const net = require('net');
const express = require('express');
const router = express.Router();
const ip = require('ip');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const io_server = require("http").createServer(router);
const io = require("socket.io")(io_server);

let list = [];
let create_user = null;
let interval_presence = null;
let interval_list = null;
let tcp_listening = false;

let globalSocket = null;

const cadastro = {
    user_name: null,
    user_port: null,
    user_ip: ip.address(),
    server_address: null,
    server_port: null,
    inGame: false
}

tempPosition = {}

let opponent = null;
let campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
let playNokCounter = 0


io_server.listen(1025);

// SERVER TCP
const server_TCP = net.createServer(function (socket) {
    globalSocket = socket
    socket.on('data', (msg) => {
        switch (msg.toString().split(" ")[0]) {
            case "START": startMatch(msg, socket); break;
            case "BYE": endMatch(msg); break;
            case "PLAY": doMove(msg, socket); break;
        }
    })

    router.post('/gameAccepted', (req, res) => {
        campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        cadastro.inGame = true

        clearInterval(interval_presence);
        clearInterval(interval_list);
        interval_presence = null;
        interval_list = null;

        socket.write('START OK')

        res.send(cadastro)
    })
});

router.post('/play', (req, res) => {
    let position = {
        line: req.body.position.line,
        column: req.body.position.column
    }
    tempPosition = position
    if (client_TCP) {
        console.log('PLAY ---> ',position)
        client_TCP.write(`PLAY ${position.line} ${position.column}`)
    } else {
        globalSocket.write(`PLAY ${position.line} ${position.column}`)
    }

    // if((position.line >= 0 && position.line < 3) && (position.column >= 0 && position.column < 3)){
    //     checkForEmptyPos(position)
    //     client_TCP.write(`PLAY ${position.line} ${position.column}`)
    // } else {

    // }
    res.sendStatus(200)
})

router.post('/bye', (req, res) => {
    cadastro.inGame = false
    // RESETA O CAMPO E ENVIA UM BYE PRO ADVERSÁRIO
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    if (client_TCP) {
        client_TCP.write('BYE')
        client_TCP.destroy()
        client_TCP = null;
    } else {
        globalSocket.write("BYE")
    }

    if (!interval_presence && !interval_list) {
        interval_presence = setInterval(doPresence, 5000);
        interval_list = setInterval(doList, 5000);
    }
    res.send('ok');
})

function startMatch(msg, socket) {
    if (msg.includes("START OK")) {
        io.emit("gameAccepted")
    } else {
        if (!cadastro.inGame) {
            io.emit("startMatch", { user: msg.toString().split(" ")[1] });
        } else {
            socket.write('BYE')
            // TODO: send BYE
        }
    }
}

function ifValid(position, socket) {
    if ((campo[position.line][position.column] != 0) || ((position.line < 0 || position.line >= 3) || (position.column < 0 || position.column >= 3))) {
        if (client_TCP) {
            client_TCP.write("PLAY NOK")
        } else {
            socket.write('PLAY NOK')
        }
        return false;
    } else {
        return true;
    }
}

function verifyWin(value) {
    if ((campo[0][0] === value && campo[0][1] === value && campo[0][2] === value) ||
        (campo[1][0] === value && campo[1][1] === value && campo[1][2] === value) ||
        (campo[2][0] === value && campo[2][1] === value && campo[2][2] === value) ||
        (campo[0][0] === value && campo[1][0] === value && campo[2][0] === value) ||
        (campo[0][1] === value && campo[1][1] === value && campo[2][1] === value) ||
        (campo[0][2] === value && campo[1][2] === value && campo[2][2] === value) ||
        (campo[0][0] === value && campo[1][1] === value && campo[2][2] === value) ||
        (campo[0][2] === value && campo[1][1] === value && campo[2][0] === value)) {
        return true;
    }
}

