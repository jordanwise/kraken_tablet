import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Alert,
} from 'react-native';

import { connect } from "react-redux";
import { 
    addIngredient, 
    editIngredient,
    deleteIngredient,
} from "./state/actions"

import OutlineButton from './components/outline_button'

import AllergenTable from "./allergen_table"
import AllergenSelector from './allergen_selector'

let page_title = "Allergen Ingredients";

import styles from './styles'
import allergenStyles from "./allergen_styles"

class AllergenIngredientScreen extends React.Component {

    constructor(props) {
        super(props);

        this.editIngredient = this.editIngredient.bind(this);
        this.selectIngredient = this.selectIngredient.bind(this);

        this.dataChanged = this.dataChanged.bind(this);

        const selectedItem = this.props.navigation.getParam('selectedItem');

        this.state = {
            addingNewItem: false,
            edittingItem: false,
            selectedItem: selectedItem,
            newItem: null,
            editedItem: null,
        };
    }

    static navigationOptions = {
        title: page_title,
    };

    componentDidMount() {
    }

    addIngredient() {
        if( this.state.editedItem ) {
            this.props.addIngredient( this.state.editedItem.current ).then( () => {
                console.log("Successfully uploaded new ingredient list");
            })
            .catch( err => {
                alert( "Uploading new ingredient list failed:\n" + err );
            });
            this.setState( {
                newItem: null,
                editedItem: null,
                edittingItem: false,
                addingNewItem: false
            })
            return
        }
        if( this.state.newItem ) {
            if( this.state.newItem.name === "" ) {
                alert( "Please enter a name");
                return;
            }
            this.props.addIngredient( this.state.newItem ).then( () => {
                console.log("Successfully uploaded new ingredient list");
            })
            .catch( err => {
                alert( "Uploading new ingredient list failed:\n" + err );
            });

            this.setState( {
                newItem: null,
                addingNewItem: false
            })
        }
        
    }

    editIngredient() {
        if( this.state.editedItem ) {
            this.props.editIngredient( this.state.editedItem ).then( () => {
                console.log("Successfully uploaded edited ingredient list");
            })
            .catch( err => {
                alert( "Uploading edited ingredient list failed:\n" + err );
            });

            this.setState({ 
                edittingItem: false,
                selectedItem: this.state.editedItem.current
            });
        } 
    }

    checkEdit() {
        // Get list of recipes containing this ingredient
        if( !this.state.editedItem ) {
            return;
        }

        let recipeList = [];
        this.props.recipes.forEach( recipe => {
            let foundRecipeWithIngredient = recipe.ingredients.find( ingredient => ingredient === this.state.editedItem.previous.name );
            if( foundRecipeWithIngredient ) {
                recipeList.push( recipe );
            }
        } );

        console.log(recipeList);

        Alert.alert( 
            "Edit ingredient", 
            "Are you sure you want to save changes to \"" + this.state.editedItem.previous.name + "\"\n" + 
            "This will affect the following recipes:" + recipeList.map( item => "\n" + item.name ),
            [
                {text: 'NO', onPress: () => {
                    console.log("Cancelled edit of " + this.state.editedItem.previous.name );
                    this.setState( { edittingItem: false} );
                }, style: 'cancel'},
                {text: 'YES', onPress: () => this.editIngredient() },
            ]
        );
    }

    checkDelete() {
        Alert.alert( 
            "Delete ingredient", 
            "Are you sure you want to delete \"" + this.state.selectedItem.name + "\"",
            [
                {text: 'NO', onPress: () => console.log("Cancelled delete of " + this.state.selectedItem.name ), style: 'cancel'},
                {text: 'YES', onPress: () => this.deleteIngredient() },
            ]
        );
    }

    deleteIngredient() {
        if( this.state.selectedItem ) {
            this.props.deleteIngredient( this.state.selectedItem ).then( () => {
                console.log("Successfully deleted item");
            })
            .catch( err => {
                alert( "Deleting item failed:\n" + err );
            });

            this.setState( {
                selectedItem: null,
                edittingItem: false
            })
        }
    }

