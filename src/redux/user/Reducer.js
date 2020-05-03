import { USER_KEY, USER_DATA, USER_UPDATE, LOG_OUT } from "../Types";

const INITIAL_STATE = {
    [USER_KEY]: {
        [USER_DATA]: undefined
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_UPDATE:
            return { ...state, [USER_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [USER_KEY]: {
                    [USER_DATA]: undefined
                }
            }
        default:
            return state;
    }
}

export default Reducer;