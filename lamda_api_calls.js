// See https://nodejs.dev/learn/making-http-requests-with-nodejs

export function getLoginData(uuid) {
    const event = {
        uuid: uuid
    }

    const data = JSON.stringify(event);
    let hostname = '1ulijg1gh6.execute-api.eu-west-1.amazonaws.com'
    let path = '/default/activateKrakenTablet'
    let url = 'https://' + hostname + path

    return fetch( url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( response => {
        console.log(response);
        return response.json()
    });
}

export function snsCreateEndpoint( platformApplicationArn, token, userId ) {    
    const event = {
        platformApplicationArn: platformApplicationArn,
        token: token,
        userId: userId
    }

    const data = JSON.stringify(event);

    let hostname = 'la2j1zr970.execute-api.eu-west-1.amazonaws.com'
    let path = '/default/createNotificationEndpoint'
    let url = 'https://' + hostname + path

    return fetch( url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( response => {
        console.log("Create endpoint lambda func returned")
        console.log(response);
        return response.json()
    });
}

export function subscribeEndpointToTopic( endpoint, topicArn ) {
    const event = {
        endpoint: endpoint, 
        topicArn: topicArn
    }

    const data = JSON.stringify(event);

    let hostname = 'i7ovqtg1i7.execute-api.eu-west-1.amazonaws.com'
    let path = '/default/subscribeEndpointToTopic'
    let url = 'https://' + hostname + path

    return fetch( url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: data
    })
    .then( response => {
        console.log("Subscription lambda func returned")
        console.log(response);
        return response.json()
    });
}
