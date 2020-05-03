const {
    ASCENDING_SORT,
    DESCENDING_SORT, 

    ANDROID_PLATFORM,
    IOS_PLATFORM
} = require('../constant');

var custmer_signup = [
    {
        key: "customer_name",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_password",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_email",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_phone",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_created_by",
        isRequired: false,
        type: "string"
    },
    {
        key: "customer_ip",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_device",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_notes",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_street_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_zip_code",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_shipping_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_shipping_longitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_street_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_zip_code",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_longitude",
        isRequired: true,
        type: "number"
    }
];

var create_customer = [
    {
        key: "customer_email",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_password",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_device",
        isRequired: false,
        type: "string"
    }
];

var customer_social_login = [
    {
        key: "email",
        isRequired: false,
        type: "string"
    },
    {
        key: "social_id",
        isRequired: true,
        type: "string"
    },
    {
        key: "social_name",
        isRequired: false,
        type: "string"
    },
    {
        key: "social_image",
        isRequired: false,
        type: "string"
    },
    {
        key: "device",
        isRequired: false,
        type: "string"
    },
    {
        key: "platform",
        isRequired: false,
        type: "enum", 
        data: [IOS_PLATFORM, ANDROID_PLATFORM]
    }
];

var edit_customer_billing_address = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_name",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_phone",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_shipping_zip_code",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_shipping_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_shipping_longitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_name",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_phone",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "customer_billing_zip_code",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "customer_billing_longitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "is_add_billing_address_as_shipping_address",
        isRequired: false,
        type: "boolean"
    }
];

var customer_search = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "search",
        isRequired: true,
        type: "string"
    },
    {
        key: "page",
        isRequired: true,
        type: "number"
    },
    {
        key: "page_size",
        isRequired: true,
        type: "number"
    },
    {
        key: "sort",
        isRequired: false,
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
    },
];

module.exports = {
    custmer_signup,
    create_customer,
    customer_social_login,
    edit_customer_billing_address,
    customer_search
};