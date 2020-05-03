import { DRIVER_RESET,LOG_OUT, DRIVER_UPDATE, DRIVER_KEY, DRIVER_FORM, DRIVER_NAME, DRIVER_LICENSE, DRIVER_VECHILE_NAME, DRIVER_EMAIL, DRIVER_AGE, DRIVER_ADDRESS, DRIVER_VECHILE_NUMBER, DRIVER_FORM_LOADING, DRIVER_FORM_ERROR, DRIVER_IMAGE, DRIVER_UPLOAD_TOTAL_IMAGES_COUNT, DRIVER_IS_UPLOADING_IMAGES, DRIVER_FORM_UPLOADED_IMAGES, DRIVER_PHONE_NUMBER, DRIVER_REQUEST_STATUS, DRIVER_REQUEST_LOADING, EMPTY, MESSAGE, STATUS, DRIVER_EDIT_FORM, DRIVER_EDIT_LICENSE, DRIVER_EDIT_VECHILE_NAME, DRIVER_EDIT_EMAIL, DRIVER_EDIT_AGE, DRIVER_EDIT_PHONE_NUMBER, DRIVER_EDIT_ADDRESS, DRIVER_EDIT_VECHILE_NUMBER, DRIVER_EDIT_FORM_UPLOADED_IMAGES, DRIVER_EDIT_FORM_LOADING, DRIVER_EDIT_IS_UPLOADING_IMAGES, DRIVER_EDIT_NAME, DRIVER_FULL_ADDRESS, DRIVER_CITY, DRIVER_STATE, DRIVER_COUNTRY, DRIVER_LATITUDE, DRIVER_LONGITUDE, DRIVER_STREET_ADDRESS, DRIVER_ZIPCODE, DRIVER_EDIT_FULL_ADDRESS, DRIVER_EDIT_STREET_ADDRESS, DRIVER_EDIT_LONGITUDE, DRIVER_EDIT_LATITUDE, DRIVER_EDIT_COUNTRY, DRIVER_EDIT_STATE, DRIVER_EDIT_CITY, DRIVER_EDIT_ZIPCODE, DRIVER_EDIT_ID, DRIVER_PASSWORD, DRIVER_ENABLE_LOADING, DRIVER_DISABLE_LOADING, ASSIGN_DRIVER_KEY, ASSIGN_DRIVER, ASSIGN_DRIVER_LOADING, ASSIGN_DRIVER_ID, ASSIGN_DRIVER_ERROR, DRIVER_EDIT_IMAGE_UPLOADED_FILE } from "../Types"

