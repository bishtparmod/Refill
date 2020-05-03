import Utils from '../../components/util/Utils';
import { PRODUCT_ROOT, PRODUCT_KEY, PRODUCT_UPDATE, ADD_PRODUCT_FORM, EDIT_PRODUCT_FORM, PRODUCT_RESET, ADD_PRODUCT_REQEUST_LOADING, STATUS, MESSAGE, EMPTY, ADD_PRODUCT_REQUEST_STATUS, SUCCESS, ERROR, USER_ROOT, USER_KEY, USER_DATA, TOKEN_NOT_FOUND, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_CREATED_BY, ADD_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_FORM, DELETE_PRODUCT_REQUEST_STATUS, DELETE_PRODUCT_REQEUST_LOADING, DELETE_PRODUCT_FORM_PRODUCT_ID, EXPORT_PRODUCT_REQUEST_STATUS, EXPORT_PRODUCT_REQEUST_LOADING, DISCOUNT } from '../Types';
import { refillAddProduct, refillGetProductViaId, refillEditProduct, refillDeleteProduct, refillExportAllProducts } from '../../apis/APIs';
import Download from '../../apis/Download'

/** Create Product */
export const createProduct = (obj) => {
    return (dispatch, getState) => {
        try {
            const productInfo = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const formData = productInfo[ADD_PRODUCT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            const discount= parseFloat(formData[ADD_PRODUCT_FORM_DISCOUNT]) ? parseFloat(formData[ADD_PRODUCT_FORM_DISCOUNT]) : formData[ADD_PRODUCT_FORM_DISCOUNT]
            if (!user_token) {
                dispatch(updateProductUIConstraints({
                    [ADD_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [ADD_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

             // check discount
             if(discount >=100){
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: DISCOUNT,
                            status:421
                        }
                    },
                    [EDIT_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateProductUIConstraints({
                [ADD_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [ADD_PRODUCT_REQEUST_LOADING]: true
            }));

            const body = {
                user_token,
                name: formData[ADD_PRODUCT_FORM_NAME],
                short_description: formData[ADD_PRODUCT_FORM_SHORT_DESCRIPTION],
                long_description: formData[ADD_PRODUCT_FORM_LONG_DESCRIPTION],
                images: formData[ADD_PRODUCT_FORM_UPLOADED_IMAGES],
                manufacture_at: formData[ADD_PRODUCT_FORM_MFG_DATE],
                brand: formData[ADD_PRODUCT_FORM_BRAND],
                distributor: formData[ADD_PRODUCT_FORM_DISTRIBUTOR],
                delivery_time_in_days: parseFloat(formData[ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]) ? parseFloat(formData[ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]) : formData[ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS],
                retail_price: parseFloat(formData[ADD_PRODUCT_FORM_RETAIL_PRICE]) ? parseFloat(formData[ADD_PRODUCT_FORM_RETAIL_PRICE]) : formData[ADD_PRODUCT_FORM_RETAIL_PRICE],
                refill_price: parseFloat(formData[ADD_PRODUCT_FORM_REFILL_PRICE]) ? parseFloat(formData[ADD_PRODUCT_FORM_REFILL_PRICE]) : formData[ADD_PRODUCT_FORM_REFILL_PRICE],
                notes: formData[ADD_PRODUCT_FORM_NOTES],
                discount: parseFloat(formData[ADD_PRODUCT_FORM_DISCOUNT]) ? parseFloat(formData[ADD_PRODUCT_FORM_DISCOUNT]) : formData[ADD_PRODUCT_FORM_DISCOUNT],
                alerts: formData[ADD_PRODUCT_FORM_ALERT],
                size: formData[ADD_PRODUCT_FORM_SIZE],
                code: formData[ADD_PRODUCT_FORM_CODE],
                weight: parseFloat(formData[ADD_PRODUCT_FORM_WEIGHT]) ? parseFloat(formData[ADD_PRODUCT_FORM_WEIGHT]) : formData[ADD_PRODUCT_FORM_WEIGHT],
                unit: formData[ADD_PRODUCT_FORM_UNITS],
                expiry_at: formData[ADD_PRODUCT_FORM_EXPIRY_DATE],
                pupc_gtin_code: formData[ADD_PRODUCT_FORM_PUP_GTIN_CODE],
                category_id: formData[ADD_PRODUCT_FORM_CATEGORY_ID],
                sub_category_id: formData[ADD_PRODUCT_FORM_SUB_CATEGORY_ID],
                average_life_in_days: parseFloat(formData[ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]) ? parseFloat(formData[ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]) : formData[EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS],
                quantity: parseFloat(formData[ADD_PRODUCT_FORM_QUANTITY]) ? parseFloat(formData[ADD_PRODUCT_FORM_QUANTITY]) : formData[ADD_PRODUCT_FORM_QUANTITY]
            }

            refillAddProduct(body).then(async (res) => {
                Utils.log("Refill Product Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateProductUIConstraints({
                        [ADD_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [ADD_PRODUCT_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateProductUIConstraints({
                        [ADD_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [ADD_PRODUCT_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Product Response ===> error", error);
                dispatch(updateProductUIConstraints({
                    [ADD_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [ADD_PRODUCT_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Product Form Data ===> error ", error);
            dispatch(updateProductUIConstraints({
                [ADD_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [ADD_PRODUCT_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Edit Product */
export const editProduct = (obj) => {
    return (dispatch, getState) => {
        try {
            const productInfo = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const formData = productInfo[EDIT_PRODUCT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;
            const discount =  parseFloat(formData[EDIT_PRODUCT_FORM_DISCOUNT]) ? parseFloat(formData[EDIT_PRODUCT_FORM_DISCOUNT]) : formData[EDIT_PRODUCT_FORM_DISCOUNT]

           
            if (!user_token) {
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND,
                            status:421
                        }
                    },
                    [EDIT_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }
            // check discount
            if(discount >=100){
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: {
                            message: DISCOUNT,
                            status:421
                        }
                    },
                    [EDIT_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateProductUIConstraints({
                [EDIT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [EDIT_PRODUCT_REQEUST_LOADING]: true
            }));

            const body = {
                user_token,
                product_id: formData[EDIT_PRODUCT_FORM_PRODUCT_ID],
                name: formData[EDIT_PRODUCT_FORM_NAME],
                short_description: formData[EDIT_PRODUCT_FORM_SHORT_DESCRIPTION],
                long_description: formData[EDIT_PRODUCT_FORM_LONG_DESCRIPTION],
                images: formData[EDIT_PRODUCT_FORM_UPLOADED_IMAGES],
                manufacture_at: formData[EDIT_PRODUCT_FORM_MFG_DATE],
                brand: formData[EDIT_PRODUCT_FORM_BRAND],
                distributor: formData[EDIT_PRODUCT_FORM_DISTRIBUTOR],
                delivery_time_in_days: parseFloat(formData[EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]) ? parseFloat(formData[EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]) : formData[EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS],
                retail_price: parseFloat(formData[EDIT_PRODUCT_FORM_RETAIL_PRICE]) ? parseFloat(formData[EDIT_PRODUCT_FORM_RETAIL_PRICE]) : formData[EDIT_PRODUCT_FORM_RETAIL_PRICE],
                refill_price: parseFloat(formData[EDIT_PRODUCT_FORM_REFILL_PRICE]) ? parseFloat(formData[EDIT_PRODUCT_FORM_REFILL_PRICE]) : formData[EDIT_PRODUCT_FORM_REFILL_PRICE],
                notes: formData[EDIT_PRODUCT_FORM_NOTES],
                discount: parseFloat(formData[EDIT_PRODUCT_FORM_DISCOUNT]) ? parseFloat(formData[EDIT_PRODUCT_FORM_DISCOUNT]) : formData[EDIT_PRODUCT_FORM_DISCOUNT],
                alerts: formData[EDIT_PRODUCT_FORM_ALERT],
                size: formData[EDIT_PRODUCT_FORM_SIZE],
                code: formData[EDIT_PRODUCT_FORM_CODE],
                weight: parseFloat(formData[EDIT_PRODUCT_FORM_WEIGHT]) ? parseFloat(formData[EDIT_PRODUCT_FORM_WEIGHT]) : formData[EDIT_PRODUCT_FORM_WEIGHT],
                unit: formData[EDIT_PRODUCT_FORM_UNITS],
                expiry_at: formData[EDIT_PRODUCT_FORM_EXPIRY_DATE],
                pupc_gtin_code: formData[EDIT_PRODUCT_FORM_PUP_GTIN_CODE],
                category_id: formData[EDIT_PRODUCT_FORM_CATEGORY_ID],
                sub_category_id: formData[EDIT_PRODUCT_FORM_SUB_CATEGORY_ID],
                average_life_in_days: parseFloat(formData[EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]) ? parseFloat(formData[EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]) : formData[EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS],
                quantity: parseFloat(formData[EDIT_PRODUCT_FORM_QUANTITY]) ? parseFloat(formData[EDIT_PRODUCT_FORM_QUANTITY]) : formData[EDIT_PRODUCT_FORM_QUANTITY]
            }


            refillEditProduct(body).then(async (res) => {
                Utils.log("Refill Edit Product Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateProductUIConstraints({
                        [EDIT_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [EDIT_PRODUCT_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateProductUIConstraints({
                        [EDIT_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [EDIT_PRODUCT_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Edit Product Response ===> error", error);
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [EDIT_PRODUCT_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Product Form Data ===> error ", error);
            dispatch(updateProductUIConstraints({
                [EDIT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [EDIT_PRODUCT_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Delete Product */
export const deleteProduct = (id) => {
    return (dispatch, getState) => {
        try {
            // const productInfo = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            // const formData = productInfo[DELETE_PRODUCT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateProductUIConstraints({
                    [DELETE_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [DELETE_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateProductUIConstraints({
                [DELETE_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [DELETE_PRODUCT_REQEUST_LOADING]: true
            }));

            const body = {
                user_token,
                product_id: id
            }


            refillDeleteProduct(body).then(async (res) => {
                Utils.log("Refill Delete Product Response ===> ", res);

                if (res && res.status === 200) {
                    dispatch(updateProductUIConstraints({
                        [DELETE_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: res
                        },
                        [DELETE_PRODUCT_REQEUST_LOADING]: false
                    }));
                } else {
                    dispatch(updateProductUIConstraints({
                        [DELETE_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [DELETE_PRODUCT_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Edit Product Response ===> error", error);
                dispatch(updateProductUIConstraints({
                    [DELETE_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [DELETE_PRODUCT_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Delete Product Form Data ===> error ", error);
            dispatch(updateProductUIConstraints({
                [DELETE_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [DELETE_PRODUCT_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Export Product */
export const exportProduct = () => {
    return (dispatch, getState) => {
        try {

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateProductUIConstraints({
                    [EXPORT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [EXPORT_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateProductUIConstraints({
                [EXPORT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [EXPORT_PRODUCT_REQEUST_LOADING]: true
            }));

            refillExportAllProducts(user_token).then(async (res) => {
                if (res && res.size) {
                    dispatch(updateProductUIConstraints({
                        [EXPORT_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: SUCCESS,
                            [MESSAGE]: "success"
                        },
                        [EXPORT_PRODUCT_REQEUST_LOADING]: false
                    }));

                    Download.download(res, "products.csv", "csv");
                } else {
                    dispatch(updateProductUIConstraints({
                        [EXPORT_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [EXPORT_PRODUCT_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Edit Product Response ===> error", error);
                dispatch(updateProductUIConstraints({
                    [EXPORT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [EXPORT_PRODUCT_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Delete Product Form Data ===> error ", error);
            dispatch(updateProductUIConstraints({
                [EXPORT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [EXPORT_PRODUCT_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Get product via id */
export const getProductViaID = () => {
    return (dispatch, getState) => {
        try {
            const productInfo = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const formData = productInfo[EDIT_PRODUCT_FORM];

            //User data
            const data = getState()[USER_ROOT][USER_KEY];
            const user_token = data && data[USER_DATA] && data[USER_DATA].user_token ? data[USER_DATA].user_token : undefined;

            if (!user_token) {
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: EMPTY,
                        [MESSAGE]: {
                            message: TOKEN_NOT_FOUND
                        }
                    },
                    [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false
                }));
                return;
            }

            //Intialize the request status and loading
            dispatch(updateProductUIConstraints({
                [EDIT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: EMPTY,
                    [MESSAGE]: ""
                },
                [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: true
            }));

            const body = {
                user_token,
                product_id: formData[EDIT_PRODUCT_FORM_PRODUCT_ID]
            }


            refillGetProductViaId(body).then(async (res) => {
                Utils.log("Refill Get Product Via Id Response ===> ", res);

                if (res && res.status === 200) {

                    const data = res && res.data ? res.data : {};

                    dispatch(updateProductUIConstraints({
                        [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false,
                        [EDIT_PRODUCT_IMAGES]: data.images && data.images.length ? data.images.map((ele, index) => ({ index, image: ele.image, uploaded: true })) : [],
                    }));

                    dispatch(updateEditProductFormData({
                        [EDIT_PRODUCT_FORM_NAME]: data.name,
                        [EDIT_PRODUCT_FORM_SHORT_DESCRIPTION]: data.shortDescription,
                        [EDIT_PRODUCT_FORM_LONG_DESCRIPTION]: data.longDescription,
                        [EDIT_PRODUCT_FORM_MFG_DATE]: data.manufactureAt,
                        [EDIT_PRODUCT_FORM_BRAND]: data.brand,
                        [EDIT_PRODUCT_FORM_DISTRIBUTOR]: data.distributor,
                        [EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS]: data && data.deliveryTimeInDays >= 0 ? `${data.deliveryTimeInDays}` : '',
                        [EDIT_PRODUCT_FORM_RETAIL_PRICE]: data && data.retailPrice >= 0 ? `${data.retailPrice}` : '',
                        [EDIT_PRODUCT_FORM_REFILL_PRICE]: data && data.refillPrice >= 0 ? `${data.refillPrice}` : '',
                        [EDIT_PRODUCT_FORM_NOTES]: data.notes,
                        [EDIT_PRODUCT_FORM_DISCOUNT]: data && data.discount  ? data.discount : '',
                        [EDIT_PRODUCT_FORM_ALERT]: data.alerts,
                        [EDIT_PRODUCT_FORM_SIZE]: data.size,
                        [EDIT_PRODUCT_FORM_CODE]: data.code,
                        [EDIT_PRODUCT_FORM_WEIGHT]: data && data.weight >= 0 ? `${data.weight}` : '',
                        [EDIT_PRODUCT_FORM_UNITS]: data.unit,
                        [EDIT_PRODUCT_FORM_EXPIRY_DATE]: data.expiryAt,
                        [EDIT_PRODUCT_FORM_PUP_GTIN_CODE]: data.pupcGtinCode,
                        [EDIT_PRODUCT_FORM_CATEGORY_ID]: data.categoryId,
                        [EDIT_PRODUCT_FORM_SUB_CATEGORY_ID]: data.subCategoryId,
                        [EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS]: data && data.averageLifeInDays >= 0 ? `${data.averageLifeInDays}` : '',
                        [EDIT_PRODUCT_FORM_QUANTITY]: data && data.quantity >= 0 ? `${data.quantity}` : ''
                    }));
                } else {
                    dispatch(updateProductUIConstraints({
                        [EDIT_PRODUCT_REQUEST_STATUS]: {
                            [STATUS]: ERROR,
                            [MESSAGE]: res
                        },
                        [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false
                    }));
                }
            }).catch(error => {
                Utils.log("Refill Get Product Via Id Response ===> error", error);
                dispatch(updateProductUIConstraints({
                    [EDIT_PRODUCT_REQUEST_STATUS]: {
                        [STATUS]: ERROR,
                        [MESSAGE]: ""
                    },
                    [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false
                }));
            });
        } catch (error) {
            Utils.log("Update Refill Get Product Via Id Form Data ===> error ", error);
            dispatch(updateProductUIConstraints({
                [EDIT_PRODUCT_REQUEST_STATUS]: {
                    [STATUS]: ERROR,
                    [MESSAGE]: ""
                },
                [EDIT_PRODUCT_GET_PRODUCT_REQEUST_LOADING]: false
            }));
        }
    }
}

/** Manage Add Product Form Data */
export const updateAddProductFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const data = Object.assign(formData[ADD_PRODUCT_FORM], obj);

            dispatch(updateProductState(Object.assign(formData, {
                [ADD_PRODUCT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Add Product Form Data ===> error ", error);
        }
    }
}

/** Manage Edit Product Form Data */
export const updateEditProductFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const data = Object.assign(formData[EDIT_PRODUCT_FORM], obj);

            dispatch(updateProductState(Object.assign(formData, {
                [EDIT_PRODUCT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Delete Product Form Data */
export const updateDeleteProductFormData = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const data = Object.assign(formData[DELETE_PRODUCT_FORM], obj);

            dispatch(updateProductState(Object.assign(formData, {
                [DELETE_PRODUCT_FORM]: data
            })));
        } catch (error) {
            Utils.log("Update Edit Product Form Data ===> error ", error);
        }
    }
}

/** Manage Product UI Constraints */
export const updateProductUIConstraints = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_ROOT][PRODUCT_KEY];
            const data = Object.assign(formData, obj);

            dispatch(updateProductState(data));
        } catch (error) {
            Utils.log("Update Product UI Constraints ===> error ", error);
        }
    }
}

/** Update product data state */
const updateProductState = (obj) => {
    return (dispatch, getState) => {
        try {
            const formData = getState()[PRODUCT_ROOT][PRODUCT_KEY];

            dispatch({
                type: PRODUCT_UPDATE,
                payload: Object.assign(formData, obj)
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}

/** Reset product data state */
export const resetProductState = (obj) => {
    return (dispatch, getState) => {
        try {
            dispatch({
                type: PRODUCT_RESET,
                payload: {}
            })
        } catch (error) {
            Utils.log("Update Product State ===> error ", error);
        }
    }
}