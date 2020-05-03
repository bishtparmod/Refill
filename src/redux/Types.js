/**
 * Common Constants
 */
export const SUCCESS = "success";
export const UPDATE = "update";
export const LOADING = "loading";
export const ERROR = "error";
export const NOT_FOUND = "not_found";
export const MESSAGE = "message";
export const STATUS = "status";
export const PENDING = "pending";
export const EMPTY = "empty";
export const RESPONSE = "response";
export const LOG_OUT = "log_out";
export const TOKEN_NOT_FOUND = "token_not_found";
export const ACTIVE = 1;
export const DEACTIVE = 0;
export const DISCOUNT = "Discount not greater than 100";
export const OFFERS_ALL_PRODUCTS = "all_products";
export const OFFERS_ALL_CATEGORY_PRODUCTS = "category_products";
export const OFFERS_ALL_SUB_CATEGORY_PRODUCTS = "sub_category_products";
export const BILLING = "billing";
export const SHIPPING = "shipping";

//Server response
export const SERVER_SUCCESS = "Success";
export const SERVER_SUCCESS_WITH_EMAIL_CHANGE = "SuccessWithEmailChange";
export const SERVER_ERROR = "Error";
export const SERVER_NOT_VALID = "NotValid";
export const SERVER_PRESENT = "Present";
export const SERVER_NO_VALUE = "NoValue";
export const SERVER_NOT_AUTHORIZED = "Not Authorized";
export const SERVER_OBJ_EMPTY = "ObjEmpty";
export const SERVER_BAD_REQUEST = "Bad REQUEST";
export const SERVER_VALIDATION_ERROR = "ValidationError";
export const SERVER_VARIFICATION_ERROR = "VarificationError";
export const SERVER_EMAIL_PRESENT = "EmailPresent";
export const SERVER_FORBIDDEN = "FORBIDDEN";
export const SERVER_LOGGED_IN = "LogedIn";
export const SERVER_LOGGED_OUT = "LogedOut";
export const SERVER_INTERNAL_SERVER_ERROR = "InternalServerError";

export const SERVER_ORDER_TYPE_WEEKLY = "weekly";
export const SERVER_ORDER_TYPE_BI_WEEKLY = "bi_weekly";
export const SERVER_ORDER_TYPE_MONTHLY = "monthly";
export const SERVER_ORDER_TYPE_BI_MONTHLY = "bi_monthly";
export const SERVER_ORDER_TYPE_CUSTOM = "custom";

export const SERVER_ORDER_STATUS_RECEIVED = "received";
export const SERVER_ORDER_STATUS_REVIEWED = "reviewed";
export const SERVER_ORDER_STATUS_PROCESSED = "processed";
export const SERVER_ORDER_STATUS_CANCELLED = "cancelled";
export const SERVER_ORDER_STATUS_SHIPPED = "shipped";
export const SERVER_ORDER_STATUS_SKIPPED = "skipped";
export const SERVER_ORDER_STATUS_DELIVERED = "delivered";
export const SERVER_ORDER_STATUS_REFUNDED = "refunded";
export const SERVER_ORDER_STATUS_REFILL = "refill";

/** ---------------------------------------------- */

/**
 * Local storage keys
 */
export const REFILL_LOGIN_DATA = "refill_login_data";
export const REFILL_SKIP_LOGIN_DATA = "refill_skip_login_data";
export const REFILL_SKIP_WELCOME_SCREEN_DATA = "refill_skip_welcome_screen_data";
export const REFILL_NOTIFICATION_DATA = "refill_notification_data";
export const REFILL_FCM_DEVICE_TOKEN = "refill_fcm_device_token";

/** ---------------------------------------------- */

/**
 * Screen Names
 * */