    dataChanged( oldData, newData ) {
        let oldIngredient = {};
        
        if( oldData ) {
            oldIngredient.name = oldData.name;
            oldIngredient.allergens = oldData.allergens;
        }

        let newIngredient = {};
        newIngredient.name = newData.name;
        newIngredient.allergens = newData.allergens;

        if( oldData.name === ""  ) {
            // Adding a new thing
            this.setState( {
                newItem: newIngredient
            });
        }
        else {
            // Editing an existing thing
            this.setState( {
                editedItem: {
                    previous: oldIngredient,
                    current: newIngredient 
                }
            });
        }
    }

    selectIngredient( item ) {
        this.setState({
            selectedItem: item,
            addingNewItem: false,
            edittingItem: false
        });
    }

    renderIngredientItem( item, index ) {
        let selected = false;
        if( this.state.selectedItem ) {
            if( this.state.selectedItem.name === item.name ) {
                selected = true;
            }
        }
        return (
            <TouchableHighlight key={index} onPress={ () => this.selectIngredient(item) }>
                <Text style={ [allergenStyles.listText, { fontWeight: ( selected ? "bold" : "normal") } ]}>
                    {item.name}
                </Text>
            </TouchableHighlight>

        )
    }

    renderIngredientList() {
        let items = this.props.ingredients;

        let renderList = [];
        for( let i = 0; i < items.length; i++) {
            renderList.push( this.renderIngredientItem( items[i], i ) );
        }

        return(
            <View>
                { renderList }
            </View>
        )
    }

    render() {
        let ingredient = null;
        let editable = this.state.addingNewItem || this.state.edittingItem;

        if( this.state.addingNewItem ) {
            ingredient = this.state.newItem;
        }
        else if( this.state.selectedItem ) {
            ingredient = this.state.selectedItem;
        }

        return (
            <View style={{flex:1, flexDirection:"row"}}>
                {/* Ingredient list */}
                <View style={{flex:2, flexDirection:"column"}}>
                    <View style={allergenStyles.body}>
                        <Text style={styles.textSubHeading} >
                            Ingredients:
                        </Text>
                        { this.renderIngredientList() }

                        <View style={{marginTop:20}}>
                            {/* Add new ingredient button  */}
                            { !this.state.addingNewItem ? 
                                <OutlineButton 
                                    title="Add new ingredient" 
                                    onPress={ () => this.setState( { 
                                        addingNewItem: true,
                                        newItem: {
                                            name: "",
                                            allergens: [],
                                        },
                                        selectedItem: null,
                                    }) }
                                />
                            :
                                null
                            }

                            {/* Save and cancel buttons for adding item*/}
                            { this.state.addingNewItem ?
                                <View>
                                    <OutlineButton
                                        title="Save changes"
                                        onPress={() => this.addIngredient()}
                                    />
                                    <OutlineButton
                                        title="Cancel"
                                        onPress={() => this.setState({ addingNewItem: false })}
                                    />
                                </View>
                            :
                                null
                            }
                            

                            {/* Edit button */}
                            { this.state.selectedItem && !this.state.edittingItem ? 
                                <OutlineButton 
                                    title="Edit ingredient" 
                                    onPress={ () => this.setState( { edittingItem: true } ) }
                                />
                            : 
                                null
                            }
                            {/* Save and cancel buttons for editing item*/}
                            { this.state.edittingItem ?
                                <View>
                                    <OutlineButton 
                                        title="Save changes" 
                                        onPress={ () => this.checkEdit() }
                                    />
                                    <OutlineButton 
                                        title="Cancel" 
                                        onPress={ () => this.setState( { edittingItem: false} ) }
                                    />
                                </View>
                            : 
                                null
                            }

                            {/* Delete button */}
                            { this.state.selectedItem ? 
                                <OutlineButton 
                                    title="Delete ingredient" 
                                    onPress={ () => this.checkDelete() }
                                />
                            : 
                                null
                            }
                        </View>
                    </View>
                </View>

                {/* Allergen table */}
                { ingredient ? 
                    <AllergenTable>
                        <AllergenSelector ingredient={ingredient} editable={editable} dataChanged={this.dataChanged} />
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
        addIngredient: ingredient => dispatch(addIngredient(ingredient)),
        editIngredient: editedIngredient => dispatch(editIngredient(editedIngredient)),
        deleteIngredient: ingredient => dispatch(deleteIngredient(ingredient)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllergenIngredientScreen)