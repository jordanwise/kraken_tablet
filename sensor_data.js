import * as React from 'react';
import { DataTable } from 'react-native-paper';

import { connect } from "react-redux";

import store from "./state/store";
import { downloadSensorData } from './state/sensor_actions'

class SensorDataScreen extends React.Component {

	constructor(props) {
		super(props)

		this.buildDataTable = this.buildDataTable.bind(this);

		this.state = {
			currentPage: 0,
			itemsPerPage: 8,
		}
	}

	componentDidMount() {
        const { navigation } = this.props;
		const sensor = navigation.getParam('sensor', null);
		store.dispatch( downloadSensorData( sensor) )
	}

	displayData() {
		// If the query is different that just the sensor data, change it here
		let data = this.props.sensorData 

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

	render() {
		return (
			this.displayData()
		)
	}
}

const mapStateToProps = state => {
    return {
        sensorData : state.sensorReducer.sensorData,
    }
}

export default connect( mapStateToProps )(SensorDataScreen)
