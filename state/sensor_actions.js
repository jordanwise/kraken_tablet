import {
    DOWNLOADED_SENSORS_FILE,
    DOWNLOADED_SENSOR_DATE_DATA,
} from "./action_types";

import {
    getDataFromDate,
} from '../db_queries'

import {
    s3Download,
    s3Upload,
} from "../data_sync";

let sensorsFilePath = 'sensors.json'

// Sensors
export function createSensorsFile() {
    return function (dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = []
        return s3Upload(data, sensorsFilePath, bucketName);
    }
}

export function downloadSensors() {
    return function(dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        return s3Download(sensorsFilePath, bucketName)
            .then(json => {
                dispatch({ type: DOWNLOADED_SENSORS_FILE, payload: json });
            });
        };
}


export function downloadSensorData( sensor, date ) {
    return function(dispatch, getState) {
        let tableName = getState().loginReducer.loginInfo.tableName

        getDataFromDate( tableName, sensor.sensorId, date )
        .then( data => {
            dispatch({ type:DOWNLOADED_SENSOR_DATE_DATA, payload: data })
        })
    }
}