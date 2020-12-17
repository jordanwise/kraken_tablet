import React from 'react';

import { View } from 'react-native' 

export default class Divider extends React.Component {
    render() {
        return (
            <View style={ [ this.props.style ,{
                    borderBottomColor: this.props.color ? this.props.color : 'black',
                    borderBottomWidth: this.props.width ? this.props.width : 6,
                    width: this.props.percentSize ? this.props.percentSize : '80%',
                } ] }
            />
        )
    }
}
