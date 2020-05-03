const appSettings = {
    base_url: 'http://18.191.114.9:5000/v0/api',
    app_key: "f4d1ca1098a0057311bc5fc33ef27a1e",
    google_key: "AIzaSyBf3khG59EunwvbAHpMjzawpP-CPP9kuGM",
    locationBaseUrl: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    locationDetailBaseUrl: "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
    locationDetailViaZipCode: "https://maps.googleapis.com/maps/api/geocode/json"
}

let variable = appSettings

if (__DEV__) {
    variable = appSettings
}

export default variable
