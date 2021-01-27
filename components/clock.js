import React from 'react';

import { Text } from 'react-native'

export default class Clock extends React.Component {

    constructor(props) {
        super(props);

        this.state = { time: Date.now() };
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 200);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {

        var date = new Date(this.state.time)

        let time = date.toUTCString();

        return (
            <Text>
                { time } 
            </Text>
        )
    }

}