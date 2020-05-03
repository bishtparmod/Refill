import Utils from '../../components/util/Utils';
import { SIDEBAR_ROOT, SIDEBAR_KEY, SIDEBAR_UPDATE } from '../Types';

/** Manage Sidebar UI Constraints */
export const updateSidebarUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SIDEBAR_ROOT][SIDEBAR_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateSidebarState(data));
        } catch (error) {
            Utils.log("Update Sidebar UI Constraints ===> error ", error);
        }
    }
}

/** Update Sidebar data state */
const updateSidebarState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SIDEBAR_ROOT][SIDEBAR_KEY];

            dispatch({
                type: SIDEBAR_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Sidebar State ===> error ", error);
        }
    }
}