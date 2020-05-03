import { ORDER_ROOT, ORDER_KEY,REFILL_ORDER_SHIP_LOADING , ORDER_UPDATE, ORDER_RESET, EDIT_ORDER_FORM, USER_ROOT, USER_KEY, USER_DATA, ERROR, STATUS, MESSAGE, ORDER_REQUEST_STATUS, ORDER_REQUEST_LOADING, TOKEN_NOT_FOUND, TABLE_TYPE, PENDING_ORDER_APPROVE_LOADING, SUCCESS, PENDING_ORDER_CANCEL_LOADING, REFILL_ORDER_SKIP_LOADING, REFILL_ORDER_CANCEL_LOADING, ORDER_DETAIL, ORDER_DETAIL_LOADING, PENDING_ORDER_CANCEL_REQUEST, REFILL_ORDER_CANCEL_REQUEST, REFILL_ORDER_SKIP_REQUEST, REFILL_ORDER_SHIP_REQUEST, PENDING_ORDER_APPROVE_REQUEST, EMPTY } from "../Types";
import Utils from "../../components/util/Utils";
import { refillOrderView, refillOrderCancel, refillOrderSkip, refillOrderShip, refillOrderApprove, refillOrderRefillCancel, refillExportAllUsers } from "../../apis/APIs";
import Download from '../../apis/Download'

/** Update order data state */
export const updateOrderState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_ROOT][ORDER_KEY];

            dispatch({
                type: ORDER_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetOrderState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: ORDER_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}


/** Manage Edit User Form Data */
export const updateEditOrderFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            const data = Object.assign(formData[EDIT_ORDER_FORM], obj);

            dispatch(updateOrderState(Object.assign(formData, {
                [EDIT_ORDER_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Order UI Constraints */
export const updateOrderUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateOrderState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}




// get cancel order
export const CancelOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("order data === >",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
             
             if(formData[PENDING_ORDER_CANCEL_LOADING]) return;
             
              //Intialize the request status and loading
              dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_CANCEL_LOADING]:true,
                
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
               
            }));

           

             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             var body ={
                user_token,
                order_id : id,
             }
           
             refillOrderCancel(body).then((res)=>{
                 if(res && res.status === 200){
                    dispatch(updateOrderUIConstraints({
                        [PENDING_ORDER_CANCEL_REQUEST]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [PENDING_ORDER_CANCEL_LOADING]:false
                    }));
                 }else{
                    dispatch(updateOrderUIConstraints({
                        [PENDING_ORDER_CANCEL_REQUEST]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [PENDING_ORDER_CANCEL_LOADING]:false
                    }));
                 }
                 
             }).catch((error)=>{
                dispatch(updateOrderUIConstraints({
                    [PENDING_ORDER_CANCEL_LOADING]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [PENDING_ORDER_CANCEL_LOADING]:false
                }));
                 console.log("error  ====   =>",error)
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_CANCEL_LOADING]:false
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}


// get refill cancel order
export const CancelRefillOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)

             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

             if(formData[REFILL_ORDER_CANCEL_LOADING]) return;

             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
               
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
               
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_LOADING]:true
            }));

             var body ={
                user_token,
                uuid : id,
             }
            
             refillOrderRefillCancel(body).then((res)=>{
                 if(res && res.status === 200){
                    dispatch(updateOrderUIConstraints({
                        [REFILL_ORDER_CANCEL_REQUEST]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [REFILL_ORDER_CANCEL_LOADING]:false
                    }));
                 }
                 
             }).catch((error)=>{
                dispatch(updateOrderUIConstraints({
                    [REFILL_ORDER_CANCEL_REQUEST]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [REFILL_ORDER_CANCEL_LOADING]:false
                }));
                 console.log("error  ====   =>",error)
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_LOADING]:false
            }));
            dispatch(updateOrderUIConstraints({
                
            }))
            Utils.log("errror  ===> ",error)
        }
    }
}

// get skip order
export const SkipOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
             
             if(formData[REFILL_ORDER_SKIP_LOADING]) return;

             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_SKIP_LOADING]:true
            }));
             
             var body ={
                user_token,
                order_id : id,
             }
           
             refillOrderSkip(body).then((res)=>{
                 if(res && res.status === 200){

                    dispatch(updateOrderUIConstraints({
                        [REFILL_ORDER_SKIP_REQUEST]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [REFILL_ORDER_SKIP_LOADING]:false
                    }));
                 }
             }).catch((error)=>{
                 console.log("error  ====   =>",error)
                 dispatch(updateOrderUIConstraints({
                    [REFILL_ORDER_SKIP_REQUEST]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [REFILL_ORDER_SKIP_LOADING]:false
                }));
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_SKIP_LOADING]:false
            }));
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_LOADING]:false
            }))
            Utils.log("errror  ===> ",error)
        }
    }
}

