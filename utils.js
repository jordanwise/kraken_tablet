
export function parseSensorId( sensorId ) {
    let res = sensorId.split("/");
    let out = {};
    out.companyName = res[0];
    out.locationId = res[1];
    out.sensorName = res[2];
    // For topic remove everything except lowercase letters and numbers
    out.topicName = sensorId.replace(/[^a-z0-9/]/g, '');

    return out;
}

export function formatDate( date ) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if( month < 10 ) {
        month = "0" + month
    }
    if( day < 10 ) {
        day = "0" + day
    }

    let res = year + '.' + month + '.' + day
    return res;
}
