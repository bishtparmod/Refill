import { gcsLogin } from '../../apis/APIs'
import Utils from '../../components/util/Utils';
import { SYSTEM_DATA_UPDATE, SYSTEM_DATA_ROOT, SYSTEM_DATA_KEY } from '../Types';

/** Manage System Data */
export const updateSystemData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SYSTEM_DATA_ROOT][SYSTEM_DATA_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateSystemDataState(data));
        } catch (error) {
            Utils.log("Update System Data ===> error ", error);
        }
    }
}

/** Update system data state */
const updateSystemDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SYSTEM_DATA_ROOT][SYSTEM_DATA_KEY];

            dispatch({
                type: SYSTEM_DATA_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update System Data State ===> error ", error);
        }
    }
}