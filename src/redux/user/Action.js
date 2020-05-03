import Utils from "../../common/util/Utils";
import { USER_ROOT, USER_KEY, USER_RESET, USER_UPDATE } from "../Types";

/** Manage User UI Constraints */
export const updateUserUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USER_ROOT][USER_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateUserState(data));
        } catch (error) {
            Utils.log("Update User UI Constraints ===> error ", error);
        }
    }
}

/** Update user data state */
const updateUserState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USER_ROOT][USER_KEY];

            dispatch({
                type: USER_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update User State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetUserState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: USER_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset User State ===> error ", error);
        }
    }
}