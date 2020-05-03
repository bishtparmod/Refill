import { DRIVER_ROOT, DRIVER_KEY, DRIVER_UPDATE, DRIVER_RESET, DRIVER_FORM, DRIVER_REQUEST_STATUS, DRIVER_REQUEST_LOADING, TOKEN_NOT_FOUND, MESSAGE, ERROR, STATUS, SUCCESS, EMPTY, USER_ROOT, USER_KEY, USER_DATA, DRIVER_NAME, DRIVER_FORM_UPLOADED_IMAGES, DRIVER_EMAIL, DRIVER_PHONE_NUMBER, DRIVER_AGE, DRIVER_VECHILE_NAME, DRIVER_VECHILE_NUMBER, DRIVER_LICENSE, DRIVER_FORM_LOADING, DRIVER_EDIT_FORM_LOADING, DRIVER_EDIT_FORM, DRIVER_EDIT_NAME, DRIVER_EDIT_EMAIL, DRIVER_EDIT_PHONE_NUMBER, DRIVER_EDIT_FORM_UPLOADED_IMAGES, DRIVER_EDIT_AGE, DRIVER_EDIT_VECHILE_NAME, DRIVER_EDIT_VECHILE_NUMBER, DRIVER_EDIT_LICENSE, DRIVER_EDIT_FULL_ADDRESS, DRIVER_EDIT_STREET_ADDRESS, DRIVER_EDIT_CITY, DRIVER_EDIT_STATE, DRIVER_EDIT_COUNTRY, DRIVER_EDIT_ZIPCODE, DRIVER_EDIT_LATITUDE, DRIVER_EDIT_LONGITUDE, DRIVER_FULL_ADDRESS, DRIVER_STREET_ADDRESS, DRIVER_CITY, DRIVER_STATE, DRIVER_COUNTRY, DRIVER_ZIPCODE, DRIVER_LATITUDE, DRIVER_LONGITUDE, DRIVER_EDIT_ADDRESS, DRIVER_EDIT_ID, DRIVER_PASSWORD, DRIVER_ENABLE_LOADING, DRIVER_DISABLE_LOADING, ASSIGN_DRIVER_KEY, DRIVER_EDIT_IMAGE_UPLOADED_FILE, DRIVER_EDIT_PASSWORD } from "../Types";
import Utils from "../../components/util/Utils";
import { refillAddDriver, refillViewDriver, refillDriverEnable, refillDriverDisable, refillEditDriver } from "../../apis/APIs";

