import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { LOGIN_KEY, LOGIN_FORM, LOGIN_FORM_EMAIL, LOGIN_FORM_PASSWORD, LOGIN_ERRORS, SUCCESS, ERROR, STATUS, LOGIN_REQEUST_LOADING, LOGIN_REQUEST_STATUS, MESSAGE, SYSTEM_DATA_PAGE_TITLE } from '../../redux/Types';
import { Helper } from '../../apis'
import { updateFormData, updateUIConstraints, login, resetLoginState } from '../../redux/login/Action';
import Utils from '../../components/util/Utils';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { updateSystemData } from '../../redux/system/Action';

class Login extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Login"
        });
    }

    _openPage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.push(url);
    }

    submit = (e) => {
        e.preventDefault();

        const { email, password, updateUIConstraints, login, loading } = this.props;
        if (loading) return;

        const requestBody = { email, user_password: password };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateUIConstraints({
                        [LOGIN_ERRORS]: []
                    });

                    login();
                } else updateUIConstraints({
                    [LOGIN_ERRORS]: response && response.length ? response : []
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

    componentDidUpdate = (prevProps) => {
        const { reqeustStatus, loading, navigation } = this.props;

        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:

                    break;
                case ERROR:
                    const status = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].status ? reqeustStatus[MESSAGE].status : 500;
                    switch (status) {
                        case 401:
                            ToastsStore.error("Either email or password is incorrect");
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
        const { resetLoginState } = this.props;

        resetLoginState();
    }

    render() {
        const { email, password, loading } = this.props;

        return (
            <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
                <ToastsContainer store={ToastsStore} lightBackground position={ToastsContainerPosition.TOP_RIGHT} />

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
                                            <h3 className="kt-login__title">Sign In To Admin</h3>
                                        </div>
                                        <form className="kt-form" onSubmit={this.submit.bind(this)}>
                                            <div className="input-group">
                                                <input className="form-control" type="text" placeholder="Email" name="email" onChange={(e) => this.onChangeText(LOGIN_FORM_EMAIL, e.target.value)} autoComplete="off" value={email} />
                                            </div>
                                            {/* display error */}
                                            {this._handleErrorMessage("email")}
                                            <div className="input-group">
                                                <input className="form-control" type="password" placeholder="Password" onChange={(e) => this.onChangeText(LOGIN_FORM_PASSWORD, e.target.value)} name="password" value={password} />
                                            </div>
                                            {/* display error */}
                                            {this._handleErrorMessage("user_password")}
                                            <div className="row kt-login__extra">
                                                <div className="col kt-align-right">
                                                    <a id="kt_login_forgot" className="kt-login__link refill-cursor" onClick={this._openPage.bind(this, '/forgot_password')}>Forgot Password ?</a>
                                                </div>
                                            </div>
                                            <div className="kt-login__actions">
                                                <button type="submit" id="kt_login_signin_submit" className="btn btn-brand btn-elevate kt-login__btn-primary">{loading ? "Loading..." : "Sign In"}</button>
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

const mapToProps = (state) => {
    const { login } = state;
    const login_data = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : undefined;
    const formData = login_data && login_data[LOGIN_FORM] ? login_data[LOGIN_FORM] : undefined;
    const email = formData && formData[LOGIN_FORM_EMAIL] ? formData[LOGIN_FORM_EMAIL] : undefined;
    const password = formData && formData[LOGIN_FORM_PASSWORD] ? formData[LOGIN_FORM_PASSWORD] : undefined;
    const errors = login_data && login_data[LOGIN_ERRORS] ? login_data[LOGIN_ERRORS] : [];
    const loading = login_data && login_data[LOGIN_REQEUST_LOADING] ? login_data[LOGIN_REQEUST_LOADING] : false;
    const reqeustStatus = login_data && login_data[LOGIN_REQUEST_STATUS] ? login_data[LOGIN_REQUEST_STATUS] : {};

    return ({
        email,
        password,
        errors,
        loading,
        reqeustStatus
    });
}

export default connect(mapToProps, {
    updateFormData,
    updateUIConstraints,
    login,
    updateSystemData,
    resetLoginState
})(Login);