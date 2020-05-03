import { DISCOUNT_ROOT, DISCOUNT_KEY, DISCOUNT_UPDATE, DISCOUNT_RESET, DISCOUNT_FORM, DISCOUNT_REQUEST_STATUS, STATUS, EMPTY, MESSAGE, DISCOUNT_FORM_LOADING, SUCCESS, ERROR, USER_ROOT, USER_KEY, USER_DATA, OFFERS_ALL_PRODUCTS, OFFERS_ALL_CATEGORY_PRODUCTS, OFFERS_ALL_SUB_CATEGORY_PRODUCTS, DISCOUNT_DISCRIPTION, DISCOUNT_CATEGORY, DISCOUNT_SUBCATEGORY, TOKEN_NOT_FOUND, DISCOUNT_TYPE, DISCOUNT, DISCOUNT_PERCENTAGE, DISCOUNT_START_DATE, DISCOUNT_END_DATE, DISCOUNT_PRODUCT_ID, OFFERS_PRODUCT_PRODUCTS } from "../Types";
import Utils from "../../components/util/Utils";
import { refillLogin, refillMakeOffer } from "../../apis/APIs";

/** Make Offer */
export const makeOffer = (obj) => {
    return (dispatch, getState) => {
        try {
            const offerInfo = getState()[DISCOUNT_ROOT][DISCOUNT_KEY];
            const formData = offerInfo[DISCOUNT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateDiscountUIConstraints({
                    [DISCOUNT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [DISCOUNT_FORM_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateDiscountUIConstraints({
                [DISCOUNT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DISCOUNT_FORM_LOADING]: true
            }));

            let _start_date = new Date(formData[DISCOUNT_START_DATE]);
            _start_date.setHours(new Date().getHours());
            _start_date.setMinutes(new Date().getMinutes());
            _start_date.setSeconds(new Date().getSeconds(), new Date().getMilliseconds());
            
            let _end_date = new Date(formData[DISCOUNT_END_DATE]);
            _end_date.setHours(new Date().getHours());
            _end_date.setMinutes(new Date().getMinutes());
            _end_date.setSeconds(new Date().getSeconds(), new Date().getMilliseconds());
            
            let _offer_type = "";

            if (formData[DISCOUNT_TYPE] === "All") {
                _offer_type = OFFERS_ALL_PRODUCTS;
            } else if (formData[DISCOUNT_TYPE] === "Category") {
                _offer_type = OFFERS_ALL_CATEGORY_PRODUCTS;
            } else if (formData[DISCOUNT_TYPE] === "Subcategory") {
                _offer_type = OFFERS_ALL_SUB_CATEGORY_PRODUCTS;
            }else if (formData[DISCOUNT_TYPE] === "Product") {
                _offer_type = OFFERS_PRODUCT_PRODUCTS;
            }

            const body = {
                "user_token": user_token,
                "offer_type": _offer_type,
                "_sub_cateogry_id": formData[DISCOUNT_SUBCATEGORY],
                "description": formData[DISCOUNT_DISCRIPTION],
                "category_id": formData[DISCOUNT_CATEGORY],
                "discount": parseFloat(formData[DISCOUNT_PERCENTAGE]),
                "start_date": _start_date.toString(),
                "end_date": _end_date.toString(),
                "product_ids":formData[DISCOUNT_PRODUCT_ID]
            }
            refillMakeOffer(body).then(async (res) => {
                Utils.log("Refill Make Offer Response ===> ", res);
                if (res && res.status === 200) {
                    dispatch(updateDiscountUIConstraints({
                        [DISCOUNT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DISCOUNT_FORM_LOADING]: false
                    }));
                } else {
                    dispatch(updateDiscountUIConstraints({
                        [DISCOUNT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DISCOUNT_FORM_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Make Offer ===> error", error);
                dispatch(updateDiscountUIConstraints({
                    [DISCOUNT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DISCOUNT_FORM_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Make Offer Form Data ===> error ", error);
            dispatch(updateDiscountUIConstraints({
                [DISCOUNT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DISCOUNT_FORM_LOADING]: false
            }));
        }
    }
}

/** Update DISCOUNT data state */
export const updateDiscountState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DISCOUNT_ROOT][DISCOUNT_KEY];

            dispatch({
                type: DISCOUNT_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Users State ===> error ", error);
        }
    }
}

/** Reset user data state */
export const resetDiscountState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: DISCOUNT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}

/** Manage Edit DISCOUNT screen 1 Form Data */
export const updateEditDiscountFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[DISCOUNT_ROOT][DISCOUNT_KEY];
            const data = Object.assign(formData[DISCOUNT_FORM], obj);

            dispatch(updateDiscountState(Object.assign(formData, {
                [DISCOUNT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}




/** Manage DISCOUNT UI Constraints */
export const updateDiscountUIConstraints = (obj) => {
    Utils.log(obj)
    return (dispatch, getState) => {
        try {
            const formData = getState()[DISCOUNT_ROOT][DISCOUNT_KEY];
            const data = Object.assign(formData, obj);
            Utils.log(formData)
            dispatch(updateDiscountState(data));
        } catch (error) {
            Utils.log("Update Users UI Constraints ===> error ", error);
        }
    }
}

// get DISCOUNT Data
export const getDiscountviaId = (id) => {
    return (dispatch, getState) => {
        try {


        } catch (error) {
            Utils.log("errror  ===> ", error)
        }
    }
}

/** Reset Offer data state */
export const resetOfferDataState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: DISCOUNT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Reset Offer Data State ===> error ", error);
        }
    }
}