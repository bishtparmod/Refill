import { USERS_KEY,USER_CUSTOMER_ERROR,USER_EDIT_FORM,USER_CUSTOMER_PHONENO,USER_CUSTOMER_LOADING,USER_CUSTOMER_ZIPCODE,USER_CUSTOMER_STATE,USER_CUSTOMER_COUNTRY,USER_CUSTOMER_CITY,USER_CUSTOMER_ADDRESS,USER_CUSTOMER_NAME,USER_CUSTOMER_EMAIL,USER_CUSTOMER_NOTES, DELETE_USERS_FORM, DELETE_USERS_FORM_USER_ID, DELETE_USERS_REQEUST_LOADING, DELETE_USERS_REQUEST_STATUS, EMPTY, STATUS, MESSAGE, DELETE_USERS_ERRORS, EXPORT_USERS_REQEUST_LOADING, EXPORT_USERS_REQUEST_STATUS, EXPORT_USERS_ERRORS, USERS_UPDATE, USERS_RESET, LOG_OUT, ENABLE_USERS_REQUEST_STATUS, ENABLE_USERS_REQUEST_LOADING, DISABLE_USERS_REQUEST_STATUS, DISABLE_USERS_REQUEST_LOADING, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_STREET, USER_CUSTOMER_BILLING_CITY, USER_CUSTOMER_BILLING_STREET, USER_CUSTOMER_BILLING_COUNTRY, USER_CUSTOMER_BILLING_STATE, USER_CUSTOMER_BILLING_ZIPCODE, USER_CUSTOMER_COMPANY_ADDRESS, USER_CUSTOMER_BILLING_LATITUDE, USER_CUSTOMER_BILLING_LONGITUDE, USER_CUSTOMER_LATITUDE, USER_CUSTOMER_LONGITUDE, USER_CUSTOMER_SHIPPING_CITY, USER_CUSTOMER_SHIPPING_STREET, USER_CUSTOMER_SHIPPING_COUNTRY, USER_CUSTOMER_SHIPPING_STATE, USER_CUSTOMER_SHIPPING_ZIPCODE, USER_CUSTOMER_SHIPPING_LATITUDE, USER_CUSTOMER_SHIPPING_LONGITUDE, USER_CUSTOMER_SHIPPING_NAME, USER_CUSTOMER_SHIPPING_PHONE, USER_CUSTOMER_BILLING_NAME, USER_CUSTOMER_BILLING_PHONE } from "../Types";