// get ship order
export const ShipOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
             
             if (formData[REFILL_ORDER_SHIP_LOADING]) return;

             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_SHIP_LOADING]:true
            }));
             
             var body ={
                user_token,
                order_id : id,
             }
            
             refillOrderShip(body).then((res)=>{
                 if(res && res.status === 200){

                    dispatch(updateOrderUIConstraints({
                        [REFILL_ORDER_SHIP_REQUEST]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [REFILL_ORDER_SHIP_LOADING]:false
                    }));
                    
                 }
             }).catch((error)=>{
                 console.log("error  ====   =>",error)
                 dispatch(updateOrderUIConstraints({
                    [REFILL_ORDER_SHIP_REQUEST]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [REFILL_ORDER_SHIP_LOADING]:false
                }));
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_SHIP_LOADING]:false
            }));
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SHIP_LOADING]:false
            }))
            Utils.log("errror  ===> ",error)
        }
    }
}

// get Process order
export const ApproveOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
             
             if(formData[PENDING_ORDER_APPROVE_LOADING]) return;
             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_APPROVE_LOADING]:true
            }));
             
             var body ={
                user_token,
                order_id : id,
             }
             
             refillOrderApprove(body).then((res)=>{
                 if(res && res.status === 200){

                    dispatch(updateOrderUIConstraints({
                        [PENDING_ORDER_APPROVE_REQUEST]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [PENDING_ORDER_APPROVE_LOADING]:false
                    }));
                 }
               
             }).catch((error)=>{
                 console.log("error  ====   =>",error)
                 dispatch(updateOrderUIConstraints({
                    [PENDING_ORDER_APPROVE_REQUEST]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [PENDING_ORDER_APPROVE_LOADING]:false
                }));
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_APPROVE_LOADING]:false
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}

export const clearStatus = () =>{
    return(dispatch,getState) =>{
        dispatch(updateOrderUIConstraints({
            [ORDER_REQUEST_STATUS]: {
                [STATUS]: EMPTY,
                [MESSAGE]: ""
            },
            [ORDER_REQUEST_LOADING]: false,
        }));
         
    }
}

// view order

export const ViewOrder = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
             
             if (!user_token) {
                 dispatch(updateOrderUIConstraints({
                     [ORDER_REQUEST_STATUS]: {
                         [STATUS]: ERROR,
                         [MESSAGE]: {
                             message: TOKEN_NOT_FOUND,
                             status:421
                         }
                     },
                     [ORDER_REQUEST_LOADING]: false
                 }));
                 return;
             }

             dispatch(updateOrderUIConstraints({
                [ORDER_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ORDER_REQUEST_LOADING]: false,
            }));
             
             var body ={
                user_token,
                order_id : id,
             }
             
             refillOrderView(body).then((res)=>{
                 if(res && res.status === 200){

                    dispatch(updateOrderUIConstraints({
                        [ORDER_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                        [ORDER_REQUEST_LOADING]: false,
                        [ORDER_DETAIL]: res.data,
                        [ORDER_DETAIL_LOADING]:false
                    }));
                   
                 }
               
             }).catch((error)=>{
                 console.log("error  ====   =>",error)
                 dispatch(updateOrderUIConstraints({
                    [ORDER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ORDER_REQUEST_LOADING]: false,
                    [ORDER_DETAIL_LOADING]:false
                }));
                
             })
            
        }catch(error){
            dispatch(updateOrderUIConstraints({
                [ORDER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ORDER_REQUEST_LOADING]: false,
                [ORDER_DETAIL_LOADING]:false
            }));
           
            Utils.log("errror  ===> ",error)
        }
    }
}


export const ClearRedux =() =>{
    return(dispatch,getState) =>{
        try{
            dispatch(updateOrderUIConstraints({
                [REFILL_ORDER_SKIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [PENDING_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                
                [REFILL_ORDER_SHIP_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [REFILL_ORDER_CANCEL_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PENDING_ORDER_APPROVE_REQUEST]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                }
            }));
        }catch(err){
            console.log(err)
        }
    }
}



/** Export all users */
export const exportOrders = () => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateOrderUIConstraints({
                    [ORDER_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [ORDER_REQUEST_LOADING]: false,
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateOrderUIConstraints({
                [ORDER_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ORDER_REQUEST_LOADING]: true,
            }));

            refillExportAllUsers(user_token).then(async (blob) => {
                if (blob && blob.size) {
                    dispatch(updateOrderUIConstraints({
                        [ORDER_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [ORDER_REQUEST_LOADING]: false,
                    }));
                    Download.download(blob, "users.csv", "csv");
                } else {
                    dispatch(updateOrderUIConstraints({
                        [ORDER_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: blob
                        },
                        [ORDER_REQUEST_LOADING]: false,
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Edit order Response ===> error", error);
                dispatch(updateOrderUIConstraints({
                    [ORDER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ORDER_REQUEST_LOADING]: false,
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Delete order Form Data ===> error ", error);
            dispatch(updateOrderUIConstraints({
                [ORDER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ORDER_REQUEST_LOADING]: false,
            }));
        }
    }
}

// addNotes order

export const addNotes = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
                         
        }catch(error){
            Utils.log("errror  ===> ",error)
        }
    }
}


// editNotes order

export const editNotes = (id) =>{
    return(dispatch,getState) => {
        try{
            const formData = getState()[ORDER_ROOT][ORDER_KEY];
            Utils.log("formData formData formData",formData)
             //User data
             const data = getState()[USER_ROOT][USER_KEY];
             const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;             
        }catch(error){
           
            Utils.log("errror  ===> ",error)
        }
    }
}