function doMove(msg, socket) {
    let position = {
        line: parseInt(msg.toString().split(" ")[1]),
        column: parseInt(msg.toString().split(" ")[2])
    }
    if (msg.includes("PLAY NOK")) {
        playNokCounter++
        if (playNokCounter === 3) {
            if (client_TCP) {
                client_TCP.write("BYE")
            } else {
                socket.write("BYE")
            }
            io, emit("byePlayNok")
        } else {
            io.emit("playNok");
        }
    } else if (msg.includes("PLAY OK")) {
        campo[tempPosition.line][tempPosition.column] = 1;
        playNokCounter = 0;
        if (verifyWin(1)) {
            io.emit("youWin");
            cadastro.inGame = false
            if(client_TCP){
                client_TCP.write("BYE")
            } else {
                socket.write("BYE")
            }
        } else if (verifyTie()) {
            io.emit("gameTie");
            cadastro.inGame = false
            if(client_TCP){
                client_TCP.write("BYE")
            } else {
                socket.write("BYE")
            }
        } else {
            io.emit("playOk", tempPosition);
        }
    } else {
        if (ifValid(position, socket)) {
            if (client_TCP) {
                client_TCP.write("PLAY OK")
            } else {
                socket.write("PLAY OK")
            }
            campo[position.line][position.column] = 2;
            if (verifyWin(2)) {
                io.emit("opponentWin");
            } else if (verifyTie()) {
                io.emit("gameTie");
            }
            io.emit('myTurn', position)
        }

    }
    // MARCO NO CAMPO E ENVIO AO FRONT A INDICAÇÃO DE QUE É O TURNO DO USUARIO
    // E A POSIÇÃO EM QUE O SEU ADVERSÁRIO JOGOU
}

function endMatch(msg) {
    cadastro.inGame = false
    globalSocket = null
    if (client_TCP) {
        client_TCP.destroy()
        client_TCP = null;
    }

    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    playNokCounter = 0;
    io.emit("matchEnd")
    interval_presence = setInterval(doPresence, 5000);
    interval_list = setInterval(doList, 5000);
}

function verifyTie() {
    let checkIfExistAnyPosition = false
    campo.forEach(position => {
        position.forEach(pos => {
            if (pos === 0) {
                checkIfExistAnyPosition = true
            }
        })
    })
    if (checkIfExistAnyPosition) {
        return false
    } else {
        return true
    }
}

// LISTENER DO SERVER UDP
client.on('message', (msg, rinfo) => {
    switch (msg.toString().split(" ")[0]) {
        case "USER": sendServerResponse(msg, rinfo); break;
        case "LIST": FormatlistUsers(msg); break;
        case "EXIT": dropUser(rinfo); break;
        // default: server.send(['USER NOK'], rinfo.port, rinfo.address, (err) => { }); //default ??? perguntar pro luiz
    }
});


// create a player
router.post('/', async (req, res) => {
    // LIMPANDO ESTADOS DE FUNÇÕES QUE FICAM REPETINDO A CADA 5 SEGUNDOS
    // SÓ PRA GARANTIR QUE VAI FUNCIONAR COMO DEVERIA
    clearInterval(interval_presence);
    clearInterval(interval_list);
    interval_presence = null;
    interval_list = null;

    // SALVANDO INFORMAÇÕES PASSADAS NO CADASTRO
    cadastro.user_name = req.body.user_name;
    cadastro.user_port = parseInt(req.body.user_port);
    cadastro.server_address = req.body.server_address;
    cadastro.server_port = req.body.server_port;

    // ENVIANDO O CADASTRO PARA O SERVER
    client.send([`USER ${cadastro.user_name} ${cadastro.user_port}`], cadastro.server_port, cadastro.server_address, (err) => { });

    // SETANDO 2 FUNÇÕES PARA FICAREM REPETINDO A CADA 5 SEGUNDOS
    // A QUE FICA PINGANDO NO SERVIDOR PRA FALAR QUE O USUARIO ESTÁ PRESENTE
    // E A QUE ATUALIZA A LISTA DE JOGADORES NO SERVIDOR
    interval_presence = setInterval(doPresence, 5000);
    interval_list = setInterval(doList, 5000);

    // FUNCAO PARA INICIALIZAR O SERVIDOR TCP
    TCPserverListen()
    res.send('ok');
})

function TCPserverListen() {
    if (!tcp_listening) server_TCP.listen(cadastro.user_port, () => { console.log('Servidor TCP ouvindo na porta ' + cadastro.user_port) });
}

// get all players
router.get('/', (req, res) => {
    // ROTA PRA PEGAR A LISTA DE JOGADORES
    res.send(list);
})

