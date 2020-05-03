import Utils from "../../common/util/Utils";
import { refillProductDetail, refillPlaceOrderEstimate, refillPlaceOrder, refillCancelOrder, refillSkipOrder, refillgetOrderNow } from "../../apis/APIs";
import { PRODUCT_DETAIL_RESET, PRODUCT_DETAIL_ROOT, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_UPDATE, PRODUCT_DETAIL_REQUEST_STATUS, STATUS, MESSAGE, EMPTY, PRODUCT_DETAIL_REQUEST_LOADING, PRODUCT_DETAIL_FORM, SUCCESS, SERVER_NOT_AUTHORIZED, ERROR, USER_ROOT, USER_KEY, USER_DATA, PRODUCT_DETAIL_REQUEST_DATA, PRODUCT_DETAIL_FORM_ORDER_TYPE, CUSTOM_ORDER, PRODUCT_DETAIL_FORM_ORDER_START_DATE, PRODUCT_DETAIL_FORM_ORDER_END_DATE, SERVER_SUCCESS, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING, SERVER_VALIDATION_ERROR, PRODUCT_DETAIL_FORM_ORDER_CARD_ID, PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES, PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING, SERVER_NO_VALUE, PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS, PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING, PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING, PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING, PRODUCT_DETAIL_ORDERS_REFILL_DATA, PRODUCT_DETAIL_FORM_ORDER_QUANTITY, PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER, PRODUCT_DETAIL_SCREEN, PRODUCT_DETAIL_ORDERS_IS_REFILL } from "../Types";
import NavigationService from "../../NavigationService";

/** Order estimate data */
export const orderEstimateData = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const form_data = product_info && product_info[PRODUCT_DETAIL_FORM] ? product_info[PRODUCT_DETAIL_FORM] : {};
            const product_detail = product_info && product_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_info[PRODUCT_DETAIL_REQUEST_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: true,
                [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: []
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false
                }));

                return;
            }

            const order_type = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] : "";
            const quantity = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] ? form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] : 1;
            const orderDate = order_type === CUSTOM_ORDER ? form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] : [form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE], form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE]];
            let discount = product_detail && product_detail.discount && product_detail.discount.value ? product_detail.discount.value : 0;
            const discount_end_date = product_detail && product_detail.discount && product_detail.discount.end_date ? product_detail.discount.end_date : "";

            if (discount_end_date && new Date(discount_end_date) <= new Date()) {
                discount = 0;
            }

            let totalPrice = product_detail.refillPrice - (product_detail.refillPrice * (discount / 100));
            totalPrice = totalPrice * quantity;

            const body = {
                "user_token": user_data.user_token,
                "product_id": product_detail._id,
                "totalPrice": totalPrice,
                "discount": discount,
                "orderDate": orderDate,
                "orderType": Utils.orderType(order_type),
                "quantity": quantity
            }

            try {
                const res = await refillPlaceOrderEstimate(body);
                Utils.log("Order Estimate response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: res.data,
                        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Order Estimate response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Order Estimate Form Data ===> error ", error);
        }
    }
}

/** Product detail */
export const orderDetail = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const form_data = product_info && product_info[PRODUCT_DETAIL_FORM] ? product_info[PRODUCT_DETAIL_FORM] : {};
            const product_detail = product_info && product_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_info[PRODUCT_DETAIL_REQUEST_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_REQUEST_LOADING]: true,
                [PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST]: []
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING]: false
                }));

                return;
            }

            const body = {
                "user_token": user_data.user_token,
                "product_id": product_detail._id
            }

            try {
                const res = await refillProductDetail(body);
                Utils.log("Product Detail response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_REQUEST_DATA]: res.data,
                        [PRODUCT_DETAIL_ORDERS_IS_REFILL]: false,
                        [PRODUCT_DETAIL_REQUEST_LOADING]: false
                    }));    

                    NavigationService.navigate(PRODUCT_DETAIL_SCREEN, {
                        y0: 100
                    })

                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_REQUEST_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Product Detail response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_REQUEST_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Product Detail Form Data ===> error ", error);
        }
    }
}

/** Validate card list form */
export const validateCardListForm = (cb = () => { }) => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const form_data = product_info && product_info[PRODUCT_DETAIL_FORM] ? product_info[PRODUCT_DETAIL_FORM] : {};
            const card_id = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_CARD_ID] ? form_data[PRODUCT_DETAIL_FORM_ORDER_CARD_ID] : "";

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                }
            }));

            console.log("card_id ===> ", card_id);
            if (!card_id) {
                setTimeout(() => {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: "Please select a card."
                        }
                    }));
                }, 500);

                cb(false);
                return;
            }

            cb(true);
        } catch (error) {
            Utils.log("Update Order Estimate Form Data ===> error ", error);
        }
    }
}

