const net = require('net');
const express = require('express');
const router = express.Router();
const ip = require('ip');
const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const ioServer = require("http").createServer(router);
const io = require("socket.io")(ioServer);
let list = [];
let createUser = null;
let intervalPresence = null;
let intervalList = null;

const cadastro = {
    user_name: null,
    user_port: null,
    user_ip: ip.address(),
    server_address: null,
    server_port: null,
    inGame: false
}

let opponent = null;
let campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]


io.on("connection", client => {
    console.log("ioSocket connected");
    // globalVariables.ioConnection = socket;

    client.on("userRegistrationSuccess", data => {
        console.log("the userRegistration succcess event was detected!");
        //emits an event to the frontend
        io.sockets.emit("registrationSuccessful");
        // io.sockets.emit('registration successful', {msg: data});
    });
});

ioServer.listen(3005);

client.on("listening", function () {
    socketAddress = client.address();
    console.log("client socket port is:", socketAddress.port);
});


// SERVER TCP
const server_TCP = net.createServer(function (socket) {
    // socket.write('Echo server\r\n');
    // socket.pipe(socket);
    socket.on('data', (msg) => {
        // console.log(msg.toString())
        switch (msg.toString().split(" ")[0]) {
            case "START": startMatch(msg); break;
            case "BYE": endMatch(msg); break;
            case "PLAY": doMove(msg); break;
            case "MSG": sendMessage(msg); break;
            case "gameAccepted": gameAccepted(msg); break;
            case "OPWIN": opponentWinGame(msg); break;
            case "GAMETIE": gameTie(msg); break;
            case "PLAYAGAIN": playAgain(msg); break;
            case "PLAYAGAINACCEPTED": playAgainAccepted(msg); break;
        }
        // console.log(`${data.toString()}`)
    })
});

function startMatch(msg) {
    opponent = {
        user: msg.toString().split(" ")[1],
        ip: msg.toString().split(" ")[2],
        port: parseInt(msg.toString().split(" ")[3]),
    }

    io.emit("startMatch", { user: msg.toString().split(" ")[1], opponent: opponent });
}

function sendMessage(msg) {
    io.emit("receiveMessage", { msg: msg.toString() })
}

function gameAccepted(msg) {
    io.emit("gameAccepted")
}

function doMove(msg) {
    let position = {
        line: msg.toString().split(" ")[1],
        column: msg.toString().split(" ")[2]
    }

    // MARCO NO CAMPO E ENVIO AO FRONT A INDICAÇÃO DE QUE É O TURNO DO USUARIO
    // E A POSIÇÃO EM QUE O SEU ADVERSÁRIO JOGOU
    campo[position.line][position.column] = 2;
    io.emit('myTurn', position)
}

function endMatch(msg){
    client_TCP.destroy()
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    io.emit("matchEnd")
}

function opponentWinGame(msg){
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    io.emit("opponentWin")
}

function gameTie(msg){
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    io.emit("gameTie")
}

function playAgain(msg){
    io.emit('playAgain')
}

function playAgainAccepted(msg){
    io.emit('letsPlay')
}

function verifyTie(){
    campo.forEach(pos => {
        if(pos === 0){
            return false
        }
    })
    return true
}

function checkIfWin(value){
    if( (campo[0][0] === value && campo[0][1] === value && campo[0][2] === value) ||
        (campo[1][0] === value && campo[1][1] === value && campo[1][2] === value) ||
        (campo[2][0] === value && campo[2][1] === value && campo[2][2] === value) ||
        (campo[0][0] === value && campo[1][0] === value && campo[2][0] === value) ||
        (campo[0][1] === value && campo[1][1] === value && campo[2][1] === value) ||
        (campo[0][2] === value && campo[1][2] === value && campo[2][2] === value) ||
        (campo[0][0] === value && campo[1][1] === value && campo[2][2] === value) ||
        (campo[0][2] === value && campo[1][1] === value && campo[2][0] === value)){
        
        campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
        io.emit("youWin");
        client_TCP.write('OPWIN')
        return true
    } else if (verifyTie()) {
        io.emit("gameTie")
        client_TCP.write('GAMETIE')
        return true
    }
    return false

}

