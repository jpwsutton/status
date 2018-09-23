"""
Mqtt Enabled InkyPhat controller.

This Python script subscribes to a topic over MQTT
and displays messages received on a Pimoroni Inky Phat
e-ink display.

Messages can be roughly 40 characters long (split over two lines),
though the font is not fixed width, so you may find that some
messages do not quite fit. YMMV.

It requires a config.json file in the same directory, containing
the MQTT connection details.

Example:

{
  "mqttConfig" : {
    "server" : "iot.eclipse.org",
    "port"   : 1883,
    "clientId" : "statusClient",
    "topic"    : "statustopic"
    },
  "inkyphat" : {
    "colour": "red",
    "first_line": "James is currently"
    }
}

Optional config values:
 - username - Username
 - password - Password
 - cafile   - If using TLS, the filename for a .pem ca file.

 Author: James Sutton 2018 - jsutton.co.uk, github.com/jpwsutton


"""
import json
import textwrap
from PIL import ImageFont
import paho.mqtt.client as mqtt
import inkyphat


def displayStatus(statusString):
    # Prepare the String into two lines
    wrapped = textwrap.wrap(statusString, width=20)

    # Show the backdrop image
    inkyphat.set_colour(config["inkyphat"]["colour"])
    inkyphat.set_border(inkyphat.RED)
    inkyphat.set_image("background.png")

    # Add the text
    font = ImageFont.truetype(inkyphat.fonts.FredokaOne, 21)

    # Title Line
    line_one = config["inkyphat"]["first_line"]
    w, h = font.getsize(line_one)
    # Center the text and align it with the name strip
    x = (inkyphat.WIDTH / 2) - (w / 2)
    y = 18 - (h / 2)
    inkyphat.text((x, y), line_one, inkyphat.WHITE, font)

    if(len(wrapped) >= 1):
        # Status Line 1
        status_one = wrapped[0]
        w, h = font.getsize(status_one)
        # Center the text and align it with the name strip
        x = (inkyphat.WIDTH / 2) - (w / 2)
        y = 50 - (h / 2)
        inkyphat.text((x, y), status_one, inkyphat.BLACK, font)


    if(len(wrapped) >= 2):
        # Status Line 2
        status_two = wrapped[1]
        w, h = font.getsize(status_two)
        # Center the text and align it with the name strip
        x = (inkyphat.WIDTH / 2) - (w / 2)
        y = 80 - (h / 2)
        inkyphat.text((x, y), status_two, inkyphat.BLACK, font)


    inkyphat.show()


# Get configuration data
with open('config.json') as data_file:
    config = json.load(data_file)

# The callback for when the client receives a CONNACK response from the server.
def on_connect(_client, _userdata, _flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe(config['mqttConfig']['topic'])

# The callback for when a PUBLISH message is received from the server.
def on_message(_client, _userdata, msg):
    string = msg.payload.decode("utf-8")
    print("Received: %s" % string)
    displayStatus(string)
   


print("Connecting to Host %s:%d" % (config['mqttConfig']['server'], config['mqttConfig']['port']))


client = mqtt.Client(client_id=config['mqttConfig']['clientId'], clean_session=True)
if "username" in config['mqttConfig']:
    client.username_pw_set(config['mqttConfig']['username'], password=config['mqttConfig']['password'])
if "cafile" in config['mqttConfig']:
    print("Using CA FILE:" + './' + config['mqttConfig']['cafile'])
    client.tls_set('./' + config['mqttConfig']['cafile'])
    client.tls_insecure_set(True)
client.on_message = on_message
client.on_connect = on_connect
client.connect(config['mqttConfig']['server'], config['mqttConfig']['port'], 60)


client.loop_forever()
