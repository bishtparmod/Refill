var driver_signup = [
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
        key: "image",
        isRequired: true,
        type: "string"
    },
    {
        key: "phone",
        isRequired: true,
        type: "number"
    },
    {
        key: "age",
        isRequired: true,
        type: "number"
    },
    {
        key: "vehicalName",
        isRequired: true,
        type: "string"
    },
    {
        key: "vehicalNumber",
        isRequired: true,
        type: "string"
    },
    {
        key: "licenseNumber",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_street_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_zipcode",
        isRequired: true,
        type: "number"
    },
    {
        key: "driver_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "driver_longitude",
        isRequired: true,
        type: "number"
    }
];

var edit_driver = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_id",
        isRequired: true,
        type: "_id"
    },
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
        key: "image",
        isRequired: true,
        type: "string"
    },
    {
        key: "phone",
        isRequired: true,
        type: "number"
    },
    {
        key: "age",
        isRequired: true,
        type: "number"
    },
    {
        key: "vehicalName",
        isRequired: true,
        type: "string"
    },
    {
        key: "vehicalNumber",
        isRequired: true,
        type: "string"
    },
    {
        key: "licenseNumber",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_full_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_street_address",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_city",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_state",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_country",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_zipcode",
        isRequired: true,
        type: "number"
    },
    {
        key: "driver_latitude",
        isRequired: true,
        type: "number"
    },
    {
        key: "driver_longitude",
        isRequired: true,
        type: "number"
    }
];

var view_driver_via_id = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "driver_id",
        isRequired: true,
        type: "_id"
    }
];

var get_driver = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "search",
        isRequired: false,
        type: "string"
    },
    {
        key: "page",
        isRequired: true,
        type: "string"
    },
    {
        key: "page_size",
        isRequired: true,
        type: "string"
    }
];

module.exports = {
    driver_signup,
    edit_driver,
    view_driver_via_id,
    get_driver
};