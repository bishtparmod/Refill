import React, { PureComponent } from 'react';
import PropTypes from 'react-native';
import { Keyboard } from 'react-native';
import { WView, WText, WTouchable } from '../../ui'
import { Input } from '../../base_components';
import { FORGOT_PASSWORD_FORM_EMAIL, FORGOT_PASSWORD_ERRORS, FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_REQEUST_LOADING, FORGOT_PASSWORD_REQUEST_STATUS, STATUS, SUCCESS } from '../../../redux/Types';
import { updateForgotPasswordFormData, updateForgotPasswordUIConstraints, forgotPassword } from '../../../redux/forgotPassword/Action';
import { connect } from 'react-redux'
import { Helper } from '../../../apis';
import Utils from '../../util/Utils';

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
        const { updateForgotPasswordFormData, loading } = this.props;
        if (loading) return;

        updateForgotPasswordFormData({
            [key]: value
        });
    }

    submit = () => {
        const { email, loading, updateForgotPasswordUIConstraints, forgotPassword } = this.props;
        const requestBody = { email };
        Keyboard.dismiss();

        if (loading) return;

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                Utils.log(" response ===> ", response);
                if (status) {
                    updateForgotPasswordUIConstraints({
                        [FORGOT_PASSWORD_ERRORS]: []
                    });

                    //Forgot password action
                    forgotPassword();
                } else updateForgotPasswordUIConstraints({
                    [FORGOT_PASSWORD_ERRORS]: response && response.length ? response : []
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

    render() {
        const { email } = this.props;
        const emailIcon = require("../../../../assets/img/email.png");

        //Email
        this.email = {
            onChangeText: (value) => this.onChangeText(FORGOT_PASSWORD_FORM_EMAIL, value),
            autoCapitalize: "none",
            value: email,
            isError: this.isError('email'),
            keyboardType: "email-address",
            leftIcon: emailIcon,
            labelName: "Email",
            onSubmitEditing: () => { }
        };

        return (
            <WView dial={5} padding={[50, 10]} stretch>
                <Input
                    {...this.email} />
            </WView>
        );
    }
}

const mapToProps = ({ forgot_password }) => {
    const forgot_password_key = forgot_password && forgot_password[FORGOT_PASSWORD_KEY] ? forgot_password[FORGOT_PASSWORD_KEY] : {};
    const forgot_password_form = forgot_password_key && forgot_password_key[FORGOT_PASSWORD_FORM] ? forgot_password_key[FORGOT_PASSWORD_FORM] : {};

    const email = forgot_password_form && forgot_password_form[FORGOT_PASSWORD_FORM_EMAIL] ? forgot_password_form[FORGOT_PASSWORD_FORM_EMAIL] : "";

    const loading = forgot_password_key && forgot_password_key[FORGOT_PASSWORD_REQEUST_LOADING] ? forgot_password_key[FORGOT_PASSWORD_REQEUST_LOADING] : false;
    const errors = forgot_password_key && forgot_password_key[FORGOT_PASSWORD_ERRORS] ? forgot_password_key[FORGOT_PASSWORD_ERRORS] : [];

    const request_status = forgot_password_key && forgot_password_key[FORGOT_PASSWORD_REQUEST_STATUS] ? forgot_password_key[FORGOT_PASSWORD_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';

    return ({
        email,
        loading,
        errors,
        type
    });
}

export default connect(mapToProps, {
    updateForgotPasswordFormData,
    forgotPassword,
    updateForgotPasswordUIConstraints
})(Form);