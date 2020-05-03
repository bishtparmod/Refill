import { SPLASH_RESET,LOG_OUT, SPLASH_UPDATE, SPLASH_KEY, SPLASH_FORM1, SPLASH_FORM_LOADING1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_ERROR, SPLASH_TITLE1, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_CONTENT2, SPLASH_FORM_LOADING2, SPLASH_TITLE3, SPLASH_FORM_LOADING3, SPLASH_CONTENT3, SPLASH_IMAGE1, SPLASH_IMAGE2, SPLASH_IMAGE3, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR2, SPLASH_FORM_ERROR3, SPLASH_ID1, SPLASH_ID2, SPLASH_ID3, SPLASH_IMAGE1_FILE, SPLASH_IMAGE1_LOADING, SPLASH_IMAGE2_FILE, SPLASH_IMAGE2_LOADING, SPLASH_IMAGE3_FILE, SPLASH_IMAGE3_LOADING } from "../Types"

const INITIAL_STATE={
    [SPLASH_KEY]:{
        [SPLASH_FORM1]:{
           [SPLASH_ID1]:"",
           [SPLASH_TITLE1]:"",
           [SPLASH_CONTENT1]:"",
           [SPLASH_IMAGE1]:"",
           [SPLASH_IMAGE1_FILE]:"",
           [SPLASH_IMAGE1_LOADING]:false,
           [SPLASH_FORM_LOADING1]:false,
        },

        [SPLASH_FORM2]:{
            [SPLASH_ID2]:"",
            [SPLASH_TITLE2]:"",
            [SPLASH_CONTENT2]:"",
            [SPLASH_IMAGE2]:"",
            [SPLASH_IMAGE2_FILE]:"",
            [SPLASH_IMAGE2_LOADING]:false,
            [SPLASH_FORM_LOADING2]:false,
        },

        [SPLASH_FORM3]:{
            [SPLASH_ID3]:"",
            [SPLASH_TITLE3]:"",
            [SPLASH_CONTENT3]:"",
            [SPLASH_IMAGE3]:"",
            [SPLASH_IMAGE3_FILE]:"",
            [SPLASH_IMAGE3_LOADING]:false,
            [SPLASH_FORM_LOADING3]:false,
        },

        [SPLASH_FORM_ERROR1]:[],
        [SPLASH_FORM_ERROR2]:[],
        [SPLASH_FORM_ERROR3]:[],
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SPLASH_UPDATE:
            return { ...state, [SPLASH_KEY]: action.payload }
        case SPLASH_RESET:
        case LOG_OUT:
            return {
                ...state,
                [SPLASH_KEY]: {
                    [SPLASH_FORM1]:{
                        [SPLASH_ID1]:"",
                        [SPLASH_TITLE1]:"",
                        [SPLASH_CONTENT1]:"",
                        [SPLASH_IMAGE1]:"",
                        [SPLASH_IMAGE1_FILE]:"",
                        [SPLASH_IMAGE1_LOADING]:false,
                        [SPLASH_FORM_LOADING1]:false,
                     },
             
                     [SPLASH_FORM2]:{
                        [SPLASH_ID2]:"",
                         [SPLASH_TITLE2]:"",
                         [SPLASH_CONTENT2]:"",
                         [SPLASH_IMAGE2]:"",
                         [SPLASH_IMAGE2_FILE]:"",
                         [SPLASH_IMAGE2_LOADING]:false,
                         [SPLASH_FORM_LOADING2]:false,
                     },
             
                     [SPLASH_FORM3]:{
                        [SPLASH_ID3]:"",
                         [SPLASH_TITLE3]:"",
                         [SPLASH_CONTENT3]:"",
                         [SPLASH_IMAGE3]:"",
                         [SPLASH_IMAGE3_FILE]:"",
                         [SPLASH_IMAGE3_LOADING]:false,
                         [SPLASH_FORM_LOADING3]:false,
                     },
                     
                     [SPLASH_FORM_ERROR1]:[],
                     [SPLASH_FORM_ERROR2]:[],
                     [SPLASH_FORM_ERROR3]:[],
                }
            }
        default:
            return state;
    }
}

export default Reducer;