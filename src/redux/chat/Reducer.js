import { LOG_OUT, CHAT_KEY, CHAT_MESSAGE,CHAT_SCHEMA, CHAT_ADMIN_ID, CHAT_USER_ID, CHAT_REQUEST_STATUS, EMPTY, MESSAGE, STATUS, CHAT_UPDATE, CHAT_LOADING, CHATING_DATA, LOAD, CHAT_USER_NAME, CHAT_PHOTO, CHAT_IS_PHOTO, CHAT_PHOTO_LOADING, OPEN_MODEL, CHAT_LIST_LOADING } from "../Types";

const INITIAL_STATE = {
    [CHAT_KEY]: {
        [CHAT_SCHEMA]:{
            [CHAT_MESSAGE]: "",
            [CHAT_ADMIN_ID]:"",
            [CHAT_USER_ID]:"",
            [CHAT_LOADING]:false,
            [CHATING_DATA]:[],
            [CHAT_USER_NAME]:"",
            [CHAT_PHOTO]:"",
            [CHAT_IS_PHOTO]:false,
            [CHAT_PHOTO_LOADING]:false,
            [OPEN_MODEL]:false,
            [CHAT_LIST_LOADING]:false
        },
        [CHAT_REQUEST_STATUS]:{
            [STATUS]: EMPTY,
            [MESSAGE]: ""
        },
        
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHAT_UPDATE:
            return { ...state, [CHAT_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [CHAT_KEY]: {
                    [CHAT_SCHEMA]:{
                        [CHAT_MESSAGE]: "",
                        [CHAT_ADMIN_ID]:"",
                        [CHAT_USER_ID]:"",
                        [CHAT_LOADING]:false,
                        [CHAT_USER_NAME]:"",
                        [CHATING_DATA]:[],
                        [CHAT_PHOTO]:"",
                        [CHAT_IS_PHOTO]:false,
                        [CHAT_PHOTO_LOADING]:false,
                        [OPEN_MODEL]:false,
                        [CHAT_LIST_LOADING]:false
                    },
                    
                    [CHAT_REQUEST_STATUS]:{
                        [STATUS]: EMPTY,
                        [MESSAGE]: ""
                    },
                    
                }
            }
        default:
            return state;
    }
}

export default Reducer;