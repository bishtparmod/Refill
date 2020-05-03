import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { WView, WText, WTouchable } from '../../ui'
import { Input } from '../../base_components';
import Utils from '../../util/Utils';
import { connect } from 'react-redux';
import { LOGIN_KEY, LOGIN_FORM, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, LOGIN_REQEUST_LOADING, LOGIN_ERRORS, LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY, STATUS, LOGIN_REQUEST_STATUS, SUCCESS, USER_KEY, USER_DATA, LOGIN_REQEUST_GOOGLE_LOADING, LOGIN_REQEUST_FACEBOOK_LOADING } from '../../../redux/Types';
import { updateLoginFormData, updateLoginUIConstraints, login } from '../../../redux/login/Action';
import { Helper } from '../../../apis';

/** Login form */
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
        const { updateLoginFormData, loading } = this.props;
        if (loading) return;

        updateLoginFormData({
            [key]: value
        });
    }

    submit = () => {
        const { email, password, isLoading, updateLoginUIConstraints, login } = this.props;
        const requestBody = { email, password };
        Keyboard.dismiss();

        if (isLoading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateLoginUIConstraints({
                        [LOGIN_ERRORS]: []
                    });

                    //Login action
                    login();
                } else updateLoginUIConstraints({
                    [LOGIN_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    componentDidUpdate = (prevProps) => {
        const { type, isResetPassword } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                this.openScren('Login');
            }
        }

        if (isResetPassword !== prevProps.isResetPassword) {
            if (isResetPassword) this.openScren('ResetPassword');
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
        const { updateLoginUIConstraints } = this.props;

        updateLoginUIConstraints({
            [key]: !value
        })
    }

    openScren = (screen) => {
        const { navigation } = this.props;

        if (!screen) return;

        navigation.navigate(screen);
    }

    render() {
        const emailIcon = require("../../../../assets/img/email.png");
        const lockIcon = require("../../../../assets/img/lock.png");
        const { email, password, passwordSecureEntry } = this.props;

        //Email
        this.email = {
            onChangeText: (value) => this.onChangeText(LOGIN_FORM_EMAIL, value),
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
            onChangeText: (value) => this.onChangeText(LOGIN_FORM_PASSWORD, value),
            value: password,
            isError: this.isError('password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Password",
            secureTextEntry: passwordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY, passwordSecureEntry),
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={5} padding={[20, 10, 10, 10]} stretch>
                <Input
                    {...this.email} />
                <Input
                    {...this.password} />
                <WView dial={6}>
                    <WText fontSize={Utils.scaleSize(14)} padding={[10, 10]} onPress={this.openScren.bind(this, 'ForgotPassword')} right>Forgot Password?</WText>
                </WView>
            </WView>
        );
    }
}

const mapToProps = ({ login, user }) => {
    const login_key = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : {};
    const login_form = login_key && login_key[LOGIN_FORM] ? login_key[LOGIN_FORM] : {};

    const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
    const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
    const isResetPassword = user_data && user_data.reset_password ? user_data.reset_password : false;

    const email = login_form && login_form[LOGIN_FORM_EMAIL] ? login_form[LOGIN_FORM_EMAIL] : "";
    const password = login_form && login_form[LOGIN_FORM_PASSWORD] ? login_form[LOGIN_FORM_PASSWORD] : "";

    const google_loading = login_key && login_key[LOGIN_REQEUST_FACEBOOK_LOADING] ? login_key[LOGIN_REQEUST_FACEBOOK_LOADING] : false;
    const facebook_loading = login_key && login_key[LOGIN_REQEUST_GOOGLE_LOADING] ? login_key[LOGIN_REQEUST_GOOGLE_LOADING] : false;
    const loading = login_key && login_key[LOGIN_REQEUST_LOADING] ? login_key[LOGIN_REQEUST_LOADING] : false;

    const errors = login_key && login_key[LOGIN_ERRORS] ? login_key[LOGIN_ERRORS] : [];
    const passwordSecureEntry = login_key && login_key[LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY] ? login_key[LOGIN_PASSWORD_TOGGLE_SECURE_ENTRY] : false;

    const request_status = login_key && login_key[LOGIN_REQUEST_STATUS] ? login_key[LOGIN_REQUEST_STATUS] : {};
    const type = login_key && login_key[STATUS] ? login_key[STATUS] : '';

    return ({
        email,
        password,
        loading,
        isLoading: loading || google_loading || facebook_loading,
        errors,
        type,
        passwordSecureEntry,
        isResetPassword
    });
}

export default connect(mapToProps, {
    updateLoginFormData,
    updateLoginUIConstraints,
    login
})(Form);