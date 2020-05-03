import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_FORM_OLD_PASSWORD, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, CHANGE_PASSWORD_UPDATE, LOG_OUT, CHANGE_PASSWORD_ERRORS } from "../Types";

const INITIAL_STATE = {
    [CHANGE_PASSWORD_KEY]: {
        [CHANGE_PASSWORD_FORM]: {
            [CHANGE_PASSWORD_FORM_OLD_PASSWORD]: "",
            [CHANGE_PASSWORD_FORM_PASSWORD]: "",
            [CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
        },
        [CHANGE_PASSWORD_REQEUST_LOADING]: false,
        [CHANGE_PASSWORD_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [CHANGE_PASSWORD_ERRORS]: []
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_PASSWORD_UPDATE:
            return { ...state, [CHANGE_PASSWORD_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [CHANGE_PASSWORD_KEY]: {
                    [CHANGE_PASSWORD_FORM]: {
                        [CHANGE_PASSWORD_FORM_OLD_PASSWORD]: "",
                        [CHANGE_PASSWORD_FORM_PASSWORD]: "",
                        [CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD]: ""
                    },
                    [CHANGE_PASSWORD_REQEUST_LOADING]: false,
                    [CHANGE_PASSWORD_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [CHANGE_PASSWORD_ERRORS]: []
                }
            }
        default:
            return state;
    }
}

export default Reducer;