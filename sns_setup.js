import messaging from '@react-native-firebase/messaging';

import * as apiCalls from './lamda_api_calls'

export async function createNotificationEndpoint() {

    let platformApplicationArn = 'arn:aws:sns:eu-west-1:557072455669:app/GCM/KrakenTabletApp'
    
    let token = await messaging().getToken()
    console.log("token: " + token )

    return apiCalls.snsCreateEndpoint( platformApplicationArn, token)
}

export async function subscribeEndpointToTopic( endpoint, topicArn ) {
    console.log("Subscribing endpoint " + endpoint + " to topic " + topicArn)

    return apiCalls.subscribeEndpointToTopic(endpoint, topicArn )
}

