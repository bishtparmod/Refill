import { CATEGORY_KEY, CATEGORY_FORM, CATEGORY_FORM_NAME, CATEGORY_REQEUST_LOADING, CATEGORY_REQUEST_STATUS, CATEGORY_ERRORS, SUB_CATEGORY_FORM, SUB_CATEGORY_FORM_NAME, SUB_CATEGORY_FORM_CATEGORY_ID, SUB_CATEGORY_REQEUST_LOADING, SUB_CATEGORY_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, CATEGORY_UPDATE, LOG_OUT, CATEGORY_RESET, ENABLE_SUB_CATEGORY_REQUEST_STATUS, ENABLE_SUB_CATEGORY_REQEUST_LOADING, DISABLE_SUB_CATEGORY_REQUEST_STATUS, DISABLE_SUB_CATEGORY_REQEUST_LOADING, ENABLE_CATEGORY_REQUEST_STATUS, ENABLE_CATEGORY_REQEUST_LOADING, DISABLE_CATEGORY_REQUEST_STATUS, DISABLE_CATEGORY_REQEUST_LOADING, CATEGORY_FORM_ICON_FILE, CATEGORY_FORM_ICON, CATEGORY_FORM_ICON_LOADING } from "../Types";

const INITIAL_STATE = {
    [CATEGORY_KEY]: {
        [CATEGORY_FORM]: {
            [CATEGORY_FORM_NAME]: "",
            [CATEGORY_FORM_ICON]:"",
            [CATEGORY_FORM_ICON_FILE]:"",
            [CATEGORY_FORM_ICON_LOADING]:""
        },
        [CATEGORY_REQEUST_LOADING]: false,
        [CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [CATEGORY_ERRORS]: [],
        [SUB_CATEGORY_FORM]: {
            [SUB_CATEGORY_FORM_NAME]: "",
            [SUB_CATEGORY_FORM_CATEGORY_ID]: ""
        },
        [SUB_CATEGORY_REQEUST_LOADING]: false,
        [SUB_CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [SUB_CATEGORY_REQEUST_LOADING]: false,

        [ENABLE_CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [ENABLE_CATEGORY_REQEUST_LOADING]: false,
        [DISABLE_CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DISABLE_CATEGORY_REQEUST_LOADING]: false,

        [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false,
        [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false,
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CATEGORY_UPDATE:
            return { ...state, [CATEGORY_KEY]: action.payload }
        case CATEGORY_RESET:
        case LOG_OUT:
            return {
                ...state,
                [CATEGORY_KEY]: {
                    [CATEGORY_FORM]: {
                        [CATEGORY_FORM_NAME]: ""
                    },
                    [CATEGORY_REQEUST_LOADING]: false,
                    [CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [CATEGORY_ERRORS]: [],
                    [SUB_CATEGORY_FORM]: {
                        [SUB_CATEGORY_FORM_NAME]: "",
                        [SUB_CATEGORY_FORM_CATEGORY_ID]: ""
                    },
                    [SUB_CATEGORY_REQEUST_LOADING]: false,
                    [SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [SUB_CATEGORY_REQEUST_LOADING]: false
                }
            }
        default:
            return state;
    }
}

export default Reducer;