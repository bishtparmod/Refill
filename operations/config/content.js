var update_splash = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    },
    {
        key: "splash_id",
        isRequired: true,
        type: "_id"
    },
    {
        key: "title",
        isRequired: true,
        type: "string"
    },
    {
        key: "description",
        isRequired: true,
        type: "string"
    },
    {
        key: "image",
        isRequired: true,
        type: "string"
    }
];

var get_splash = [
    {
        key: "user_token",
        isRequired: true,
        type: "string"
    }
];

module.exports = {
    update_splash,
    get_splash
}