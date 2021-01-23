
import React from 'react';

import AsyncStorage from "@react-native-community/async-storage";

// Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Authentication
var AWS = require('aws-sdk');
import { withAuthenticator } from 'aws-amplify-react-native'
import Auth from '@aws-amplify/auth';

// App pages
import Home from './home'
import AllergenIngredientScreen from './allergen_ingredient'
import AllergenRecipeScreen from './allergen_recipe'
import AddNewRecipeScreen from './add_new_recipe'
import SFBBCategory from './sfbb_category.js';

// State
import { connect } from "react-redux";
import store from "./state/store";

import { s3CheckExists, s3Upload } from './data_sync'

import {
    createIngredientsFile,
    createRecipesFile,
	downloadIngredients,
    downloadRecipes,
    createSensorsFile,
    downloadSensors,
} from "./state/actions"

// Create navigation
const AppNavigator = createStackNavigator(
	{
		Home: {
			screen: Home
		},
		AllergenIngredient: AllergenIngredientScreen,
        AllergenRecipe: AllergenRecipeScreen,
		AddNewRecipe: AddNewRecipeScreen,
		SFBBCategory: SFBBCategory,
	},
	{
		initialRouteName: "Home"
	}
);

const AppContainer = createAppContainer(AppNavigator);

// const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;
const persistenceKey = "persistenceKey"
// const persistenceKey = null

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

class ConfiguredAppContainer extends React.Component {

    componentDidMount() {
        // Authenticate user and download app data
        this.authenticate().then(() => {
            // Initial download/creation of data files required
            return s3CheckExists( 'ingredients.json', this.props.loginInfo.bucketName )
        })
        .then( exists => {
            if (!exists) {
                console.log("Need to create ingredients.json")
                return store.dispatch( createIngredientsFile() )
            }
            else {
                return store.dispatch( downloadIngredients() )
            }
        })
        .then( () => {
            return s3CheckExists( 'recipes.json', this.props.loginInfo.bucketName )
        })
        .then( exists => {
            if (!exists) {
                console.log("Need to create recipes.json")
                return store.dispatch( createRecipesFile() )
            }
            else {
                return store.dispatch(downloadRecipes() )
            }
        })
        .then( () => {
            return s3CheckExists( 'sensors.json', this.props.loginInfo.bucketName )
        })
        .then( exists => {
            if (!exists) {
                console.log("Need to create sensors.json")
                return store.dispatch( createSensorsFile() )
            }
            else {
                return store.dispatch( downloadSensors() )
            }
        })
        .then( () => {
            console.log("All data downloaded")
        })
    }
    

    async authenticate() {
        try {
            let res = await Auth.currentSession();

            let accessToken = res.getAccessToken()
            let jwt = accessToken.getJwtToken()

            let idToken = res.getIdToken()
            let jwtID = idToken.getJwtToken();


            let loginInfo = this.props.loginInfo

            let identityProviderName = 'cognito-idp.' + loginInfo.region + '.amazonaws.com/' + loginInfo.userPoolId;

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
        catch (err) {
            // Authentication failed
            console.log("Identity pool authentication failed");
            console.log(err);
        }
    }

    render() {
        return(
            <AppContainer persistNavigationState={persistNavigationState} loadNavigationState={loadNavigationState} />
        )
    }
}

const mapStateToProps = state => {
    return {
        loginInfo: state.loginReducer.loginInfo,
    }
}

const connectedConfiguredAppContainer = connect(mapStateToProps)(ConfiguredAppContainer)

export default withAuthenticator(connectedConfiguredAppContainer)