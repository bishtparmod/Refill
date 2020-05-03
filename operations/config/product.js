const {
    ASCENDING_SORT,
    DESCENDING_SORT
} = require('../constant');

var add_product = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "name",
        isRequired: true,
        type: "string"
    },
    {
        key: "short_description",
        isRequired: true,
        type: "string"
    },
    {
        key: "long_description",
        isRequired: true,
        type: "string"
    },
    {
        key: "images",
        isRequired: true,
        type: "array"
    },
    {
        key: "manufacture_at",
        isRequired: false,
        type: "number"
    },
    {
        key: "brand",
        isRequired: true,
        type: "string"
    },
    {
        key: "distributor",
        isRequired: true,
        type: "string"
    },
    {
        key: "delivery_time_in_days",
        isRequired: true,
        type: "number"
    },
    {
        key: "retail_price",
        isRequired: true,
        type: "number"
    },
    {
        key: "refill_price",
        isRequired: true,
        type: "number"
    },
    {
        key: "notes",
        isRequired: false,
        type: "string"
    },
    {
        key: "alerts",
        isRequired: false,
        type: "string"
    },
    {
        key: "size",
        isRequired: true,
        type: "string"
    },
    {
        key: "code",
        isRequired: true,
        type: "string"
    },
    {
        key: "weight",
        isRequired: true,
        type: "number"
    },
    {
        key: "unit",
        isRequired: true,
        type: "string"
    },
    {
        key: "expiry_at",
        isRequired: false,
        type: "number"
    },
    {
        key: "average_life_in_days",
        isRequired: false,
        type: "number"
    },
    {
        key: "pupc_gtin_code",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "sub_category_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "quantity",
        isRequired: true,
        type: "number"
    }
];

var edit_product = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "product_id",
        isRequired: true,
        type: "string"
    },
    {
        key: "name",
        isRequired: true,
        type: "string"
    },
    {
        key: "short_description",
        isRequired: true,
        type: "string"
    },
    {
        key: "long_description",
        isRequired: true,
        type: "string"
    },
    {
        key: "images",
        isRequired: true,
        type: "array"
    },
    {
        key: "manufacture_at",
        isRequired: false,
        type: "number"
    },
    {
        key: "brand",
        isRequired: true,
        type: "string"
    },
    {
        key: "distributor",
        isRequired: true,
        type: "string"
    },
    {
        key: "delivery_time_in_days",
        isRequired: true,
        type: "number"
    },
    {
        key: "retail_price",
        isRequired: true,
        type: "number"
    },
    {
        key: "refill_price",
        isRequired: true,
        type: "number"
    },
    {
        key: "notes",
        isRequired: false,
        type: "string"
    },
    {
        key: "alerts",
        isRequired: false,
        type: "string"
    },
    {
        key: "size",
        isRequired: true,
        type: "string"
    },
    {
        key: "code",
        isRequired: true,
        type: "string"
    },
    {
        key: "weight",
        isRequired: true,
        type: "number"
    },
    {
        key: "unit",
        isRequired: true,
        type: "string"
    },
    {
        key: "expiry_at",
        isRequired: false,
        type: "number"
    },
    {
        key: "average_life_in_days",
        isRequired: false,
        type: "number"
    },
    {
        key: "pupc_gtin_code",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "sub_category_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "quantity",
        isRequired: true,
        type: "number"
    }
];

var delete_product = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "product_id",
        isRequired: true,
        type: "_id"
    }
];

var get_product_data_tables = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

var get_product_via_id = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "product_id",
        isRequired: true,
        type: "_id"
    }
];

const export_all_products = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

var search_product = [
    {
        key: "sort",
        isRequired: false,
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
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
    }
];


module.exports = {
    add_product,
    edit_product,
    delete_product,
    get_product_data_tables,
    get_product_via_id,
    export_all_products,
    search_product
};