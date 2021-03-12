import store from "./state/store";

import { downloadSensors, sensorUpdate } from "./state/sensor_actions"

export function parseMessage( message ) {
    console.log("Received notification:")
    console.log(message)

    if( message.data.default === 'Update sensor list') {
        console.log("trigger sensor tile list update")

        store.dispatch( downloadSensors() )
    }
    else {
        // Data is from database change
        console.log("sensor reading arrived")
        console.log(message.data)

        store.dispatch( sensorUpdate(JSON.parse(message.data.default) ) )
    }
}