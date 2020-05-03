import { SALES_DELIVERYCHARGES_KEY, STATUS, MESSAGE, EMPTY, LOG_OUT, DELIVERYCHARGES_FORM_ERROR, DELIVERYCHARGES_FORM, SALESTAX_FORM, SALESTAX_VALUE, SALESTAX_FORM_LOADING, DELIVERYCHARGES_VALUE, DELIVERYCHARGES_AMOUNT, SALESTAX_FORM_ERROR, DELIVERYCHARGES_FORM_LOADING, SALES_DELIVERYCHARGES_UPDATE, SALES_DELIVERYCHARGES_RESET, SALES_DELIVERYCHARGES_REQUEST_STATUS } from "../Types"

const INITIAL_STATE={
    [SALES_DELIVERYCHARGES_KEY]:{
        [SALESTAX_FORM]:{
           [SALESTAX_VALUE]:"",
           [SALESTAX_FORM_LOADING]:false
        },
        [SALES_DELIVERYCHARGES_REQUEST_STATUS]:{
            [STATUS]: EMPTY,
            [MESSAGE]: "" 
        },

        [SALESTAX_FORM_ERROR]:[],
        
        [DELIVERYCHARGES_FORM]:{
           [DELIVERYCHARGES_FORM_LOADING]:false,
           [DELIVERYCHARGES_VALUE]:"",
           [DELIVERYCHARGES_AMOUNT]:""
        },
        
        [DELIVERYCHARGES_FORM_ERROR]:[],
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SALES_DELIVERYCHARGES_UPDATE:
            return { ...state, [SALES_DELIVERYCHARGES_KEY]: action.payload }
        case SALES_DELIVERYCHARGES_RESET:
        case LOG_OUT:
            return {
                ...state,
                [SALES_DELIVERYCHARGES_KEY]: {
                    [SALESTAX_FORM]:{
                        [SALESTAX_VALUE]:"",
                        [SALESTAX_FORM_LOADING]:false
                     },
             
                     [SALESTAX_FORM_ERROR]:[],
                     
                     [DELIVERYCHARGES_FORM]:{
                        [DELIVERYCHARGES_FORM_LOADING]:false,
                        [DELIVERYCHARGES_VALUE]:"",
                        [DELIVERYCHARGES_AMOUNT]:""
                     },
                     
                     [DELIVERYCHARGES_FORM_ERROR]:[],
                }
            }
        default:
            return state;
    }
}

export default Reducer;