import Utils from "../../common/util/Utils";
import { ADD_CARD_RESET, ADD_CARD_ROOT, ADD_CARD_KEY, ADD_CARD_UPDATE, ADD_CARD_FORM, USER_ROOT, USER_KEY, USER_DATA, ADD_CARD_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING, ERROR, ADD_CARD_REQUEST_LOADING, SUCCESS, ADD_CARD_ERRORS, ADD_CARD_FORM_CARDHOLDER_NAME, ADD_CARD_FORM_CARD_NUMBER, ADD_CARD_FORM_EXPIRE_DATE, ADD_CARD_FORM_CVV, SERVER_VALIDATION_ERROR, SERVER_SUCCESS, LIST_CARD_REQUEST_PAGE, LIST_CARD_REQUEST_STATUS, LIST_CARD_REQUEST_LOADING, LIST_CARD_REQUEST_DATA, LIST_CARD_ERRORS, SERVER_NO_VALUE } from "../Types";
import { refillAddCard, refillListCard, getCVVMonth, getCVVYear } from "../../apis/APIs";

/** List card data */
export const listCardAddress = () => {
    return async (dispatch, getState) => {
        try {
            const card_info = getState()[ADD_CARD_ROOT][ADD_CARD_KEY];
            const page_number = card_info && card_info[LIST_CARD_REQUEST_PAGE] ? card_info[LIST_CARD_REQUEST_PAGE] : 1;

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateAddCardUIConstraints({
                [LIST_CARD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [LIST_CARD_REQUEST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateAddCardUIConstraints({
                    [LIST_CARD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [LIST_CARD_REQUEST_LOADING]: false
                }));

                return;
            }

            let body = {
                "user_token": user_data.user_token
            }

            try {
                const res = await refillListCard(body);
                Utils.log("List Card Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateAddCardUIConstraints({
                        [LIST_CARD_REQUEST_DATA]: res.data,
                        [LIST_CARD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [LIST_CARD_REQUEST_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";

                            dispatch(updateAddCardUIConstraints({
                                [LIST_CARD_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [LIST_CARD_REQUEST_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateAddCardUIConstraints({
                        [LIST_CARD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [LIST_CARD_REQUEST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("List Card Response ===> error", error);
                dispatch(updateAddCardUIConstraints({
                    [LIST_CARD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [LIST_CARD_REQUEST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update List Card Form Data ===> error ", error);
        }
    }
}

/** Add card data */
export const addCardAddress = () => {
    return async (dispatch, getState) => {
        try {
            const autocomplete_form_info = getState()[ADD_CARD_ROOT][ADD_CARD_KEY];
            const form_data = autocomplete_form_info && autocomplete_form_info[ADD_CARD_FORM] ? autocomplete_form_info[ADD_CARD_FORM] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateAddCardUIConstraints({
                [ADD_CARD_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ADD_CARD_REQUEST_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateAddCardUIConstraints({
                    [ADD_CARD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [ADD_CARD_REQUEST_LOADING]: false
                }));

                return;
            }

            let body = {
                "user_token": user_data.user_token,
                "card_holder_name": form_data[ADD_CARD_FORM_CARDHOLDER_NAME],
                "card_number": parseInt(form_data[ADD_CARD_FORM_CARD_NUMBER].replace(/\D/gi, "")),
                "expire_month": parseInt(getCVVMonth(form_data[ADD_CARD_FORM_EXPIRE_DATE])),
                "expire_year": parseInt(getCVVYear(form_data[ADD_CARD_FORM_EXPIRE_DATE])),
                "cvv": parseInt(form_data[ADD_CARD_FORM_CVV].replace(/\D/gi, ""))
            }

            try {
                const res = await refillAddCard(body);
                Utils.log("Add Card Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateAddCardUIConstraints({
                        [ADD_CARD_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [ADD_CARD_REQUEST_LOADING]: false
                    }));
                    dispatch(resetAddCardState());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";
                            const errors = res && res.emptyKeys && res.emptyKeys.message ? res.emptyKeys.message : res.emptyKeys && res.emptyKeys.length ? res.emptyKeys : [];


                            dispatch(updateAddCardUIConstraints({
                                [ADD_CARD_ERRORS]: errors && errors.length ? errors.map(err => Object.assign(err, { message: err.message ? err.message : `${err.type} is required.` })) : [],
                                [ADD_CARD_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [ADD_CARD_REQUEST_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            if (res.data && res.data.raw && res.data.raw.message) {
                                message = res.data.raw.message;
                            } else
                                message = "Internal server error, please try again";
                    }

                    dispatch(updateAddCardUIConstraints({
                        [ADD_CARD_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [ADD_CARD_REQUEST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Add Card Response ===> error", error);
                dispatch(updateAddCardUIConstraints({
                    [ADD_CARD_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [ADD_CARD_REQUEST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Add Card Form Data ===> error ", error);
        }
    }
}

/** Manage Add Card Form Data */
export const updateAddCardFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_CARD_ROOT][ADD_CARD_KEY];
            const data = Object.assign(formData[ADD_CARD_FORM], obj);

            dispatch(updateAddCardState(Object.assign(formData, {
                [ADD_CARD_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Add Card Form Data ===> error ", error);
        }
    }
}

/** Manage Add Card UI Constraints */
export const updateAddCardUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_CARD_ROOT][ADD_CARD_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateAddCardState(data));
        } catch (error) {
            Utils.log("Update Add Card UI Constraints ===> error ", error);
        }
    }
}

/** Update add card data state */
const updateAddCardState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[ADD_CARD_ROOT][ADD_CARD_KEY];

            dispatch({
                type: ADD_CARD_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Add Card State ===> error ", error);
        }
    }
}

/** Reset add card data state */
export const resetAddCardState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: ADD_CARD_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Add Card State ===> error ", error);
        }
    }
}