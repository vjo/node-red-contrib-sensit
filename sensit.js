var Sensit = require("node-sensit");

module.exports = function(RED) {
    "use strict";

    function SensitNode(config) {
        RED.nodes.createNode(this, config);

        var Sensit = require("node-sensit"),
            SensitAPI = new Sensit(config.token),
            deviceId = config.deviceId || "",
            sensorType = config.sensorType;

        function getSensorByType(type){
            return function(json){
                return json.filter(function(sensor) {
                    return sensor.sensor_type === sensorType;
                })[0];
            }
        }

        function extractSensorId(sensor){
            return sensor.id;
        }

        function fetchSensorId(deviceId){
            return function(sensorId){
                return getSensor(deviceId, sensorId);
            };
        }

        var sendData = function(json){
            // return the last value
            this.send({payload: json.data.history[0]});
            this.status({fill: "blue", shape: "ring", text: "idle."});
        }.bind(this);

        function getDeviceId(){
            return SensitAPI.getAllDevices()
                .then(function(json) {
                    //XXX return the first device in the json
                    return json.data[0].id;
                }).catch(function(json) {
                    console.log('getDeviceId: Error!');
                });
        }

        function getAllSensors(deviceId){
            return SensitAPI.getAllSensors(deviceId)
                .then(getSensorByType(sensorType))
                .then(extractSensorId)
                .then(fetchSensorId(deviceId))
                .then(sendData)
                .catch(function(json) {
                    console.log('getAllSensors: Error!');
                });
        }

        function getSensor(deviceId, sensorId){
            return SensitAPI.getSensor(deviceId, sensorId)
                .then(function(json) {
                    return json;
                }).catch(function(json) {
                    console.log('getSensor: Error!');
                });
        }

        this.on('input', function(msg) {
            this.status({fill: "green", shape: "ring", text: "Fetching..."});

            if(deviceId){
                getAllSensors(deviceId);
            } else {
                getDeviceId().then(getAllSensors)
            }

        }.bind(this));
    }
    RED.nodes.registerType("sensit", SensitNode);
}
