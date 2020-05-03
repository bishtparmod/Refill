var {
    ACCEPCT_CONTACT_RESPONSE,
    DECLINE_CONTACT_RESPONSE
} = require('../constant');

var { login, admin_signup, forgot_password, session_login, logout, change_password, reset_password, export_all_users, enable_user, disable_user, edit_user, view_user_via_id, find_place_from_text } = require('./user');
var { add_product, edit_product, delete_product, get_product_data_tables, get_product_via_id, export_all_products, search_product } = require('./product');
var { get_category_via_id, get_sub_category_via_id, add_category, add_sub_category, get_category_data_tables, get_category, enable_category, disable_category, enable_sub_category, disable_sub_category, get_sub_category, get_all_categories, get_all_sub_categories, get_all_sub_category } = require('./category');
var { custmer_signup, create_customer, customer_social_login, edit_customer_billing_address, customer_search } = require('./customer');
var { driver_signup, edit_driver, view_driver_via_id, get_driver } = require("./driver");
var { place_order, cancel_order, skip_order, get_order_data_tables, order_status_payload, shipped_payload, cancel_refill_order, list_order, order_list, get_now_order } = require("./order");
var { get_charges_payload, sales_tax_payload, delivery_charges_payload } = require('./charges');
var { makey_offer } = require('./offers');
var { get_splash, update_splash } = require('./content');
var { card_list, delete_card, create_card } = require('./payment');
var { notifications_list } = require('./notification');

/** Route parameters */
module.exports = {
    routesFields: {
        login: login,
        admin_signup: admin_signup,
        forgot_password: forgot_password,
        session_login: session_login,
        logout: logout,
        change_password: change_password,
        reset_password: reset_password,
        add_product: add_product,
        edit_product: edit_product,
        delete_product: delete_product,
        get_product_data_tables: get_product_data_tables,
        get_product_via_id: get_product_via_id,
        get_category_via_id: get_category_via_id,
        get_sub_category_via_id: get_sub_category_via_id,
        add_category: add_category,
        add_sub_category: add_sub_category,
        get_category_data_tables: get_category_data_tables,
        get_category: get_category,
        enable_category: enable_category,
        disable_category: disable_category,
        enable_sub_category: enable_sub_category,
        disable_sub_category: disable_sub_category,
        get_sub_category: get_sub_category,
        export_all_products: export_all_products,
        custmer_signup: custmer_signup,
        export_all_users: export_all_users,
        enable_user: enable_user,
        disable_user: disable_user,
        edit_user: edit_user,
        view_user_via_id: view_user_via_id,
        driver_signup: driver_signup,
        edit_driver: edit_driver,
        view_driver_via_id: view_driver_via_id,
        place_order: place_order,
        find_place_from_text: find_place_from_text,
        skip_order: skip_order,
        cancel_order: cancel_order,
        get_order_data_tables: get_order_data_tables,
        order_status_payload: order_status_payload,
        get_charges_payload: get_charges_payload,
        makey_offer: makey_offer,
        shipped_payload: shipped_payload,
        get_driver: get_driver,
        get_splash: get_splash,
        update_splash: update_splash,
        cancel_refill_order: cancel_refill_order,
        sales_tax_payload: sales_tax_payload,
        delivery_charges_payload: delivery_charges_payload,
        create_customer: create_customer,
        customer_social_login: customer_social_login,
        edit_customer_billing_address: edit_customer_billing_address,
        create_card: create_card,
        card_list: card_list,
        delete_card: delete_card,
        list_order: list_order,
        get_all_categories: get_all_categories,
        get_all_sub_categories: get_all_sub_categories,
        get_all_sub_category: get_all_sub_category,
        customer_search: customer_search,
        search_product: search_product,
        notifications_list: notifications_list,
        order_list: order_list,
        get_now_order: get_now_order
    }
}