import { REPORT_RESET,LOG_OUT, REPORT_UPDATE, REPORT_END_DATE, REPORT_START_DATE, REPORT_KEY } from "../Types"

const INITIAL_STATE={
    [REPORT_KEY]:{
       [REPORT_END_DATE]:"",
       [REPORT_START_DATE]:""
    }
}

const Reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_UPDATE:
            return { ...state, [REPORT_KEY]: action.payload }
        case REPORT_RESET:
        case LOG_OUT:
            return {
                ...state,
                [REPORT_KEY]: {
                    [REPORT_END_DATE]:"",
                    [REPORT_START_DATE]:""
                }
            }
        default:
            return state;
    }
}

export default Reducer;