/** Update Driver data state */
export const updateDriverState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DRIVER_ROOT][DRIVER_KEY];

            dispatch({
                type: DRIVER_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetDriverState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: DRIVER_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}


/** Manage Add Driver Form Data */
export const updateEditDriverFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DRIVER_ROOT][DRIVER_KEY];
            const data = Object.assign(formData[DRIVER_FORM], obj);

            dispatch(updateDriverState(Object.assign(formData, {
                [DRIVER_FORM]:data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Assign Driver Form Data */
export const updateAssignDriver = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DRIVER_ROOT][DRIVER_KEY];
            const data = Object.assign(formData[ASSIGN_DRIVER_KEY], obj);

            dispatch(updateDriverState(Object.assign(formData, {
                [ASSIGN_DRIVER_KEY]:data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}



/** Manage Edit Driver Form Data */
export const updateEdit1DriverFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DRIVER_ROOT][DRIVER_KEY];
            const data = Object.assign(formData[DRIVER_EDIT_FORM], obj);

            dispatch(updateDriverState(Object.assign(formData, {
                [DRIVER_EDIT_FORM]:data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Driver UI Constraints */
export const updateDriverUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[DRIVER_ROOT][DRIVER_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateDriverState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

// get Driver Data
export const getDriverviaId = (id) =>{
    return(dispatch,getState) => {
        try{
            const driverInfo = getState()[DRIVER_ROOT][DRIVER_KEY];
            const formData = driverInfo[DRIVER_EDIT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if(id){
                const body = {
                    user_token,
                    driver_id: id
                }

                refillViewDriver(body)
                .then((res)=>{
                    if(res && res.status === 200){
                        const data = res && res.data ? res.data[0] : {};
                        Utils.log("data   ======   >>",data)
                        dispatch(updateEdit1DriverFormData({
                            [DRIVER_EDIT_ID]:id,
                            [DRIVER_EDIT_PASSWORD]:data.driverPassword,
                            [DRIVER_EDIT_NAME]:data.name ? data.name : "",
                            [DRIVER_EDIT_LICENSE]:data.licenseNumber ? data.licenseNumber : "",
                            [DRIVER_EDIT_VECHILE_NAME]:data.vehicalName ? data.vehicalName : "",
                            [DRIVER_EDIT_EMAIL]:data.email ? data.email : "",
                            [DRIVER_EDIT_AGE]:data.age ? data.age : "",
                            [DRIVER_EDIT_PHONE_NUMBER]:data.phone ? data.phone : "",
                            [DRIVER_EDIT_ADDRESS]:data.name ? data.name : "",
                            [DRIVER_EDIT_VECHILE_NUMBER]:data.vehicalNumber ? data.vehicalNumber : "",
                            [DRIVER_EDIT_FORM_UPLOADED_IMAGES]:data.image ? data.image : "",
                            [DRIVER_EDIT_FULL_ADDRESS]:data.address ? data.address.fullAddress : "",
                            [DRIVER_EDIT_STREET_ADDRESS]:data.address ? data.address.street : "",
                            [DRIVER_EDIT_ZIPCODE]:data.address ? data.address.zipcode : "",
                            [DRIVER_EDIT_CITY]:data.address ? data.address.city : "",
                            [DRIVER_EDIT_STATE]:data.address ? data.address.state : "",
                            [DRIVER_EDIT_COUNTRY]:data.address ? data.address.country : "",
                            [DRIVER_EDIT_LATITUDE]: data && data.location ? data.location.coordinates[0] : "",
                            [DRIVER_EDIT_LONGITUDE]:data && data.location ? data.location.coordinates[1] : "",
                        }))

                    }
                })
                .catch((error)=>{
                    dispatch(updateDriverUIConstraints({
                        [DRIVER_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: ""
                        },
                        [DRIVER_REQUEST_LOADING]: false
                    }));
                    updateEditDriverFormData({
                        [DRIVER_FORM_LOADING]:false
                    })
                    console.log(error)
                })
            }

            
        }catch(error){
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            }));
            updateEditDriverFormData({
                [DRIVER_FORM_LOADING]:false
            })
            Utils.log("errror  ===> ",error)
        }
    }
}


/** Create Driver */
export const createDriver = (obj) => {
    return (dispatch, getState) => {
        try {
            const driverInfo = getState()[DRIVER_ROOT][DRIVER_KEY];
            const formData = driverInfo[DRIVER_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            
            if (!user_token) {
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                return;
            }


            //Intialize the request status and loading
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: true
            }));

            const body = {
                user_token,
                name: formData[DRIVER_NAME],
                email: formData[DRIVER_EMAIL],
                password:formData[DRIVER_PASSWORD],
                phone:parseInt(formData[DRIVER_PHONE_NUMBER].replace(/\D/gi, ''))  ,
                image: formData[DRIVER_FORM_UPLOADED_IMAGES],
                age: parseInt(formData[DRIVER_AGE]),
                vehicalName: formData[DRIVER_VECHILE_NAME],
                vehicalNumber: formData[DRIVER_VECHILE_NUMBER],
                licenseNumber: formData[DRIVER_LICENSE],
                driver_full_address: formData[DRIVER_FULL_ADDRESS],
                driver_street_address: formData[DRIVER_STREET_ADDRESS],
                driver_city: formData[DRIVER_CITY],
                driver_state: formData[DRIVER_STATE],
                driver_country: formData[DRIVER_COUNTRY],
                driver_zipcode: parseInt(formData[DRIVER_ZIPCODE]),
                driver_latitude: parseFloat(formData[DRIVER_LATITUDE]) ,
                driver_longitude: parseFloat(formData[DRIVER_LONGITUDE]) ,
                
            }

            refillAddDriver(body).then(async (res) => {
                Utils.log("Refill Driver Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateDriverUIConstraints({
                        [DRIVER_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DRIVER_REQUEST_LOADING]: false
                    }));
                    updateEditDriverFormData({
                        [DRIVER_FORM_LOADING]:false
                    })
                } else {
                    dispatch(updateDriverUIConstraints({
                        [DRIVER_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DRIVER_REQUEST_LOADING]: false
                    }));
                    updateEditDriverFormData({
                        [DRIVER_FORM_LOADING]:false
                    })
                }
            }).catch(error => {
                Utils.log("Refill Driver Response ===> error", error);
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                updateEditDriverFormData({
                    [DRIVER_FORM_LOADING]:false
                })
            });
        } catch (error) {
            Utils.log("Update Refill Product Form Data ===> error ", error);
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            }));
            updateEditDriverFormData({
                [DRIVER_FORM_LOADING]:false
            })
        }
    }
}