export const HOME_SCREEN = "Home";
export const EDIT_SCREEN = "EditProfile";
export const ADD_SHIPPING_AND_BILLING_ADDRESS_SCREEN = "AddShippingAndBillingAddress";
export const CHANGE_PASSWORD_SCREEN = "ChangePassword";
export const ADD_CARD_SCREEN = "AddCard";
export const LIST_CARD_SCREEN = "ListCard";
export const PRODUCT_DETAIL_SCREEN = "ProductDetail";
export const ORDER_SUMMARY_SCREEN = "OrderSummary";
export const PRODUCT_LIST_SCREEN = "ProductList";
export const ORDER_LIST_SCREEN = "OrderList";
export const ORDER_VIEW_SCREEN = "OrderView";
export const NOTIFICATIONS_SCREEN = "Notifications";
export const CUSTOMER_SUPPORT_SCREEN = "CustomerSupport";
export const CHAT_SCREEN = "Chat";

/** ------------------------------ */

/**
 * Screen Type
 * */

export const SCREEN_TYPE_ADD_CARD = "add_card";
export const SCREEN_TYPE_PAYMENT = "payment";

/** ------------------------------ */

/**
 * Firebase Collections
 * */

export const USERS_COLLECTION = "users";

/** ------------------------------ */

/**
 * Firebase User Types
 * */

export const USER_TYPE = "user";
export const ADMIN_TYPE = "admin";

/** ------------------------------ */

/**
 * Order Types
 * */

export const WEEKLY_ORDER = "Every One Week";
export const TWO_WEEKLY_ORDER = "Every Two Week";
export const FOUR_WEEKLY_ORDER = "Every Four Week";
export const EIGHT_WEEKLY_ORDER = "Every Eight Week";
export const CUSTOM_ORDER = "Custom";

export const CURRENT_ORDER = "current";
export const FUTURE_ORDER = "future";
export const CANCELLED_ORDER = "cancelled";
export const PAST_ORDER = "past";
export const ALL_ORDER = "all";

/** ------------------------------ */

/**
 * Sort Types
 * */

export const SORT_NAME_A_TO_Z = "sort_name_a_to_z";
export const SORT_PRICE_LOW_TO_HIGH = "sort_price_low_to_high";
export const SORT_PRICE_HIGH_TO_LOW = "sort_price_high_to_low";
export const SORT_NAME_Z_TO_A = "sort_name_z_to_a";

/** ------------------------------ */

/**
 * Order Types
 * */

export const SILENT_LOGOUT = "silent_logout";

/** ------------------------------ */

/**
 * Signup constant key
 * */
export const SIGNUP_ROOT = "signup";
export const SIGNUP_UPDATE = "signup_update";
export const SIGNUP_RESET = "signup_reset";
export const SIGNUP_KEY = "signup_key";

//Signup UI constants
export const SIGNUP_ERRORS = "signup_errors";
export const SIGNUP_REQUEST_STATUS = "signup_request_status";
export const SIGNUP_REQEUST_LOADING = "signup_request_loading";
export const SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY = "signup_password_toggle_secure_entry";
export const SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY = "signup_confirm_password_toggle_secure_entry";


//Signup form constants
export const SIGNUP_FORM = "signup_form";
export const SIGNUP_FORM_EMAIL = "signup_form_email";
export const SIGNUP_FORM_PASSWORD = "signup_form_short_password";
export const SIGNUP_FORM_CONFIRM_PASSWORD = "signup_form_confirm_password";

/** ------------------------------ */

/**
 * Login constant key
 * */
export const LOGIN_ROOT = "login";
export const LOGIN_UPDATE = "login_update";
export const LOGIN_RESET = "login_reset";
export const LOGIN_KEY = "login_key";

//Login UI constants
export const LOGIN_ERRORS = "login_errors";
export const LOGIN_REQUEST_STATUS = "login_request_status";
export const LOGIN_REQEUST_LOADING = "login_request_loading";
export const LOGIN_REQEUST_FACEBOOK_LOADING = "login_request_facebook_loading";
export const LOGIN_REQEUST_GOOGLE_LOADING = "login_request_google_loading";
export const LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY = "login_password_toggle_secure_entry";


//Login form constants
export const LOGIN_FORM = "login_form";
export const LOGIN_FORM_EMAIL = "login_form_email";
export const LOGIN_FORM_PASSWORD = "login_form_short_password";
export const LOGIN_FORM_CONFIRM_PASSWORD = "login_form_confirm_password";

