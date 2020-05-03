const { ASCENDING_SORT, DESCENDING_SORT } = require('../constant');

var notifications_list = [
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
    notifications_list
}