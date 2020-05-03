import { SPLASH_ROOT, SPLASH_KEY, SPLASH_UPDATE, SPLASH_RESET, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_REQUEST_STATUS, ERROR, STATUS, MESSAGE, TOKEN_NOT_FOUND, SPLASH_REQUEST_LOADING, USER_ROOT, USER_DATA, USER_KEY, SPLASH_ID1, SPLASH_ID2, SPLASH_ID3, SPLASH_TITLE1, SPLASH_CONTENT1, SPLASH_CONTENT2, SPLASH_TITLE2, SPLASH_CONTENT3, SPLASH_IMAGE3, SPLASH_IMAGE2, SPLASH_IMAGE1, SPLASH_TITLE3, SUCCESS, EMPTY, SPLASH_FORM_LOADING1, SPLASH_FORM_LOADING2, SPLASH_FORM_LOADING3 } from "../Types";
import Utils from "../../components/util/Utils";
import { refillContentList, refillContent } from "../../apis/APIs";
import { ToastsStore } from 'react-toasts'

/** Update SPLASH data state */
export const updateSplashState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SPLASH_ROOT][SPLASH_KEY];

            dispatch({
                type: SPLASH_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetSplashState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: SPLASH_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}

/** Manage Edit splash screen 1 Form Data */
export const updateEditSplashForm3Data = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SPLASH_ROOT][SPLASH_KEY];
            const data = Object.assign(formData[SPLASH_FORM3], obj);

            dispatch(updateSplashState(Object.assign(formData, {
                [SPLASH_FORM3]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Edit splash screen 1 Form Data */
export const updateEditSplashForm2Data = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SPLASH_ROOT][SPLASH_KEY];
            const data = Object.assign(formData[SPLASH_FORM2], obj);

            dispatch(updateSplashState(Object.assign(formData, {
                [SPLASH_FORM2]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}


/** Manage Edit splash screen 1 Form Data */
export const updateEditSplashForm1Data = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[SPLASH_ROOT][SPLASH_KEY];
            const data = Object.assign(formData[SPLASH_FORM1], obj);

            dispatch(updateSplashState(Object.assign(formData, {
                [SPLASH_FORM1]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage SPLASH UI Constraints */
export const updateSplashUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[SPLASH_ROOT][SPLASH_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateSplashState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

// get Splash Data
export const getSplashviaId = () =>{
    return(dispatch,getState) => {
        try{
           //User data
           const data = getState()[USER_ROOT][USER_KEY];
           const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
          
           if (!user_token) {
               dispatch(updateSplashUIConstraints({
                   [SPLASH_REQUEST_STATUS]: {
                       [STATUS]: ERROR,
                       [MESSAGE]: {
                           message: TOKEN_NOT_FOUND,
                           status:421
                       }
                   },
                   [SPLASH_REQUEST_LOADING]: false
               }));
               return;
           }  

           refillContentList({user_token:user_token}).then((res)=>{
                Utils.log("spalsh screen data ====   >",res)
                if(res && res.status === 200){
                    const data = res && res.data
                    dispatch(updateEditSplashForm1Data({
                        [SPLASH_ID1] : data && data[0]._id ? data[0]._id :"",
                        [SPLASH_TITLE1]:data && data[0].title ? data[0].title :"",
                        [SPLASH_CONTENT1]:data && data[0].description ? data[0].description :"",
                        [SPLASH_IMAGE1]:data && data[0].image ? data[0].image :""
                    }))
                    dispatch(updateEditSplashForm2Data({
                        [SPLASH_ID2] : data && data[1]._id ? data[1]._id : "",
                        [SPLASH_TITLE2]:data && data[1].title ? data[1].title : "",
                        [SPLASH_CONTENT2]:data && data[1].description ? data[1].description : "",
                        [SPLASH_IMAGE2]:data && data[1].image ? data[1].image : ""
                    }))
                    dispatch(updateEditSplashForm3Data({
                        [SPLASH_ID3] : data && data[2]._id ? data[2]._id :"",
                        [SPLASH_TITLE3]:data && data[2].title ? data[2].title : "",
                        [SPLASH_CONTENT3]:data && data[2].description ? data[2].description : "",
                        [SPLASH_IMAGE3]:data && data[2].image ? data[2].image : ""
                    }))
                }
           }).catch((error)=>{
                Utils.log("",error)
           })
            
        }catch(error){
            Utils.log("errror  ===> ",error)
        }
    }
}

// get upadte Splash Data
export const editSplash = (id,title,content,image) =>{
    return(dispatch,getState) => {
        try{
           
           //User data
           const data = getState()[USER_ROOT][USER_KEY];
           const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
          
           if (!user_token) {
               dispatch(updateSplashUIConstraints({
                   [SPLASH_REQUEST_STATUS]: {
                       [STATUS]: ERROR,
                       [MESSAGE]: {
                           message: TOKEN_NOT_FOUND,
                           status:421
                       }
                   },
                   [SPLASH_REQUEST_LOADING]: false
               }));
               return;
           }  

            dispatch(updateSplashUIConstraints({
                [SPLASH_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
            }));

           var body ={
                user_token:user_token,
                splash_id:id,
                title:title,
                description:content,
                image:image
           }
           refillContent(body).then((res)=>{
                Utils.log("spalsh screen data ====   > result",res)
                if(res && res.status === 200){
                    const data = res && res.data
                    dispatch(updateSplashUIConstraints({
                        [SPLASH_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: ""
                        },
                    }));
                    dispatch(updateEditSplashForm1Data({
                        [SPLASH_FORM_LOADING1]:false
                    }))
                    dispatch(updateEditSplashForm2Data({
                        [SPLASH_FORM_LOADING2]:false
                    }))
                    dispatch(updateEditSplashForm3Data({
                        [SPLASH_FORM_LOADING3]:false
                    }))
                    ToastsStore.success("Splash successfully Updated", 3000);
                }
           }).catch((error)=>{
                Utils.log("",error)
                dispatch(updateSplashUIConstraints({
                    [SPLASH_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [SPLASH_REQUEST_LOADING]: true
                }));
           })
            
        }catch(error){
            dispatch(updateSplashUIConstraints({
                [SPLASH_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SPLASH_REQUEST_LOADING]: true
            }));
            Utils.log("errror  ===> ",error)
        }
    }
}