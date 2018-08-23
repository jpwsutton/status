# status
A Status display using the Pimoroni Inky pHAT and React

## Prerequisites:
 - A Server running an MQTT Broker.
 - A Raspberry Pi & Pimoroni Inky pHat.
    - Python 3 and virtualenv installed
 - Nodejs & npm

 Everything could be running on the Raspberry Pi, or separately. It's up to you!


## Client Setup
 - Change to client directory: `cd client`
 - Create virtual environment: `virtualenv -p python3 env`
 - Activate virtual environment: `source env/bin/activate`
 - Install dependencies: `pip3 install -r requirements.txt`
 - Create a config.json file:
    ```
    {
    "mqttConfig" : {
        "server" : "hostname",
        "port"   : 8883,
        "username" : "username",
        "password" : "password",
        "clientId" : "statusClient",
        "topic"    : "statustopic"
        }
    }
    ```
 - Run Client: `python3 status.py`



## Server Setup
 - Change to server directory: `cd server`
 - Install Dependencies: `npm install`
 - Create a .env file:
    ```
    MQTT_HOST=hostname
    MQTT_PORT=8883
    MQTT_PROTOCOL=ssl
    MQTT_USER=username
    MQTT_PASS=password
    MQTT_ID=statusServer
    MQTT_TOPIC=statustopic
    HTTP_PORT=9000
    HTTP_PASS=superSecret
    ```
- Build the Static Content: `npm run build`
- Run the Server: `node server`
- The default username is 'status', with the password defined in the .env file.
