import React from 'react';

import {
    View,
    Text,
    TouchableHighlight,
    TextInput,
    ScrollView,
} from 'react-native';

import { connect } from "react-redux";

import CheckBox from '@react-native-community/checkbox'

import OutlineButton from './components/outline_button'

import { 
    addRecipe, 
    editRecipe
} from "./state/actions"

let page_title = "Add new recipe";

import allergenStyles from './allergen_styles'

class AddNewRecipeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.onTextChanged = this.onTextChanged.bind(this);
        this.saveRecipe = this.saveRecipe.bind(this);

        const { navigation } = this.props;
        const recipe = navigation.getParam('recipe');

        this.state = {
            recipe: recipe,
            ingredients: recipe ? recipe.ingredients : [],
            name: recipe ? recipe.name : "",
        }
    }

    static navigationOptions = {
        title: page_title,
    };
    
    toggleIngredient( ingredientName ) {        
        let ingredients = this.state.ingredients
        
        if( !ingredients.find( item => item === ingredientName ) ) {
            // if ingredient is not in selected items, add it.
            ingredients.push(ingredientName);
        }
        else {
            // if is is in there, remove it
            let index = ingredients.indexOf( ingredientName )
            ingredients.splice(index, 1);
        }

        this.setState( {
            ingredients : ingredients
        } );
    }

    onTextChanged( text ) {
        this.setState({
            name: text
        });
    }

    goBack() {
        const { navigation } = this.props;
        navigation.goBack();
        navigation.getParam('onSave')();
    }

    saveRecipe() {
        let recipe = {};

        recipe.name = this.state.name,
        recipe.ingredients= this.state.ingredients;

        if( !this.state.recipe ) {
            // Add new recipe
            this.props.addRecipe( recipe ).then( () => {
                console.log("Successfully uploaded new recipe list");
                this.goBack();
            })
            .catch( err => {
                alert( "Uploading new recipe list failed:\n" + err );
            });
        }
        else {
            // Edit existing recipe
            const { navigation } = this.props;
            const initialRecipe = navigation.getParam('recipe');
            let editedItem = {
                previous: initialRecipe,
                current: recipe 
            }

            this.props.editRecipe( editedItem ).then( () => {
                console.log("Successfully uploaded edited recipe list");
                this.goBack();
            })
            .catch( err => {
                alert( "Uploading edited recipe list failed:\n" + err );
            });
        }

    }

    renderRecipeNameInput() {
        return (
            <TextInput style={allergenStyles.ingredientNameInput}
                onChangeText={this.onTextChanged}
                placeholder='Enter name'
                value={ this.state.name } />
        )
    }

    renderIngredientSelect() {
        const ingredients = this.state.ingredients

        let allIngredients = this.props.ingredients;

        if( !allIngredients ) {
            return;
        }

        let scrollList = [];
        for( let i = 0; i < allIngredients.length; i++ ) {
            selected = ingredients.find( item => item === allIngredients[i].name );

            scrollList.push(
                <TouchableHighlight onPress={ () => this.toggleIngredient(allIngredients[i].name) }>
                    <View style={{flexDirection:"row"}}>
                        <CheckBox value={selected ? true : false} onValueChange={() => this.toggleIngredient(allIngredients[i].name)} />
                        <Text style={ [allergenStyles.listText, {fontWeight: ( selected ? "bold" : "normal")}] }>{allIngredients[i].name}</Text>
                    </View>
                </TouchableHighlight>
            )
        }
        return (
            <ScrollView>
                { scrollList }
            </ScrollView>
        );
    }

    render() {
        return ( 
            <View style={{flex:1, flexDirection:"row"}}>
                <View style={{flex:1, flexDirection:"column", justifyContent:"flex-start"}}>
                    <View style = {allergenStyles.container}>
                        <Text>
                            Enter the name of the recipe
                        </Text>
                        { this.renderRecipeNameInput() }

                        <Text>
                            Select ingredients
                        </Text>
                        { this.renderIngredientSelect() }
                        
                        <OutlineButton title="Save recipe" onPress={() => { this.saveRecipe() } } />
                    </View>
                </View>
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
        addRecipe: recipe => dispatch(addRecipe(recipe)),
        editRecipe: recipe => dispatch(editRecipe(recipe)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewRecipeScreen)
