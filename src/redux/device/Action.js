import Utils from "../../common/util/Utils";
import { DEVICE_RESET, DEVICE_UPDATE, DEVICE_KEY, DEVICE_ROOT } from "../Types";

/** Manage Device UI Constraints */
export const updateDeviceUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DEVICE_ROOT][DEVICE_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateDeviceState(data));
        } catch (error) {
            Utils.log("Update Device UI Constraints ===> error ", error);
        }
    }
}

/** Update device data state */
const updateDeviceState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DEVICE_ROOT][DEVICE_KEY];

            dispatch({
                type: DEVICE_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Device State ===> error ", error);
        }
    }
}

/** Reset device data state */
export const resetDeviceState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: DEVICE_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Device State ===> error ", error);
        }
    }
}