/** ------------------------------ */

/**
 * User constant key
 * */
export const USER_ROOT = "user";
export const USER_UPDATE = "user_update";
export const USER_RESET = "user_reset";
export const USER_KEY = "user_key";

//User UI constants
export const USER_DATA = "user_data";

/** ------------------------------ */

/**
 * Device constant key
 * */
export const DEVICE_ROOT = "device";
export const DEVICE_UPDATE = "device_update";
export const DEVICE_RESET = "device_reset";
export const DEVICE_KEY = "device_key";

//Device UI constants
export const DEVICE_ROUTE_LOADING = "device_route_data";
export const DEVICE_IS_LOGGED_IN = "device_is_logged_in";
export const DEVICE_IS_LOGIN_SKIPPED = "device_is_login_skipped";
export const DEVICE_IS_WELCOME_SCREEN_SKIPPED = "device_is_welcome_screen_skipped";

/** ------------------------------ */

/**
 * Forgot Password constant key
 * */
export const FORGOT_PASSWORD_ROOT = "forgot_password";
export const FORGOT_PASSWORD_UPDATE = "forgot_password_update";
export const FORGOT_PASSWORD_RESET = "forgot_password_reset";
export const FORGOT_PASSWORD_KEY = "forgot_password_key";

//Forgot Password UI constants
export const FORGOT_PASSWORD_ERRORS = "forgot_password_errors";
export const FORGOT_PASSWORD_REQUEST_STATUS = "forgot_password_request_status";
export const FORGOT_PASSWORD_REQEUST_LOADING = "forgot_password_request_loading";


//Forgot Password form constants
export const FORGOT_PASSWORD_FORM = "forgot_password_form";
export const FORGOT_PASSWORD_FORM_EMAIL = "forgot_password_form_email";

/** ------------------------------ */

/**
 * Reset Password constant key
 * */
export const RESET_PASSWORD_ROOT = "reset_password";
export const RESET_PASSWORD_UPDATE = "reset_password_update";
export const RESET_PASSWORD_RESET = "reset_password_reset";
export const RESET_PASSWORD_KEY = "reset_password_key";

//Reset Password UI constants
export const RESET_PASSWORD_ERRORS = "reset_password_errors";
export const RESET_PASSWORD_REQUEST_STATUS = "reset_password_request_status";
export const RESET_PASSWORD_REQEUST_LOADING = "reset_password_request_loading";
export const RESET_PASSWORD_TOGGLE_SECURE_ENTRY = "reset_password_toggle_secure_entry";
export const RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY = "reset_confirm_password_toggle_secure_entry";


//Reset Password form constants
export const RESET_PASSWORD_FORM = "reset_password_form";
export const RESET_PASSWORD_FORM_EMAIL = "reset_password_form_email";
export const RESET_PASSWORD_FORM_PASSWORD = "reset_password_form_password";
export const RESET_PASSWORD_FORM_CONFIRM_PASSWORD = "reset_password_form_confirm_password";

/** ------------------------------ */

/**
 * Welcome screen constant key
 * */
export const WELCOME_SCREEN_ROOT = "welcome_screen";
export const WELCOME_SCREEN_UPDATE = "welcome_screen_update";
export const WELCOME_SCREEN_RESET = "welcome_screen_reset";
export const WELCOME_SCREEN_KEY = "welcome_screen_key";

//Welcome screen UI constants
export const WELCOME_SCREEN_ERRORS = "welcome_screen_errors";
export const WELCOME_SCREEN_REQUEST_STATUS = "welcome_screen_request_status";
export const WELCOME_SCREEN_REQEUST_LOADING = "welcome_screen_request_loading";
export const WELCOME_SCREEN_DATA = "welcome_screen_data";

/** ------------------------------ */

/**
 * Add card constant key
 * */
export const ADD_CARD_ROOT = "add_card";
export const ADD_CARD_UPDATE = "add_card_update";
export const ADD_CARD_RESET = "add_card_reset";
export const ADD_CARD_KEY = "add_card_key";

