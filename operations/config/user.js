const {
    ANDROID_PLATFORM,
    IOS_PLATFORM
} = require("../constant");

var login = [
    {
        key: "email",
        isRequired: true,
        type: "string"
    },
    {
        key: "device_token",
        isRequired: false,
        type: "string"
    },
    {
        key: "password",
        isRequired: true,
        type: "string"
    },
    {
        key: "platform",
        isRequired: false,
        type: "enum",
        data: [IOS_PLATFORM, ANDROID_PLATFORM]
    }
];

var admin_signup = [
    {
        key: "name",
        isRequired: true,
        type: "string"
    },
    {
        key: "email",
        isRequired: true,
        type: "string"
    },
    {
        key: "password",
        isRequired: true,
        type: "any"
    },
    {
        key: "confirm_password",
        isRequired: true,
        type: "any"
    }
];

var forgot_password = [
    {
        key: "email",
        isRequired: true,
        type: "string"
    }
];

var session_login = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

var logout = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "device_token",
        isRequired: false,
        type: "string"
    }
];

var change_password = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "old_password",
        isRequired: true,
        type: "string"
    },
    {
        key: "password",
        isRequired: true,
        type: "string"
    },
    {
        key: "confirm_password",
        isRequired: true,
        type: "string"
    }
];

var reset_password = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "password",
        isRequired: true,
        type: "string"
    },
    {
        key: "confirm_password",
        isRequired: true,
        type: "string"
    }
];

var export_all_users = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

var enable_user = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "user_id",
        isRequired: true,
        type: "_id"
    }
];

var disable_user = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "user_id",
        isRequired: true,
        type: "_id"
    }
];

var edit_user = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "user_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "customer_name",
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
    }
];

var view_user_via_id = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "user_id",
        isRequired: true,
        type: "_id"
    }
];

var find_place_from_text = [
    {
        key: "inputQuery",
        isRequired: true,
        type: "string"
    },
    {
        key: "fields",
        isRequired: true,
        type: "string"
    }
];

module.exports = {
    login,
    admin_signup,
    forgot_password,
    session_login,
    logout,
    change_password,
    reset_password,
    export_all_users,
    enable_user,
    disable_user,
    edit_user,
    view_user_via_id,
    find_place_from_text
};