import { WELCOME_SCREEN_KEY, WELCOME_SCREEN_REQEUST_LOADING, WELCOME_SCREEN_ERRORS, WELCOME_SCREEN_REQUEST_STATUS, STATUS, MESSAGE, WELCOME_SCREEN_DATA, WELCOME_SCREEN_UPDATE, WELCOME_SCREEN_RESET, LOG_OUT } from "../Types";

const INIT_STATE = {
    [WELCOME_SCREEN_KEY]: {
        [WELCOME_SCREEN_REQEUST_LOADING]: false,
        [WELCOME_SCREEN_DATA]: undefined,
        [WELCOME_SCREEN_ERRORS]: [],
        [WELCOME_SCREEN_REQUEST_STATUS]: {
            [STATUS]: undefined,
            [MESSAGE]: undefined
        }
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case WELCOME_SCREEN_UPDATE:
            return { ...state, [WELCOME_SCREEN_KEY]: action.payload };
        case WELCOME_SCREEN_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [WELCOME_SCREEN_KEY]: {
                        [WELCOME_SCREEN_REQEUST_LOADING]: false,
                        [WELCOME_SCREEN_DATA]: undefined,
                        [WELCOME_SCREEN_ERRORS]: [],
                        [WELCOME_SCREEN_REQUEST_STATUS]: {
                            [STATUS]: undefined,
                            [MESSAGE]: undefined
                        }
                    }
                }
            }
        default:
            return state;
    }
};