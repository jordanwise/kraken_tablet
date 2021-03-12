
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

// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"/"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"/"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}
