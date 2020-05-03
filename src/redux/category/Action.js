import { refillChangePassword, refillAddCategory, refillAddSubCategory, refillEnableCategory, refillDisableCategory, refillEnableSubCategory, refillDisableSubCategory } from '../../apis/APIs'
import Utils from '../../components/util/Utils';
import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_ROOT, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_UPDATE, USER_ROOT, USER_KEY, USER_DATA, TOKEN_NOT_FOUND, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_FORM_OLD_PASSWORD, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, SUCCESS, ERROR, CATEGORY_ROOT, CATEGORY_KEY, CATEGORY_FORM, CATEGORY_REQUEST_STATUS, CATEGORY_REQEUST_LOADING, SUB_CATEGORY_FORM_NAME, CATEGORY_FORM_NAME, CATEGORY_UPDATE, SUB_CATEGORY_FORM, SUB_CATEGORY_REQUEST_STATUS, SUB_CATEGORY_REQEUST_LOADING, CATEGORY_RESET, SUB_CATEGORY_FORM_CATEGORY_ID, DELETE_CATEGORY_REQUEST_STATUS, DELETE_PRODUCT_REQEUST_LOADING, DELETE_CATEGORY_REQEUST_LOADING, ENABLE_CATEGORY_REQUEST_STATUS, ENABLE_CATEGORY_REQEUST_LOADING, DISABLE_CATEGORY_REQUEST_STATUS, DISABLE_CATEGORY_REQEUST_LOADING, ENABLE_SUB_CATEGORY_REQUEST_STATUS, ENABLE_SUB_CATEGORY_REQEUST_LOADING, DISABLE_SUB_CATEGORY_REQUEST_STATUS, DISABLE_SUB_CATEGORY_REQEUST_LOADING } from '../Types';
import { RefillStorage } from '../../apis';

/** Create category */
export const createCategory = () => {
    return (dispatch, getState) => {
        try {
            //Form Data
            const category_data = getState()[CATEGORY_ROOT][CATEGORY_KEY];
            const formData = category_data[CATEGORY_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "name": formData[CATEGORY_FORM_NAME]
            }


            refillAddCategory(body).then(async (res) => {
                Utils.log("Refill Add Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Create sub category */
export const createSubCategory = () => {
    return (dispatch, getState) => {
        try {
            //Form Data
            const sub_category_data = getState()[CATEGORY_ROOT][CATEGORY_KEY];
            const formData = sub_category_data[SUB_CATEGORY_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [SUB_CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [SUB_CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "name": formData[SUB_CATEGORY_FORM_NAME],
                "category_id": formData[SUB_CATEGORY_FORM_CATEGORY_ID]
            }


            refillAddSubCategory(body).then(async (res) => {
                Utils.log("Refill Add Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [SUB_CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [SUB_CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Enable category */
export const enableCategory = (id) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [ENABLE_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [ENABLE_CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [ENABLE_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ENABLE_CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "category_id": id
            }


            refillEnableCategory(body).then(async (res) => {
                Utils.log("Refill Enable Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [ENABLE_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [ENABLE_CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [ENABLE_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [ENABLE_CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [ENABLE_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ENABLE_CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [ENABLE_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ENABLE_CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Disable category */
export const disableCategory = (id) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [DISABLE_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [DISABLE_CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [DISABLE_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DISABLE_CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "category_id": id
            }


            refillDisableCategory(body).then(async (res) => {
                Utils.log("Refill Enable Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [DISABLE_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DISABLE_CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [DISABLE_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DISABLE_CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [DISABLE_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DISABLE_CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [DISABLE_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DISABLE_CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Enable sub-category */
export const enableSubCategory = ({ category_id, sub_category_id }) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "category_id": category_id,
                "sub_category_id": sub_category_id
            }


            refillEnableSubCategory(body).then(async (res) => {
                Utils.log("Refill Enable Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [ENABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ENABLE_SUB_CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Disable sub-category */
export const disableSubCategory = ({ category_id, sub_category_id }) => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateCategoryUIConstraints({
                    [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateCategoryUIConstraints({
                [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: true
            }));

            const body = {
                "user_token": user_token,
                "category_id": category_id,
                "sub_category_id": sub_category_id
            }


            refillDisableSubCategory(body).then(async (res) => {
                Utils.log("Refill Enable Category Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateCategoryUIConstraints({
                        [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateCategoryUIConstraints({
                        [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Add Category ===> error", error);
                dispatch(updateCategoryUIConstraints({
                    [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Refill Add Category ===> error", error);
            dispatch(updateCategoryUIConstraints({
                [DISABLE_SUB_CATEGORY_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DISABLE_SUB_CATEGORY_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Manage Category Form Data */
export const updateCategoryFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CATEGORY_ROOT][CATEGORY_KEY];
            const data = Object.assign(formData[CATEGORY_FORM], obj);

            dispatch(updateCategoryState(Object.assign(formData, {
                [CATEGORY_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
        }
    }
}

/** Manage Sub Category Form Data */
export const updateSubCategoryFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CATEGORY_ROOT][CATEGORY_KEY];
            const data = Object.assign(formData[SUB_CATEGORY_FORM], obj);

            dispatch(updateCategoryState(Object.assign(formData, {
                [SUB_CATEGORY_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Form Data ===> error ", error);
        }
    }
}

/** Manage Category UI Constraints */
export const updateCategoryUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CATEGORY_ROOT][CATEGORY_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateCategoryState(data));
        } catch (error) {
            Utils.log("Update UI Constraints ===> error ", error);
        }
    }
}

/** Update category data state */
const updateCategoryState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[CATEGORY_ROOT][CATEGORY_KEY];

            dispatch({
                type: CATEGORY_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Login State ===> error ", error);
        }
    }
}

/** Reset category data state */
export const resetCategoryDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: CATEGORY_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Forgot State ===> error ", error);
        }
    }
}
