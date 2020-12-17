
const initialState = {
};

// The state is immutable, we cannot push, so we assign new arrays and concat/slice
function rootReducer(state = initialState, action) {
    return state;
}

export default rootReducer;