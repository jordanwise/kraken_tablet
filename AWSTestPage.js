import React from 'react';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default class AWSTestPage extends React.Component {

    render() {
        Auth.currentSession()
        .then( res=>{
            let accessToken = res.getAccessToken()
            let jwt = accessToken.getJwtToken()
    
            let idToken = res.getIdToken()
            let jwtID = idToken.getJwtToken();
    
            let identityProviderName = 'cognito-idp.'+ loginInfo.region + '.amazonaws.com/' + loginInfo.userPoolId;
    
            console.log("identity provider name: " + identityProviderName);
            // This bit explained here: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getId-property
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: loginInfo.identityPoolId,
                Logins: {
                    [identityProviderName]: jwtID
                }
            });
    
            // Trust relationship needs to be set:
            // https://stackoverflow.com/questions/44043289/aws-invalid-identity-pool-configuration-check-assigned-iam-roles-for-this-poo
    
            AWS.config.region = 'eu-west-2';
            AWS.config.dynamoDbCrc32 = false;
    
            AWS.config.credentials.get(function(err)
            {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Authenticated.")
                }
            });
    
            var s3 = new AWS.S3();
    
            const params = {
                Bucket: loginInfo.bucketName,
                Key: 'ingredients.json',
            };
    
            s3.getObject(params, (s3Err, data) => {
                if (s3Err) {
                    console.log("s3 download error..")
                    console.log(s3Err); 
                    // return reject(s3Err);
                }
                console.log(`Downloaded ${data.ContentLength} bytes.`);
                console.log( JSON.parse( JSON.parse(data.Body) ) );
                // return resolve(data.Body);
            } );
        } )
    
        return (
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app! HELLO</Text>
                <StatusBar style="auto" />
            </View>
        );
    }
}