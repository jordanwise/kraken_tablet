import React from 'react';

import { 
    View,
    Text,
    Keyboard,
} from 'react-native'

import { connect } from "react-redux";

import Tick from './tick'

import { TableCell } from './components/table'

let allergenList = require('./data/allergen_list')

class RecipeSelector extends React.Component {
    constructor(props) {
        super(props)

        this.hasAllergen = this.hasAllergen.bind(this);

        this.state = {
            allergens : [],
            name: this.props.ingredient ? this.props.ingredient.name : "",
        }
    }

    componentDidUpdate(prevProps) {
        if( prevProps.recipe && this.props.recipe ) {            
            if( prevProps.recipe.name !== this.props.recipe.name ) {
                this.setState({
                    recipe: this.props.recipe ? this.props.recipe : null,
                    allergens: [],
                    name: this.props.recipe ? this.props.recipe.name : "",
                });
                Keyboard.dismiss();
            }
        }
    }

    allergensToIndices( allergens = [] ) {   // TODO::make common function  
        let indices = allergenList.map( item => allergens.indexOf( item.name) >= 0 );

        return indices;
    }

    hasAllergen( allergenIndex ) {
        let recipe = this.props.recipe;

        // Get allergens for each ingredient 
        let result = false;

        if( recipe ) {
            for( let i = 0; i < recipe.ingredients.length; i++ ) {
                let ingredientName = recipe.ingredients[i];
                let ingredientData = this.props.ingredients.find( item => item.name === ingredientName )

                if( ingredientData ) {
                    let allergenIndices = this.allergensToIndices( ingredientData.allergens )

                    result = result || allergenIndices[allergenIndex]
                }
            }
        }
        return result;
    }

    renderTick( allergenIndex) {
        return (
            <Tick ticked={this.hasAllergen( allergenIndex )} />
        )
    }

    renderDataColumn() {
        let cells = [];
        
        // Header cell
        cells.push( <TableCell>
                <Text>{this.props.recipe.name}</Text>
            </TableCell>);

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
        if( !this.props.recipe ) {
            return null;
        }

        return( this.renderDataColumn() )
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.recipeReducer.ingredients,
        recipes: state.recipeReducer.recipes,
    }
}

export default connect(mapStateToProps)(RecipeSelector)