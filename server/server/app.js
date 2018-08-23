/**
 * Status Server - app.js
 * 
 * Core Logic for Server Application
 * 
 * Author: James Sutton 2018 - jsutton.co.uk, github.com/jpwsutton
 */
const express  = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const mqtt = require('mqtt');
const basicAuth = require('express-basic-auth')


const app = express();
const router = express.Router();

const mqttOptions = {
    port: process.env.MQTT_PORT,
    host: process.env.MQTT_HOST,
    protocol: process.env.MQTT_PROTOCOL, 
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS
}
const client = mqtt.connect(mqttOptions)

// Global State Variable - The status
var currentStatus = "No Status Set";

client.on('connect', ()=>{
    client.subscribe(process.env.MQTT_TOPIC);
});

client.on('message', (topic, message) => {
    currentStatus = message.toString();
    console.log("Received new status: " + message.toString())
});

// Setup Logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Setup body parser
app.use(bodyParser.json());

// Add Basic Auth
app.use(basicAuth({
    users: { 'status' : process.env.HTTP_PASS},
    challenge: true
}));

// Setup Router and Static assets
app.use("/", router);
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Set the status
router.post('/api/status', (req, res) => {
    if(req.body.status !== null){
        console.log(`New Status: ${req.body.status}`);
        client.publish(process.env.MQTT_TOPIC, req.body.status, {"retain" : true});
        res.sendStatus(200);
    } else {
        res.sendStatus(400);
    }
});

// Get the current Status
router.get('/api/status', (req, res) => {
    res.send({"status" : currentStatus});
});

module.exports = app;
