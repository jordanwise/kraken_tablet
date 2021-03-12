
import React from 'react'

import { 
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
} from 'react-native'

import { withNavigation } from 'react-navigation';

import * as utils from '../utils' 

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

class SensorTile extends React.Component {

    // TODO: Update these tiles based on Amazon SNS (Simple Notification Service)
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-subscribing-unubscribing-topics.html

    constructor( props ) {
        super(props)
    }

    componentDidMount() {
        console.log( "Sensor tile mounted...")
        console.log(this.props.sensor)
    }
    
    renderSensorName(data) {
        let details = utils.parseSensorId(data.sensorId)
        return (
            <Text style={tileStyles.sensorTitle}>
                {details.sensorName}
            </Text>
        )
    }

    renderLastTemperatureReading( sensor ) {
        // let reading = "25.6" + "{'\u2103'}"
        let reading = "25.6\u2103"

        if( sensor.latest ) {
            reading = sensor.latest.temperature + "\u2103"
        }

        return (
            <Text style={tileStyles.sensorTemp}>
                {reading}
            </Text>
        )
    }

    renderLastUpdatedString( sensor ) {

        let message = "---"
        if( sensor.latest ) {
            let date = new Date( sensor.latest.timestamp )

            message = date.timeNow() + " " + date.today();
        }
        
        return (
            <Text>
                {message}
            </Text>
        )
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

    tilePressed() {        
        console.log("pressed tile")
        
        this.props.navigation.navigate('SensorData', { sensor: this.props.sensor })        
    }

    render() {
        return(          
            <TouchableHighlight onPress={() => this.tilePressed()}>
                <View style={tileStyles.container}>
                
                    { this.renderSensorName( this.props.sensor )}
                    { this.renderLastTemperatureReading(this.props.sensor)}
                    { this.renderLastUpdatedString( this.props.sensor ) }
                
                    { this.renderStatusIcons() }
                </View>
            </TouchableHighlight>
        )
    }

}

export default withNavigation(SensorTile)