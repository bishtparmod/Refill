import Utils from "../../common/util/Utils";
import { refillCategoryList, getCVVMonth, getCVVYear, refillSubCategoriesList, refillSearchProductList, refillSubCateegoryAllProductsList } from "../../apis/APIs";
import { HOME_RESET, HOME_UPDATE, HOME_ROOT, HOME_KEY, HOME_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, HOME_REQEUST_CATEGORY_LOADING, HOME_REQEUST_CATEGORY_DATA, SUCCESS, SERVER_VALIDATION_ERROR, LIST_CARD_REQUEST_STATUS, ERROR, SERVER_NO_VALUE, HOME_ERRORS, HOME_REQEUST_SUB_CATEGORY_DATA_LOADING, HOME_REQUEST_SEARCH_PAGE, HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE, HOME_REQUEST_SUB_CATEGORY_PAGE, HOME_REQEUST_SELECTED_CATEGORY_ID, SERVER_SUCCESS, HOME_REQEUST_SUB_CATEGORY_DATA, HOME_REQEUST_SEARCH_TEXT, HOME_REQEUST_SEARCH_DATA, HOME_REQEUST_SEARCH_DATA_LOADING, HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE, HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE_SIZE, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING, HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA, HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID, HOME_REQEUST_CATEGORY_REFRESH_LOADING, HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING, HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT, SORT_NAME_A_TO_Z, SORT_NAME_Z_TO_A, SORT_PRICE_HIGH_TO_LOW, SORT_PRICE_LOW_TO_HIGH } from "../Types";

