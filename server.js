const express = require('express');
const fs = require('fs')
const app = express();
const http = require('https');
//const server = http.createServer(app);

const server = http.createServer({
   key: fs.readFileSync('config/cert.key'),
   cert: fs.readFileSync('config/cert.crt')
}, app);

const { Server } = require("socket.io");
const io = new Server(server);


const porta1 = 9091;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/controle.html');
});
app.get('/tela', (req, res2) => {
  res2.sendFile(__dirname + '/tela.html');
});

app.use(express.static('img'));
app.use(express.static('game'));
app.use(express.static('css'));

io.on('connection', (socket) => {
  
  console.log('usuário conectado');
  socket.on('chat message', (msg) => {
    io.emit('hello', msg);
  });

  socket.on('disconnect', () => {
    console.log('usuário desconectado');
  });

  socket.on('beta', (beta) => {
    //console.log(beta)
    io.emit('coordenada', beta);
  });

  socket.on('tiro', (tiro) => {
    io.emit('atirar', tiro);
  });

});

server.listen(porta1, () => {
  console.log(`listening on *: ${porta1}`);
});