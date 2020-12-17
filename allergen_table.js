import React from 'react'

import { 
    View,
    Text,
    Image,
} from 'react-native'

import { TableCell } from './components/table'

let allergenList = require('./data/allergen_list');

import allergenStyles from "./allergen_styles"

export default class AllergenTable extends React.Component {

    renderAllergen( index ) {
        // Needs to be rendered in a view where style={{flex:1}}
        let allergen = allergenList[index];
        return (
            <View style={ {flex:1, alignItems: 'center' } }>
                {/* Cell contents */}
                <Image
                    style={ allergenStyles.cellImage }
                    source={allergen.icon}
                    resizeMode="center"
                />
                <Text style={allergenStyles.cellText}>{allergen.name}</Text>
            </View>
        );
    }

    renderColumnCell( dataIndex ) {
        return ( 
            <TableCell>
                { this.renderAllergen( dataIndex ) }
            </TableCell> )
    }

    renderColumn() {
        let columnCells = [];
        let columnDataSize = allergenList.length;

        //Push empty cell for the header row
        columnCells.push( <TableCell/> );

        for( let dataIndex = 0; dataIndex < columnDataSize; dataIndex++) {
            columnCells.push( this.renderColumnCell( dataIndex ) );
        }

        return (
            <View style={{flexDirection:"column"}}>
                { columnCells }
            </View>
        )
    }

    render() {
        return (
            <View style={{flex:1, flexDirection:"row"}}>
                {/* Allergen column */}
                { this.renderColumn()}

                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {this.props.children}
                </View>

            </View>

        )
    }
}