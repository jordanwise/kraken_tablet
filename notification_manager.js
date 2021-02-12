import store from "./state/store";

import { downloadSensors } from "./state/sensor_actions"

export function parseMessage( message ) {
    console.log("Received notification:")
    console.log(message)

    if( message.data.default === 'Update sensor list') {
        console.log("trigger sensor tile list update")

        store.dispatch( downloadSensors() )
    }
}