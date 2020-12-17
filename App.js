import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";

// Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// State
import { Provider } from "react-redux";
import store from "./state/store";

import {
	downloadIngredients,
	downloadRecipes,
} from "./state/actions"

// Authentication
import { withAuthenticator } from 'aws-amplify-react-native'

// AWS authentication 
var AWS = require('aws-sdk');
import Amplify from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

import Home from './home'
import AllergenIngredientScreen from './allergen_ingredient'
import AllergenRecipeScreen from './allergen_recipe'
import SFBBCategory from './sfbb_category.js';

let loginInfo = require('./login_info.json')

let config = {
	Auth: {
		identityPoolId: loginInfo.identityPoolId,
		userPoolId: loginInfo.userPoolId,
		userPoolWebClientId: loginInfo.appClientId,
		region: loginInfo.region,
	},
	Storage: {
        AWSS3: {
			bucket: loginInfo.bucketName,
			region: loginInfo.region,
			identityPoolId: loginInfo.identityPoolId,
        }
    },
	Analytics:{
		disabled: true
	},
}

Amplify.configure(config);
Auth.configure(config);

// Create navigation
const AppNavigator = createStackNavigator(
	{
		Home: {
			screen: Home
		},
		AllergenIngredient: AllergenIngredientScreen,
		AllergenRecipe: AllergenRecipeScreen,
		SFBBCategory: SFBBCategory,
	},
	{
		initialRouteName: "Home"
	}
);

const AppContainer = createAppContainer(AppNavigator);

// const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;
const persistenceKey = "persistenceKey"

const persistNavigationState = async (navState) => {
	try {
		console.log("Moving...")
		await AsyncStorage.setItem(persistenceKey, JSON.stringify(navState))
	} catch (err) {
		// handle the error according to your needs
		console.log(err)
	}
}

const loadNavigationState = async () => {
	const jsonString = await AsyncStorage.getItem(persistenceKey)
	return JSON.parse(jsonString)
}

// Wrap everything in login authenticator

class App extends React.Component {

	componentDidMount() {
		// // Request all permissions needed
		// permissions.requestFileWritePermission();

		// // Download all the data we need
		// store.dispatch(downloadIngredients());
		// store.dispatch(downloadRecipes());

		// Download all the data we need
		this.authenticate().then( () => {
			store.dispatch(downloadIngredients());
			store.dispatch(downloadRecipes());
		})
		
	}

	async authenticate() {
		try {
			let res = await Auth.currentSession();
	
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
	
			AWS.config.region = loginInfo.region;
			AWS.config.dynamoDbCrc32 = false;
	
			await AWS.config.credentials.get();
			console.log("Authenticated.")
		}
		catch( err ) {
			// Authentication failed
			console.log(err);
		}
	}

	render() {
		return (
			<Provider store={store}>
				<AppContainer persistNavigationState={persistNavigationState} loadNavigationState={loadNavigationState} />
			</Provider>
		);
	}
}

export default withAuthenticator(App)