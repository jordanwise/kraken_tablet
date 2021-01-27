
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
