import * as React from 'react';
import { View, Text } from 'react-native'
import { DataTable } from 'react-native-paper';

import { connect } from "react-redux";

import store from "./state/store";
import { downloadSensorData } from './state/sensor_actions'

import DatePicker from './components/date_picker'

import * as utils from './utils'

class SensorDataScreen extends React.Component {

	constructor(props) {
		super(props)

		this.buildDataTable = this.buildDataTable.bind(this);
		this.setDate = this.setDate.bind(this);

		this.state = {
			currentPage: 0,
			itemsPerPage: 8,
			queryDate: new Date()
		}
	}
	
	componentDidMount() {
		let formatted = utils.formatDate(this.state.queryDate)
		const sensor = this.props.navigation.getParam('sensor', null)

		store.dispatch( downloadSensorData( sensor, formatted) )
	}

	setDate( date ) {
		let formatted = utils.formatDate(date)
		console.log( "Selected date is " + formatted )

		const sensor = this.props.navigation.getParam('sensor', null)

		store.dispatch( downloadSensorData( sensor, formatted) )
		this.setState( { queryDate: date} )
	}
	
	displayData() {
		// If the query is different that just the sensor data, change it here
		let data = this.props.sensorData 
		console.log("redrawing data table")
		console.log(data.length)

		return this.buildDataTable( data )
	}

	sort() {
		// TODO
		console.log("sorting! todo!")
	}

	buildHeader() {
		return(
			<DataTable.Header>
				<DataTable.Title>Sensor ID</DataTable.Title>
				<DataTable.Title numeric onPress={this.sort}>Temperature</DataTable.Title>
				<DataTable.Title numeric onPress={this.sort}>Battery</DataTable.Title>
				<DataTable.Title numeric onPress={this.sort}>Date</DataTable.Title>
				<DataTable.Title numeric onPress={this.sort}>Time</DataTable.Title>
			</DataTable.Header>
		)
	}

	buildRow( data, key ) {
		if( !data ) {
			return
		}
		
		return (
			<DataTable.Row key={key}>
				{/* <DataTable.Cell>{data.sensorId}</DataTable.Cell> */}
				<DataTable.Cell>{data.sensorId}</DataTable.Cell>
				<DataTable.Cell numeric>{data.temp}</DataTable.Cell>
				<DataTable.Cell numeric>{data.battery}</DataTable.Cell>
				<DataTable.Cell numeric>{data.date}</DataTable.Cell>
				<DataTable.Cell numeric>{data.TOD}</DataTable.Cell>
			</DataTable.Row>
		)
	}

	buildRows( data, currentPage, itemsPerPage) {
		console.log("Building rows again")
		let rows = []

		let start = currentPage * itemsPerPage
		let end = start + itemsPerPage

		if( end >= data.length ) {
			end = data.length - 1
		}

		console.log("Range: " + start + "-" + end)

		for( let i = start; i < end; i++ ) {
			rows.push( this.buildRow(data[i], "sensorDataRow" + i) )
		}
		return rows
	}

	buildDataTable( data ) {

		let currentPage = this.state.currentPage;
		let itemsPerPage = this.state.itemsPerPage;
		console.log("currentPage is" + currentPage)

		let numPages = Math.ceil( data.length / itemsPerPage)
		console.log("num pages: " + numPages)
		let label = (currentPage + 1) + " of " + (numPages)

		return(
			<DataTable>
				{ this.buildHeader() }
				{ this.buildRows(data, currentPage, itemsPerPage) }

				<DataTable.Pagination
					page={currentPage}
					numberOfPages={numPages}
					onPageChange={page => {
						console.log("Page is" + page)
						this.setState( { currentPage: page } );
					}}
					label={label} 
				/>
			</DataTable>
		)
	}

	renderControls() {
		return(
			<View>
				<DatePicker setDate={this.setDate}/>
				<Text>
					Current displaying 
				</Text>

			</View>
		)
	}

	render() {
		return (
			<View>
				{this.renderControls()}
				{this.displayData()}
			</View>
		)
	}
}

const mapStateToProps = state => {
    return {
        sensorData : state.sensorReducer.sensorData,
    }
}

export default connect( mapStateToProps )(SensorDataScreen)
