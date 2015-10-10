# node-red-contrib-sensit

A simple [Node-RED](http://nodered.org) node that connect to the [Sens'it](http://sensit.io/) API.

## Options

`name`: simply rename your node (optional)

`token`: sensit access token

`deviceId`: sensit device id (optional)

`sensorType`: sensor type you are interested in looking at (default: temperature)

## Message

```json
{
      "payload": {
          "data": "sensorData",
          "date": "date"
      }
}
```
