import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Keyboard } from 'react-native';
import { WView, WText, WTouchable } from '../../ui'
import { Input } from '../../base_components';
import { Helper } from '../../../apis'
import { connect } from 'react-redux'
import { RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_FORM_PASSWORD, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, RESET_PASSWORD_REQEUST_LOADING, RESET_PASSWORD_ERRORS, RESET_PASSWORD_TOGGLE_SECURE_ENTRY, RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, RESET_PASSWORD_REQUEST_STATUS, STATUS, SUCCESS } from '../../../redux/Types';
import { updateResetPasswordUIConstraints, resetPassword, updateResetPasswordFormData } from '../../../redux/resetPassword/Action';

/** Reset Password */
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
        const { updateResetPasswordFormData, loading } = this.props;
        if (loading) return;

        updateResetPasswordFormData({
            [key]: value
        });
    }

    submit = () => {
        const { password, confirm_password, loading, resetPassword, updateResetPasswordUIConstraints } = this.props;
        const requestBody = { password, confirm_password };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateResetPasswordUIConstraints({
                        [RESET_PASSWORD_ERRORS]: []
                    });

                    //Reset password action
                    resetPassword();
                } else updateResetPasswordUIConstraints({
                    [RESET_PASSWORD_ERRORS]: response && response.length ? response : []
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
        const { updateResetPasswordUIConstraints } = this.props;

        updateResetPasswordUIConstraints({
            [key]: !value
        })
    }

    render() {
        const lockIcon = require("../../../../assets/img/lock.png");
        const { password, confirm_password, passwordSecureEntry, confirmPasswordSecureEntry } = this.props;

        //Password
        this.password = {
            onChangeText: (value) => this.onChangeText(RESET_PASSWORD_FORM_PASSWORD, value),
            value: password,
            isError: this.isError('password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Password",
            secureTextEntry: passwordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, RESET_PASSWORD_TOGGLE_SECURE_ENTRY, passwordSecureEntry),
            onSubmitEditing: () => { }
        };

        //Confirm Password
        this.confirmPassword = {
            onChangeText: (value) => this.onChangeText(RESET_PASSWORD_FORM_CONFIRM_PASSWORD, value),
            value: confirm_password,
            isError: this.isError('confirm_password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Confirm Password",
            secureTextEntry: confirmPasswordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, confirmPasswordSecureEntry),
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={5} padding={[50, 10]} stretch>
                <Input
                    {...this.password} />
                <Input
                    {...this.confirmPassword} />
            </WView>
        );
    }
}

const mapToProps = ({ reset_password }) => {
    const reset_password_key = reset_password && reset_password[RESET_PASSWORD_KEY] ? reset_password[RESET_PASSWORD_KEY] : {};
    const reset_password_form = reset_password_key && reset_password_key[RESET_PASSWORD_FORM] ? reset_password_key[RESET_PASSWORD_FORM] : {};

    const password = reset_password_form && reset_password_form[RESET_PASSWORD_FORM_PASSWORD] ? reset_password_form[RESET_PASSWORD_FORM_PASSWORD] : "";
    const confirm_password = reset_password_form && reset_password_form[RESET_PASSWORD_FORM_CONFIRM_PASSWORD] ? reset_password_form[RESET_PASSWORD_FORM_CONFIRM_PASSWORD] : "";

    const loading = reset_password_key && reset_password_key[RESET_PASSWORD_REQEUST_LOADING] ? reset_password_key[RESET_PASSWORD_REQEUST_LOADING] : false;
    const errors = reset_password_key && reset_password_key[RESET_PASSWORD_ERRORS] ? reset_password_key[RESET_PASSWORD_ERRORS] : [];
    const passwordSecureEntry = reset_password_key && reset_password_key[RESET_PASSWORD_TOGGLE_SECURE_ENTRY] ? reset_password_key[RESET_PASSWORD_TOGGLE_SECURE_ENTRY] : false;
    const confirmPasswordSecureEntry = reset_password_key && reset_password_key[RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] ? reset_password_key[RESET_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] : false;

    const request_status = reset_password_key && reset_password_key[RESET_PASSWORD_REQUEST_STATUS] ? reset_password_key[RESET_PASSWORD_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
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
    updateResetPasswordUIConstraints,
    resetPassword,
    updateResetPasswordFormData
})(Form);