/** Place Order */
export const placeOrder = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const form_data = product_info && product_info[PRODUCT_DETAIL_FORM] ? product_info[PRODUCT_DETAIL_FORM] : {};
            const product_detail = product_info && product_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_info[PRODUCT_DETAIL_REQUEST_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING]: false
                }));

                return;
            }

            const order_type = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] ? form_data[PRODUCT_DETAIL_FORM_ORDER_TYPE] : "";
            const quantity = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] ? form_data[PRODUCT_DETAIL_FORM_ORDER_QUANTITY] : 1;
            const orderDate = order_type === CUSTOM_ORDER ? form_data[PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES] : [form_data[PRODUCT_DETAIL_FORM_ORDER_START_DATE], form_data[PRODUCT_DETAIL_FORM_ORDER_END_DATE]];
            let discount = product_detail && product_detail.discount && product_detail.discount.value ? product_detail.discount.value : 0;
            const discount_end_date = product_detail && product_detail.discount && product_detail.discount.end_date ? product_detail.discount.end_date : "";

            if (discount_end_date && new Date(discount_end_date) <= new Date()) {
                discount = 0;
            }

            let totalPrice = product_detail.refillPrice - (product_detail.refillPrice * (discount / 100));
            totalPrice = totalPrice * quantity;

            const body = {
                "user_token": user_data.user_token,
                "product_id": product_detail._id,
                "totalPrice": totalPrice,
                "quantity": quantity,
                "discount": discount,
                "orderDate": orderDate,
                "orderType": Utils.orderType(order_type)
            }

            try {
                Utils.log("Place Order Response ===> ", body);
                const res = await refillPlaceOrder(body);
                Utils.log("Place Order Response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Plase Order Response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Place Order Data ===> error ", error);
        }
    }
}

/** Order cancel order */
export const cancelOrder = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const order = product_info && product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] ? product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING]: false
                }));

                return;
            }

            const body = {
                "user_token": user_data.user_token,
                "uuid": order.uuid
            }

            try {
                const res = await refillCancelOrder(body);
                Utils.log("Order Cancel response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Order Cancel response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Order Cancel Data ===> error ", error);
        }
    }
}

/** Order skip order */
export const skipOrder = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const order = product_info && product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] ? product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING]: false
                }));

                return;
            }

            const body = {
                "user_token": user_data.user_token,
                "order_id": order._id
            }

            try {
                const res = await refillSkipOrder(body);
                Utils.log("Order Skip response ===> ", res, order);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Order Skip response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Order Skip Data ===> error ", error);
        }
    }
}

/** Order get order now */
export const getOrderNow = () => {
    return async (dispatch, getState) => {
        try {
            const product_info = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const order = product_info && product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] ? product_info[PRODUCT_DETAIL_ORDERS_REFILL_DATA] : {};

            const user_data_info = getState()[USER_ROOT][USER_KEY];
            const user_data = user_data_info && user_data_info[USER_DATA] ? user_data_info[USER_DATA] : {};

            //Intialize state
            dispatch(updateProductDetailUIConstraints({
                [PRODUCT_DETAIL_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING]: true
            }));

            if (!user_data.user_token) {
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "User token not found, please try again."
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING]: false
                }));

                return;
            }

            const body = {
                "user_token": user_data.user_token,
                "order_id": order._id,
                "order_date": new Date("12-01-2020").toISOString(),
                "is_skip": product_info[PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER]
            }

            try {
                const res = await refillgetOrderNow(body);
                Utils.log("Order Get Now response ===> ", res, body);
                if (res && res.message === SERVER_SUCCESS) {
                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "Success"
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING]: false
                    }));
                } else {
                    const _res = res && res.length ? res[0] : res;
                    let message = "";
                    switch (_res.message) {
                        case SERVER_VALIDATION_ERROR:
                            message = res && res.data && res.data.message ? res.data.message : "";

                            if (!message) {
                                message = res && res.emptyKeys.length ? res.emptyKeys[0].message : "";
                            }

                            if (!message) {
                                message = "Validation Error, Please try again";
                            }
                            break;
                        case ERROR:
                            message = "Error, Please try again";
                            break;
                        case SERVER_NO_VALUE:
                            message = res && res.data && res.data.message ? res.data.message : "Error, Please try again";
                            break;
                        default:
                            message = "Internal server error, please try again";
                    }

                    dispatch(updateProductDetailUIConstraints({
                        [PRODUCT_DETAIL_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: message
                        },
                        [PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING]: false
                    }));
                }
            } catch (error) {
                Utils.log("Get Order Now Response ===> error", error);
                dispatch(updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: "Please try again"
                    },
                    [PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING]: false
                }));
            }
        } catch (error) {
            Utils.log("Update Get Order Now Data ===> error ", error);
        }
    }
}

/** Manage Product Detail Form Data */
export const updateProductDetailFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const data = Object.assign(formData[PRODUCT_DETAIL_FORM], obj);

            dispatch(updateProductDetailState(Object.assign(formData, {
                [PRODUCT_DETAIL_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Product Detail Form Data ===> error ", error);
        }
    }
}

/** Manage Product Detail UI Constraints */
export const updateProductDetailUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateProductDetailState(data));
        } catch (error) {
            Utils.log("Update Home UI Constraints ===> error ", error);
        }
    }
}

/** Update product detail data state */
const updateProductDetailState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_DETAIL_ROOT][PRODUCT_DETAIL_KEY];

            dispatch({
                type: PRODUCT_DETAIL_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Product Detail State ===> error ", error);
        }
    }
}

/** Reset product detail data state */
export const resetProductDetailState = () => {
    return (dispatch) => {
        try {
            dispatch({
                type: PRODUCT_DETAIL_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Reset Home State ===> error ", error);
        }
    }
}