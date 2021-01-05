// See https://nodejs.dev/learn/making-http-requests-with-nodejs

export function getLoginData(uuid) {
    const event = {
        uuid: uuid
    }

    const data = JSON.stringify(event);

    let hostname = 'dfr8l1bzob.execute-api.eu-west-2.amazonaws.com'
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