/** Edit Driver */
export const editDriver = (id) => {
    
    return (dispatch, getState) => {
        try {
            const driverInfo = getState()[DRIVER_ROOT][DRIVER_KEY];
            const formData = driverInfo[DRIVER_EDIT_FORM];
            
            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            
            if (!user_token) {
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                return;
            }


            //Intialize the request status and loading
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: true
            }));
            const body = {
                user_token,
                driver_id:formData[DRIVER_EDIT_ID],
                name: formData[DRIVER_EDIT_NAME],
                email: formData[DRIVER_EDIT_EMAIL],
                phone: parseInt(formData[DRIVER_EDIT_PHONE_NUMBER].replace(/\D/gi, '')) ,
                image: formData[DRIVER_EDIT_FORM_UPLOADED_IMAGES],
                age: parseInt(formData[DRIVER_EDIT_AGE]),
                vehicalName: formData[DRIVER_EDIT_VECHILE_NAME],
                vehicalNumber: formData[DRIVER_EDIT_VECHILE_NUMBER],
                licenseNumber: formData[DRIVER_EDIT_LICENSE],
                driver_full_address: formData[DRIVER_EDIT_FULL_ADDRESS  ],
                driver_street_address: formData[DRIVER_EDIT_STREET_ADDRESS],
                driver_city: formData[DRIVER_EDIT_CITY],
                driver_state: formData[DRIVER_EDIT_STATE],
                driver_country: formData[DRIVER_EDIT_COUNTRY],
                driver_zipcode:parseInt(formData[DRIVER_EDIT_ZIPCODE]) ,
                driver_latitude:parseFloat(formData[DRIVER_EDIT_LATITUDE]) ,
                driver_longitude:parseFloat(formData[DRIVER_EDIT_LONGITUDE]) ,
            }
           
            refillEditDriver(body).then(async (res) => {
                Utils.log("Refill Driver Response ===> ", res);
               
                if (res && res.status === 200) {
                    dispatch(updateDriverUIConstraints({
                        [DRIVER_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DRIVER_REQUEST_LOADING]: false
                    }));
                    dispatch(updateEdit1DriverFormData({
                        [DRIVER_EDIT_FORM_LOADING]:false
                    }))
                } else {
                    dispatch(updateDriverUIConstraints({
                        [DRIVER_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DRIVER_REQUEST_LOADING]: false
                    }));
                    dispatch(updateEdit1DriverFormData({
                        [DRIVER_EDIT_FORM_LOADING]:false
                    }))
                }
            }).catch(error => {
                Utils.log("Refill Driver Response ===> error", error);
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                dispatch(updateEdit1DriverFormData({
                    [DRIVER_EDIT_FORM_LOADING]:false
                }))
            });
        } catch (error) {
            Utils.log("Update Refill Product Form Data ===> error ", error);
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            }));
            dispatch(updateEdit1DriverFormData({
                [DRIVER_EDIT_FORM_LOADING]:false
            }))
        }
    }
}


// enable Driver
export const enableDriver = (id) => {
    return (dispatch,getState)=>{
        try{
            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            
            if (!user_token) {
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                return;
            }
            const body = {
                user_token,
                user_id:id
            }
            refillDriverEnable(body).then((result)=>{
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: SUCCESS,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                updateDriverUIConstraints({
                    [DRIVER_ENABLE_LOADING]:false
                })
            }).catch((error)=>{
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                updateEdit1DriverFormData({
                    [DRIVER_ENABLE_LOADING]:false
                })
                console.log(error)
            })

        }catch(error){
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            }));
            updateEdit1DriverFormData({
                [DRIVER_ENABLE_LOADING]:false
            })
            console.log(error)
        }
    }
}

// enable Driver
export const disableDriver = (id) => {
    return (dispatch,getState)=>{
        try{
            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            
            if (!user_token) {
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                return;
            }
            const body = {
                user_token,
                user_id:id
            }
            refillDriverDisable(body).then((result)=>{
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: SUCCESS,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                updateDriverUIConstraints({
                    [DRIVER_DISABLE_LOADING]:false
                })
            }).catch((error)=>{
                dispatch(updateDriverUIConstraints({
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DRIVER_REQUEST_LOADING]: false
                }));
                updateEdit1DriverFormData({
                    [DRIVER_DISABLE_LOADING]:false
                })
                console.log(error)
            })

        }catch(error){
            dispatch(updateDriverUIConstraints({
                [DRIVER_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DRIVER_REQUEST_LOADING]: false
            }));
            updateEdit1DriverFormData({
                [DRIVER_DISABLE_LOADING]:false
            })
            console.log(error)
        }
    }
}

