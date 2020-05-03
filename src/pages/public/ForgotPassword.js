import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { LOGIN_KEY, LOGIN_FORM, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, LOGIN_ERRORS, SUCCESS, ERROR, STATUS, LOGIN_REQEUST_LOADING, LOGIN_REQUEST_STATUS, FORGOT_PASSWORD_KEY, FORGOT_PASSWORD_FORM, FORGOT_PASSWORD_FORM_EMAIL, FORGOT_PASSWORD_ERRORS, FORGOT_PASSWORD_REQEUST_LOADING, FORGOT_PASSWORD_REQUEST_STATUS, SYSTEM_DATA_PAGE_TITLE, MESSAGE } from '../../redux/Types';
import { Helper } from '../../apis'
import { updateFormData, updateUIConstraints, forgotPassword, resetForgotState } from '../../redux/forgot_password/Action';
import Utils from '../../components/util/Utils';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { updateSystemData } from '../../redux/system/Action';

class ForgotPassword extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Forgot Password"
        });
    }

    submit = (e) => {
        e.preventDefault();

        const { email, updateUIConstraints, forgotPassword, loading } = this.props;
        if (loading) return;

        const requestBody = { email };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateUIConstraints({
                        [FORGOT_PASSWORD_ERRORS]: []
                    });

                    forgotPassword();
                } else updateUIConstraints({
                    [FORGOT_PASSWORD_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    onChangeText = (key, value) => {
        const { updateFormData } = this.props;

        updateFormData({
            [key]: value
        });
    }

    _openPage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.push(url);
    }

    componentDidUpdate = (prevProps) => {
        const { reqeustStatus, loading, navigation } = this.props;

        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Your new password has been sent to your email address.");
                    this._openPage('/login');
                    break;
                case ERROR:
                    const status = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].status ? reqeustStatus[MESSAGE].status : 500;
                    switch (status) {
                        case 404:
                            ToastsStore.error("User email is not present.");
                            break;
                        default:
                            ToastsStore.error("Internal server error");
                    }
                    break;
            }
        }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <p className="text-right text-error">{data.message}</p>;

        return <div />
    }

    componentWillUnmount = () => {
        this.resetLoginData();
    }

    resetLoginData = () => {
        const { resetForgotState } = this.props;

        resetForgotState();
    }

    render() {
        const { email, loading } = this.props;

        return (
            <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
                {/* begin:: Page */}
                <div className="kt-grid kt-grid--ver kt-grid--root kt-page height-100">
                    <div className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v3 kt-login--signin" id="kt_login">
                        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" style={{ backgroundImage: 'url(assets/media//bg/bg-3.jpg)' }}>
                            <div className="kt-grid__item kt-grid__item--fluid kt-login__wrapper">
                                <div className="kt-login__container">
                                    <div className="kt-login__logo">
                                        <a href="#">
                                            <img src="/small-logo.png" />
                                        </a>
                                    </div>
                                    <div className="kt-login__signin">
                                        <div className="kt-login__head">
                                            <h3 className="kt-login__title">Forgot Password ?</h3>
                                        </div>
                                        <form className="kt-form" onSubmit={this.submit.bind(this)}>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="Email" name="email" onChange={(e) => this.onChangeText(FORGOT_PASSWORD_FORM_EMAIL, e.target.value)} autoComplete="off" value={email} />
                                            </div>
                                            {/* display error */}
                                            {this._handleErrorMessage("email")}
                                            <div className="kt-login__actions">
                                                <button type="submit" id="kt_login_signin_submit" className="btn btn-brand btn-elevate kt-login__btn-primary">{ loading ? "Loading..." : "Submit"}</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* end:: Page */}
            </div>
        )
    }
}

const mapToProps = ({ forgot_password }) => {
    const forgot_password_data = forgot_password && forgot_password[FORGOT_PASSWORD_KEY] ? forgot_password[FORGOT_PASSWORD_KEY] : undefined;
    const formData = forgot_password_data && forgot_password_data[FORGOT_PASSWORD_FORM] ? forgot_password_data[FORGOT_PASSWORD_FORM] : undefined;
    const email = formData && formData[FORGOT_PASSWORD_FORM_EMAIL] ? formData[FORGOT_PASSWORD_FORM_EMAIL] : undefined;
    const errors = forgot_password_data && forgot_password_data[FORGOT_PASSWORD_ERRORS] ? forgot_password_data[FORGOT_PASSWORD_ERRORS] : [];
    const loading = forgot_password_data && forgot_password_data[FORGOT_PASSWORD_REQEUST_LOADING] ? forgot_password_data[FORGOT_PASSWORD_REQEUST_LOADING] : false;
    const reqeustStatus = forgot_password_data && forgot_password_data[FORGOT_PASSWORD_REQUEST_STATUS] ? forgot_password_data[FORGOT_PASSWORD_REQUEST_STATUS] : {};

    console.log("errors ===> forgot password", errors);

    return ({
        email,
        errors,
        loading,
        reqeustStatus
    });
}

export default connect(mapToProps, {
    updateFormData,
    updateUIConstraints,
    updateSystemData,
    forgotPassword,
    resetForgotState
})(ForgotPassword);