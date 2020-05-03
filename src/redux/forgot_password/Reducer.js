import { FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_FORM_EMAIL, FORGOT_PASSWORD_REQEUST_LOADING, FORGOT_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, FORGOT_PASSWORD_ERRORS, FORGOT_PASSWORD_UPDATE, LOG_OUT, FORGOT_PASSWORD_RESET } from "../Types";

const INITIAL_STATE = {
    [FORGOT_PASSWORD_KEY]: {
        [FORGOT_PASSWORD_FORM]: {
            [FORGOT_PASSWORD_FORM_EMAIL]: ""
        },
        [FORGOT_PASSWORD_REQEUST_LOADING]: false,
        [FORGOT_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [FORGOT_PASSWORD_ERRORS]: []
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FORGOT_PASSWORD_UPDATE:
            return { ...state, [FORGOT_PASSWORD_KEY]: action.payload }
        case FORGOT_PASSWORD_RESET:
        case LOG_OUT:
            return {
                ...state,
                [FORGOT_PASSWORD_KEY]: {
                    [FORGOT_PASSWORD_FORM]: {
                        [FORGOT_PASSWORD_FORM_EMAIL]: ""
                    },
                    [FORGOT_PASSWORD_REQEUST_LOADING]: false,
                    [FORGOT_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [FORGOT_PASSWORD_ERRORS]: []
                }
            }
        default:
            return state;
    }
}

export default Reducer;