//Add card UI constants
export const ADD_CARD_REQUEST_LOADING = "add_card_request_loading";
export const ADD_CARD_IS_LOGGED_IN = "add_card_is_logged_in";
export const ADD_CARD_ERRORS = "add_card_errors";
export const ADD_CARD_REQUEST_STATUS = "add_card_request_status";
export const ADD_CARD_IS_CALENDAR_VISIBLE = "add_card_is_calendar_visible";

//List card UI Constants
export const LIST_CARD_REQUEST_LOADING = "list_card_request_loading";
export const LIST_CARD_REQUEST_REFRESH_LOADING = "list_card_request_refresh_loading";
export const LIST_CARD_REQUEST_ON_END_REACHED_LOADING = "list_card_request_on_end_reached_loading";
export const LIST_CARD_REQUEST_DATA = "list_card_request_data";
export const LIST_CARD_REQUEST_PAGE = "list_card_request_page";
export const LIST_CARD_ERRORS = "list_card_errors";
export const LIST_CARD_REQUEST_STATUS = "list_card_request_status";

//Add card form constants
export const ADD_CARD_FORM = "add_card_form";
export const ADD_CARD_FORM_CARDHOLDER_NAME = "add_card_form_cardholder_name";
export const ADD_CARD_FORM_CARD_NUMBER = "add_card_form_card_number";
export const ADD_CARD_FORM_EXPIRE_DATE = "add_card_form_expire_date";
export const ADD_CARD_FORM_CVV = "add_card_form_cvv";

/** ------------------------------ */

/**
 * Change password constant key
 * */
export const CHANGE_PASSWORD_ROOT = "change_password";
export const CHANGE_PASSWORD_UPDATE = "change_password_update";
export const CHANGE_PASSWORD_RESET = "change_password_reset";
export const CHANGE_PASSWORD_KEY = "change_password_key";

//Change Password UI constants
export const CHANGE_PASSWORD_ERRORS = "change_password_errors";
export const CHANGE_PASSWORD_REQUEST_STATUS = "change_password_request_status";
export const CHANGE_PASSWORD_REQEUST_LOADING = "change_password_request_loading";
export const CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY = "change_old_password_toggle_secure_entry";
export const CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY = "change_password_toggle_secure_entry";
export const CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY = "change_confirm_password_toggle_secure_entry";

//Reset Password form constants
export const CHANGE_PASSWORD_FORM = "change_password_form";
export const CHANGE_OLD_PASSWORD_FORM_PASSWORD = "change_password_old_form_password";
export const CHANGE_PASSWORD_FORM_PASSWORD = "change_password_form_password";
export const CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD = "change_password_form_confirm_password";

/** ------------------------------ */

/**
 * Add billing/shipping address constant key
 * */
export const ADD_BILLING_AND_SHIPPING_ADDRESS_ROOT = "add_billing_and_shipping_address";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_UPDATE = "add_billing_and_shipping_address_update";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_RESET = "add_billing_and_shipping_address_reset";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_KEY = "add_billing_and_shipping_address_key";

//Add billing/shipping UI constants
export const ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_LOADING = "add_billing_and_shipping_address_request_loading";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_ERRORS = "add_billing_and_shipping_address_errors";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_STATUS = "add_billing_and_shipping_address_request_status";
export const IS_ADD_BILLING_ADDRESS_AS_SHIPPING_ADDRESS = "is_add_billing_address_as_shipping_address";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_DATA = "add_billing_and_shipping_address_request_autocomplete_data";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_TYPE = "add_billing_and_shipping_address_request_type";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_REQUEST_AUTOCOMPLETE_LOADING = "add_billing_and_shipping_address_request_autocomplete_loading";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_IS_VISIBLE = "add_billing_and_shipping_address_modal_is_visible";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_MODAL_TYPE = "add_billing_and_shipping_address_modal_type";