function checkForEmptyPos(position){
    if(campo[position.line][position.column] === 0){
        campo[position.line][position.column] = 1;
        if(!checkIfWin(1)){
            client_TCP.write(`PLAY ${position.line} ${position.column}`)
        }
    } else {
        io.emit("positionInvalid")
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
    // console.log(msg1.toString())
});


// create a player
router.post('/', async (req, res) => {
    // LIMPANDO ESTADOS DE FUNÇÕES QUE FICAM REPETINDO A CADA 5 SEGUNDOS
    // SÓ PRA GARANTIR QUE VAI FUNCIONAR COMO DEVERIA
    clearInterval(intervalPresence);
    clearInterval(intervalList);
    intervalPresence = null;
    intervalList = null;

    // SALVANDO INFORMAÇÕES PASSADAS NO CADASTRO
    cadastro.user_name = req.body.user_name;
    cadastro.user_port = parseInt(req.body.user_port);
    cadastro.server_address = req.body.server_address;
    cadastro.server_port = req.body.server_port;

    // ENVIANDO O CADASTRO PARA O SERVER
    client.send([`USER ${cadastro.user_name} ${cadastro.user_port}`], cadastro.server_port, `${cadastro.server_address}`, (err) => { });

    // SETANDO 2 FUNÇÕES PARA FICAREM REPETINDO A CADA 5 SEGUNDOS
    // A QUE FICA PINGANDO NO SERVIDOR PRA FALAR QUE O USUARIO ESTÁ PRESENTE
    // E A QUE ATUALIZA A LISTA DE JOGADORES NO SERVIDOR
    intervalPresence = setInterval(doPresence, 5000);
    intervalList = setInterval(doList, 5000);

    // FUNCAO PARA INICIALIZAR O SERVIDOR TCP
    TCPserverListen()
    // server_TCP.listen(cadastro.user_port, () => {console.log('Servidor TCP ouvindo na porta ' + cadastro.user_port)});
    // RESPONDENDO AO FRONT -> TALVEZ EU MUDE ISSO (COM O io) PRA RESPONDER SÓ QUANDO RECEBER A RESPOSTA DO SERVIDOR
    // res.send(createUser);
})

function TCPserverListen() {
    server_TCP.listen(cadastro.user_port, () => { console.log('Servidor TCP ouvindo na porta ' + cadastro.user_port) });
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
    clearInterval(intervalPresence);
    clearInterval(intervalList);
    intervalPresence = null;
    intervalList = null;

    // FINALIZA O SERVIDOR TCP
    server_TCP.close();
    res.send('REMOVED')
})

// FUNCAO QUE FICARÁ REPETINDO PARA ATUALIZAR A LISTA DE JOGADORES NO SERVIDOR
function doList() {
    client.send([`LIST`], cadastro.server_port, cadastro.server_address, (err) => { });
}

//FUNÇÃO QUE FICARÁ REPETINDO PARA INDICAR AO SERVIDOR UDP QUE O USUARIO ESTÁ ATIVO
function doPresence() {
    client.send([`USER ${cadastro.user_name} ${cadastro.user_port}`], cadastro.server_port, `${cadastro.server_address}`, (err) => {
    });
}


