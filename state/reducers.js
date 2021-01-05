
import { combineReducers } from "redux";

import root from "./root_reducers";
import recipeReducer from './recipe_reducer'
import loginReducer from './login_reducer'

export default combineReducers({ root, recipeReducer, loginReducer });

