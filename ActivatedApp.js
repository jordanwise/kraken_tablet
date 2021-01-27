import React from 'react';

import { Provider } from "react-redux";
import { Provider as PaperProvider } from 'react-native-paper';
import store from "./state/store";

import AppAuthWrapper from './AppAuthWrapper'

export default class ActivatedApp extends React.Component {

    render() {
        return (
            <Provider store={store}>
                <PaperProvider>
                    <AppAuthWrapper/>
                </PaperProvider>
            </Provider>
        )
    }
}

