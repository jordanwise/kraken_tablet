import React from 'react';

import { Provider } from "react-redux";
import store from "./state/store";

import AppAuthWrapper from './AppAuthWrapper'

export default class ActivatedApp extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <AppAuthWrapper/>
            </Provider>
        )
    }
}

