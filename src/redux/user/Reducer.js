import { USER_DATA, USER_KEY, USER_UPDATE, USER_RESET, LOG_OUT } from "../Types";

const INIT_STATE = {
    [USER_KEY]: {
        [USER_DATA]: undefined
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case USER_UPDATE:
            return { ...state, [USER_KEY]: action.payload };
        case USER_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [USER_KEY]: {
                        [USER_DATA]: undefined
                    }
                }
            }
        default:
            return state;
    }
};