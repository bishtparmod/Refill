var create_card = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "card_holder_name",
        isRequired: true,
        type: "string"
    },
    {
        key: "card_number",
        isRequired: true,
        type: "number"
    }, {
        key: "expire_month",
        isRequired: true,
        type: "number"
    },
    {
        key: "expire_year",
        isRequired: true,
        type: "number"
    },
    {
        key: "cvv",
        isRequired: true,
        type: "number"
    },
];

var card_list = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

var delete_card = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "card_id",
        isRequired: true,
        type: "string"
    }
];

module.exports = {
    create_card,
    card_list,
    delete_card
};