const {
    ASCENDING_SORT,
    DESCENDING_SORT
 } = require("../constant");

var get_category_via_id = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    }
];

var get_sub_category_via_id = [
    {
        key: "user_token",
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
    }
];

var add_category = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "name",
        isRequired: true,
        type: "string"
    }
];

var add_sub_category = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "name",
        isRequired: true,
        type: "string"
    }
];

var get_category_data_tables = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: false,
        type: "_id"
    },
    {
        key: "sub_category_id",
        isRequired: false,
        type: "_id"
    }
];

var get_category = [
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

var enable_category = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    }
];

var disable_category = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
    }
];

var enable_sub_category = [
    {
        key: "user_token",
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
    }
];

var disable_sub_category = [
    {
        key: "user_token",
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
    }
];

var get_sub_category = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
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

var get_all_categories = [
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

var get_all_sub_categories = [
    {
        key: "category_id",
        isRequired: true,
        type: "_id"
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

var get_all_sub_category = [
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
        key: "name_sorting",
        isRequired: false,
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
    },
    {
        key: "price_sorting",
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
    }
];


module.exports = {
    get_category_via_id,
    get_sub_category_via_id,
    add_category,
    add_sub_category,
    get_category_data_tables,
    get_category,
    enable_category,
    disable_category,
    enable_sub_category,
    disable_sub_category,
    get_sub_category,
    get_all_categories,
    get_all_sub_categories,
    get_all_sub_category
};