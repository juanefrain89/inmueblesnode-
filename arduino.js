const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const port = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Asegúrate de usar el puerto correcto
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:3000'
}));

parser.on('data', (data) => {
  console.log('Data from Arduino:', data);
  io.emit('arduinoData', data);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3005, () => {
  console.log('Server is running on port 3005');
});
