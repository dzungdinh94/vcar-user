//var DeviceInfo = require("react-native-device-info");
import {
    Platform
} from "react-native";
import api from '../api/api'
import color from "./color";
import values from './values'
import mapStyle from "./mapStyle";

const api_key_google = 'AIzaSyDMk9SSZg58cPeB9Q3zkm8nqCAn9OdLx_M';
// const api_key_google = 'AIzaSyC50cYi9TerEENDDFIoxhLES89L7WEOBII';
const api_key_ios = 'AIzaSyD88Gjas9RUVIUmMF1LWYSo3TMi8V-P434'
let config = {}
const status_api_google = { ZERO_RESULTS: 'ZERO_RESULTS', OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT', OK: 'OK' }
config.app_version = '0.0.1'
config.domain = "https://pacific-stream-38316.herokuapp.com"
config.socket = null;
config.type_socket_notif = {
    acceptedorder: 'acceptedorder',
    cancelorder: 'cancelorder',
    driverchangelocation: 'driverchangelocation',
    finishorder: 'finishorder',
    gocar:'gocar',
    updatePosition:'updatePosition'
}
// config.domain = "http://10.5.50.241:3000"
export {
    api,
    color,
    mapStyle,
    values,
    config,
    status_api_google,
    api_key_google,
}