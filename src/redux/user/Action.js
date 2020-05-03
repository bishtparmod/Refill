import { gcsLogin } from '../../apis/APIs'
import Utils from '../../components/util/Utils';
import { USER_ROOT, USER_KEY, USER_UPDATE } from '../Types';

/** Manage User Data */
export const updateUserData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USER_ROOT][USER_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateUserDataState(data));
        } catch (error) {
            Utils.log("Update User Data ===> error ", error);
        }
    }
}

/** Update user data state */
const updateUserDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[USER_ROOT][USER_KEY];

            dispatch({
                type: USER_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update User Data State ===> error ", error);
        }
    }
}