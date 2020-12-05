import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import { withAuthenticator } from 'aws-amplify-react-native'

var AWS = require('aws-sdk');

let config = {
	Auth: {
		// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
		identityPoolId: 'eu-west-2:68e02533-edb2-40f2-901e-a5463ee51d8b',

		// // OPTIONAL - Amazon Cognito User Pool ID
		userPoolId: 'eu-west-2_r5TNW0vRK',

		userPoolWebClientId: '2g920h05c6dvuik8ai3mgqfbo',

		// REQUIRED - Amazon Cognito Region
		region: 'eu-west-2',
	},
	Storage: {
        AWSS3: {
			bucket: 'testclient1bucket', //REQUIRED -  Amazon S3 bucket name
			region: 'us-east-1',
			identityPoolId: 'eu-west-2:68e02533-edb2-40f2-901e-a5463ee51d8b',
        }
    },
	Analytics:{
		disabled: true
	},
}

Amplify.configure(config);
Auth.configure(config);

function App() {
	// Download something from s3

	Auth.currentSession()
	.then( res=>{
		let accessToken = res.getAccessToken()
		let jwt = accessToken.getJwtToken()
		//You can print them to see the full objects
		console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
		console.log(`myJwt: ${jwt}`)

		let idToken = res.getIdToken()
		let jwtID = idToken.getJwtToken();


		// This bit explained here: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#getId-property
		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'eu-west-2:68e02533-edb2-40f2-901e-a5463ee51d8b',
			Logins: {
				'cognito-idp.eu-west-2.amazonaws.com/eu-west-2_r5TNW0vRK': jwtID
			}
		});

		AWS.config.region = 'eu-west-2';
		AWS.config.dynamoDbCrc32 = false;

		AWS.config.credentials.get(function(err)
		{
			if (err) {
				console.log(err);
			} else {
				console.log(AWS.config.credentials.accessKeyId)
				console.log(AWS.config.credentials.secretAccessKey)
				console.log(AWS.config.credentials.sessionToken)
			}
		});

		var s3 = new AWS.S3();

		const params = {
			Bucket: 'testclient1bucket',
			Key: 'app_data/ingredients.json',
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default withAuthenticator(App)