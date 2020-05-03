import { FOOTER_KEY, FOOTER_IS_SHOW, FOOTER_UPDATE, LOG_OUT } from "../Types";

const INITIAL_STATE = {
    [FOOTER_KEY]: {
        [FOOTER_IS_SHOW]: false
    }
};

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FOOTER_UPDATE:
            return { ...state, [FOOTER_KEY]: action.payload }
        case LOG_OUT:
            return {
                ...state,
                [FOOTER_KEY]: {
                    [FOOTER_IS_SHOW]: false
                }
            }
        default:
            return state;
    }
}

export default Reducer;