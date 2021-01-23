import React from 'react';

import { Text } from 'react-native'

export default class Clock extends React.Component {

    constructor(props) {
        super(props);

        this.state = { time: Date.now() };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <Text>
                { this.state.time } 
            </Text>
        )
    }

}