const INITIAL_STATE = {
    [USERS_KEY]: {
        [DELETE_USERS_FORM]: {
            [DELETE_USERS_FORM_USER_ID]: ""
        },
        [DELETE_USERS_REQEUST_LOADING]: false,
        [DELETE_USERS_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DELETE_USERS_ERRORS]: [],
        [EXPORT_USERS_REQEUST_LOADING]: false,
        [EXPORT_USERS_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [EXPORT_USERS_ERRORS]: [],


        [ENABLE_USERS_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [ENABLE_USERS_REQUEST_LOADING]: false,
        [DISABLE_USERS_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        [DISABLE_USERS_REQUEST_LOADING]: false,

        [USER_CUSTOMER_ERROR]:[], 

        [USER_EDIT_REQUEST_STATUS]:{
            [STATUS]:"",
            [MESSAGE]:""
        },

        [USER_EDIT_FORM]:{
            [USER_CUSTOMER_ID]:"",
            [USER_CUSTOMER_NAME]:"",
            [USER_CUSTOMER_EMAIL]:"",
            [USER_CUSTOMER_NOTES]:"",
            [USER_CUSTOMER_PHONENO]:"",
            
            [USER_CUSTOMER_ADDRESS]:"",
            [USER_CUSTOMER_SHIPPING_NAME]:"",
            [USER_CUSTOMER_SHIPPING_PHONE]:"",
            [USER_CUSTOMER_SHIPPING_CITY]:"",
            [USER_CUSTOMER_SHIPPING_STREET]:"",
            [USER_CUSTOMER_SHIPPING_COUNTRY]:"",
            [USER_CUSTOMER_SHIPPING_STATE]:"",
            [USER_CUSTOMER_SHIPPING_ZIPCODE]:"",
            [USER_CUSTOMER_LOADING]:false,
            [USER_CUSTOMER_SHIPPING_LATITUDE]:"",
            [USER_CUSTOMER_SHIPPING_LONGITUDE]:"",

            [USER_CUSTOMER_COMPANY_ADDRESS]:"",
            [USER_CUSTOMER_BILLING_NAME]:"",
            [USER_CUSTOMER_BILLING_PHONE]:"",
            [USER_CUSTOMER_BILLING_CITY]:"",
            [USER_CUSTOMER_BILLING_STREET]:"",
            [USER_CUSTOMER_BILLING_COUNTRY]:"",
            [USER_CUSTOMER_BILLING_STATE]:"",
            [USER_CUSTOMER_BILLING_ZIPCODE]:"",
            [USER_CUSTOMER_BILLING_LATITUDE]:"",
            [USER_CUSTOMER_BILLING_LONGITUDE]:"",
        }
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USERS_UPDATE:
            return { ...state, [USERS_KEY]: action.payload }
        case USERS_RESET:
        case LOG_OUT:
            return {
                ...state,
                [USERS_KEY]: {
                    [DELETE_USERS_FORM]: {
                        [DELETE_USERS_FORM_USER_ID]: ""
                    },
                    [DELETE_USERS_REQEUST_LOADING]: false,
                    [DELETE_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [DELETE_USERS_ERRORS]: [],
                    [EXPORT_USERS_REQEUST_LOADING]: false,
                    [EXPORT_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [EXPORT_USERS_ERRORS]: [],
            
            
                    [ENABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [ENABLE_USERS_REQUEST_LOADING]: false,
                    [DISABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [DISABLE_USERS_REQUEST_LOADING]: false,
            
                    [USER_CUSTOMER_ERROR]:[], 
            
                    [USER_EDIT_REQUEST_STATUS]:{
                        [STATUS]:"",
                        [MESSAGE]:""
                    },
            
                    [USER_EDIT_FORM]:{
                        [USER_CUSTOMER_ID]:"",
                        [USER_CUSTOMER_NAME]:"",
                        [USER_CUSTOMER_EMAIL]:"",
                        [USER_CUSTOMER_NOTES]:"",
                        [USER_CUSTOMER_PHONENO]:"",
                        
                        [USER_CUSTOMER_ADDRESS]:"",
                        [USER_CUSTOMER_SHIPPING_NAME]:"",
                        [USER_CUSTOMER_SHIPPING_PHONE]:"",
                        [USER_CUSTOMER_SHIPPING_CITY]:"",
                        [USER_CUSTOMER_SHIPPING_STREET]:"",
                        [USER_CUSTOMER_SHIPPING_COUNTRY]:"",
                        [USER_CUSTOMER_SHIPPING_STATE]:"",
                        [USER_CUSTOMER_SHIPPING_ZIPCODE]:"",
                        [USER_CUSTOMER_LOADING]:false,
                        [USER_CUSTOMER_SHIPPING_LATITUDE]:"",
                        [USER_CUSTOMER_SHIPPING_LONGITUDE]:"",
            
                        [USER_CUSTOMER_COMPANY_ADDRESS]:"",
                        [USER_CUSTOMER_BILLING_NAME]:"",
                        [USER_CUSTOMER_BILLING_PHONE]:"",
                        [USER_CUSTOMER_BILLING_CITY]:"",
                        [USER_CUSTOMER_BILLING_STREET]:"",
                        [USER_CUSTOMER_BILLING_COUNTRY]:"",
                        [USER_CUSTOMER_BILLING_STATE]:"",
                        [USER_CUSTOMER_BILLING_ZIPCODE]:"",
                        [USER_CUSTOMER_BILLING_LATITUDE]:"",
                        [USER_CUSTOMER_BILLING_LONGITUDE]:"",
                    }
                }
            }
        default:
            return state;
    }
}

export default Reducer;