// "delete" player
router.delete('/', (req, res) => {
    // ROTA PARA SAIR DO JOGO, E POR CONSEQUENCIA DO SERVIDOR

    // ENVIA O COMANDO PARA O SERVER UDP
    client.send(['EXIT'], cadastro.server_port, cadastro.server_address, (err) => { });

    // PARA DE EXECUTAR AS FUNÇÕES EM REPETIÇÃO
    clearInterval(interval_presence);
    clearInterval(interval_list);
    interval_presence = null;
    interval_list = null;

    // FINALIZA O SERVIDOR TCP
    server_TCP.close();
    tcp_listening = false;
    res.send('REMOVED')
})

// FUNCAO QUE FICARÁ REPETINDO PARA ATUALIZAR A LISTA DE JOGADORES NO SERVIDOR
function doList() {
    client.send([`LIST`], cadastro.server_port, cadastro.server_address, (err) => { });
}

//FUNÇÃO QUE FICARÁ REPETINDO PARA INDICAR AO SERVIDOR UDP QUE O USUARIO ESTÁ ATIVO
function doPresence() {
    client.send([`USER ${cadastro.user_name} ${cadastro.user_port}`], cadastro.server_port, cadastro.server_address, (err) => {
    });
}


// FUNÇÃO PARA PEGAR A MENSAGEM DA LISTAGEM QUE VEM DO SERVER E TRANSFORMAR CADA USUARIO EM UM OBJETO PARA SER UTIL NO FRONTEND
function FormatlistUsers(msg) {
    let message = ''
    let sendObject = []
    let data = msg.toString().split(' ')
    message = message + data[0] + ' ' + data[1];
    let Ob_id = 0;

    data.forEach((player, index) => {
        if (index > 1 && player != '') {
            // player = player.replace("<", "");
            // player = player.replace(">", "");
            let newPlayer = player.split(':')
            let obj = {
                id: Ob_id,
                user: newPlayer[0],
                ip: newPlayer[1],
                port: parseInt(newPlayer[2]),
                selected: false
            }
            if (obj.ip != cadastro.user_ip) {
                Ob_id++;
                sendObject.push(obj)
            }
        }
    })
    let newObject = {
        users: sendObject,
        message: message,
        serverResponseUser: create_user
    }
    list = newObject

    // if (!cadastro.inGame) {
    io.emit("playersList", { list });
    // }
}

// FUNÇÃO PARA SALVAR A MENSAGEM DO SERVIOR UDP, ESTA É ENVIA AO FRONT JUNTO COM A LISTA DE USUÁRIOS
function sendServerResponse(msg, rinfo) {
    create_user = msg.toString();
    if (msg.includes("USER OK")) {
        io.emit("registrationSuccessful");
    } else if (msg.includes("USER NOK")) {
        io.emit("registrationFailed");
    }
}


// CLIENTE TCP
let client_TCP = null

function startClientTCPListner() {
    if (client_TCP) {
        client_TCP.on('data', (msg) => {
            switch (msg.toString().split(" ")[0]) {
                case "START": startMatch(msg); break;
                case "BYE": endMatch(msg); break;
                case "PLAY": doMove(msg); break;
            }
        })
    }
}

// ROTA PARA INICIAR O JOGO
// AQUI PRECISO USAR O io PARA MANDAR MENSAGEM PARA O FRONT MAS NÃO SEI DIREITO COMO ESSE SOCKET TCP FUNCIONA
router.post('/startGame', (req, res) => {
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

    opponent = req.body;

    cadastro.inGame = true

    clearInterval(interval_presence);
    clearInterval(interval_list);
    interval_presence = null;
    interval_list = null;

    if (!client_TCP) {
        client_TCP = new net.Socket();
        startClientTCPListner()
    }
    // client.send([`INGAME`], cadastro.server_port, cadastro.server_address, (err) => { });
    client_TCP.connect(opponent.port, opponent.ip, () => {
        // client_TCP.write(`START ${cadastro.user_name} ${cadastro.user_ip} ${cadastro.user_port}`)
        client_TCP.write(`START ${cadastro.user_name}`)
    })

    res.send(cadastro);
})

module.exports = router;
