import Utils from '../../components/util/Utils';
import { refillExportAllUsers, refillUserEdit, refillEnableUser, refillDisableUser, refillGetUserViaId } from '../../apis/APIs';
import { USER_EDIT_KEY, USER_CUSTOMER_LOADING, USERS_RESET, USERS_ROOT, USERS_KEY, USERS_UPDATE, DELETE_USERS_FORM, USER_ROOT, USER_KEY, USER_DATA, EXPORT_USERS_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, TOKEN_NOT_FOUND, EXPORT_USERS_REQEUST_LOADING, SUCCESS, ERROR, ENABLE_USERS_REQUEST_STATUS, ENABLE_USERS_REQUEST_LOADING, DISABLE_USERS_REQUEST_STATUS, DISABLE_USERS_REQUEST_LOADING, USER_EDIT_FORM, USER_CUSTOMER_ID, USER_CUSTOMER_EMAIL, USER_CUSTOMER_NOTES, USER_CUSTOMER_PHONENO, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_CUSTOMER_NAME, USER_CUSTOMER_STATE, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_COMPANY_ADDRESS, USER_CUSTOMER_BILLING_STREET, USER_CUSTOMER_STREET, USER_CUSTOMER_LATITUDE, USER_CUSTOMER_LONGITUDE, USER_CUSTOMER_BILLING_ZIPCODE, USER_CUSTOMER_BILLING_COUNTRY, USER_CUSTOMER_BILLING_STATE, USER_CUSTOMER_BILLING_CITY, USER_CUSTOMER_BILLING_LATITUDE, USER_CUSTOMER_BILLING_LONGITUDE, USER_CUSTOMER_SHIPPING_CITY, USER_CUSTOMER_SHIPPING_LONGITUDE, USER_CUSTOMER_SHIPPING_LATITUDE, USER_CUSTOMER_SHIPPING_STREET, USER_CUSTOMER_SHIPPING_ZIPCODE, USER_CUSTOMER_SHIPPING_STATE, USER_CUSTOMER_SHIPPING_COUNTRY, USER_CUSTOMER_SHIPPING_NAME, USER_CUSTOMER_SHIPPING_PHONE, USER_CUSTOMER_BILLING_NAME, USER_CUSTOMER_BILLING_PHONE } from '../Types';
import Download from '../../apis/Download'

