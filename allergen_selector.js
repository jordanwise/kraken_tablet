
import React from 'react'

import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    Keyboard,
} from 'react-native'

import { connect } from "react-redux";

import { TableCell } from "./components/table"
import PressButton from "./press_button"

let allergenList = require('./data/allergen_list');

import allergenStyles from "./allergen_styles"

export default class AllergenSelector extends React.Component {

    constructor( props ) {
        super(props)

        this.onTextChanged = this.onTextChanged.bind(this);
        this.onTextSubmitted = this.onTextSubmitted.bind(this);
        this.onAllergenPressed = this.onAllergenPressed.bind(this);

        this.renderTick = this.renderTick.bind(this);
        this.renderHeaderCell = this.renderHeaderCell.bind(this);

        this.state = {
            allergens : this.props.ingredient ? this.props.ingredient.allergens : [],
            name: this.props.ingredient ? this.props.ingredient.name : "",
        }
    }

    componentDidUpdate(prevProps) {
        if( prevProps.ingredient && this.props.ingredient ) {            
            if( prevProps.ingredient.name !== this.props.ingredient.name || (prevProps.editable !== this.props.editable ) ) {
                this.setState({
                    allergens : this.props.ingredient ? this.props.ingredient.allergens : [],
                    name: this.props.ingredient ? this.props.ingredient.name : "",
                });
                Keyboard.dismiss();
            }
        }
    }
    
    // See https://linguinecode.com/post/get-child-component-state-from-parent-component for passing state to parent
    onTextChanged( text ) {
        this.setState({
            name: text
        });
    }

    onTextSubmitted( event ) { 
        if (this.props.dataChanged) {
            this.props.dataChanged( this.props.ingredient, this.state );
        }
    }

    allergensToIndices( allergens ) {     
        if( !allergens ) {
            return Array(allergenList.length).fill(false);
        }

        let indices = allergenList.map( item => allergens.indexOf( item.name) >= 0 );
        return indices;
    }

    hasAllergen( allergenIndex ) {
        let data = this.allergensToIndices( this.state.allergens );
        return data[allergenIndex]
    }

    onAllergenPressed( allergenIndex ) {
        if( !this.props.editable ) 
            return;

        let data = this.allergensToIndices( this.state.allergens )
        data[allergenIndex] = !data[allergenIndex];

        let newData = this.indicesToAllergenNames( data );

        this.setState({
            allergens: newData
        }, () => {
            if (this.props.dataChanged) {
                // let previous = this.props.ingredient ? this.props.ingredient : this.state;
                this.props.dataChanged(this.props.ingredient, this.state);
            }
        });
    }

    indicesToAllergenNames( indices ) {
        let allergens = []
        for( let i = 0; i < allergenList.length; i++ ) {
            if( indices[i] ) {
                allergens.push( allergenList[i].name ); 
            }
        }
        return allergens;
    }

    renderTick( allergenIndex ) {
        return (
            <PressButton 
                onPress={() => this.onAllergenPressed( allergenIndex )} 
                selected={() => this.hasAllergen( allergenIndex )}
            />
        )
    }

    renderHeaderCell() {
        return (
            <TextInput 
                style={allergenStyles.cellText}
                placeholder='Enter name'
                onChangeText={this.onTextChanged}
                editable={this.props.editable}
                onSubmitEditing={this.onTextSubmitted}
                value={this.state.name}
            />
        )
    }

    renderDataColumn() {
        let cells = [];
        
        // Header cell
        cells.push( <TableCell>
                {this.renderHeaderCell()}
            </TableCell> );
        
        for( let i = 0; i < allergenList.length; i++ ) {
            cells.push( <TableCell>
                { this.renderTick(i) }
            </TableCell> );
        }

        return (
            <View style={{flexDirection:"column"}}>
                {cells}
            </View>
        );
    }

    render() {
        if( !this.props.ingredient ) {
            return null;
        }

        return( this.renderDataColumn() )
    }
}
