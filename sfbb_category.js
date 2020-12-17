import React from 'react';

import { View } from 'react-native' 

import PDFViewer from './pdf_viewer';

export default class SFBBCategory extends React.Component {
    render() {
        console.log("rendering sfbb")
        const { navigation } = this.props;
        const filename = navigation.getParam('filename', '');

        return (
            <View style={{ flex: 1 }}>
                <PDFViewer filename={filename} />
            </View>
        )
    }
}