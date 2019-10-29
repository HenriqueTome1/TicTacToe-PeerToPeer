const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const active_users = []

/* Função de inserção de novos usuários */
function pushToUsers(active_users, user) {
    const index = active_users.findIndex((u) => u.ip === user.ip);
    if (index === -1) {
        active_users.push(user);
    } else {
        active_users[index] = user;
    }
}

/* Serviço de verificação de usuários inativos */
setInterval(function () {
    console.log(`Servidor executando serviço de verificação de usuários inativos\n`);
    active_users.forEach(user => {
        if (new Date() - 60000 > user.last_check) { // verificar esse tempo
            console.log(`Usuário ${user.name} removido por inatividade\n`);
            active_users.indexOf(user) > -1 ? active_users.splice(active_users.indexOf(user), 1) : null
        }
    });
}, 60000);

/* Função de validação de cadastro e atualização de usuários */
function validateUser(msg, rinfo) {
    if (!msg.toString().split(" ")[1].match("^[a-zA-Z0-9_]*$") ||
        !msg.toString().split(" ")[2].match("^[0-9]*$") ||
        Number(msg.toString().split(" ")[2]) > 65535 ||
        Number(msg.toString().split(" ")[2]) < 1024) {
        server.send(['USER NOK'], rinfo.port, rinfo.address, (err) => {
            if (err) return ("Deu Muito Ruim")
        });
    } else {
        server.send(['USER OK'], rinfo.port, rinfo.address, (err) => {
            if (err) {
                return ("Deu Muito Ruim")
            } else {
                const user = {
                    'name': msg.toString().split(" ")[1],
                    'ip': rinfo.address,
                    'port': Number(msg.toString().split(" ")[2]),
                    'last_check': new Date(),
                    'inGame': false
                }
                pushToUsers(active_users, user)
            }
        });
    }
    server.send(['USER OK'], rinfo.port, rinfo.address, (err) => { });
}

/* Serviço de listagem de usuários ativos no sistema */
function listUsers(rinfo) {
    let list = `LIST ${active_users.length}`
    active_users.map((user) => {
        // list += ` <${user.name}:${user.ip}:${user.port}> `
        list += ` ${user.name}:${user.ip}:${user.port}`
    })
    server.send([list], rinfo.port, rinfo.address, (err) => { });
}

/* Serviço de listagem de usuários ativos no sistema */
function dropUser(rinfo) {
    let user_found = active_users.find(function (user) {
        return user.ip == rinfo.address ? user : false;
    });
    if (user_found) {
        console.log(`Usuário ${user_found.name} saiu do lobby\n`);
        active_users.indexOf(user_found) > -1 ? active_users.splice(user_found, 1) : null
    }
}

/* Serviço de recepção e identificação da mensagem */
server.on('message', (msg, rinfo) => {
    console.log(`Servidor recebeu a mensagem: <${msg}> -> ${rinfo.address}:${rinfo.port}\n`);

    switch (msg.toString().split(" ")[0]) {
        case "USER": validateUser(msg, rinfo); break;
        case "LIST": listUsers(rinfo); break;
        case "EXIT": dropUser(rinfo); break;
        default: server.send(['USER NOK'], rinfo.port, rinfo.address, (err) => { }); //default ??? perguntar pro luiz
    }
});

server.on('error', (err) => {
    console.log(`Erro de servidor:\n${err.stack}`);
    server.close();
});

server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor ouvindo em: \n${address.address}:${address.port}`);
});

server.bind(8000, '192.168.100.107');
