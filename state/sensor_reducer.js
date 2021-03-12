import{
    DOWNLOADED_SENSORS_FILE,
    DOWNLOADED_SENSOR_DATA_ALL,
    DOWNLOADED_SENSOR_DATE_DATA,
    SENSOR_UPDATE,
} from "./action_types";

const initialState = {
    sensorList: [],
    sensorData: {},
};

function updateObjectInArray( array, index, newObject ) {
    // This magic finds the index with a matching name, removes 1 element and adds item
    let newArray = array.slice()

    newArray.splice( index, 1, newObject );
    return newArray;
}

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

    if( action.type === SENSOR_UPDATE ) {
        let items = state.sensorList;

        // Find the sensor in sensorList

        let foundIndex = items.findIndex( x => x.sensorId === action.payload.sensorId );
        if( foundIndex === -1 ) {
            console.log("Unable to find sensor to update");
            return state
        }

        let sensorItem = Object.assign({}, items[foundIndex])
        sensorItem.latest = {
            timestamp: action.payload.timestamp,
            temperature: action.payload.temperature
        }

        let newArray = updateObjectInArray(items, foundIndex, sensorItem);

        return Object.assign({}, state, {
            sensorList: newArray
        });
    }

    return state;
}