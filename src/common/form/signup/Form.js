import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { WView, WText, WTouchable } from '../../ui'
import { Input } from '../../base_components';
import { connect } from 'react-redux'
import { SIGNUP_FORM_EMAIL, SIGNUP_FORM_PASSWORD, SIGNUP_FORM_CONFIRM_PASSWORD, SIGNUP_KEY, SIGNUP_FORM, SIGNUP_ERRORS, SIGNUP_REQEUST_LOADING, SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY, SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, SIGNUP_REQUEST_STATUS, STATUS, SUCCESS } from '../../../redux/Types';
import { updateSignupFormData, updateSignupUIConstraints, signup } from '../../../redux/signup/Action';
import { Helper } from '../../../apis'

/** Signup form */
class Form extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        initSubmit: PropTypes.func,
        navigation: PropTypes.any
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { initSubmit } = this.props;

        if (typeof initSubmit === "function") initSubmit(this.submit);
    }

    onChangeText = (key, value) => {
        const { updateSignupFormData, loading } = this.props;
        if (loading) return;

        updateSignupFormData({
            [key]: value
        });
    }

    submit = () => {
        const { email, password, confirm_password, loading, updateSignupUIConstraints, signup } = this.props;
        const requestBody = { email, password, confirm_password };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSignupUIConstraints({
                        [SIGNUP_ERRORS]: []
                    });

                    //Signup action
                    signup();
                } else updateSignupUIConstraints({
                    [SIGNUP_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    //Open new screen
    openScren = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    componentDidUpdate = (prevProps) => {
        const { type } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                this.openScren('Login');
            }
        }
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    toggleSecureTextEntry = (key, value) => {
        const { updateSignupUIConstraints } = this.props;

        updateSignupUIConstraints({
            [key]: !value
        })
    }

    render() {
        const emailIcon = require("../../../../assets/img/email.png");
        const lockIcon = require("../../../../assets/img/lock.png");
        const { email, password, confirm_password, passwordSecureEntry, confirmPasswordSecureEntry } = this.props;

        //Email
        this.email = {
            onChangeText: (value) => this.onChangeText(SIGNUP_FORM_EMAIL, value),
            autoCapitalize: "none",
            value: email,
            isError: this.isError('email'),
            keyboardType: "email-address",
            leftIcon: emailIcon,
            labelName: "Email",
            onSubmitEditing: () => { }
        };

        //Password
        this.password = {
            onChangeText: (value) => this.onChangeText(SIGNUP_FORM_PASSWORD, value),
            value: password,
            isError: this.isError('password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Password",
            secureTextEntry: passwordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY, passwordSecureEntry),
            onSubmitEditing: () => { }
        };

        //Confirm Password
        this.confirmPassword = {
            onChangeText: (value) => this.onChangeText(SIGNUP_FORM_CONFIRM_PASSWORD, value),
            value: confirm_password,
            isError: this.isError('confirm_password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Confirm Password",
            secureTextEntry: confirmPasswordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, confirmPasswordSecureEntry),
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={5} padding={[50, 10]} stretch>
                <Input
                    {...this.email} />
                <Input
                    {...this.password} />
                <Input
                    {...this.confirmPassword} />
            </WView>
        );
    }
}

const mapToProps = ({ signup }) => {
    const signup_key = signup && signup[SIGNUP_KEY] ? signup[SIGNUP_KEY] : {};
    const signup_form = signup_key && signup_key[SIGNUP_FORM] ? signup_key[SIGNUP_FORM] : {};

    const email = signup_form && signup_form[SIGNUP_FORM_EMAIL] ? signup_form[SIGNUP_FORM_EMAIL] : "";
    const password = signup_form && signup_form[SIGNUP_FORM_PASSWORD] ? signup_form[SIGNUP_FORM_PASSWORD] : "";
    const confirm_password = signup_form && signup_form[SIGNUP_FORM_CONFIRM_PASSWORD] ? signup_form[SIGNUP_FORM_CONFIRM_PASSWORD] : "";

    const loading = signup_key && signup_key[SIGNUP_REQEUST_LOADING] ? signup_key[SIGNUP_REQEUST_LOADING] : false;
    const errors = signup_key && signup_key[SIGNUP_ERRORS] ? signup_key[SIGNUP_ERRORS] : [];
    const passwordSecureEntry = signup_key && signup_key[SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY] ? signup_key[SIGNUP_PASSWORD_TOGGLE_SECURE_ENTRY] : false;
    const confirmPasswordSecureEntry = signup_key && signup_key[SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] ? signup_key[SIGNUP_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] : false;

    const request_status = signup_key && signup_key[SIGNUP_REQUEST_STATUS] ? signup_key[SIGNUP_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        email,
        password,
        confirm_password,
        loading,
        errors,
        type,
        passwordSecureEntry,
        confirmPasswordSecureEntry
    });
}

export default connect(mapToProps, {
    updateSignupFormData,
    updateSignupUIConstraints,
    signup
})(Form);