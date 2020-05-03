import { RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_FORM_PASSWORD, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, RESET_PASSWORD_REQEUST_LOADING, RESET_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, RESET_PASSWORD_ERRORS, RESET_PASSWORD_UPDATE, LOG_OUT, RESET_PASSWORD_RESET } from "../Types";

const INITIAL_STATE = {
    [RESET_PASSWORD_KEY]: {
        [RESET_PASSWORD_FORM]: {
            [RESET_PASSWORD_FORM_PASSWORD]: "",
            [RESET_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
        },
        [RESET_PASSWORD_REQEUST_LOADING]: false,
        [RESET_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [RESET_PASSWORD_ERRORS]: []
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case RESET_PASSWORD_UPDATE:
            return { ...state, [RESET_PASSWORD_KEY]: action.payload }
        case RESET_PASSWORD_RESET:
        case LOG_OUT:
            return {
                ...state,
                [RESET_PASSWORD_KEY]: {
                    [RESET_PASSWORD_FORM]: {
                        [RESET_PASSWORD_FORM_PASSWORD]: "",
                        [RESET_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
                    },
                    [RESET_PASSWORD_REQEUST_LOADING]: false,
                    [RESET_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [RESET_PASSWORD_ERRORS]: []
                }
            }
        default:
            return state;
    }
}

export default Reducer;