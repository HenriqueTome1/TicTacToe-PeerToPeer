const dgram = require('dgram');
const client = dgram.createSocket('udp4');



client.on('message', (msg, rinfo) => {
	msg.toString() === 'USER NOK' ? client.close() : console.log(`Cliente recebeu a mensagem: ${msg} de ${rinfo.address}:${rinfo.port}`);
});
// ta recebendo duas mensagens


var interval = setInterval(function (str1, str2) {
	const nome = Buffer.from('Tome');
	const porta = Buffer.from('1024');

	client.send([`USER ${nome} ${porta}`], 29999, '10.81.71.217', (err) => {
	});
	// client.send([`LIST`], 8000, '192.168.100.107', (err) => {
	// });

}, 5000);

//   clearInterval(interval);