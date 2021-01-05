
import {
    ADD_RECIPE,
    EDIT_RECIPE,
    DELETE_RECIPE,
    ADD_INGREDIENT,
    EDIT_INGREDIENT,
    DELETE_INGREDIENT,
    DOWNLOADED_INGREDIENTS,
    DOWNLOADED_RECIPES,
    LOADED_LOGIN_INFO,
} from "./action_types";

import {
    s3Download,
    s3Upload,
} from "../data_sync";

let recipeFilePath = 'recipes.json'
let ingredientFilePath = 'ingredients.json'

export function createIngredientsFile() {
    return function (dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = []
        return s3Upload(data, ingredientFilePath, bucketName)
    }
}

export function createRecipesFile() {
    return function (dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = []
        return s3Upload(data, recipeFilePath, bucketName);
    }
}

export function downloadRecipes() {
    return function(dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        return s3Download(recipeFilePath, bucketName)
            .then(json => {
                dispatch({ type: DOWNLOADED_RECIPES, payload: json });
            });
        };
};

export function downloadIngredients() {
    return function(dispatch, getState) {
        let bucketName = getState().loginReducer.loginInfo.bucketName
        return s3Download(ingredientFilePath, bucketName)
            .then(json => {
                dispatch({ type: DOWNLOADED_INGREDIENTS, payload: json });
            });
        };
};

export function addRecipe(payload) {
    return (dispatch, getState) => {
        dispatch({ type: ADD_RECIPE, payload: payload });

        let items = getState().recipeReducer.recipes;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items )
        return s3Upload(data, recipeFilePath, bucketName);
    }
};

export function editRecipe(payload) {
    return (dispatch, getState) => {
        dispatch({ type: EDIT_RECIPE, payload: payload });
        
        let items = getState().recipeReducer.recipes;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items );
        return s3Upload(data, recipeFilePath, bucketName);
    }
}

export function deleteRecipe(payload) { 
    return (dispatch, getState) => {
        dispatch({ type: DELETE_RECIPE, payload: payload });

        let items = getState().recipeReducer.recipes;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items );
        return s3Upload(data, recipeFilePath, bucketName);
    }
}

export function addIngredient(payload) {
    return (dispatch, getState) => {
        dispatch({ type: ADD_INGREDIENT, payload: payload });
        
        let items = getState().recipeReducer.ingredients;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items );
        return s3Upload(data, ingredientFilePath, bucketName);
    }
};

export function editIngredient(payload) {
    return (dispatch, getState) => {
        dispatch({ type: EDIT_INGREDIENT, payload: payload });
        
        // If the ingredient name has changed, we must change all the recipes to have the new name
        {
            let recipes = getState().recipeReducer.recipes
            recipes.forEach( recipe => {
                let foundIndex = recipe.ingredients.findIndex( ingredient => ingredient === payload.previous.name );
                if( foundIndex !== -1 ) {
                    let newArray = recipe.ingredients.slice();
                    newArray.splice( foundIndex, 1, payload.current.name );

                    let newRecipe = {
                        name: recipe.name,
                        ingredients: newArray,
                    }

                    let editedItem = {
                        previous: recipe,
                        current: newRecipe, 
                    }

                    // Then edit all current recipes with this ingredient
                    dispatch({type:EDIT_RECIPE, payload: editedItem});
                }
            } );
        }

        let items = getState().recipeReducer.ingredients;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items );
        return s3Upload(data, ingredientFilePath, bucketName).then( () => { 
            // Upload recipe list also
            let recipes = getState().recipeReducer.recipes;
            let recipeData = JSON.stringify( recipes );
            return s3Upload(recipeData, recipeFilePath, bucketName);
        } );
    }
}

export function deleteIngredient(payload) {
    return (dispatch, getState) => {
        dispatch({ type: DELETE_INGREDIENT, payload: payload });

        let items = getState().recipeReducer.ingredients;
        let bucketName = getState().loginReducer.loginInfo.bucketName
        let data = JSON.stringify( items );
        return s3Upload(data, ingredientFilePath, bucketName);
    }
}

export function setLoginInfo(payload) {
    return { type: LOADED_LOGIN_INFO, payload: payload }
}