/** List catgory home data */
export const listHomeCategoryData = (is_refresh = false) => {
    return async (dispatch, getState) => {
        try {
            const home_info = getState()[HOME_ROOT][HOME_KEY];
            const selected_category_id = home_info && home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] ? home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] : "";

            //Intialize state
            dispatch(updateHomeUIConstraints({
                [HOME_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [HOME_REQEUST_CATEGORY_LOADING]: !is_refresh,
                [HOME_REQEUST_CATEGORY_REFRESH_LOADING]: is_refresh
            }));

            let body = {
                page: 1,
                page_size: 100
            }

            try {
                const res = await refillCategoryList(body);
                Utils.log("Home Category List Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    const default_category_id = selected_category_id ? selected_category_id : res.data && res.data.length ? res.data[0]._id : undefined;
                    dispatch(updateHomeUIConstraints(Object.assign({
                        [HOME_REQEUST_CATEGORY_DATA]: res.data,
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [HOME_REQEUST_CATEGORY_LOADING]: false,
                        [HOME_REQEUST_CATEGORY_REFRESH_LOADING]: false
                    }, default_category_id ? {
                        [HOME_REQEUST_SELECTED_CATEGORY_ID]: default_category_id
                    } : null)));

                    dispatch(listSubCategoryData());
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";

                            dispatch(updateHomeUIConstraints({
                                [HOME_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [HOME_REQEUST_CATEGORY_LOADING]: false,
                                [HOME_REQEUST_CATEGORY_REFRESH_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateHomeUIConstraints({
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [HOME_REQEUST_CATEGORY_LOADING]: false,
                        [HOME_REQEUST_CATEGORY_REFRESH_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Home Category List Response ===> error", error);
                dispatch(updateHomeUIConstraints({
                    [HOME_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [HOME_REQEUST_CATEGORY_LOADING]: false,
                    [HOME_REQEUST_CATEGORY_REFRESH_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Home Category List ===> error ", error);
        }
    }
}

/** List sub category home data */
export const listSubCategoryData = () => {
    return async (dispatch, getState) => {
        try {
            const home_info = getState()[HOME_ROOT][HOME_KEY];
            const page = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PAGE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PAGE] : 1;
            const page_size = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE] : 10;
            const selected_category_id = home_info && home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] ? home_info[HOME_REQEUST_SELECTED_CATEGORY_ID] : "";

            //Intialize state
            dispatch(updateHomeUIConstraints({
                [HOME_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [HOME_REQEUST_SUB_CATEGORY_DATA_LOADING]: true
            }));

            let body = {
                category_id: selected_category_id,
                page: page,
                page_size: page_size
            }

            try {
                const res = await refillSubCategoriesList(body);
                Utils.log("Home Sub Category List Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateHomeUIConstraints({
                        [HOME_REQEUST_SUB_CATEGORY_DATA]: res.data,
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [HOME_REQEUST_SUB_CATEGORY_DATA_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";

                            dispatch(updateHomeUIConstraints({
                                [HOME_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [HOME_REQEUST_SUB_CATEGORY_DATA_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateHomeUIConstraints({
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [HOME_REQEUST_SUB_CATEGORY_DATA_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Home Category List Response ===> error", error);
                dispatch(updateHomeUIConstraints({
                    [HOME_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [HOME_REQEUST_SUB_CATEGORY_DATA_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Home Category List ===> error ", error);
        }
    }
}

/** Search list */
export const listSearchTextData = () => {
    return async (dispatch, getState) => {
        try {
            const home_info = getState()[HOME_ROOT][HOME_KEY];
            const page = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PAGE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PAGE] : 1;
            const page_size = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE] : 10;
            const search_text = home_info && home_info[HOME_REQEUST_SEARCH_TEXT] ? home_info[HOME_REQEUST_SEARCH_TEXT] : "";

            //Intialize state
            dispatch(updateHomeUIConstraints({
                [HOME_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [HOME_REQEUST_SEARCH_DATA_LOADING]: true
            }));

            let body = {
                search: search_text,
                page: page,
                page_size: page_size
            }

            try {
                const res = await refillSearchProductList(body);
                Utils.log("Home Search List Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateHomeUIConstraints({
                        [HOME_REQEUST_SEARCH_DATA]: res.data,
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [HOME_REQEUST_SEARCH_DATA_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";

                            dispatch(updateHomeUIConstraints({
                                [HOME_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [HOME_REQEUST_SEARCH_DATA_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateHomeUIConstraints({
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [HOME_REQEUST_SEARCH_DATA_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Home Search List Response ===> error", error);
                dispatch(updateHomeUIConstraints({
                    [HOME_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [HOME_REQEUST_SEARCH_DATA_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Home Search List ===> error ", error);
        }
    }
}

/** Sub Category Product list */
export const listSubCategoryProductsListData = (is_refresh = false) => {
    return async (dispatch, getState) => {
        try {
            const home_info = getState()[HOME_ROOT][HOME_KEY];
            const page = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE] : 1;
            const page_size = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE_SIZE] ? home_info[HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE_SIZE] : 10;
            const category_id = home_info && home_info[HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID] ? home_info[HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID] : "";
            const sub_category_id = home_info && home_info[HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID] ? home_info[HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID] : "";
            const selected_sort = home_info && home_info[HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT] ? home_info[HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT] : "";

            //Intialize state
            dispatch(updateHomeUIConstraints({
                [HOME_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING]: !is_refresh,
                [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING]: is_refresh
            }));

            let sortQuery = {};

            switch (selected_sort) {
                case SORT_NAME_A_TO_Z:
                    sortQuery = { name_sorting: 'asc' }
                    break;
                case SORT_NAME_Z_TO_A:
                    sortQuery = { name_sorting: 'dsc' }
                    break;
                case SORT_PRICE_LOW_TO_HIGH:
                    sortQuery = { price_sorting: 'asc' }
                    break;
                case SORT_PRICE_HIGH_TO_LOW:
                    sortQuery = { price_sorting: 'dsc' }
                    break;
            }


            let body = {
                category_id: category_id,
                sub_category_id: sub_category_id,
                page: page,
                page_size: page_size
            }

            try {
                const res = await refillSubCateegoryAllProductsList(Object.assign(body, sortQuery));
                Utils.log("Home Sub Category Product List Response ===> ", res, Object.assign(body, sortQuery));
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateHomeUIConstraints({
                        [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA]: res.data,
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING]: false,
                        [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = "Validation error, please try again";

                            dispatch(updateHomeUIConstraints({
                                [HOME_REQUEST_STATUS]: {
                                    [STATUS]: ERROR,
                                    [MESSAGE]: message
                                },
                                [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING]: false,
                                [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING]: false
                            }));

                            return;
                        case SERVER_NO_VALUE:
                            message = "No record found, please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateHomeUIConstraints({
                        [HOME_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING]: false,
                        [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Home Sub Category Product List Response ===> error", error);
                dispatch(updateHomeUIConstraints({
                    [HOME_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again."
                    },
                    [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING]: false,
                    [HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING]: false
                }))
            }
        } catch (error) {
            Utils.log("Update Home Sub Category Product List ===> error ", error);
        }
    }
}

/** Select catgory id */
export const selectCategoryId = (id) => {
    return async (dispatch, getState) => {
        try {

            dispatch(updateHomeUIConstraints({
                [HOME_REQEUST_SELECTED_CATEGORY_ID]: id
            }));

            dispatch(listSubCategoryData());

        } catch (error) {
            Utils.log("Update Home Category List ===> error ", error);
        }
    }
}

/** Manage Home UI Constraints */
export const updateHomeUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[HOME_ROOT][HOME_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateHomeState(data));
        } catch (error) {
            Utils.log("Update Home UI Constraints ===> error ", error);
        }
    }
}

/** Update home data state */
const updateHomeState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[HOME_ROOT][HOME_KEY];

            dispatch({
                type: HOME_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Home State ===> error ", error);
        }
    }
}

/** Reset home data state */
export const resetHomeState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: HOME_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Home State ===> error ", error);
        }
    }
}