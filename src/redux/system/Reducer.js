import { SYSTEM_DATA_KEY, SYSTEM_DATA_IS_AUTHENTICATED, SYSTEM_DATA_UPDATE, LOG_OUT, SYSTEM_DATA_PAGE_TITLE } from "../Types";

const INITIAL_STATE = {
    [SYSTEM_DATA_KEY]: {
        [SYSTEM_DATA_IS_AUTHENTICATED]: false,
        [SYSTEM_DATA_PAGE_TITLE]: ""
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SYSTEM_DATA_UPDATE:
            return { ...state, [SYSTEM_DATA_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [SYSTEM_DATA_KEY]: {
                    [SYSTEM_DATA_IS_AUTHENTICATED]: false
                }
            }
        default:
            return state;
    }
}

export default Reducer;