//Add billing/shipping form constants
export const ADD_BILLING_AND_SHIPPING_ADDRESS_FORM = "add_billing_and_shipping_address_form";
export const ADD_SHIPPING_ADDRESS_FORM_ADDRESS = "add_shipping_address_form_address";
export const ADD_SHIPPING_ADDRESS_FORM_CITY = "add_shipping_address_form_city";
export const ADD_SHIPPING_ADDRESS_FORM_STATE = "add_shipping_address_form_state";
export const ADD_SHIPPING_ADDRESS_FORM_COUNTRY = "add_shipping_address_form_country";
export const ADD_SHIPPING_ADDRESS_FORM_ZIP_CODE = "add_shipping_address_form_zip_code";
export const ADD_SHIPPING_ADDRESS_FORM_PHONE = "add_shipping_address_form_phone";
export const ADD_SHIPPING_ADDRESS_FORM_NAME = "add_shipping_address_form_name";

export const ADD_BILLING_ADDRESS_FORM_ADDRESS = "add_billing_address_form_address";
export const ADD_BILLING_ADDRESS_FORM_CITY = "add_billing_address_form_city";
export const ADD_BILLING_ADDRESS_FORM_STATE = "add_billing_address_form_state";
export const ADD_BILLING_ADDRESS_FORM_COUNTRY = "add_billing_address_form_country";
export const ADD_BILLING_ADDRESS_FORM_ZIP_CODE = "add_billing_address_form_zip_code";
export const ADD_BILLING_ADDRESS_FORM_PHONE = "add_billing_address_form_phone";
export const ADD_BILLING_ADDRESS_FORM_NAME = "add_billing_address_form_name";

//Search location form constants
export const ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM = "add_billing_and_shipping_address_autocomplete_form";
export const ADD_BILLING_AND_SHIPPING_ADDRESS_AUTOCOMPLETE_FORM_TEXT = "add_billing_and_shipping_address_autocomplete_form_text";

/** ------------------------------ */

/**
 * Home constant key
 * */
export const HOME_ROOT = "home";
export const HOME_UPDATE = "home_update";
export const HOME_RESET = "home_reset";
export const HOME_KEY = "home_key";

//Home UI constants
export const HOME_ERRORS = "home_errors";
export const HOME_REQUEST_STATUS = "home_status";

export const HOME_REQEUST_CATEGORY_LOADING = "home_request_category_loading";
export const HOME_REQEUST_CATEGORY_REFRESH_LOADING = "home_request_category_refresh_loading";
export const HOME_REQEUST_CATEGORY_DATA = "home_request_category_data";
export const HOME_REQUEST_CATEGORY_PAGE = "home_request_category_page";
export const HOME_REQUEST_CATEGORY_PAGE_SIZE = "home_request_category_page_size";

export const HOME_REQEUST_SELECTED_CATEGORY_ID = "home_request_selected_category_id";
export const HOME_REQEUST_SUB_CATEGORY_DATA_LOADING = "home_request_sub_category_data_loading";
export const HOME_REQEUST_SUB_CATEGORY_DATA = "home_request_sub_category_data";
export const HOME_REQUEST_SUB_CATEGORY_PAGE = "home_request_sub_category_page";
export const HOME_REQUEST_SUB_CATEGORY_PAGE_SIZE = "home_request_sub_category_page_size";

export const HOME_REQEUST_VIEW_ALL_SELECTED_CATEGORY_ID = "home_request_view_all_selected_category_id";
export const HOME_REQEUST_VIEW_ALL_SELECTED_SUB_CATEGORY_ID = "home_request_view_all_selected_sub_category_id";
export const HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_LOADING = "home_request_sub_category_product_list_data_loading";
export const HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA_REFRESH_LOADING = "home_request_sub_category_product_list_data_refresh_loading";
export const HOME_REQEUST_SUB_CATEGORY_PRODUCT_LIST_DATA = "home_request_sub_category_product_list_data";
export const HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE = "home_request_sub_category_product_list_page";
export const HOME_REQUEST_SUB_CATEGORY_PRODUCT_LIST_PAGE_SIZE = "home_request_sub_category_product_list_page_size";
export const HOME_REQUEST_SUB_CATEGORY_NAME = "home_request_sub_category_name";
export const HOME_REQUEST_SUB_CATEGORY_SELECTED_SORT = "home_request_sub_category_selected_sort";
export const HOME_REQUEST_SUB_CATEGORY_IS_VISIBLE_SORT_ALERT = "home_request_sub_category_is_visible_sort_alert";

