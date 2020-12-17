import React, { Component } from 'react';

import { View, Image, Text } from 'react-native';
import tickIcon from './icons/tick.png'

export default class Tick extends React.Component {
    getWidth() {
        return (this.props.width !== undefined ? this.props.width : 100 );
    }
    
    getHeight() {
        return (this.props.height !== undefined ? this.props.height : 100 );
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems:'center', width: this.getWidth(), height: this.getHeight() }}>    
                { this.props.ticked ? 
                    (<Image
                        style={{flex:1}}
                        source={tickIcon}
                        resizeMode="center"
                    />) 
                    : (null) 
                }
            </View>
        )
    }
}