import { SIGNUP_ROOT, SIGNUP_KEY, SIGNUP_UPDATE, SIGNUP_FORM_CONFIRM_PASSWORD, SIGNUP_FORM, SIGNUP_REQEUST_LOADING, SIGNUP_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, SIGNUP_FORM_EMAIL, SIGNUP_FORM_PASSWORD, SUCCESS, SERVER_SUCCESS, ERROR, SIGNUP_RESET, SERVER_PRESENT, LOGIN_FORM_EMAIL } from "../Types";
import { refillSignup } from "../../apis/APIs";
import Utils from "../../common/util/Utils";
import { updateLoginUIConstraints, updateLoginFormData } from "../login/Action";

/** Signup data */
export const signup = () => {
    return async (dispatch, getState) => {
        try {
            const signup_info = getState()[SIGNUP_ROOT][SIGNUP_KEY];
            const form_data = signup_info && signup_info[SIGNUP_FORM] ? signup_info[SIGNUP_FORM] : {};

            //Intialize state
            dispatch(updateSignupUIConstraints({
                [SIGNUP_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [SIGNUP_REQEUST_LOADING]: true
            }));

            const body = {
                customer_email: form_data[SIGNUP_FORM_EMAIL],
                customer_password: form_data[SIGNUP_FORM_PASSWORD]
            }

            try {
                const res = await refillSignup(body);
                Utils.log("Signup response ===> ", res);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateSignupUIConstraints({
                        [SIGNUP_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [SIGNUP_REQEUST_LOADING]: false
                    }))
                    dispatch(updateLoginFormData({
                        [LOGIN_FORM_EMAIL]: form_data[SIGNUP_FORM_EMAIL]
                    }));
                    dispatch(resetSignupState());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_PRESENT:
                            message = "User is already present, please try with other email address";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateSignupUIConstraints({
                        [SIGNUP_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [SIGNUP_REQEUST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Signup response ===> error", error);
                dispatch(updateSignupUIConstraints({
                    [SIGNUP_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [SIGNUP_REQEUST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Signup Form Data ===> error ", error);
        }
    }
}

/** Manage Signup Form Data */
export const updateSignupFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SIGNUP_ROOT][SIGNUP_KEY];
            const data = Object.assign(formData[SIGNUP_FORM], obj);

            dispatch(updateSignupState(Object.assign(formData, {
                [SIGNUP_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Signup Form Data ===> error ", error);
        }
    }
}

/** Manage Signup UI Constraints */
export const updateSignupUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SIGNUP_ROOT][SIGNUP_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateSignupState(data));
        } catch (error) {
            Utils.log("Update Signup UI Constraints ===> error ", error);
        }
    }
}

/** Update signup data state */
const updateSignupState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SIGNUP_ROOT][SIGNUP_KEY];

            dispatch({
                type: SIGNUP_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Signup State ===> error ", error);
        }
    }
}

/** Reset signup data state */
export const resetSignupState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: SIGNUP_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Signup State ===> error ", error);
        }
    }
}