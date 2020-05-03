const { OFFERS_ALL_CATEGORY_PRODUCTS, OFFERS_ALL_PRODUCTS, OFFERS_ALL_SUB_CATEGORY_PRODUCTS, OFFERS_CUSTOM_PRODUCTS } = require('../constant');

var makey_offer = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "discount",
        isRequired: true,
        type: "number"
    },
    {
        key: "start_date",
        isRequired: true,
        type: "string"
    },
    {
        key: "end_date",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: false,
        type: "_id"
    },
    {
        key: "_sub_cateogry_id",
        isRequired: false,
        type: "_id"
    },
    {
        key: "description",
        isRequired: false,
        type: "string"
    },
    {
        key: "product_ids",
        isRequired: false,
        type: "array"
    },
    {
        key: "offer_type",
        isRequired: true,
        type: "enum",
        data: [OFFERS_ALL_CATEGORY_PRODUCTS, OFFERS_ALL_SUB_CATEGORY_PRODUCTS, OFFERS_ALL_PRODUCTS, OFFERS_CUSTOM_PRODUCTS]
    }
];

module.exports = {
    makey_offer
}