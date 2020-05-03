import React, { PureComponent } from 'react';
import PropTypes from 'prop-types'
import { WView } from '../../ui'
import { Input } from '../../base_components';
import { connect } from 'react-redux';
import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, CHANGE_OLD_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_ERRORS, CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY, CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, CHANGE_PASSWORD_REQUEST_STATUS, STATUS, CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY, SUCCESS } from '../../../redux/Types';
import { updateChangePasswordUIConstraints, changePassword, updateChangePasswordFormData } from '../../../redux/changePassword/Action';
import { Helper } from '../../../apis';
import { Keyboard } from 'react-native';

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
        const { updateChangePasswordFormData, loading } = this.props;
        if (loading) return;

        updateChangePasswordFormData({
            [key]: value
        });
    }

    submit = () => {
        const { password, confirm_password, old_password, loading, changePassword, updateChangePasswordUIConstraints } = this.props;
        const requestBody = { password, confirm_password, old_password };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateChangePasswordUIConstraints({
                        [CHANGE_PASSWORD_ERRORS]: []
                    });

                    //Reset password action
                    changePassword();
                } else updateChangePasswordUIConstraints({
                    [CHANGE_PASSWORD_ERRORS]: response && response.length ? response : []
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
        const { type, onBack } = this.props;

        if (prevProps.type !== type) {
            if (type === SUCCESS) {
                if (typeof onBack === "function") onBack();
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
        const { updateChangePasswordUIConstraints } = this.props;

        updateChangePasswordUIConstraints({
            [key]: !value
        })
    }

    render() {
        const lockIcon = require("../../../../assets/img/lock.png");
        const { password, confirm_password, old_password, passwordSecureEntry, confirmPasswordSecureEntry, oldPasswordSecureEntry } = this.props;

        //Password
        this.password = {
            onChangeText: (value) => this.onChangeText(CHANGE_PASSWORD_FORM_PASSWORD, value),
            value: password,
            isError: this.isError('password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Password",
            secureTextEntry: passwordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY, passwordSecureEntry),
            onSubmitEditing: () => { }
        };

        //Old Password
        this.oldPassword = {
            onChangeText: (value) => this.onChangeText(CHANGE_OLD_PASSWORD_FORM_PASSWORD, value),
            value: old_password,
            isError: this.isError('old_password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Old Password",
            secureTextEntry: oldPasswordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY, oldPasswordSecureEntry),
            onSubmitEditing: () => { }
        };

        //Confirm Password
        this.confirmPassword = {
            onChangeText: (value) => this.onChangeText(CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, value),
            value: confirm_password,
            isError: this.isError('confirm_password'),
            autoCapitalize: "none",
            keyboardType: "default",
            leftIcon: lockIcon,
            labelName: "Confirm Password",
            secureTextEntry: confirmPasswordSecureEntry,
            isPassword: true,
            toggleSecureTextEntry: this.toggleSecureTextEntry.bind(this, CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY, confirmPasswordSecureEntry),
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={5} padding={[50, 10]} stretch>
                <Input
                    {...this.oldPassword} />
                <Input
                    {...this.password} />
                <Input
                    {...this.confirmPassword} />
            </WView>
        );
    }
}


const mapToProps = ({ change_password }) => {
    const change_password_key = change_password && change_password[CHANGE_PASSWORD_KEY] ? change_password[CHANGE_PASSWORD_KEY] : {};
    const change_password_form = change_password_key && change_password_key[CHANGE_PASSWORD_FORM] ? change_password_key[CHANGE_PASSWORD_FORM] : {};

    const password = change_password_form && change_password_form[CHANGE_PASSWORD_FORM_PASSWORD] ? change_password_form[CHANGE_PASSWORD_FORM_PASSWORD] : "";
    const confirm_password = change_password_form && change_password_form[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD] ? change_password_form[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD] : "";
    const old_password = change_password_form && change_password_form[CHANGE_OLD_PASSWORD_FORM_PASSWORD] ? change_password_form[CHANGE_OLD_PASSWORD_FORM_PASSWORD] : "";

    const loading = change_password_key && change_password_key[CHANGE_PASSWORD_REQEUST_LOADING] ? change_password_key[CHANGE_PASSWORD_REQEUST_LOADING] : false;
    const errors = change_password_key && change_password_key[CHANGE_PASSWORD_ERRORS] ? change_password_key[CHANGE_PASSWORD_ERRORS] : [];
    const passwordSecureEntry = change_password_key && change_password_key[CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY] ? change_password_key[CHANGE_PASSWORD_TOGGLE_SECURE_ENTRY] : false;
    const confirmPasswordSecureEntry = change_password_key && change_password_key[CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] ? change_password_key[CHANGE_CONFIRM_PASSWORD_TOGGLE_SECURE_ENTRY] : false;
    const oldPasswordSecureEntry = change_password_key && change_password_key[CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY] ? change_password_key[CHANGE_OLD_PASSWORD_TOGGLE_SECURE_ENTRY] : false;

    const request_status = change_password_key && change_password_key[CHANGE_PASSWORD_REQUEST_STATUS] ? change_password_key[CHANGE_PASSWORD_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        password,
        confirm_password,
        old_password,
        loading,
        errors,
        type,
        passwordSecureEntry,
        confirmPasswordSecureEntry,
        oldPasswordSecureEntry
    });
}
export default connect(mapToProps, {
    changePassword,
    updateChangePasswordUIConstraints,
    updateChangePasswordFormData
})(Form);