export const HOME_REQEUST_SEARCH_DATA_LOADING = "home_request_search_data_loading";
export const HOME_REQEUST_SEARCH_DATA = "home_request_search_data";
export const HOME_REQEUST_SEARCH_TEXT = "home_request_search_text";
export const HOME_REQEUST_IS_SHOW_SEARCH_LIST = "home_request_is_show_search_list";
export const HOME_REQUEST_SEARCH_PAGE = "home_request_search_page";
export const HOME_REQUEST_SEARCH_PAGE_SIZE = "home_request_search_page_size";

/** ------------------------------ */

/**
 * Product detail constant key
 * */
export const PRODUCT_DETAIL_ROOT = "product_detail";
export const PRODUCT_DETAIL_UPDATE = "product_detail_update";
export const PRODUCT_DETAIL_RESET = "product_detail_reset";
export const PRODUCT_DETAIL_KEY = "product_detail_key";

//Product Detail UI constants
export const PRODUCT_DETAIL_ERRORS = "product_detail_errors";
export const PRODUCT_DETAIL_REQUEST_STATUS = "product_detail_status";
export const PRODUCT_DETAIL_REQUEST_LOADING = "product_detail_request_loading";
export const PRODUCT_DETAIL_REQUEST_DATA = "product_detail_request_data";
export const PRODUCT_DETAIL_REQUEST_PAGE = "product_detail_request_page";
export const PRODUCT_DETAIL_REQUEST_PAGE_SIZE = "product_detail_request_page_size";
export const PRODUCT_DETAIL_ORDER_CUSTOM_DATES_STYLE = "product_detail_order_custom_dates_style";
export const PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT = "product_detail_is_order_type_alert";
export const PRODUCT_DETAIL_IS_ORDER_CALENDAR_ALERT = "product_detail_is_order_calendar_alert";

export const PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST = "product_detail_orders_estimate_list";
export const PRODUCT_DETAIL_ORDERS_ESTIMATE_LOADING = "product_detail_orders_estimate_loading";
export const PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS = "product_detail_orders_place_request_status";
export const PRODUCT_DETAIL_ORDERS_PLACE_ORDER_LOADING = "product_detail_orders_place_order_loading";

export const PRODUCT_DETAIL_ORDERS_IS_REFILL = "product_detail_orders_is_refill";
export const PRODUCT_DETAIL_ORDERS_REFILL_DATA = "product_detail_orders_refill_data";

export const PRODUCT_DETAIL_REFILL_ORDER_IS_GET_NOW_VISIBLE = "product_detail_refill_order_is_get_now_visible";
export const PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_VISIBLE = "product_detail_refill_order_is_skip_visible";
export const PRODUCT_DETAIL_REFILL_ORDER_IS_SKIP_UPCOMING_ORDER = "product_detail_refill_order_is_skip_upcoming_order";
export const PRODUCT_DETAIL_REFILL_ORDER_IS_CANCEL_VISIBLE = "product_detail_refill_order_is_cancel_visible";

export const PRODUCT_DETAIL_REFILL_ORDER_GET_NOW_LOADING = "product_detail_refill_order_get_now_loading";
export const PRODUCT_DETAIL_REFILL_ORDER_SKIP_LOADING = "product_detail_refill_order_skip_loading";
export const PRODUCT_DETAIL_REFILL_ORDER_CANCEL_LOADING = "product_detail_refill_order_cancel_loading";

//Product Detail Form Data
export const PRODUCT_DETAIL_FORM = "product_detail_form";
export const PRODUCT_DETAIL_FORM_ORDER_START_DATE = "product_detail_form_order_start_date";
export const PRODUCT_DETAIL_FORM_ORDER_END_DATE = "product_detail_form_order_end_date";
export const PRODUCT_DETAIL_FORM_ORDER_TYPE = "product_detail_form_order_type";
export const PRODUCT_DETAIL_FORM_ORDER_CUSTOM_DATES = "product_detail_form_order_custom_dates";
export const PRODUCT_DETAIL_FORM_ORDER_QUANTITY = "product_detail_form_order_quantity";
export const PRODUCT_DETAIL_FORM_ORDER_CARD_ID = "product_detail_form_order_card_id";

