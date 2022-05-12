const express = require('express');
const app = express();
const cors = require('cors')
const socket = require('socket.io');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.static(path.join(__dirname, '/webpage')));

const portn = 3000;
const server = app.listen(portn, () => {
    console.log(`server started on http://localhost:${portn}/`);
});
/*
 * This portion of code begins a serial connection between the arduino board
 * which is assumed to be connected to COM3 port number at 9600 baud rate.
 */
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: "COM5", baudRate: 9600 });
const parser = new ReadlineParser();
port.pipe(parser);

var data;

/*
 * Starting a worker thread which will simulate a sensor and send the data 
 * as a message event to the server. Usage: In case the board is not connected.
 * If board's sensor data is required, comment out the following lines.
 */
// const { Worker } = require('worker_threads');
// var sensor = new Worker('./sensor.js');
// sensor.on('message', function(val) {
//     data = val;
//     console.log(val);
// });


parser.on('data', function(info) {
    data = JSON.parse(info);
    console.log(data);
});

const io = socket(server, {
    cors: {
        origin: '*',
        handlePreflightRequests: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET",
                "Access-Control-Allow-Headers": "my-custom-header",
                "Access-Control-Allow-Credentials": "true"
            });
            res.end();
        }
    }
});

io.on('connection', function(socket) {
    console.log('A user connected');
    setInterval(function() {
        socket.emit('sensor', data);
    }, 10);
    socket.on('disconnect', function() {
        console.log('A user disconnected');
    });
});

app.get("/ssh", (req, res) => {
    console.log(process.env.SSH);
    res.send(process.env.SSH);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});