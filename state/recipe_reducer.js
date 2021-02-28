

import { 
    ADD_INGREDIENT,
    EDIT_INGREDIENT,
    DELETE_INGREDIENT,
    ADD_RECIPE,
    EDIT_RECIPE,
    DELETE_RECIPE,
    DOWNLOADED_INGREDIENTS,
    DOWNLOADED_RECIPES,
} from "./action_types";

const initialState = {
    ingredients: [],
    recipes: [],
};

function updateObjectInArray( array, index, newObject ) {
    // This magic finds the index with a matching name, removes 1 element and adds item
    let newArray = array.slice()

    newArray.splice( index, 1, newObject );
    return newArray;
}

function removeObjectFromArray( array, index ) {
    let newArray = array.slice()

    newArray.splice(index, 1);
    return newArray;
}

// See here for how to do the concatanating: https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
function recipeReducer(state = initialState, action) {
    
    if (action.type === ADD_INGREDIENT) {
        return Object.assign({}, state, {
            ingredients: state.ingredients.concat(action.payload)
        });
    }

    if( action.type === EDIT_INGREDIENT ) {
        let items = state.ingredients;

        let foundIndex = items.findIndex( x => x.name === action.payload.previous.name );
        if( foundIndex === -1 ) {
            console.log("Unable to find ingredient to update");
            return;
        }

        let newArray = updateObjectInArray(items, foundIndex, action.payload.current);

        return Object.assign({}, state, {
            ingredients: newArray
        }); 
    }

    if( action.type === DELETE_INGREDIENT ) {
        let items = state.ingredients;

        let foundIndex = items.findIndex( x => x.name === action.payload.name );
        if( foundIndex === -1 ) {
            console.log( "Unable to find ingredient to delete");
            return;
        }

        let newArray = removeObjectFromArray( items, foundIndex );

        return Object.assign({}, state, {
            ingredients: newArray
        });
    }

    if (action.type === ADD_RECIPE) {
        return Object.assign({}, state, {
            recipes: state.recipes.concat(action.payload)
        });
    }

    if( action.type === EDIT_RECIPE ) {
        let items = state.recipes;

        let foundIndex = items.findIndex( x => x.name === action.payload.previous.name );
        if( foundIndex === -1 ) {
            console.log("Unable to find recipe to update");
            return;
        }

        let newArray = updateObjectInArray(items, foundIndex, action.payload.current);

        return Object.assign({}, state, {
            recipes: newArray
        }); 
    }

    if( action.type === DELETE_RECIPE ) {
        let items = state.recipes;

        let foundIndex = items.findIndex( x => x.name === action.payload.name );
        if( foundIndex === -1 ) {
            console.log( "Unable to find recipe to delete");
            return;
        }

        let newArray = removeObjectFromArray( items, foundIndex );

        return Object.assign({}, state, {
            recipes: newArray
        });
    }

    if (action.type === DOWNLOADED_INGREDIENTS) {
        let downloaded_data = JSON.parse(action.payload);

        console.log("Downloaded ingredients")

        return Object.assign({}, state, {
            ingredients: state.ingredients.concat(downloaded_data)
        });
    }

    if( action.type === DOWNLOADED_RECIPES ) {
        let downloaded_data = JSON.parse(action.payload);

        return Object.assign({}, state, {
            recipes: state.recipes.concat(downloaded_data)
        }); 
    }

    return state;
}

export default recipeReducer;
