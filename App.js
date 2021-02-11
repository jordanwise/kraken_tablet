import React from 'react';
import {
	View,
	TextInput,
	Button
} from 'react-native';

import * as apiCalls from './lamda_api_calls'
import * as snsSetup from './sns_setup'

import { writeFile, fileExists, readFile } from './data_sync'

import permissions from './permissions'
import store from "./state/store";

import ActivatedApp from './ActivatedApp'

import {
	setLoginInfo,
} from "./state/actions"

// Wrap everything in login authenticator

class App extends React.Component {
	constructor(props) {
		super(props)

		this.onChangeActivationText = this.onChangeActivationText.bind(this)
		this.submitActivation = this.submitActivation.bind(this)

		this.state = {
			modalVisible: true,
			activationText: "",
			loginInfoFound: false,
		};
	}

	componentDidMount() {
		let infoFileName = 'login_info.json'

		// Request all permissions needed
		permissions.requestFileWritePermission();

		fileExists( infoFileName )
		.then( exists => {
			if( exists ) {
				console.log("Found login info")
				return readFile(infoFileName)
				.then( data => {
					store.dispatch( setLoginInfo( JSON.parse(data) ) );
				})
				.then( () => {
					this.setState({
						loginInfoFound: true
					})
				})
			}
			else {
				console.log("No login found")
				return Promise.reject( new Error('No login info file found!'))
			}
		})
		.catch( err => {
			console.log(err)
		})
	}

	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	}

	onChangeActivationText( text ) {
		console.log(text)
		this.setState({
			activationText: text
		})
	}

	submitActivation() {
		console.log("Submitted text: " + this.state.activationText)
		let infoFileName = 'login_info.json'

		apiCalls.getLoginData(this.state.activationText)
		.then( json => {		
			fileExists( infoFileName )
			.then ( res => {
				if( !res ) {
					console.log("login file doesn't exist, writing it now");
					return writeFile( 'login_info.json', JSON.stringify(json) )
				}
				else {
					return Promise.reject( new Error("Login file already exists") )
				}
			})
			.then( len => {
				console.log("written " + len + " bytes to file " + infoFileName)

				return snsSetup.createNotificationEndpoint()
			})
			.then( data => {
				console.log(data)

				json.notificationEndpointArn = data.EndpointArn
				
				return snsSetup.subscribeEndpointToTopic( data.EndpointArn, json.sensorListTopicArn )
			})
			.then( data => {
				console.log(data)
				console.log("Endpoint created and subcribed to notifications")
				console.log("App activated")

				// Add the endpoint info on the state
				json.sensorListNotificationSubscription = data.SubscriptionArn

				// Write the json to state
				console.log('Saving login info:')
				console.log(json)
				store.dispatch( setLoginInfo( json ) );

				this.setState({
					loginInfoFound: true
				})
			})
			.catch( err => {
				console.log(err)
			})
		})
	}

	displayActivation() {
		return( 
			<View>
				<TextInput
					onChangeText={this.onChangeActivationText}
					onSubmitEditing={this.submitActivation}
					defaultValue="Enter activation code"
					clearTextOnFocus={true}/>
				<Button title="Submit code" onPress={this.submitActivation}/>					
			</View>
		)
	}


	displayApp() {
		return (
			<ActivatedApp/>
		)
	}
	render() {
		let activationRequired = !this.state.loginInfoFound;

		return (
				activationRequired ?
					this.displayActivation() 
				:
					this.displayApp()
		);
	}
}

export default App