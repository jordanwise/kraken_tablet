import React from 'react';

import { Button } from 'react-native-elements';

export default class OutlineButton extends React.Component {
    render() {
        return (
            <Button {...this.props} type="outline">
                {this.props.children}
            </Button>
        );
    }
}
