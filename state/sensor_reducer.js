import{
    DOWNLOADED_SENSORS_FILE,
    DOWNLOADED_SENSOR_DATA_ALL,
    DOWNLOADED_SENSOR_DATE_DATA
} from "./action_types";

const initialState = {
    sensorList: [],
    sensorData: {},
};

export default function sensorReducer(state = initialState, action) {
    if( action.type === DOWNLOADED_SENSORS_FILE ) {
        let downloaded_data = JSON.parse( JSON.parse(action.payload) );

        return Object.assign({}, state, {
            sensorList: downloaded_data
        }); 
    }

    if( action.type === DOWNLOADED_SENSOR_DATA_ALL ) {
        let downloaded_data = {};

        console.log("downloaded sensor data")
        console.log(action.payload)
        sensorData[ sensor ] = downloaded_data

        return Object.assign({}, state, {
            sensorData: downloaded_data
        }); 
    }

    if( action.type === DOWNLOADED_SENSOR_DATE_DATA ) {

        let downloaded_data = action.payload;

        // Sort by timestamp
        downloaded_data.sort((a, b) => b.timestamp - a.timestamp );

        return Object.assign({}, state, {
            sensorData: downloaded_data
        }); 
    }

    return state;
}