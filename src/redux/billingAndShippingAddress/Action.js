import Utils from "../../common/util/Utils";
import { ADD_BILLING_AND_SHIPPING_ADDRESS_RESET, ADD_BILLING_AND_SHIPPING_ADDRESS_UPDATE, ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT, ADD_BILLING_AND_SHIPPING_ADDRESS_KEY, ADD_BILLING_AND_SHIPPING_ADDRESS_FORM, ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM, ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA, ADD_SHIPPING_ADDRESS_FORM_ADDRESS, ADD_SHIPPING_ADDRESS_FORM_PHONE, ADD_SHIPPING_ADDRESS_FORM_NAME, ADD_SHIPPING_ADDRESS_FORM_CITY, ADD_SHIPPING_ADDRESS_FORM_STATE, ADD_SHIPPING_ADDRESS_FORM_COUNTRY, ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE, ADD_BILLING_ADDRESS_FORM_NAME, ADD_BILLING_ADDRESS_FORM_PHONE, ADD_BILLING_ADDRESS_FORM_ADDRESS, ADD_BILLING_ADDRESS_FORM_CITY, ADD_BILLING_ADDRESS_FORM_STATE, ADD_BILLING_ADDRESS_FORM_COUNTRY, ADD_BILLING_ADDRESS_FORM_ZIP_CODE, IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS, USER_ROOT, USER_KEY, USER_DATA, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING, STATUS, MESSAGE, SUCCESS, SERVER_NO_VALUE, ERROR, EMPTY, SERVER_SUCCESS, SERVER_VALIDATION_ERROR, ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS } from "../Types";
import { refillAutoCompleteLocation, refillEditBillingAndShippingAddress, refillSessionLogin } from "../../apis/APIs";
import { sessionLogin } from "../login/Action";
import { Helper } from "../../apis";

/** Add Billing/Shipping address data */
export const addBillingAndShippingAddress = () => {
    return async (dispatch, getState) => {
        try {
            const autocomplete_form_info = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];
            const form_data = autocomplete_form_info && autocomplete_form_info[ADD_BILLING_AND_SHIPPING_ADDRESS_FORM] ? autocomplete_form_info[ADD_BILLING_AND_SHIPPING_ADDRESS_FORM] : {};

            const is_add_billing_address_as_shipping_address = autocomplete_form_info && autocomplete_form_info[IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS] ? autocomplete_form_info[IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS] : false;

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateAddBillingAndShippingAddressUIConstraints({
                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: false
                }));

                return;
            }

            let body = {
                "user_token": user_data.user_token,
                "customer_shipping_name": form_data[ADD_SHIPPING_ADDRESS_FORM_NAME],
                "customer_shipping_phone": form_data[ADD_SHIPPING_ADDRESS_FORM_PHONE].replace(/\D/gi, ''),
                "customer_shipping_full_address": form_data[ADD_SHIPPING_ADDRESS_FORM_ADDRESS],
                "customer_shipping_city": form_data[ADD_SHIPPING_ADDRESS_FORM_CITY],
                "customer_shipping_state": form_data[ADD_SHIPPING_ADDRESS_FORM_STATE],
                "customer_shipping_country": form_data[ADD_SHIPPING_ADDRESS_FORM_COUNTRY],
                "customer_shipping_zip_code": parseInt(form_data[ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE]),
                "customer_shipping_latitude": 0,
                "customer_shipping_longitude": 0,
                "customer_billing_name": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_NAME : ADD_BILLING_ADDRESS_FORM_NAME],
                "customer_billing_phone": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_PHONE : ADD_BILLING_ADDRESS_FORM_PHONE].replace(/\D/gi, ''),
                "customer_billing_full_address": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_ADDRESS : ADD_BILLING_ADDRESS_FORM_ADDRESS],
                "customer_billing_city": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_CITY : ADD_BILLING_ADDRESS_FORM_CITY],
                "customer_billing_state": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_STATE : ADD_BILLING_ADDRESS_FORM_STATE],
                "customer_billing_country": form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_COUNTRY : ADD_BILLING_ADDRESS_FORM_COUNTRY],
                "customer_billing_zip_code": parseInt(form_data[is_add_billing_address_as_shipping_address ? ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE : ADD_BILLING_ADDRESS_FORM_ZIP_CODE]),
                "customer_billing_latitude": 0,
                "customer_billing_longitude": 0,
                "is_add_billing_address_as_shipping_address": is_add_billing_address_as_shipping_address
            }

            try {
                const res = await refillEditBillingAndShippingAddress(body);
                Utils.log("Add Billing and Shipping Address Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateAddBillingAndShippingAddressUIConstraints({
                        [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: false
                    }));
                    dispatch(sessionLogin());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";
                            const errors = res && res.emptyKeys && res.emptyKeys.message ? res.emptyKeys.message : res.emptyKeys && res.emptyKeys.length ? res.emptyKeys : [];


                            dispatch(updateAddBillingAndShippingAddressUIConstraints({
                                [ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS]: errors && errors.length ? errors.map(err => Object.assign(err, { message: err.message ? err.message : `${err.type} is required.` })) : [],
                                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateAddBillingAndShippingAddressUIConstraints({
                        [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Add Billing and Shipping Address Response ===> error", error);
                dispatch(updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address Form Data ===> error ", error);
        }
    }
}

/** Auto Complete data */
export const autoComplete = () => {
    return async (dispatch, getState) => {
        try {
            const autocomplete_form_info = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];
            const form_data = autocomplete_form_info && autocomplete_form_info[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM] ? autocomplete_form_info[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM] : {};

            //Intialize state
            dispatch(updateAddBillingAndShippingAddressUIConstraints({
                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING]: true
            }));

            const body = {
                location: form_data[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT]
            }

            try {
                const res = await refillAutoCompleteLocation(body);
                Utils.log("Add Billing and Shipping Address Response ===> ", res, body);
                dispatch(updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING]: false,
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA]: res && res.status === "OK" ? res.predictions : []
                }));
            } catch (error) {
                Utils.log("Add Billing and Shipping Address Response ===> error", error);
                dispatch(updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address Form Data ===> error ", error);
        }
    }
}

