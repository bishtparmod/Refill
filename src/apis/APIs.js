import AppConfig from '../configs/AppConfig'
import Utils from '../components/util/Utils';
import moment from 'moment-timezone'
import md5 from 'md5'
import S3FileUpload from 'react-s3';

const RESOURCE_URL = AppConfig.base_url;
const APP_KEY = AppConfig.app_key;

//AWS Product config
const config = {
    bucketName: 'refillphotos',
    dirName: 'product',
    region: 'us-east-1',
    accessKeyId: 'AKIA2LJKHUXPGBFZ6ZOY',
    secretAccessKey: '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',
}

// Aws user config
const configUser = {
    bucketName: 'refillphotos',
    dirName: 'user',
    region: 'us-east-1',
    accessKeyId: 'AKIA2LJKHUXPGBFZ6ZOY',
    secretAccessKey: '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',
}

// Aws chat config
const configChat = {
    bucketName: 'refillphotos',
    dirName: 'chat',
    region: 'us-east-1',
    accessKeyId: 'AKIA2LJKHUXPGBFZ6ZOY',
    secretAccessKey: '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',
}

/**
 * Get authorization token
 */
export const getAuthoriztionToken = () => {
    return md5(`${APP_KEY}${md5(moment(new Date()).tz('America/New_York').format('DD-MM-YYYY'))}`);
}

const headers = new Headers({
    'content-type': 'application/json',
    'Authorization': getAuthoriztionToken()
});

const POST = (baseUrl, endpoint, body) => fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
    .then(Utils.verifyResponse);

const PUT = (baseUrl, endpoint, body) => fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
    })
    .then(Utils.verifyResponse);

const DELETE = (baseUrl, endpoint, body) => fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify(body)
    })
    .then(Utils.verifyResponse);

const GET = (baseUrl, endpoint) => fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers
    })
    .then(Utils.verifyResponse);

export const refillLogin = (body) =>
    POST(RESOURCE_URL, `/login`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillSessionLogin = (body) =>
    POST(RESOURCE_URL, `/session_login`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillLogout = (body) =>
    POST(RESOURCE_URL, `/logout`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillChangePassword = (body) =>
    POST(RESOURCE_URL, `/change_password`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillForgotPassword = (body) =>
    POST(RESOURCE_URL, `/forgot_password`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillResetPassword = (body) =>
    POST(RESOURCE_URL, `/reset_password`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillAddCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillAddSubCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillEnableCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category/enable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDisableCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category/disable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillEnableSubCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category/enable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDisableSubCategory = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category/disable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillAddProduct = (body) =>
    POST(RESOURCE_URL, `/admin/product`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillGetProductViaId = (body) =>
    POST(RESOURCE_URL, `/admin/product/get_product_via_id`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillGetUserViaId = (body) =>
    POST(RESOURCE_URL, `/admin/user/view`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillUserEdit = (body) =>
    POST(RESOURCE_URL, `/admin/user/edit`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillGetCategoryViaId = (body) =>
    POST(RESOURCE_URL, `/admin/category/get_via_id`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
    
export const refillGetSubCategoryViaId = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category/get_via_id`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillEditProduct = (body) =>
    PUT(RESOURCE_URL, `/admin/product`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDeleteProduct = (body) =>
    DELETE(RESOURCE_URL, `/admin/product`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillEnableUser = (body) =>
    POST(RESOURCE_URL, `/admin/user/enable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDisableUser = (body) =>
    POST(RESOURCE_URL, `/admin/user/disable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillExportAllProducts = (token) =>
    GET(RESOURCE_URL, `/admin/product/export_all_products?user_token=${token}`)
    .then(response => response.blob())
    .catch(Utils.handleError);

export const refillExportAllUsers = (token) =>
    GET(RESOURCE_URL, `/admin/export_all_users?user_token=${token}`)
    .then(response => response.blob())
    .catch(Utils.handleError);

export const refillProductUploadFile = (file) =>
    S3FileUpload
    .uploadFile(file, Object.assign(config, {
        dirName: 'product'
    }))
export const refillUserUploadFile = (file) =>
    S3FileUpload
    .uploadFile(file, Object.assign(configUser, {
        dirName: 'user'
    }))
export const refillChatUploadFile = (file) =>
    S3FileUpload
    .uploadFile(file, Object.assign(configChat, {
        dirName: 'chat'
    }))

export const refillAddDriver = (body) =>
    POST(RESOURCE_URL, `/admin/driver`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillEditDriver = (body) =>
    POST(RESOURCE_URL, `/admin/driver/edit`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillViewDriver = (body) =>
    POST(RESOURCE_URL, `/admin/driver/view`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDriverEnable = (body) =>
    POST(RESOURCE_URL, `/admin/user/enable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDriverDisable = (body) =>
    POST(RESOURCE_URL, `/admin/user/disable`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillOrderView = (body) =>
    POST(RESOURCE_URL, `/order/view`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillOrderCancel = (body) =>
    POST(RESOURCE_URL, `/order/cancel`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
export const refillOrderRefillCancel = (body) =>
    POST(RESOURCE_URL, `/order/cancel_refill`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillOrderApprove = (body) =>
    POST(RESOURCE_URL, `/order/process`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillOrderSkip = (body) =>
    POST(RESOURCE_URL, `/order/skip`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillOrderShip = (body) =>
    POST(RESOURCE_URL, `/order/shipped`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
    
export const getLatlong = (inputQuery) => {
    return fetch(`http://18.191.114.9:5000/v0/api/maps/api/place/findplacefromtext/json?inputQuery=${inputQuery}&fields=formatted_address,geometry`, {
        headers
    })
    .then(response => response.json())
        .catch(Utils.handleError);
}

export const refillMakeOffer = (body) =>
    POST(RESOURCE_URL, `/offer`, body)
        .then(response => response.json())
        .catch(Utils.handleError);


// Content list api
export const refillContentList = (body) =>
    POST(RESOURCE_URL, `/content/list`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillContent = (body) =>
    POST(RESOURCE_URL, `/content`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDeliveryChargeList = (body) =>
    POST(RESOURCE_URL, `/charges/list`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillSalesTax = (body) =>
    POST(RESOURCE_URL, `/charges/sales_tax`, body)
    .then(response => response.json())
    .catch(Utils.handleError);

export const refillDeliveryCharge = (body) =>
    POST(RESOURCE_URL, `/charges/delivery_charges`, body)
    .then(response => response.json())
    .catch(Utils.handleError);
/** Data tables api names */

export const getCategoriesDataTables = () => `${RESOURCE_URL}/admin/category/list`;
export const getSubCategoriesDataTables = () => `${RESOURCE_URL}/admin/category/sub_category/list`;
export const getCategoriesWithSearch = () => `${RESOURCE_URL}/admin/category`;
export const getSubCategoriesWithSearch = () => `${RESOURCE_URL}/admin/category/sub_category`;
export const getProductsDataTables = () => `${RESOURCE_URL}/admin/product/list`;
export const getUsersDataTables = () => `${RESOURCE_URL}/admin/users/list`;
export const getDriverDataTables = () => `${RESOURCE_URL}/admin/driver/list`
export const getOrderDataTables = () => `${RESOURCE_URL}/order/list`
export const getDriverWithSearch = () => `${RESOURCE_URL}/admin/driver/search`;

/** ------------------------------------------- */