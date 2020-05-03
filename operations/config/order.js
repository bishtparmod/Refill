const {
    ORDER_TYPE_WEEKLY,
    ORDER_TYPE_BI_WEEKLY,
    ORDER_TYPE_MONTHLY,
    ORDER_TYPE_BI_MONTHLY,
    ORDER_TYPE_CUSTOM,

    ACTIVE_ORDER,
    PAST_ORDER,
    REFILL_ORDER,
    PENDING_ORDER,

    ASCENDING_SORT,
    DESCENDING_SORT,

    CURRENT_ORDER,
    FUTURE_ORDER,
    CANCELLED_ORDER,
    ALL_ORDER
} = require('../constant');

var place_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "product_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "totalPrice",
        isRequired: true,
        type: "number"
    },
    {
        key: "discount",
        isRequired: true,
        type: "number"
    },
    {
        key: "orderDate",
        isRequired: true,
        type: "array"
    },
    {
        key: "quantity",
        isRequired: true,
        type: "number"
    },
    {
        key: "orderType",
        isRequired: true,
        type: "enum",
        data: [ORDER_TYPE_WEEKLY, ORDER_TYPE_BI_WEEKLY, ORDER_TYPE_MONTHLY, ORDER_TYPE_BI_MONTHLY, ORDER_TYPE_CUSTOM]
    }
];

var get_now_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "order_date",
        isRequired: true,
        type: "string"
    },
    {
        key: "is_skip",
        isRequired: false,
        type: "boolean"
    }
];

var cancel_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_id",
        isRequired: true,
        type: "_id"
    }
];

var cancel_refill_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "uuid",
        isRequired: true,
        type: "string"
    }
];

var skip_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_id",
        isRequired: true,
        type: "_id"
    }
];

var order_status_payload = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_id",
        isRequired: true,
        type: "_id"
    }
];

var shipped_payload = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "driver_id",
        isRequired: true,
        type: "_id"
    }
];

var get_order_data_tables = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "order_status",
        isRequired: true,
        type: "enum",
        data: [PENDING_ORDER, ACTIVE_ORDER, PAST_ORDER, REFILL_ORDER]
    }
];

var list_order = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "sort",
        isRequired: false,
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
    },
    {
        key: "user_id",
        isRequired: false,
        type: "_id"
    },
    {
        key: "order_id",
        isRequired: false,
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

var order_list = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "sort",
        isRequired: false,
        type: "enum",
        data: [ASCENDING_SORT, DESCENDING_SORT]
    },
    {
        key: "order_status",
        isRequired: true,
        type: "enum",
        data: [CURRENT_ORDER, FUTURE_ORDER, PAST_ORDER, CANCELLED_ORDER, ALL_ORDER]
    },
    {
        key: "order_id",
        isRequired: false,
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

module.exports = {
    place_order,
    cancel_order,
    skip_order,
    order_status_payload,
    get_order_data_tables,
    shipped_payload,
    cancel_refill_order,
    list_order,
    order_list,
    get_now_order
}