import { DISCOUNT_KEY, DISCOUNT_FORM, DISCOUNT_FORM_ERROR, DISCOUNT_RESET, DISCOUNT_UPDATE, DISCOUNT_DISCRIPTION, DISCOUNT_PERCENTAGE, DISCOUNT_START_DATE, DISCOUNT_END_DATE, DISCOUNT_TYPE, DISCOUNT_CATEGORY, DISCOUNT_SUBCATEGORY, DISCOUNT_PRODUCT_NAME, DISCOUNT_FORM_LOADING, LOG_OUT, DISCOUNT_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, DISCOUNT_PRODUCT_ID } from "../Types"

const INITIAL_STATE={
    [DISCOUNT_KEY]:{
        [DISCOUNT_FORM]:{
            [DISCOUNT_DISCRIPTION] : "",
            [DISCOUNT_PERCENTAGE] : "",
            [DISCOUNT_START_DATE] : "",
            [DISCOUNT_END_DATE] : "",
            [DISCOUNT_TYPE] : "",
            [DISCOUNT_CATEGORY] : "",
            [DISCOUNT_SUBCATEGORY] : "",
            [DISCOUNT_PRODUCT_NAME] : "",
            [DISCOUNT_PRODUCT_ID] : [],
        },
        [DISCOUNT_REQUEST_STATUS]:{
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DISCOUNT_FORM_ERROR]:[],
        [DISCOUNT_FORM_LOADING]:false
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DISCOUNT_UPDATE:
            return { ...state, [DISCOUNT_KEY]: action.payload }
        case DISCOUNT_RESET:
        case LOG_OUT:
            return {
                ...state,
                [DISCOUNT_KEY]:{
                    [DISCOUNT_FORM]:{
                        [DISCOUNT_DISCRIPTION] : "",
                        [DISCOUNT_PERCENTAGE] : "",
                        [DISCOUNT_START_DATE] : "",
                        [DISCOUNT_END_DATE] : "",
                        [DISCOUNT_TYPE] : "",
                        [DISCOUNT_CATEGORY] : "",
                        [DISCOUNT_SUBCATEGORY] : "",
                        [DISCOUNT_PRODUCT_NAME] : "",
                        [DISCOUNT_PRODUCT_ID] : [],
                    },
                    [DISCOUNT_REQUEST_STATUS]:{
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [DISCOUNT_FORM_ERROR]:[],
                    [DISCOUNT_FORM_LOADING]:false
                }
            }
        default:
            return state;
    }
}

export default Reducer;