const INITIAL_STATE={
    [DRIVER_KEY]:{
        [DRIVER_FORM]:{
            [DRIVER_NAME]:"",
            [DRIVER_LICENSE]:"",
            [DRIVER_VECHILE_NAME]:"",
            [DRIVER_EMAIL]:"",
            [DRIVER_AGE]:"",
            [DRIVER_PHONE_NUMBER]:"",
            [DRIVER_ADDRESS]:"",
            [DRIVER_FULL_ADDRESS]:"",
            [DRIVER_STREET_ADDRESS]:"",
            [DRIVER_ZIPCODE]:"",
            [DRIVER_CITY]:"",
            [DRIVER_STATE]:"",
            [DRIVER_COUNTRY]:"",
            [DRIVER_LATITUDE]:"",
            [DRIVER_LONGITUDE]:"",
            [DRIVER_PASSWORD]:"",
            [DRIVER_VECHILE_NUMBER]:"",
            [DRIVER_FORM_UPLOADED_IMAGES]:"",
            [DRIVER_FORM_LOADING]:false
        },

        [ASSIGN_DRIVER_KEY]:{
            [ASSIGN_DRIVER]:"",
            [ASSIGN_DRIVER_ID]:"",
            [ASSIGN_DRIVER_LOADING]:false
        },
        [ASSIGN_DRIVER_ERROR]:[],

        [DRIVER_EDIT_FORM]:{
            [DRIVER_EDIT_NAME]:"",
            [DRIVER_EDIT_ID]:"",
            [DRIVER_EDIT_LICENSE]:"",
            [DRIVER_EDIT_VECHILE_NAME]:"",
            [DRIVER_EDIT_EMAIL]:"",
            [DRIVER_EDIT_AGE]:"",
            [DRIVER_EDIT_PHONE_NUMBER]:"",
            [DRIVER_EDIT_ADDRESS]:"",
            [DRIVER_EDIT_VECHILE_NUMBER]:"",
            [DRIVER_EDIT_FORM_UPLOADED_IMAGES]:"",
            [DRIVER_EDIT_FULL_ADDRESS]:"",
            [DRIVER_EDIT_STREET_ADDRESS]:"",
            [DRIVER_EDIT_ZIPCODE]:"",
            [DRIVER_EDIT_CITY]:"",
            [DRIVER_EDIT_STATE]:"",
            [DRIVER_EDIT_COUNTRY]:"",
            [DRIVER_EDIT_IMAGE_UPLOADED_FILE]:"",
            [DRIVER_EDIT_LATITUDE]:"",
            [DRIVER_EDIT_LONGITUDE]:"",
            [DRIVER_EDIT_FORM_LOADING]:false
        },
        [DRIVER_FORM_ERROR]:[],

        [DRIVER_REQUEST_LOADING]: false,
        [DRIVER_REQUEST_STATUS]: {
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },

        [DRIVER_IMAGE]: [],
        [DRIVER_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
        [DRIVER_IS_UPLOADING_IMAGES]: false,
        [DRIVER_EDIT_IS_UPLOADING_IMAGES]: false,

        [DRIVER_ENABLE_LOADING] : false,
        [DRIVER_DISABLE_LOADING] : false

        
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case DRIVER_UPDATE:
            return { ...state, [DRIVER_KEY]: action.payload }
        case DRIVER_RESET:
        case LOG_OUT:
            return {
                ...state,
                [DRIVER_KEY]: {
                    [DRIVER_FORM]:{
                        [DRIVER_NAME]:"",
                        [DRIVER_LICENSE]:"",
                        [DRIVER_VECHILE_NAME]:"",
                        [DRIVER_EMAIL]:"",
                        [DRIVER_PASSWORD]:"",
                        [DRIVER_AGE]:"",
                        [DRIVER_PHONE_NUMBER]:"",
                        [DRIVER_ADDRESS]:"",
                        [DRIVER_FULL_ADDRESS]:"",
                        [DRIVER_STREET_ADDRESS]:"",
                        [DRIVER_ZIPCODE]:"",
                        [DRIVER_CITY]:"",
                        [DRIVER_STATE]:"",
                        [DRIVER_COUNTRY]:"",
                        [DRIVER_LATITUDE]:"",
                        [DRIVER_LONGITUDE]:"",
                        [DRIVER_VECHILE_NUMBER]:"",
                        [DRIVER_FORM_UPLOADED_IMAGES]:"",
                        [DRIVER_FORM_LOADING]:false
                    },


                [DRIVER_EDIT_FORM]:{
                    [DRIVER_EDIT_NAME]:"",
                    [DRIVER_EDIT_ID]:"",
                    [DRIVER_EDIT_LICENSE]:"",
                    [DRIVER_EDIT_VECHILE_NAME]:"",
                    [DRIVER_EDIT_EMAIL]:"",
                    [DRIVER_EDIT_AGE]:"",
                    [DRIVER_EDIT_PHONE_NUMBER]:"",
                    [DRIVER_EDIT_ADDRESS]:"",
                    [DRIVER_EDIT_VECHILE_NUMBER]:"",
                    [DRIVER_EDIT_FORM_UPLOADED_IMAGES]:"",
                    [DRIVER_EDIT_FULL_ADDRESS]:"",
                    [DRIVER_EDIT_STREET_ADDRESS]:"",
                    [DRIVER_EDIT_ZIPCODE]:"",
                    [DRIVER_EDIT_CITY]:"",
                    [DRIVER_EDIT_STATE]:"",
                    [DRIVER_EDIT_IMAGE_UPLOADED_FILE]:"",
                    [DRIVER_EDIT_COUNTRY]:"",
                    [DRIVER_EDIT_LATITUDE]:"",
                    [DRIVER_EDIT_LONGITUDE]:"",
                    [DRIVER_EDIT_FORM_LOADING]:false
                },
                    [DRIVER_FORM_ERROR]:[],

                    [DRIVER_REQUEST_LOADING]: false,
                    [DRIVER_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },

                    [ASSIGN_DRIVER_KEY]:{
                        [ASSIGN_DRIVER]:"",
                        [ASSIGN_DRIVER_ID]:"",
                        [ASSIGN_DRIVER_LOADING]:false
                    },

                    [ASSIGN_DRIVER_ERROR]:[],
                    
                    [DRIVER_IMAGE]: [],
                    [DRIVER_UPLOAD_TOTAL_IMAGES_COUNT]: 0,
                    [DRIVER_IS_UPLOADING_IMAGES]: false,       
                    [DRIVER_EDIT_IS_UPLOADING_IMAGES]: false, 
                    
                    [DRIVER_ENABLE_LOADING] : false,
                    [DRIVER_DISABLE_LOADING] : false
                }
            }
        default:
            return state;
    }
}

export default Reducer;