/** Set Billing/Shipping address data */
export const setBillingAndShippingAddress = () => {
    return async (dispatch, getState) => {
        try {
            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateAddBillingAndShippingAddressUIConstraints({
                [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
            }));

            if (!user_data.user_token) {
                dispatch(updateAddBillingAndShippingAddressUIConstraints({
                    [ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User data not found, please try again."
                    },
                }));

                return;
            }

            const shippingAddress = user_data && user_data.shippingAddress ? user_data.shippingAddress : {};
            const billingAddress = user_data && user_data.billingAddress ? user_data.billingAddress : {};
            const is_add_billing_address_as_shipping_address = user_data && user_data.is_add_billing_address_as_shipping_address ? user_data.is_add_billing_address_as_shipping_address : false;

            let obj = {};

            if (is_add_billing_address_as_shipping_address) {
                obj = {
                    [ADD_SHIPPING_ADDRESS_FORM_NAME]: shippingAddress.name,
                    [ADD_SHIPPING_ADDRESS_FORM_PHONE]: shippingAddress.phone ? Helper.MakePhoneNumberMask(`${shippingAddress.phone}`) : '',
                    [ADD_SHIPPING_ADDRESS_FORM_ADDRESS]: shippingAddress.fullAddress,
                    [ADD_SHIPPING_ADDRESS_FORM_CITY]: shippingAddress.city,
                    [ADD_SHIPPING_ADDRESS_FORM_STATE]: shippingAddress.state,
                    [ADD_SHIPPING_ADDRESS_FORM_COUNTRY]: shippingAddress.country,
                    [ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE]: shippingAddress.zipCode ? `${shippingAddress.zipCode}` : '',
                    [IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS]: is_add_billing_address_as_shipping_address
                }
            } else {
                obj = {
                    [ADD_SHIPPING_ADDRESS_FORM_NAME]: shippingAddress.name,
                    [ADD_SHIPPING_ADDRESS_FORM_PHONE]: shippingAddress.phone,
                    [ADD_SHIPPING_ADDRESS_FORM_ADDRESS]: shippingAddress.fullAddress,
                    [ADD_SHIPPING_ADDRESS_FORM_CITY]: shippingAddress.city,
                    [ADD_SHIPPING_ADDRESS_FORM_STATE]: shippingAddress.state,
                    [ADD_SHIPPING_ADDRESS_FORM_COUNTRY]: shippingAddress.country,
                    [ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE]: shippingAddress.zipCode ? `${shippingAddress.zipCode}` : '',

                    [ADD_BILLING_ADDRESS_FORM_NAME]: billingAddress.name,
                    [ADD_BILLING_ADDRESS_FORM_PHONE]: billingAddress.phone ? Helper.MakePhoneNumberMask(`${billingAddress.phone}`) : billingAddress.phone,
                    [ADD_BILLING_ADDRESS_FORM_ADDRESS]: billingAddress.fullAddress,
                    [ADD_BILLING_ADDRESS_FORM_CITY]: billingAddress.city,
                    [ADD_BILLING_ADDRESS_FORM_STATE]: billingAddress.state,
                    [ADD_BILLING_ADDRESS_FORM_COUNTRY]: billingAddress.country,
                    [ADD_BILLING_ADDRESS_FORM_ZIP_CODE]: billingAddress.zipCode ? `${billingAddress.zipCode}` : '',
                    [IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS]: is_add_billing_address_as_shipping_address
                }
            }

            console.log("updateAddBillingAndShippingAddressFormData ===> ", obj);

            dispatch(updateAddBillingAndShippingAddressFormData(obj));
        } catch (error) {
            Utils.log("Update Set Billing and Shipping Address Form Data ===> error ", error);
        }
    }
}

/** Manage Add Billing/Shipping address Form Data */
export const updateAddBillingAndShippingAddressFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];
            const data = Object.assign(formData[ADD_BILLING_AND_SHIPPING_ADDRESS_FORM], obj);

            dispatch(updateAddBillingAndShippingAddressState(Object.assign(formData, {
                [ADD_BILLING_AND_SHIPPING_ADDRESS_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address Form Data ===> error ", error);
        }
    }
}

/** Manage Auto completet Billing/Shipping address Form Data */
export const updateAutoCompleteBillingAndShippingAddressFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];
            const data = Object.assign(formData[ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM], obj);

            dispatch(updateAddBillingAndShippingAddressState(Object.assign(formData, {
                [ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address Form Data ===> error ", error);
        }
    }
}

/** Manage Add Billing/Shipping Address UI Constraints */
export const updateAddBillingAndShippingAddressUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateAddBillingAndShippingAddressState(data));
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address UI Constraints ===> error ", error);
        }
    }
}

/** Update add billing/shipping address data state */
const updateAddBillingAndShippingAddressState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT][ADD_BILLING_AND_SHIPPING_ADDRESS_KEY];

            dispatch({
                type: ADD_BILLING_AND_SHIPPING_ADDRESS_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Add Billing and Shipping Address State ===> error ", error);
        }
    }
}

/** Reset add billing/shipping address data state */
export const resetAddBillingAndShippingAddressState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: ADD_BILLING_AND_SHIPPING_ADDRESS_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Add Billing and Shipping Address State ===> error ", error);
        }
    }
}