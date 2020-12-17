// Generic table class.
// Data expected: 2 dimension array [itemIndex][dataIndex] (column number)(rowNumber)
// Pass render functions for header, first column, cell as props, eg:
// <Table tableData={tableData} renderCell={this.renderTick} renderHeaderCell={this.renderHeaderCell} renderColumnCell={this.renderAllergen} headerSize={headerSize} colSize={allergenList.length} />

import React from 'react';

import {
    View,
    StyleSheet,
} from 'react-native';

const tableSizes = {
    firstColumnWidth: 100,
    normalColumnWidth: 100,
    firstRowHeight: 40,
    normalRowHeight: 60,
}

const tableStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flex: 0,
        flexDirection: 'row',
    },
    column: {
        flex: 0,
        flexDirection: 'column',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: tableSizes.normalColumnWidth,
        height: tableSizes.normalRowHeight,
        borderColor: "black",
        borderRightWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    emptyCell: {
        flex: 0,
        width: tableSizes.normalColumnWidth,
        height: tableSizes.normalRowHeight,
    },
    dimensions: {
        width: tableSizes.normalColumnWidth,
        height: tableSizes.normalRowHeight,
    },
    headerRowCell: { 
        width: tableSizes.normalColumnWidth, 
        alignItems: 'center',
        borderColor: "black",
        borderRightWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
});


class TableCell extends React.Component {
    render() {
        return (
            <View style={ tableStyles.cell }>
                {/* Cell contents */}
                {this.props.children}
            </View>
        );
    }
};

class Table extends React.Component {

    constructor(props) {
        super(props);
    }

    renderCell( itemIndex, dataIndex ) {
        return ( 
            <TableCell>
                { this.props.renderCell( itemIndex, dataIndex) } 
            </TableCell>
        )
    }

    renderHeaderCell( dataIndex ) {
        return (
            <View style={tableStyles.headerRowCell}>
                { this.props.renderHeaderCell(dataIndex) }
            </View>
        )
    }

    renderHeader() {

        let headerCells = [];
        let headerDataSize = this.props.headerSize ? this.props.headerSize : 1;
        for( let dataIndex = 0; dataIndex < headerDataSize; dataIndex++) {
            headerCells.push( this.renderHeaderCell( dataIndex ) );
        }

        return (
            <View style={[tableStyles.row, tableStyles.dimensions, { alignItems: 'center' }]}>
                <View style={tableStyles.emptyCell} />
                { headerCells }
            </View>
        );
    }

    renderColumn() {

        let columnCells = [];
        let columnDataSize = this.props.colSize;
        for( let dataIndex = 0; dataIndex < columnDataSize; dataIndex++) {
            columnCells.push( this.renderColumnCell( dataIndex ) );
        }

        return (
            <View style={[tableStyles.column]}>
                { columnCells }
            </View>
        )
    }

    renderTableData( data ) {
        let allRenderData = [];
        if( !data ) {
            return;
        }

        let numItems = data.length

        for( let itemIndex = 0; itemIndex < numItems; itemIndex++) {
            let itemDataSize = data[itemIndex].length

            let itemRenderData = [];

            for( let dataIndex = 0; dataIndex < itemDataSize; dataIndex++) {
                itemRenderData.push(
                    this.renderCell( itemIndex, dataIndex )
                );
            }

            let colRenderData = ( 
                <View style={[tableStyles.column]}>
                    {itemRenderData}
                </View>
            )
            allRenderData.push( colRenderData );
        }

        return allRenderData;
    }

    render() {
        return (
            <View style={tableStyles.container}>

                {/* Header */}
                { this.renderHeader() }
    
                <View style={{flex:1,flexDirection:'row'}}>
                    
                    {/* First Column */}
                    { this.renderColumn() }

                    {/* Grid of data */}
                    { this.renderTableData( this.props.tableData ) } 

                </View>

            </View>
        )
    }
}

export {
    Table, 
    TableCell,
    tableStyles
};