import React from 'react';

import {
    TouchableHighlight,
} from 'react-native';

import Tick from "./tick"

export default class PressButton extends React.Component {
    render() {
        return (
            <TouchableHighlight style={{flex:1}} 
                onPress={this.props.onPress}>
                <Tick ticked={this.props.selected()}></Tick>
            </TouchableHighlight>
        );
    }
}