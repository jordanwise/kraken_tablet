
import React from 'react'

import { 
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native'

import batteryFullIcon from '../icons/sensor/battery_full_24px.png'
import bluetoothIcon from '../icons/sensor/bluetooth_searching_24px.png'
import cloudIcon from '../icons/sensor/cloud_queue_24px.png'

const tileStyles = StyleSheet.create({
    container: {
        width: 150,
        height: 150,
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: "black",
        justifyContent: "space-between",
    },
    sensorTitle: {
        fontSize: 20,
    },
    sensorTemp: {
        fontSize: 24,
        fontWeight: "bold",
    },
    iconRow: {
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection:"row",
        justifyContent: "space-between",
    },
    icon: {
        flex:1,
    }
})

export default class SensorTile extends React.Component {

    // TODO: Update these tiles based on Amazon SNS (Simple Notification Service)
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-subscribing-unubscribing-topics.html

    constructor( props ) {
        super(props)
    }
    
    renderLastTemperatureReading( data ) {
        return( "25.6" + "{'\u2103'}")
    }

    renderLastUpdatedString( data ) {
        return "1 minute ago";
    }

    renderBatteryStatus(data) {
        return( 
            <Image source={batteryFullIcon} /> 
        )
    }

    renderBluetoothStatus(data) {
        return (
            <Image source={bluetoothIcon} />
        )
    }

    renderCloudStatus(data) {
        return(
            <Image source={cloudIcon} />
        )
    }

    renderStatusIcons(data) {
        return (
            <View style={tileStyles.iconRow}>
                {this.renderBatteryStatus()}
                {this.renderBluetoothStatus()}
                {this.renderCloudStatus()}
            </View>
        )
    }

    render() {
        return( 
            <View style={tileStyles.container}>
                <Text style={tileStyles.sensorTitle}>
                    SensorID
                </Text>
                <Text style={tileStyles.sensorTemp}>
                    25.6{'\u2103'}
                </Text>
                <Text>
                    { this.renderLastUpdatedString() }
                </Text>
                
                { this.renderStatusIcons() }
            </View>
        )
    }

}

