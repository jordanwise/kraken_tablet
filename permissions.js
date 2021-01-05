import { PermissionsAndroid } from 'react-native';

async function requestBluetoothPermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
                title: 'Bluetooth Permission',
                message:
                    'App needs access to Bluetooth.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel', 
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use Bluetooth');
        } else {
            console.log('Bluetooth permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}

async function requestFileWritePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'File Write Permission',
                message:
                    'App needs access to your storage.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use write to storage');
        } else {
            console.log('File write permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}

module.exports = {
    requestBluetoothPermission,
    requestFileWritePermission
};

