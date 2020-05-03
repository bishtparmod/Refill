var sales_tax_payload = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "sales_tax",
        isRequired: true,
        type: "number"
    },
    {
        key: "item_id",
        isRequired: true,
        type: "_id"
    }
];

var delivery_charges_payload = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "delivery_charges_valid_limit",
        isRequired: true,
        type: "number"
    },
    {
        key: "delivery_charges",
        isRequired: true,
        type: "number"
    },
    {
        key: "item_id",
        isRequired: true,
        type: "_id"
    }
];

var get_charges_payload = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

module.exports = {
    sales_tax_payload,
    delivery_charges_payload,
    get_charges_payload
};