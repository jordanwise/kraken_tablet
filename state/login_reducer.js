

import{
    LOADED_LOGIN_INFO
} from "./action_types";

const initialState = {
    loginInfo: {},
};

export default function loginReducer(state = initialState, action) {
    
    if (action.type === LOADED_LOGIN_INFO) {
        return Object.assign({}, state, {
            loginInfo: action.payload
        });
    }

    return state;
}