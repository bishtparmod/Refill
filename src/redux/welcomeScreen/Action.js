import { STATUS, EMPTY, MESSAGE, SUCCESS, SERVER_SUCCESS, ERROR, WELCOME_SCREEN_RESET, WELCOME_SCREEN_UPDATE, WELCOME_SCREEN_ROOT, WELCOME_SCREEN_KEY, WELCOME_SCREEN_REQUEST_STATUS, WELCOME_SCREEN_REQEUST_LOADING, WELCOME_SCREEN_DATA, DEVICE_IS_WELCOME_SCREEN_SKIPPED } from "../Types";
import { refillGetWelcomeScreens } from "../../apis/APIs";
import Utils from "../../common/util/Utils";
import { RefillStorage } from "../../apis";
import { updateDeviceUIConstraints } from "../device/Action";

/** Welcome Screen data */
export const getWelcomeScreenData = () => {
    return async (dispatch, getState) => {
        try {

            //Intialize state
            dispatch(updateWelcomeScreenUIConstraints({
                [WELCOME_SCREEN_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [WELCOME_SCREEN_REQEUST_LOADING]: true
            }));

            try {
                const res = await refillGetWelcomeScreens();
                Utils.log("Welcome screen response ===> ", res);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateWelcomeScreenUIConstraints({
                        [WELCOME_SCREEN_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Sucess"
                        },
                        [WELCOME_SCREEN_DATA]: res.data,
                        [WELCOME_SCREEN_REQEUST_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateWelcomeScreenUIConstraints({
                        [WELCOME_SCREEN_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [WELCOME_SCREEN_REQEUST_LOADING]: false
                    }))
                }
            } catch (error) {
                Utils.log("Welcome Screen response ===> error", error);
                dispatch(updateWelcomeScreenUIConstraints({
                    [WELCOME_SCREEN_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [WELCOME_SCREEN_REQEUST_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Welcome Screen Data ===> error ", error);
        }
    }
}

/** Skip Welcome Screen data */
export const skipWelcomeScreen = () => {
    return async (dispatch, getState) => {
        try {

            //Intialize state
            await RefillStorage.storeRefillSkipWelcomeScreenData({
                [DEVICE_IS_WELCOME_SCREEN_SKIPPED]: true
            });
            dispatch(updateDeviceUIConstraints({
                [DEVICE_IS_WELCOME_SCREEN_SKIPPED]: true
            }));

        } catch (error) {
            Utils.log("Update Welcome Screen Form Data ===> error ", error);
        }
    }
}

/** Manage Welcome Screen UI Constraints */
export const updateWelcomeScreenUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[WELCOME_SCREEN_ROOT][WELCOME_SCREEN_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateWelcomeScreenState(data));
        } catch (error) {
            Utils.log("Update Welcome Sreen UI Constraints ===> error ", error);
        }
    }
}

/** Update welcome screen data state */
const updateWelcomeScreenState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[WELCOME_SCREEN_ROOT][WELCOME_SCREEN_KEY];

            dispatch({
                type: WELCOME_SCREEN_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Welcome Screen State ===> error ", error);
        }
    }
}

/** Welcome screen data state */
export const resetWelcomeScreenState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: WELCOME_SCREEN_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Welcome Screen State ===> error ", error);
        }
    }
}