/** Export all users */
export const exportUsers = () => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUsersUIConstraints({
                    [EXPORT_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [EXPORT_USERS_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateUsersUIConstraints({
                [EXPORT_USERS_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [EXPORT_USERS_REQUEST_STATUS]: true
            }));

            refillExportAllUsers(user_token).then(async (blob) => {
                if (blob && blob.size) {
                    dispatch(updateUsersUIConstraints({
                        [EXPORT_USERS_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [EXPORT_USERS_REQEUST_LOADING]: false
                    }));

                    Download.download(blob, "users.csv", "csv");
                } else {
                    dispatch(updateUsersUIConstraints({
                        [EXPORT_USERS_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: blob
                        },
                        [EXPORT_USERS_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Edit Users Response ===> error", error);
                dispatch(updateUsersUIConstraints({
                    [EXPORT_USERS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [EXPORT_USERS_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Delete Users Form Data ===> error ", error);
            dispatch(updateUsersUIConstraints({
                [EXPORT_USERS_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [EXPORT_USERS_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Manage Delete Users Form Data */
export const updateDeleteUsersFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USERS_ROOT][USERS_KEY];
            const data = Object.assign(formData[DELETE_USERS_FORM], obj);

            dispatch(updateUsersUIConstraints(Object.assign(formData, {
                [DELETE_USERS_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Users Form Data ===> error ", error);
        }
    }
}

/** Manage Users UI Constraints */
export const updateUsersUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USERS_ROOT][USERS_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateUsersState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

/** Update users data state */
const updateUsersState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USERS_ROOT][USERS_KEY];

            dispatch({
                type: USERS_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Enable users */
export const enableUsers = (id) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUsersUIConstraints({
                    [ENABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [ENABLE_USERS_REQUEST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateUsersUIConstraints({
                [ENABLE_USERS_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ENABLE_USERS_REQUEST_LOADING]: true 
            }));

            const body = {
                "user_token": user_token,
                "user_id": id
            }

            refillEnableUser(body).then(async (res) => {
                Utils.log("Refill Enable Users Response ===> ", res);

                if (res && res.status === 200) {
                    
                    dispatch(updateUsersUIConstraints({
                        [ENABLE_USERS_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [ENABLE_USERS_REQUEST_LOADING]: false
                    }));
                } else {
                    dispatch(updateUsersUIConstraints({
                        [ENABLE_USERS_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [ENABLE_USERS_REQUEST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Enable Users ===> error", error);
                dispatch(updateUsersUIConstraints({
                    [ENABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ENABLE_USERS_REQUEST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Enable Users ===> error", error);
            dispatch(updateUsersUIConstraints({
                [ENABLE_USERS_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ENABLE_USERS_REQUEST_LOADING]: false
            }));
        }
    }
}

/** Disable Users */
export const disableUsers = (id) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUsersUIConstraints({
                    [DISABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [DISABLE_USERS_REQUEST_LOADING]: false
                }));
                
                return;
            }

            //Intialize the request status and loading
            dispatch(updateUsersUIConstraints({
                [DISABLE_USERS_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DISABLE_USERS_REQUEST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "user_id": id
            }


            refillDisableUser(body).then(async (res) => {
                Utils.log("Refill Enable User Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateUsersUIConstraints({
                        [DISABLE_USERS_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DISABLE_USERS_REQUEST_LOADING]: false
                    }));
                } else {
                    dispatch(updateUsersUIConstraints({
                        [DISABLE_USERS_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DISABLE_USERS_REQUEST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateUsersUIConstraints({
                    [DISABLE_USERS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DISABLE_USERS_REQUEST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateUsersUIConstraints({
                [DISABLE_USERS_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DISABLE_USERS_REQUEST_LOADING]: false
            }));
        }
    }
}

/** Reset user data state */
export const resetUserState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: USERS_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}

/** Manage Edit User Form Data */
export const updateEditUserFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USERS_ROOT][USERS_KEY];
            const data = Object.assign(formData[USER_EDIT_FORM], obj);

            dispatch(updateUsersState(Object.assign(formData, {
                [USER_EDIT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

export const getUserviaId = (id) => {
    return (dispatch, getState) => {
        try {
            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            if (id) {
                const body = {
                    user_token,
                    user_id: id
                }
                refillGetUserViaId(body).then(async (res) => {
                    if (res && res.status === 200) {
                        const data = res && res.data ? res.data : {};
                        dispatch(updateEditUserFormData({
                            [USER_CUSTOMER_ID]: id,
                            [USER_CUSTOMER_NAME]: data.name ? data.name : '',
                            [USER_CUSTOMER_EMAIL]: data.email ? data.email : '',
                            [USER_CUSTOMER_NOTES]: data.notes ? data.notes : '',
                            [USER_CUSTOMER_PHONENO]: data.phone ? data.phone : '',
                            
                            [USER_CUSTOMER_COMPANY_ADDRESS]: data.billingAddress ? data.billingAddress.fullAddress : '',
                            [USER_CUSTOMER_ADDRESS]: data.shippingAddress ? data.shippingAddress.fullAddress : '',
                            [USER_CUSTOMER_SHIPPING_CITY]: data.shippingAddress ? data.shippingAddress.city : '',
                            [USER_CUSTOMER_SHIPPING_COUNTRY]: data.shippingAddress ? data.shippingAddress.country : '',
                            [USER_CUSTOMER_SHIPPING_STATE]: data.shippingAddress ? data.shippingAddress.state :'',
                            [USER_CUSTOMER_SHIPPING_ZIPCODE]: data.shippingAddress ? data.shippingAddress.zipCode :  '',
                            [USER_CUSTOMER_SHIPPING_STREET]: data.shippingAddress ? data.shippingAddress.street : '',
                            [USER_CUSTOMER_SHIPPING_LATITUDE]: data.shippingAddress ? data.shippingAddress.location.coordinates[0] :'',
                            [USER_CUSTOMER_SHIPPING_LONGITUDE]: data.shippingAddress ? data.shippingAddress.location.coordinates[1] : '',

                            [USER_CUSTOMER_COMPANY_ADDRESS]: data.billingAddress ? data.billingAddress.fullAddress : '',
                            [USER_CUSTOMER_BILLING_STREET]: data.billingAddress ? data.billingAddress.street : '',
                            [USER_CUSTOMER_BILLING_CITY]: data.billingAddress ? data.billingAddress.city : '',
                            [USER_CUSTOMER_BILLING_STATE]: data.billingAddress ? data.billingAddress.state : '',
                            [USER_CUSTOMER_BILLING_COUNTRY]: data.billingAddress ? data.billingAddress.country : '',
                            [USER_CUSTOMER_BILLING_ZIPCODE]: data.billingAddress ? data.billingAddress.zipCode : '',
                            [USER_CUSTOMER_BILLING_LATITUDE]: data.billingAddress ? data.billingAddress.location.coordinates[0] : '',
                            [USER_CUSTOMER_BILLING_LONGITUDE]: data.billingAddress ? data.billingAddress.location.coordinates[1] : '',
                        }))
                    }
                    Utils.log("res  ===== >", res)
                }).catch((error) => console.log(error))
            }

        } catch (error) {
            Utils.log("errror  ===> ", error)
        }
    }
}

export const editUserData = (id) => {
    return (dispatch, getState) => {
        try {
            Utils.log("getState", getState()[USERS_ROOT])
            const userInfo = getState()[USERS_ROOT][USERS_KEY];
            const formData = userInfo[USER_EDIT_FORM];
            Utils.log("fghgbfgjfgbfh", formData)
            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateUsersState({
                    [USER_EDIT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    }
                }));
                return;
            }

            dispatch(updateUsersState({
                [USER_EDIT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
            }))
            const body = {
                user_token: user_token,
                user_id: formData[USER_CUSTOMER_ID],
                customer_name: formData[USER_CUSTOMER_NAME],
                customer_email: formData[USER_CUSTOMER_EMAIL],
                customer_phone: parseInt(formData[USER_CUSTOMER_PHONENO].replace(/\D/gi, '')),

                customer_shipping_full_address: formData[USER_CUSTOMER_ADDRESS],
                
                customer_shipping_name:formData[USER_CUSTOMER_SHIPPING_NAME],
                customer_shipping_phone:formData[USER_CUSTOMER_SHIPPING_PHONE],
                customer_shipping_street_address: formData[USER_CUSTOMER_SHIPPING_STREET],
                customer_shipping_city: formData[USER_CUSTOMER_SHIPPING_CITY],
                customer_shipping_state: formData[USER_CUSTOMER_SHIPPING_STATE],
                customer_shipping_country: formData[USER_CUSTOMER_SHIPPING_COUNTRY],
                customer_shipping_zip_code: parseInt(formData[USER_CUSTOMER_SHIPPING_ZIPCODE]),
                customer_shipping_latitude: parseFloat(formData[USER_CUSTOMER_SHIPPING_LATITUDE]),
                customer_shipping_longitude: parseFloat(formData[USER_CUSTOMER_SHIPPING_LONGITUDE]),

                customer_billing_full_address: formData[USER_CUSTOMER_COMPANY_ADDRESS],
                
                customer_billing_name: formData[USER_CUSTOMER_BILLING_NAME],
                customer_billing_phone: formData[USER_CUSTOMER_BILLING_PHONE],
                customer_billing_street_address: formData[USER_CUSTOMER_BILLING_STREET],
                customer_billing_city: formData[USER_CUSTOMER_BILLING_CITY],
                customer_billing_state: formData[USER_CUSTOMER_BILLING_STATE],
                customer_billing_country: formData[USER_CUSTOMER_BILLING_COUNTRY],
                customer_billing_zip_code: parseInt(formData[USER_CUSTOMER_BILLING_ZIPCODE]),
                customer_billing_latitude: parseFloat(formData[USER_CUSTOMER_BILLING_LATITUDE]),
                customer_billing_longitude: parseFloat(formData[USER_CUSTOMER_BILLING_LONGITUDE]),
            }

            refillUserEdit(body).then((res) => {
                Utils.log(res)
                if (res && res.status === 200) {
                    dispatch(updateUsersState({
                        [USER_EDIT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                    }))
                    dispatch(updateEditUserFormData({
                        [USER_CUSTOMER_LOADING]: false
                    }))

                } else {
                    dispatch(updateUsersState({
                        [USER_EDIT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                    }))
                    dispatch(updateEditUserFormData({
                        [USER_CUSTOMER_LOADING]: false
                    }))

                }
            }).catch(error => console.log(error))
        } catch (error) {
            console.log(error)

        }

    }
}