// FUNÇÃO PARA PEGAR A MENSAGEM DA LISTAGEM QUE VEM DO SERVER E TRANSFORMAR CADA USUARIO EM UM OBJETO PARA SER UTIL NO FRONTEND
function FormatlistUsers(msg) {
    let message = ''
    let sendObject = []
    let data = msg.toString().split(' ')
    message = message + data[0] + ' ' + data[1];
    let Ob_id = 0;
    data.forEach(player => {
        if (player[0] === '<') {
            player = player.replace("<", "");
            player = player.replace(">", "");
            let newPlayer = player.split(':')
            let obj = {
                id: Ob_id,
                user: newPlayer[0],
                ip: newPlayer[1],
                port: parseInt(newPlayer[2]),
                inGame: (newPlayer[3] === 'true'),
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
        serverResponseUser: createUser
    }
    list = newObject

    // if (!cadastro.inGame) {
        io.emit("playersList", { list });
    // }
}

// FUNÇÃO PARA SALVAR A MENSAGEM DO SERVIOR UDP, ESTA É ENVIA AO FRONT JUNTO COM A LISTA DE USUÁRIOS
function sendServerResponse(msg, rinfo) {
    createUser = msg.toString();
    if (msg.includes("USER OK")) {
        io.emit("registrationSuccessful");
    } else if (msg.includes("USER NOK")) {
        io.emit("registrationFailed");
    }
}


// CLIENTE TCP
let client_TCP = null

// ROTA PARA INICIAR O JOGO
// AQUI PRECISO USAR O io PARA MANDAR MENSAGEM PARA O FRONT MAS NÃO SEI DIREITO COMO ESSE SOCKET TCP FUNCIONA
router.post('/startGame', (req, res) => {
    client_TCP = new net.Socket();
    opponent = req.body;
    // client_TCP = net.createConnection({ req.body.port, }, () => {

    // })
    console.log(opponent)
    // client_TCP.connect(parseInt(cadastro.user_port), cadastro.user_ip, () => {
    //     client_TCP.write(`START ${cadastro.user_name}`)
    // // })
    // console.log('user_port',cadastro.user_port)
    cadastro.inGame = true;
    client.send([`INGAME`], cadastro.server_port, cadastro.server_address, (err) => { });
    client_TCP.connect(opponent.port, opponent.ip, () => {
        client_TCP.write(`START ${cadastro.user_name} ${cadastro.user_ip} ${cadastro.user_port}`)
    })
})

router.post('/sendMessage', (req, res) => {
    client_TCP.write(`MSG ${req.body.message}`)
    res.send('ok')
})

router.post('/gameAccepted', (req, res) => {
    client_TCP = new net.Socket();
    opponent = req.body.opponent;
    cadastro.inGame = true;
    client.send([`INGAME`], cadastro.server_port, cadastro.server_address, (err) => { });
    // TODO: DECIDIR QUEM VAI COMEÇAR O JOGO
    client_TCP.connect(opponent.port, opponent.ip, () => {
        client_TCP.write(`gameAccepted`)
    })
    res.send('ok')
})

router.post('/play', (req, res) => {
    let position = {
        line: req.body.position.line,
        column: req.body.position.column
    }
    checkForEmptyPos(position)
    res.send('ok')
})

router.post('/bye', (req, res) => {
    // RESETA O CAMPO E ENVIA UM BYE PRO ADVERSÁRIO
    campo = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
    client_TCP.write('BYE')
    client_TCP.destroy()
    res.send('ok');
})

router.post('/playAgain', (req, res) => {
    client_TCP.write('PLAYAGAIN')
    res.send('ok');
})

router.get('/playAgain', (req, res) => {
    client_TCP.write('PLAYAGAINACCEPTED')
    res.send('ok');
})

// Toda vez que criar iniciar um jogo esse cliente é criado

// opponent info here: porta do oponente e ip do oponente
// client_TCP.connect(user_port, user_ip, function() {
// 	console.log('Connected');
// 	client_TCP.write('Hello, server! Love, Client.');
// });

// client_TCP.on('data', function(data) {
// 	console.log('Received: ' + data);
// 	client_TCP.destroy(); // kill client after server's response
// });

// client_TCP.on('close', function() {
// 	console.log('Connection closed');
// });


module.exports = router;