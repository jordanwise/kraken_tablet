import React from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    Alert,
} from 'react-native';

import { connect } from "react-redux";
import { 
    deleteRecipe,
} from './state/actions'


import AllergenTable from "./allergen_table"
import RecipeSelector from "./recipe_selector"

import OutlineButton from './components/outline_button'

let page_title = "Allergen Recipes";

import styles from './styles'
import allergenStyles from './allergen_styles'

class AllergenRecipeScreen extends React.Component {

    constructor(props) {
        super(props);

        this.selectItem = this.selectItem.bind(this);
        this.onSave = this.onSave.bind(this);

        this.state = {
            selectedItem: null,
        };    
    }

    static navigationOptions = {
        title: page_title,
    };

    componentDidMount() {
        // Ensure selected recipe is up to date
        this.props.navigation.addListener('didFocus', () => {
            if( this.state.selectedItem ) {
                let currentVersion = this.props.recipes.find( recipe => recipe.name == this.state.selectedItem.name );
                if( currentVersion ) {
                    this.setState( {
                        selectedItem: currentVersion,
                    } );
                }
            }
        } );
    }

    onSave() {
        this.setState( {
            selectedItem: null,
        });
    }

    selectItem( item ) {
        this.setState({
            selectedItem: item,
        });
    }

    checkDelete() {
        Alert.alert( 
            "Delete recipe", 
            "Are you sure you want to delete \"" + this.state.selectedItem.name + "\"",
            [
                {text: 'NO', onPress: () => console.log("Cancelled delete of " + this.state.selectedItem.name ), style: 'cancel'},
                {text: 'YES', onPress: () => this.deleteRecipe() },
            ]
        );
    }

    deleteRecipe() {
        if( this.state.selectedItem ) {
            this.props.deleteRecipe( this.state.selectedItem ).then( () => {
                console.log("Successfully deleted item");
            })
            .catch( err => {
                alert( "Deleting item failed:\n" + err );
            });

            this.setState( {
                selectedItem: null
            })
        }
    }

    renderRecipeItem( item, key ) {
        let selected = false;
        if( this.state.selectedItem ) {
            if( this.state.selectedItem.name === item.name ) {
                selected = true;
            }
        }

        return (
            <TouchableHighlight key={key} onPress={ () => this.selectItem(item) }>
                <Text style={ [allergenStyles.listText, { fontWeight: ( selected ? "bold" : "normal") } ]}>
                    {item.name}
                </Text>
            </TouchableHighlight>
        )
    }

    renderRecipeList() {
        let items = this.props.recipes;

        let renderList = [];
        for( let i = 0; i < items.length; i++) {
            let key = "select_recipe_" + i.toString();
            renderList.push( this.renderRecipeItem( items[i], key ) );
        }

        return(
            <View>
                { renderList }
            </View>
        )
    }

    renderSelectedRecipeIngredients() {
        let recipe = this.state.selectedItem
        if( !recipe ) {
            return;
        }

        let renderList = recipe.ingredients.map( item => {
            let ingredient = this.props.ingredients.find( x => x.name == item );

            return( 
                <TouchableHighlight onPress={() => this.props.navigation.navigate('AllergenIngredient', {selectedItem: ingredient})}>  
                    <Text 
                        style={ [allergenStyles.listText ]}>
                            {item}
                    </Text>
                </TouchableHighlight>
            );
        });

        return renderList;
    }

    render() {
        return ( 
            <View style={{flex:1, flexDirection:"row"}}>
                <View style={{flex:2, flexDirection:"column", justifyContent:"flex-start"}}>
                    <View style={allergenStyles.body}>
                        <Text style={styles.textSubHeading}>
                            Recipies: 
                        </Text>
                        { this.renderRecipeList() }
                        
                        <View style={{marginTop:20}}>
                            <OutlineButton title="Add new recipe" onPress={() => this.props.navigation.navigate('AddNewRecipe', {onSave: this.onSave})} />

                            {this.state.selectedItem ?
                                <View>
                                    <OutlineButton title="Edit recipe" onPress={() => this.props.navigation.navigate('AddNewRecipe', { recipe: this.state.selectedItem, onSave: this.onSave } )} />
                                    <OutlineButton title="Delete recipe" onPress={() => this.checkDelete() } />

                                    <View style={{marginTop:20}}>
                                        <Text style={styles.textSubHeading}>
                                            Contains:
                                        </Text>
                                        {this.renderSelectedRecipeIngredients()}
                                    </View>
                                </View>
                            :
                                null
                            }
                        </View>
                    </View>
                    
                </View>

                {this.state.selectedItem ?
                    <AllergenTable>
                        <RecipeSelector recipe={this.state.selectedItem} />
                    </AllergenTable>
                :
                    null
                }
                
            </View>
        )   
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.recipeReducer.ingredients,
        recipes: state.recipeReducer.recipes,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteRecipe: recipe => dispatch(deleteRecipe(recipe)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllergenRecipeScreen)