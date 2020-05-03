import { HEADER_KEY, HEADER_IS_SHOW, HEADER_PROPS, HEADER_UPDATE, LOG_OUT } from "../Types";

const INITIAL_STATE = {
    [HEADER_KEY]: {
        [HEADER_IS_SHOW]: false,
        [HEADER_PROPS]: undefined
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case HEADER_UPDATE:
            return { ...state, [HEADER_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [HEADER_KEY]: {
                    [HEADER_IS_SHOW]: false,
                    [HEADER_PROPS]: undefined
                }
            }
        default:
            return state;
    }
}

export default Reducer;