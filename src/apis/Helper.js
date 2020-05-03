export default class Helper {

    constructor() {

    }

    /**
     * Check for, is object empty?
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static isObjectEmpty(obj, cb) {
        let names = Object.getOwnPropertyNames(obj);
        return Promise.resolve({ status: (names.length === 0) ? true : false, names });
    }

    /**
     * Check for, is data array format?
     * @param {*object} obj 
     * @param {*function} cb 
     */
    static isDataArray(obj, cb) {
        cb(obj.length !== undefined ? true : false);
    }

    /**
     * For sorting
     * @param {*any} a 
     * @param {*any} b 
     */
    static compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    /**
     * Validate email address
     * @param {*string} email 
     */
    static validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

     /**
     * Validate name address
     * @param {*string} name 
     */
    static validateName(name) {
        var re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g
        return re.test(name);
    }
   
     /**
     * Validate vehical_name address
     * @param {*string} vehical_no
     */
    static validateVehical_no(vehical_no) {
        var re = /^[A-Za-z0-9]+$/
        return re.test(vehical_no);
    }

     /**
     * Validate vehical_name address
     * @param {*string} vehical_name 
     */
    static validateVehical_name(vehical_name) {
        var re = /^[A-Za-z]+$/
        return re.test(vehical_name);
    }

     /**
     * Validate license_no address
     * @param {*string} license_no 
     */
    static validateLicense_no(license_no) {
        var re = /^[A-Za-z0-9]+$/
        return re.test(license_no);
    }

    /**
     * Validate mobile
     * @param {*string} number
     */
    static validateMobile(data) {
        const number = data.toString();
        var re = /^(\([0-9]{3}\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/
        return re.test(number);
    }

    static validateAgeLength(number) {
        return (number >=18 && number <= 100);
    }

    static validateAge(number) {
        var re = /[1-9]{1,3}/
            return re.test(number)       
    }

    static validateZipcode(number) {
        var re = /^[0-9]{0,7}$/
            return re.test(number)       
    }

    /** Validate password */
    static validatePassword = (value) => {
        return (value && value.length >= 5) ? true : false;
    }

    /**
     * Merge objects
     * @param {*object} obj 
     * @param {*function} oldObj 
     */
    static mergeObject(obj, oldObj) {
        return Object.assign(obj, oldObj)
    }

    /**
     * Validate the request 
     * @param {*object} obj 
     */
    static validate(parameters, obj) {
        return this.isObjectEmpty(obj)
            .then(({ status, names }) => {
                if (!status) {
                    let existedFields = {
                        keys: names,
                        emptyKeys: []
                    }
                    parameters.forEach((element, index) => {
                        !obj[element] && existedFields.emptyKeys.push({ fieldName: element, message: "Required" });
                    });

                    //Specific fields validations
                    existedFields.emptyKeys.length <= 0 &&
                        existedFields.keys.forEach((element) => {
                            switch (element) {
                                case "email":
                                    !this.validateEmail(obj["email"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Email address is not valid." });
                                    break;
                                case "name":
                                    !this.validateName(obj["name"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Name is not valid." });
                                    break;
                                case "mobile_number":
                                    !this.validateMobile(obj["mobile_number"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Mobile number is not valid." });
                                    break;
                                case "zipcode":
                                    !this.validateZipcode(obj["zipcode"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Zipcode is not valid." });
                                    break;
                                case "age":
                                    !this.validateAge(obj["age"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Age is not valid." });
                                    !this.validateAgeLength(obj["age"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Age length is not valid." });
                                    break;
                                case "password":
                                    !this.validatePassword(obj["password"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Password at least 5 characters" });
                                    break;
                                case "confirm_password":
                                    if (obj["password"] !== obj["confirm_password"]) {
                                        existedFields.emptyKeys.push({ fieldName: "password", message: "Password is not matched." });
                                        existedFields.emptyKeys.push({ fieldName: "confirm_password", message: "Password is not matched." });
                                    }
                                    break;
                                case "vehical_name":
                                    !this.validateVehical_name(obj["vehical_name"]) && existedFields.emptyKeys.push({ fieldName: element, message: "vehical_name is not valid." });
                                    break;
                                case "vehical_no":
                                    !this.validateVehical_no(obj["vehical_no"]) && existedFields.emptyKeys.push({ fieldName: element, message: "vehical_no is not valid." });
                                    break;
                                case "license_no":
                                    !this.validateLicense_no(obj["license_no"]) && existedFields.emptyKeys.push({ fieldName: element, message: "license_no is not valid." });
                                    break;
                                case "customerShippingPhone":
                                    !this.validateMobile(obj["customerShippingPhone"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Mobile number is not valid." });
                                    break; 
                                case "billingPhone":
                                    !this.validateMobile(obj["billingPhone"]) && existedFields.emptyKeys.push({ fieldName: element, message: "Mobile number is not valid." });
                                    break;   
                            }
                        });

                    return Promise.resolve({ status: existedFields.emptyKeys.length > 0 ? false : true, response: existedFields.emptyKeys });
                } else return Promise.resolve({ status: false, response: parameters });
            });
    }

    static isValidForm = (keys, body) => {
        return Helper.validate(keys, body)
            .then(({ status, response }) => {
                // console.log(response);
                if (status) {
                    return Promise.resolve({ message: "Success" });
                } else return Promise.resolve({ status, response });
            })
    }

    /** Reset and push rout in stack */
    static resetAndPushRoot(history, path) {
        history.entries = [];
        history.index = -1;
        history.push(path);
    }
}