/** ------------------------------ */

/**
 * Order list constant key
 * */
export const ORDER_LIST_ROOT = "order_list";
export const ORDER_LIST_UPDATE = "order_list_update";
export const ORDER_LIST_RESET = "order_list_reset";
export const ORDER_LIST_KEY = "order_list_key";

//Order List UI constants
export const ORDER_LIST_ERRORS = "order_list_errors";
export const ORDER_LIST_REQUEST_STATUS = "order_list_request_status";
export const ORDER_LIST_REQEUST_LOADING = "order_list_request_loading";
export const ORDER_LIST_REQEUST_REFRESH_LOADING = "order_list_request_refresh_loading";
export const ORDER_LIST_REQEUST_ON_END_REACHED_LOADING = "order_list_request_on_end_reached_loading";
export const ORDER_LIST_REQEUST_ON_END_REACHED_DONE = "order_list_request_on_end_reached_done";
export const ORDER_LIST_REQUEST_DATA = "order_list_request_data";
export const ORDER_LIST_TYPE = "order_list_type";
export const ORDER_LIST_REQUEST_PAGE = "order_list_request_page";
export const ORDER_LIST_REQUEST_PAGE_SIZE = "order_list_request_page_size";

/** ------------------------------ */

/**
 * Notification list constant key
 * */
export const NOTIFICATION_ROOT = "notification_list";
export const NOTIFICATION_UPDATE = "notification_update";
export const NOTIFICATION_RESET = "notification_reset";
export const NOTIFICATION_KEY = "notification_key";

//Notification List UI constants
export const NOTIFICATION_REQUEST_STATUS = "notification_request_status";
export const NOTIFICATION_REQEUST_LOADING = "notification_request_loading";
export const NOTIFICATION_REQEUST_REFRESH_LOADING = "notification_request_refresh_loading";
export const NOTIFICATION_REQEUST_ON_END_REACHED_LOADING = "notification_request_on_end_reached_loading";
export const NOTIFICATION_REQEUST_ON_END_REACHED_DONE = "notification_request_on_end_reached_done";
export const NOTIFICATION_REQUEST_DATA = "notification_request_data";
export const NOTIFICATION_TYPE = "notification_type";
export const NOTIFICATION_REQUEST_PAGE = "notification_request_page";
export const NOTIFICATION_REQUEST_PAGE_SIZE = "notification_request_page_size";

/** ------------------------------ */

/**
 * Order list constant key
 * */
export const ORDER_VIEW_ROOT = "order_view";
export const ORDER_VIEW_UPDATE = "order_view_update";
export const ORDER_VIEW_RESET = "order_view_reset";
export const ORDER_VIEW_KEY = "order_view_key";

//Order List UI constants
export const ORDER_VIEW_REQUEST_STATUS = "notification_request_status";
export const ORDER_VIEW_REQEUST_LOADING = "notification_request_loading";
export const ORDER_VIEW_REQUEST_DATA = "notification_request_data";
export const ORDER_VIEW_REQUEST_ID = "notification_request_id";

/** ------------------------------ */

/**
 * Customer constant key
 * */
export const CUSTOMER_SUPPORT_ROOT = "customer_support";
export const CUSTOMER_SUPPORT_UPDATE = "customer_support_update";
export const CUSTOMER_SUPPORT_RESET = "customer_support_reset";
export const CUSTOMER_SUPPORT_KEY = "customer_support_key";

//Customer Support UI constants
export const CUSTOMER_SUPPORT_ERRORS = "customer_support_errors";
export const CUSTOMER_SUPPORT_REQUEST_STATUS = "customer_support_request_status";
export const CUSTOMER_SUPPORT_REQUEST_LOADING = "signup_request_loading";

//Customer Support form constants
export const CUSTOMER_SUPPORT_FORM = "signup_form";
export const CUSTOMER_SUPPORT_FORM_MESSAGE = "signup_form_email";

/** ------------------------------ */