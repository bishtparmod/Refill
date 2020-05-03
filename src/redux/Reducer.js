import { combineReducers } from 'redux'
import { SIGNUP_ROOT, LOGIN_ROOT, USER_ROOT, DEVICE_ROOT, FORGOT_PASSWORD_ROOT, RESET_PASSWORD_ROOT, WELCOME_SCREEN_ROOT, CHANGE_PASSWORD_ROOT, ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT, ADD_CARD_ROOT, HOME_ROOT, PRODUCT_DETAIL_ROOT, ORDER_LIST_ROOT, NOTIFICATION_ROOT, ORDER_VIEW_ROOT, CUSTOMER_SUPPORT_ROOT } from './Types'
import Signup from './signup/Reducer'
import Login from './login/Reducer'
import Device from './device/Reducer'
import User from './user/Reducer'
import ForgotPassword from './forgotPassword/Reducer'
import ResetPassword from './resetPassword/Reducer'
import WelcomeScreen from './welcomeScreen/Reducer'
import ChangePassword from './changePassword/Reducer'
import AddBillingAndShippingAddress from './billingAndShippingAddress/Reducer'
import AddCard from './addCard/Reducer'
import HomeReducer from './home/Reducer'
import ProductDetailReducer from './prodcutDetail/Reducer'
import OrderListReducer from './orderList/Reducer'
import NotificationListReducer from './notification/Reducer'
import OrderViewReducer from './orderView/Reducer'
import CustomerSupportReducer from './customerSupport/Reducer'

export default combineReducers({
    [SIGNUP_ROOT]: Signup,
    [LOGIN_ROOT]: Login,
    [USER_ROOT]: User,
    [DEVICE_ROOT]: Device,
    [FORGOT_PASSWORD_ROOT]: ForgotPassword,
    [RESET_PASSWORD_ROOT]: ResetPassword,
    [WELCOME_SCREEN_ROOT]: WelcomeScreen,
    [CHANGE_PASSWORD_ROOT]: ChangePassword,
    [ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT]: AddBillingAndShippingAddress,
    [ADD_CARD_ROOT]: AddCard,
    [HOME_ROOT]: HomeReducer,
    [PRODUCT_DETAIL_ROOT]: ProductDetailReducer,
    [ORDER_LIST_ROOT]: OrderListReducer,
    [NOTIFICATION_ROOT]: NotificationListReducer,
    [ORDER_VIEW_ROOT]: OrderViewReducer,
    [CUSTOMER_SUPPORT_ROOT]: CustomerSupportReducer
});