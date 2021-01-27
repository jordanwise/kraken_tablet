

function queryDB( tableName, indexName, queryParams ) {
    let params = {
        TableName: tableName,
        IndexName: indexName,
        ...queryParams
    };

    // Create DynamoDB DocumentClient object - allows us to use Javascript native types
    var docClient = new AWS.DynamoDB.DocumentClient();
    
    const queryWrapper = (params) => new Promise((resolve, reject) => {

        docClient.query(params, function(err, data) {
            if (err) {
                console.log("Query error", err);
                reject( err )
            } else {
                console.log("Query succeeded.");

                resolve(data.Items)    
            }
        });
    })
    
    return queryWrapper(params);

}

export function getDataFromDate( tableName, sensorId, date ) {
    let queryParams = {

        ExpressionAttributeNames:{
            "#mydate": "date"
        },
        ExpressionAttributeValues: {
            ":sensorId": sensorId,
            ":date": date
        },
    
        KeyConditionExpression: "sensorId = :sensorId and #mydate = :date",
    };

    let index = "sensorId-date-index"

    return queryDB( tableName, index, queryParams );
}

export function getTempLessThan( sensorId, minTemp, callback ) {

    let queryParams = {
        ExpressionAttributeNames:{
            "#temp":"temp"
        },
        ExpressionAttributeValues: {
            ":sensorId": sensorId,
            ":temp": minTemp
        },
    
        KeyConditionExpression: "sensorId = :sensorId and #temp < :temp",
    };

    let index = "sensorId-temp-index"

    queryDB( index, queryParams, callback );
}