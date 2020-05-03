import { SALES_DELIVERYCHARGES_ROOT,SALES_DELIVERYCHARGES_RESET, SALES_DELIVERYCHARGES_KEY, SALES_DELIVERYCHARGES_UPDATE, Salestax_RESET, SALESTAX_FORM, DELIVERYCHARGES_FORM, USER_ROOT, USER_KEY, USER_DATA, SALES_DELIVERYCHARGES_REQUEST_STATUS, ERROR, STATUS, MESSAGE, TOKEN_NOT_FOUND, SALES_DELIVERYCHARGES_REQUEST_LOADING, SALESTAX_VALUE, DELIVERYCHARGES_VALUE, DELIVERYCHARGES_AMOUNT, SALESTAX_ID, DELIVERYCHARGES_ID, SALESTAX_FORM_LOADING, DELIVERYCHARGES_FORM_LOADING, SUCCESS } from "../Types";
import Utils from "../../components/util/Utils";
import { refillDeliveryChargeList,  refillSalesTax, refillDeliveryCharge } from "../../apis/APIs";
import { ToastsStore } from 'react-toasts'

/** Update Salestax data state */
export const updateSalestaxState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];

            dispatch({
                type: SALES_DELIVERYCHARGES_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetSalestaxState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: SALES_DELIVERYCHARGES_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}

/** Manage Edit Salestax screen 1 Form Data */
export const updateEditSalestaxFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
            const data = Object.assign(formData[SALESTAX_FORM], obj);

            dispatch(updateSalestaxState(Object.assign(formData, {
                [SALESTAX_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}


/** Manage Edit DeliveryCharge screen 1 Form Data */
export const updateEditDeliveryChargeFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
            const data = Object.assign(formData[DELIVERYCHARGES_FORM], obj);

            dispatch(updateSalestaxState(Object.assign(formData, {
                [DELIVERYCHARGES_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}



/** Manage Salestax UI Constraints */
export const updateSalestaxUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateSalestaxState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

// get Salestax Data
export const getSalestaxviaId = () =>{
    return(dispatch,getState) => {
        try{
         //User data
           const data = getState()[USER_ROOT][USER_KEY];
           const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
          
           const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
           const saleData = formData[DELIVERYCHARGES_FORM]
           if (!user_token) {
               dispatch(updateSalestaxUIConstraints({
                   [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                       [STATUS]: ERROR,
                       [MESSAGE]: {
                           message: TOKEN_NOT_FOUND,
                           status:421
                       }
                   },
                   [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
               }));
               return;
           }  

           refillDeliveryChargeList({user_token:user_token}).then((res)=>{
                if(res && res.status === 200){
                    const data = res.data[0]
                    dispatch(updateEditSalestaxFormData({
                        [SALESTAX_VALUE]:data.salesTax,
                        [SALESTAX_ID]: data._id
                    }))

                    dispatch(updateEditDeliveryChargeFormData({
                        [DELIVERYCHARGES_ID]:data._id,
                        [DELIVERYCHARGES_VALUE]:data.deliveryCharges,
                        [DELIVERYCHARGES_AMOUNT]:data.deliveryChargesValidLimit
                    }))
                }
           }).catch((error)=>{
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
               console.log(error)
            })
            
        }catch(error){
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}


// get Salestax Data
export const editSalesTax = (id) =>{
    return(dispatch,getState) => {
        try{
         //User data
           const data = getState()[USER_ROOT][USER_KEY];
           const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
          
           const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
           const saleData = formData[SALESTAX_FORM]
           if (!user_token) {
               dispatch(updateSalestaxUIConstraints({
                   [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                       [STATUS]: ERROR,
                       [MESSAGE]: {
                           message: TOKEN_NOT_FOUND,
                           status:421
                       }
                   },
                   [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
               }));
               return;
           }  

           const body ={
                user_token: user_token,
                sales_tax:parseInt(saleData.salestax_value) ,
                item_id: saleData.salestax_id
           }
           refillSalesTax(body).then((res)=>{
                if(res && res.status === 200){
                    dispatch(updateSalestaxUIConstraints({
                        [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
                    }));
                    dispatch(updateEditSalestaxFormData({
                        [SALESTAX_FORM_LOADING]:false
                    }))
                   
                }else{
                    dispatch(updateSalestaxUIConstraints({
                        [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
                    }));
                }
           }).catch((error)=>{
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
               console.log(error)
            })
            
        }catch(error){
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}


// get Salestax Data
export const editDeliveryCharge = () =>{
    return(dispatch,getState) => {
        try{
         //User data
           const data = getState()[USER_ROOT][USER_KEY];
           const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
          
           const formData = getState()[SALES_DELIVERYCHARGES_ROOT][SALES_DELIVERYCHARGES_KEY];
           const deliveryChargeData = formData[DELIVERYCHARGES_FORM]
           if (!user_token) {
               dispatch(updateSalestaxUIConstraints({
                   [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                       [STATUS]: ERROR,
                       [MESSAGE]: {
                           message: TOKEN_NOT_FOUND,
                           status:421
                       }
                   },
                   [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
               }));
               return;
           }  

           const body ={
            user_token: user_token,
            delivery_charges_valid_limit:parseInt(deliveryChargeData.deliverycharges_amount) ,
            delivery_charges:parseInt(deliveryChargeData.deliverycharges_value) ,
            item_id: deliveryChargeData.deliverycharges_id
           }
           refillDeliveryCharge(body).then((res)=>{
                if(res && res.status === 200){
                    dispatch(updateSalestaxUIConstraints({
                        [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
                    }));
                    dispatch(updateEditDeliveryChargeFormData({
                        [DELIVERYCHARGES_FORM_LOADING]:false
                    }))
                    ToastsStore.success("DeliveryCharges successfully Updated", 3000);
                }
           }).catch((error)=>{
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
               console.log(error)
            })
            
        }catch(error){
            dispatch(updateSalestaxUIConstraints({
                [SALES_DELIVERYCHARGES_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SALES_DELIVERYCHARGES_REQUEST_LOADING]: false
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}