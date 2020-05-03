import AppConfig from '../configs/AppConfig'
import Utils from '../common/util/Utils';
import moment from 'moment-timezone'
import md5 from 'md5'
const APP_KEY = AppConfig.app_key;

const RESOURCE_URL = AppConfig.base_url;

/**
 * Get authorization token
 */
export const getAuthoriztionToken = () => {
    return md5(`${APP_KEY}${md5(moment(new Date()).tz('America/New_York').format('DD-MM-YYYY'))}`);
}

export const getCVVDate = (date) => date ? moment(new Date(date)).format('MM/YY') : "";
export const getCVVMonth = (date) => date ? moment(new Date(date)).format('MM') : "";
export const getCVVYear = (date) => date ? moment(new Date(date)).format('YYYY') : "";

const POST = (baseUrl, endpoint, body) => fetch(`${baseUrl}${endpoint}`, {
    method: 'POST',
    headers: new Headers({
        'content-type': 'application/json',
        'Authorization': getAuthoriztionToken()
    }),
    body: body ? JSON.stringify(Object.assign(body)) : undefined,
})
    .then(Utils.verifyResponse);

const GET = (baseUrl, endpoint) => fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: new Headers({
        'content-type': 'application/json',
        'Authorization': getAuthoriztionToken()
    })
})
    .then(Utils.verifyResponse)

export const refillSignup = (body) =>
    POST(RESOURCE_URL, `/customer/signup`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillLogin = (body) =>
    POST(RESOURCE_URL, `/customer/login`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillForgotPassword = (body) =>
    POST(RESOURCE_URL, `/customer/forgot_password`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillResetPassword = (body) =>
    POST(RESOURCE_URL, `/customer/reset_password`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSessionLogin = (body) =>
    POST(RESOURCE_URL, `/customer/session_login`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSocialLogin = (body) =>
    POST(RESOURCE_URL, `/customer/social_login`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillGetWelcomeScreens = () =>
    GET(RESOURCE_URL, `/content/list`)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillChangePassword = (body) =>
    POST(RESOURCE_URL, `/customer/change_password`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillEditBillingAndShippingAddress = (body) =>
    POST(RESOURCE_URL, `/customer/edit_billing_and_shipping_address`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillAutoCompleteLocation = (body) => {
    return fetch(`${AppConfig.locationBaseUrl}?input=${body.location}&types=establishment&radius=500&key=${AppConfig.google_key}`, {
        method: 'GET',
        headers: new Headers({
            'content-type': 'application/json',
            'Authorization': getAuthoriztionToken()
        })
    })
        .then(Utils.verifyResponse)
        .then(response => response.json())
        .catch(Utils.handleError);
}

export const refillGetLocationDetail = (body) =>
    GET(RESOURCE_URL, `${AppConfig.locationDetailBaseUrl}?input=${body.address}&inputtype=textquery&fields=formatted_address,geometry&key=${AppConfig.google_key}`)
        .then(response => response.json(body))
        .catch(Utils.handleError);

export const refillGetLocationDetailViaZipCode = (body) =>
    GET(RESOURCE_URL, `${AppConfig.locationDetailViaZipCode}?address=${body.zipCode}&key=${AppConfig.google_key}`)
        .then(response => response.json(body))
        .catch(Utils.handleError);

export const refillGetLocationDetailViaLatLng = (body) =>
    GET(RESOURCE_URL, `${AppConfig.locationDetailViaZipCode}?latlng=${body.latlng}&key=${AppConfig.google_key}`)
        .then(response => response.json(body))
        .catch(Utils.handleError);

export const refillAddCard = (body) =>
    POST(RESOURCE_URL, `/payment/createCard`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillListCard = (body) =>
    POST(RESOURCE_URL, `/payment/card_list`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillDeleteCard = (body) =>
    POST(RESOURCE_URL, `/payment/delete_card`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillCategoryList = (body) =>
    POST(RESOURCE_URL, `/admin/category/list/all`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSubCategoriesList = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_categories/list/all`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSubCategoryList = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category/list/all`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSearchProductList = (body) =>
    POST(RESOURCE_URL, `/admin/product/list/all`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSubCateegoryAllProductsList = (body) =>
    POST(RESOURCE_URL, `/admin/category/sub_category/list/all`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillPlaceOrderEstimate = (body) =>
    POST(RESOURCE_URL, `/order/place/estimate`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillPlaceOrder = (body) =>
    POST(RESOURCE_URL, `/order/place`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillOrderList = (body) =>
    POST(RESOURCE_URL, `/order/list/customer`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillNotificationList = (body) =>
    POST(RESOURCE_URL, `/notification/list`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillOrderView = (body) =>
    POST(RESOURCE_URL, `/order/view`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillCancelOrder = (body) =>
    POST(RESOURCE_URL, `/order/cancel_refill`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillSkipOrder = (body) =>
    POST(RESOURCE_URL, `/order/skip`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillgetOrderNow = (body) =>
    POST(RESOURCE_URL, `/order/get_now`, body)
        .then(response => response.json())
        .catch(Utils.handleError);

export const refillProductDetail= (body) =>
    POST(RESOURCE_URL, `/admin/product/get_product_via_id`, body)
        .then(response => response.json())
        .catch(Utils.handleError);