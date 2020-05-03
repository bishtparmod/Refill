import { LOG_OUT, ORDER_KEY, ORDER_UPDATE, ORDER_RESET, EDIT_ORDER_FORM, EDIT_ORDER_FORM_LOADING, DELETE_ORDER_LOADING, EDIT_ORDER_ID, EDIT_ORDER_QUANTITY, EDIT_ORDER_ERROR, TABLE_DATA, TABLE_ID, TABLE_NAME, TABLE_TYPE, EDIT_ORDER_NAME, EDIT_ORDER_DRIVER, EDIT_ORDER_DESCRIPTION, EDIT_ORDER_PRICE, EDIT_ORDER_DISCOUNT, EDIT_ORDER_BILLING_ADDRESS, EDIT_ORDER_SHIPPING_ADDRESS, EDIT_ORDER_STATUS, EDIT_ORDER_PLACED_DATE, EDIT_ORDER_PRODUCT_CATEGORY, EDIT_ORDER_PRODUCT_SUBCATEGORY, EMPTY, ORDER_REQUEST_STATUS, ORDER_REQUEST_LOADING, STATUS, MESSAGE, PENDING_ORDER_APPROVE_LOADING, PENDING_ORDER_CANCEL_LOADING, REFILL_ORDER_CANCEL_LOADING, REFILL_ORDER_SKIP_LOADING, REFILL_ORDER_SHIP_LOADING, ORDER_DETAIL, ORDER_DETAIL_LOADING, PENDING_ORDER_APPROVE_REQUEST, PENDING_ORDER_CANCEL_REQUEST, REFILL_ORDER_CANCEL_REQUEST, REFILL_ORDER_SKIP_REQUEST, REFILL_ORDER_SHIP_REQUEST, ORDER_NOTES, ORDER_NOTES_TEXT, ORDER_NOTES_LOADING } from "../Types"

const INITIAL_STATE={
    [ORDER_KEY]:{
        [EDIT_ORDER_FORM]:{
            [EDIT_ORDER_ID]:"",
            [EDIT_ORDER_QUANTITY]:"",
            [EDIT_ORDER_NAME]:"",
            [EDIT_ORDER_DRIVER]:"",
            [EDIT_ORDER_DESCRIPTION]:"",
            [EDIT_ORDER_PRICE]:"",
            [EDIT_ORDER_DISCOUNT]:"",
            [EDIT_ORDER_BILLING_ADDRESS]:"",
            [EDIT_ORDER_SHIPPING_ADDRESS]:"",
            [EDIT_ORDER_STATUS]:"",
            [EDIT_ORDER_PLACED_DATE]:"",
            [EDIT_ORDER_PRODUCT_CATEGORY]:"",
            [EDIT_ORDER_PRODUCT_SUBCATEGORY]:"",
            [EDIT_ORDER_FORM_LOADING]:false,

            [ORDER_NOTES_TEXT]:"",
            [ORDER_NOTES_LOADING]:false
        },

        [ORDER_NOTES]:{
            [ORDER_NOTES_TEXT]:"",
            [ORDER_NOTES_LOADING]:false
        },

        [ORDER_DETAIL] : {},
        [ORDER_DETAIL_LOADING]:false,

        [ORDER_REQUEST_LOADING]: false,
            [ORDER_REQUEST_STATUS]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            
        [PENDING_ORDER_APPROVE_REQUEST]:{
                [STATUS]: EMPTY,
                [MESSAGE]: ""
        },

        [PENDING_ORDER_CANCEL_REQUEST] : { 
                [STATUS]: EMPTY,
                [MESSAGE]: ""
        },

        [REFILL_ORDER_CANCEL_REQUEST]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
        },

        [REFILL_ORDER_SKIP_REQUEST] : {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },

        [REFILL_ORDER_SHIP_REQUEST] : {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },

        [EDIT_ORDER_ERROR]:[],
        [TABLE_NAME]:"",
        [TABLE_ID]:"",
        [TABLE_TYPE]:"",
        [DELETE_ORDER_LOADING]:false,
        [PENDING_ORDER_APPROVE_LOADING]:false,
        [PENDING_ORDER_CANCEL_LOADING] : false,
        [REFILL_ORDER_CANCEL_LOADING]: false,
        [REFILL_ORDER_SKIP_LOADING] : false,
        [REFILL_ORDER_SHIP_LOADING] : false,


      
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ORDER_UPDATE:
            return { ...state, [ORDER_KEY]: action.payload }
        case ORDER_RESET:
        case LOG_OUT:
            return {
                ...state,
                [ORDER_KEY]: {
                    [EDIT_ORDER_FORM] :{
                        [EDIT_ORDER_ID]:"",
                        [EDIT_ORDER_QUANTITY]:"",
                        [EDIT_ORDER_NAME]:"",
                        [EDIT_ORDER_DRIVER]:"",
                        [EDIT_ORDER_DESCRIPTION]:"",
                        [EDIT_ORDER_PRICE]:"",
                        [EDIT_ORDER_DISCOUNT]:"",
                        [EDIT_ORDER_BILLING_ADDRESS]:"",
                        [EDIT_ORDER_SHIPPING_ADDRESS]:"",
                        [EDIT_ORDER_STATUS]:"",
                        [EDIT_ORDER_PLACED_DATE]:"",
                        [EDIT_ORDER_PRODUCT_CATEGORY]:"",
                        [EDIT_ORDER_PRODUCT_SUBCATEGORY]:"",
                        [EDIT_ORDER_FORM_LOADING]:false,

                        [ORDER_NOTES_TEXT]:"",
                        [ORDER_NOTES_LOADING]:false
                    },

                          

                    [ORDER_DETAIL] : {},
                    [ORDER_DETAIL_LOADING]:false,

                    [ORDER_REQUEST_LOADING]: false,
                    [ORDER_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    [PENDING_ORDER_APPROVE_REQUEST]:{
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                },
        
                [PENDING_ORDER_CANCEL_REQUEST] : { 
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                },
        
                [REFILL_ORDER_CANCEL_REQUEST]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                },
        
                [REFILL_ORDER_SKIP_REQUEST] : {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
        
                [REFILL_ORDER_SHIP_REQUEST] : {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                            }
            }
        default:
            return state;
    }
}

export default Reducer;