import { combineReducers } from 'redux'
import Login from './login/Reducer'
import ForgotPassword from './forgot_password/Reducer'
import ChangePassword from './change_password/Reducer'
import ResetPassword from './reset_password/Reducer'
import UserData from './user/Reducer'
import SystemData from './system/Reducer'
import SidebarData from './sidebar/Reducer'
import HeaderData from './header/Reducer'
import FooterData from './footer/Reducer'
import CategoryData from './category/Reducer'
import ProductData from './product/Reducer'
import UsersData from './users/Reducer'
import Order from './order/Reducer'
import Report from './report/Reducer'
import Driver from './driver/Reducer'
import Splash from './splash/Reducer'
import Discount from './discount/Reducer'
import SalesTax from './SalesTax/Reducer'
import Chat from './chat/Reducer'

import { LOGIN_ROOT, CHANGE_PASSWORD_ROOT, RESET_PASSWORD_ROOT, FORGOT_PASSWORD_ROOT, USER_ROOT, SYSTEM_DATA_ROOT, SIDEBAR_ROOT, HEADER_ROOT, FOOTER_ROOT, CATEGORY_ROOT, PRODUCT_ROOT, USERS_ROOT, ORDER_ROOT, REPORT_ROOT, DRIVER_ROOT, SPLASH_ROOT, DISCOUNT_ROOT, SALES_DELIVERYCHARGES_ROOT, CHAT_ROOT } from './Types'

export default combineReducers({
    [LOGIN_ROOT]: Login,
    [FORGOT_PASSWORD_ROOT]: ForgotPassword,
    [CHANGE_PASSWORD_ROOT]: ChangePassword,
    [RESET_PASSWORD_ROOT]: ResetPassword,
    [USER_ROOT]: UserData,
    [SYSTEM_DATA_ROOT]: SystemData,
    [SIDEBAR_ROOT]: SidebarData,
    [HEADER_ROOT]: HeaderData,
    [FOOTER_ROOT]: FooterData,
    [CATEGORY_ROOT]: CategoryData,
    [PRODUCT_ROOT]: ProductData,
    [USERS_ROOT]: UsersData,
    [ORDER_ROOT]: Order,
    [REPORT_ROOT]: Report,
    [DRIVER_ROOT]:Driver,
    [SPLASH_ROOT]:Splash,
    [DISCOUNT_ROOT]:Discount,
    [SALES_DELIVERYCHARGES_ROOT]:SalesTax,
    [CHAT_ROOT]:Chat
})