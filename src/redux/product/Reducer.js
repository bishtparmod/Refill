import { PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, ADD_PRODUCT_ERRORS, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_ERRORS, PRODUCT_UPDATE, PRODUCT_RESET, LOG_OUT, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_FORM_IS_UPLOADING_IMAGES, ADD_PRODUCT_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_FORM, DELETE_PRODUCT_FORM_PRODUCT_ID, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_REQUEST_STATUS, DELETE_PRODUCT_ERRORS, EXPORT_PRODUCT_REQEUST_LOADING, EXPORT_PRODUCT_REQUEST_STATUS, EXPORT_PRODUCT_ERRORS, EDIT_PRODUCT_LOADING } from "../Types";

const INITIAL_STATE = {
    [PRODUCT_KEY]: {
        [ADD_PRODUCT_FORM]: {
            [ADD_PRODUCT_FORM_NAME]: "",
            [ADD_PRODUCT_FORM_SHORT_DESCRIPTION]: "",
            [ADD_PRODUCT_FORM_LONG_DESCRIPTION]: "",
            [ADD_PRODUCT_FORM_BRAND]: "",
            [ADD_PRODUCT_FORM_DISTRIBUTOR]: "",
            [ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]: "",
            [ADD_PRODUCT_FORM_RETAIL_PRICE]: "",
            [ADD_PRODUCT_FORM_REFILL_PRICE]: "",
            [ADD_PRODUCT_FORM_DISCOUNT]: "",
            [ADD_PRODUCT_FORM_NOTES]: "",
            [ADD_PRODUCT_FORM_ALERT]: "",
            [ADD_PRODUCT_FORM_QUANTITY]: "",
            [ADD_PRODUCT_FORM_SIZE]: "",
            [ADD_PRODUCT_FORM_WEIGHT]: "",
            [ADD_PRODUCT_FORM_UNITS]: "",
            [ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]: "",
            [ADD_PRODUCT_FORM_MFG_DATE]: "",
            [ADD_PRODUCT_FORM_EXPIRY_DATE]: "",
            [ADD_PRODUCT_FORM_CODE]: "",
            [ADD_PRODUCT_FORM_PUP_GTIN_CODE]: "",
            [ADD_PRODUCT_FORM_CATEGORY_ID]: "",
            [ADD_PRODUCT_FORM_SUB_CATEGORY_ID]: "",
            [ADD_PRODUCT_FORM_UPLOADED_IMAGES]: []
        },
        [ADD_PRODUCT_REQEUST_LOADING]: false,
        [ADD_PRODUCT_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [ADD_PRODUCT_ERRORS]: [],

        [ADD_PRODUCT_IMAGES]: [],
        [ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
        [ADD_PRODUCT_IS_UPLOADING_IMAGES]: false,


        [EDIT_PRODUCT_FORM]: {
            [EDIT_PRODUCT_FORM_NAME]: "",
            [EDIT_PRODUCT_FORM_SHORT_DESCRIPTION]: "",
            [EDIT_PRODUCT_FORM_LONG_DESCRIPTION]: "",
            [EDIT_PRODUCT_FORM_BRAND]: "",
            [EDIT_PRODUCT_FORM_DISTRIBUTOR]: "",
            [EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]: "",
            [EDIT_PRODUCT_FORM_RETAIL_PRICE]: "",
            [EDIT_PRODUCT_FORM_REFILL_PRICE]: "",
            [EDIT_PRODUCT_FORM_DISCOUNT]: {},
            [EDIT_PRODUCT_FORM_NOTES]: "",
            [EDIT_PRODUCT_FORM_ALERT]: "",
            [EDIT_PRODUCT_FORM_QUANTITY]: "",
            [EDIT_PRODUCT_FORM_SIZE]: "",
            [EDIT_PRODUCT_FORM_WEIGHT]: "",
            [EDIT_PRODUCT_FORM_UNITS]: "",
            [EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]: "",
            [EDIT_PRODUCT_FORM_MFG_DATE]: "",
            [EDIT_PRODUCT_FORM_EXPIRY_DATE]: "",
            [EDIT_PRODUCT_FORM_CODE]: "",
            [EDIT_PRODUCT_FORM_PUP_GTIN_CODE]: "",
            [EDIT_PRODUCT_FORM_CATEGORY_ID]: "",
            [EDIT_PRODUCT_FORM_SUB_CATEGORY_ID]: "",
            [EDIT_PRODUCT_FORM_UPLOADED_IMAGES]: []
        },
        [EDIT_PRODUCT_REQEUST_LOADING]: false,
        [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false,
        [EDIT_PRODUCT_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [EDIT_PRODUCT_ERRORS]: [],
        [EDIT_PRODUCT_LOADING]:false,

        [EDIT_PRODUCT_IMAGES]: [],
        [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
        [EDIT_PRODUCT_IS_UPLOADING_IMAGES]: false,

        [DELETE_PRODUCT_FORM]: {
            [DELETE_PRODUCT_FORM_PRODUCT_ID]: ""
        },
        [DELETE_PRODUCT_REQEUST_LOADING]: false,
        [DELETE_PRODUCT_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DELETE_PRODUCT_ERRORS]: [],
        [EXPORT_PRODUCT_REQEUST_LOADING]: false,
        [EXPORT_PRODUCT_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [EXPORT_PRODUCT_ERRORS]: []
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PRODUCT_UPDATE:
            return { ...state, [PRODUCT_KEY]: action.payload }
        case PRODUCT_RESET:
        case LOG_OUT:
            return {
                ...state,
                [PRODUCT_KEY]: {
                    [ADD_PRODUCT_FORM]: {
                        [ADD_PRODUCT_FORM_NAME]: "",
                        [ADD_PRODUCT_FORM_SHORT_DESCRIPTION]: "",
                        [ADD_PRODUCT_FORM_LONG_DESCRIPTION]: "",
                        [ADD_PRODUCT_FORM_BRAND]: "",
                        [ADD_PRODUCT_FORM_DISTRIBUTOR]: "",
                        [ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]: "",
                        [ADD_PRODUCT_FORM_RETAIL_PRICE]: "",
                        [ADD_PRODUCT_FORM_REFILL_PRICE]: "",
                        [ADD_PRODUCT_FORM_DISCOUNT]: "",
                        [ADD_PRODUCT_FORM_NOTES]: "",
                        [ADD_PRODUCT_FORM_ALERT]: "",
                        [ADD_PRODUCT_FORM_QUANTITY]: "",
                        [ADD_PRODUCT_FORM_SIZE]: "",
                        [ADD_PRODUCT_FORM_WEIGHT]: "",
                        [ADD_PRODUCT_FORM_UNITS]: "",
                        [ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]: "",
                        [ADD_PRODUCT_FORM_MFG_DATE]: "",
                        [ADD_PRODUCT_FORM_EXPIRY_DATE]: "",
                        [ADD_PRODUCT_FORM_CODE]: "",
                        [ADD_PRODUCT_FORM_PUP_GTIN_CODE]: "",
                        [ADD_PRODUCT_FORM_CATEGORY_ID]: "",
                        [ADD_PRODUCT_FORM_SUB_CATEGORY_ID]: "",
                        [ADD_PRODUCT_FORM_UPLOADED_IMAGES]: []
                    },
                    [ADD_PRODUCT_REQEUST_LOADING]: false,
                    [ADD_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [ADD_PRODUCT_ERRORS]: [],
            
                    [ADD_PRODUCT_IMAGES]: [],
                    [ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
                    [ADD_PRODUCT_IS_UPLOADING_IMAGES]: false,
            
            
                    [EDIT_PRODUCT_FORM]: {
                        [EDIT_PRODUCT_FORM_NAME]: "",
                        [EDIT_PRODUCT_FORM_SHORT_DESCRIPTION]: "",
                        [EDIT_PRODUCT_FORM_LONG_DESCRIPTION]: "",
                        [EDIT_PRODUCT_FORM_BRAND]: "",
                        [EDIT_PRODUCT_FORM_DISTRIBUTOR]: "",
                        [EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]: "",
                        [EDIT_PRODUCT_FORM_RETAIL_PRICE]: "",
                        [EDIT_PRODUCT_FORM_REFILL_PRICE]: "",
                        [EDIT_PRODUCT_FORM_DISCOUNT]: "",
                        [EDIT_PRODUCT_FORM_NOTES]: "",
                        [EDIT_PRODUCT_FORM_ALERT]: "",
                        [EDIT_PRODUCT_FORM_QUANTITY]: "",
                        [EDIT_PRODUCT_FORM_SIZE]: "",
                        [EDIT_PRODUCT_FORM_WEIGHT]: "",
                        [EDIT_PRODUCT_FORM_UNITS]: "",
                        [EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]: "",
                        [EDIT_PRODUCT_FORM_MFG_DATE]: "",
                        [EDIT_PRODUCT_FORM_EXPIRY_DATE]: "",
                        [EDIT_PRODUCT_FORM_CODE]: "",
                        [EDIT_PRODUCT_FORM_PUP_GTIN_CODE]: "",
                        [EDIT_PRODUCT_FORM_CATEGORY_ID]: "",
                        [EDIT_PRODUCT_FORM_SUB_CATEGORY_ID]: "",
                        [EDIT_PRODUCT_FORM_UPLOADED_IMAGES]: []
                    },
                    [EDIT_PRODUCT_REQEUST_LOADING]: false,
                    [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false,
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [EDIT_PRODUCT_ERRORS]: [],
                    [EDIT_PRODUCT_LOADING]:false,
            
                    [EDIT_PRODUCT_IMAGES]: [],
                    [EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
                    [EDIT_PRODUCT_IS_UPLOADING_IMAGES]: false,
            
                    [DELETE_PRODUCT_FORM]: {
                        [DELETE_PRODUCT_FORM_PRODUCT_ID]: ""
                    },
                    [DELETE_PRODUCT_REQEUST_LOADING]: false,
                    [DELETE_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [DELETE_PRODUCT_ERRORS]: []
                }
            }
        default:
            return state;
    }
}

export default Reducer;