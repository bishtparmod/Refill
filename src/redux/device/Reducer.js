import { DEVICE_UPDATE, DEVICE_KEY, DEVICE_RESET, LOG_OUT, DEVICE_ROUTE_LOADING, DEVICE_IS_LOGGED_IN, DEVICE_IS_LOGIN_SKIPPED, DEVICE_IS_WELCOME_SCREEN_SKIPPED } from "../Types";

const INIT_STATE = {
    [DEVICE_KEY]: {
        [DEVICE_ROUTE_LOADING]: true,
        [DEVICE_IS_LOGGED_IN]: false,
        [DEVICE_IS_LOGIN_SKIPPED]: false,
        [DEVICE_IS_WELCOME_SCREEN_SKIPPED]: false
    }
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case DEVICE_UPDATE:
            return { ...state, [DEVICE_KEY]: action.payload };
        case DEVICE_RESET:
        case LOG_OUT:
            return {
                ...state,
                ...{
                    [DEVICE_KEY]: {
                        [DEVICE_ROUTE_LOADING]: true,
                        [DEVICE_IS_LOGGED_IN]: false,
                        [DEVICE_IS_LOGIN_SKIPPED]: false,
                        [DEVICE_IS_WELCOME_SCREEN_SKIPPED]: false
                    }
                }
            }
        default:
            return state;
    }
};