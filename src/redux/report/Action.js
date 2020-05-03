import { REPORT_ROOT, REPORT_KEY, REPORT_UPDATE, REPORT_RESET, EDIT_REPORT_FORM } from "../Types";
import Utils from "../../components/util/Utils";

/** Update REPORT data state */
export const updateReportState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[REPORT_ROOT][REPORT_KEY];

            dispatch({
                type: REPORT_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetReportState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: REPORT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}


/** Manage Edit User Form Data */
export const updateEditReportFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[REPORT_ROOT][REPORT_KEY];
            // const data = Object.assign(formData[EDIT_REPORT_FORM], obj);

            dispatch(updateReportState(Object.assign(formData, {
                
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Report UI Constraints */
export const updateReportUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[REPORT_ROOT][REPORT_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateReportState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

// get Report Data
export const getReportviaId = (id) =>{
    return(dispatch,getState) => {
        try{
            
            
        }catch(error){
            Utils.log("errror  ===> ",error)
        }
    }
}