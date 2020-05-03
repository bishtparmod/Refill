import Utils from '../../components/util/Utils';
import { HEADER_ROOT, HEADER_KEY, HEADER_UPDATE } from '../Types';

/** Manage Header UI Constraints */
export const updateHeaderUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[HEADER_ROOT][HEADER_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateHeaderState(data));
        } catch (error) {
            Utils.log("Update Header UI Constraints ===> error ", error);
        }
    }
}

/** Update Header data state */
const updateHeaderState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[HEADER_ROOT][HEADER_KEY];

            dispatch({
                type: HEADER_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Header State ===> error ", error);
        }
    }
}