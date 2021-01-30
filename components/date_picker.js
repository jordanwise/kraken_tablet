import React, { useState } from 'react';
import { View, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class DatePicker extends React.Component {
    constructor(props) {
        super(props)

        this.showMode = this.showMode.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            date: new Date(),
            mode: 'date',
            show: false,
        }
    }

    onChange(event, selectedDate) {
        const currentDate = selectedDate || date;
        console.log("here")
        console.log(this.props)
        this.props.setDate(currentDate);
        this.setState( { show:false })
    }

    showMode(currentMode) {
        this.setState(  {
            show: true,
            mode: currentMode
        } )
    }

    showDatepicker() {
        this.showMode('date');
    }

    showTimepicker() {
        this.showMode('time');
    }

    render() {
        return (
            <View>
                <View>
                    <Button onPress={() => this.showDatepicker()} title="Select date" />
                </View>
                {/* <View>
                    <Button onPress={showTimepicker} title="Show time picker!" />
                </View> */}
                {this.state.show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.date}
                        mode={this.state.mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.onChange}
                    />
                )}
            </View>
        );
    }
}