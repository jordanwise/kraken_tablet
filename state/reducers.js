
import { combineReducers } from "redux";

import root from "./root_reducers";
import recipeReducer from './recipe_reducer'

export default combineReducers({ root, recipeReducer });

