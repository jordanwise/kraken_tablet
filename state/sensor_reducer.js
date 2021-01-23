import{
    DOWNLOADED_SENSORS_FILE
} from "./action_types";

const initialState = {
    sensorList: [],
};

export default function sensorReducer(state = initialState, action) {
    if( action.type === DOWNLOADED_SENSORS_FILE ) {
        let downloaded_data = JSON.parse( JSON.parse(action.payload) );

        return Object.assign({}, state, {
            sensorList: downloaded_data
        }); 
    }



    return state;
}