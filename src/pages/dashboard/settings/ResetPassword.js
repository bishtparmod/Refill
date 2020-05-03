import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { updateFormData, updateUIConstraints, resetPassword, resetResetDataState } from '../../../redux/reset_password/Action';
import { Helper } from '../../../apis'
import Utils from '../../../components/util/Utils';
import { RESET_PASSWORD_KEY, RESET_PASSWORD_FORM, RESET_PASSWORD_ERRORS, RESET_PASSWORD_REQEUST_LOADING, RESET_PASSWORD_REQUEST_STATUS, RESET_PASSWORD_FORM_PASSWORD, RESET_PASSWORD_FORM_CONFIRM_PASSWORD, STATUS, SUCCESS, ERROR, HEADER_IS_SHOW, SIDEBAR_IS_SHOW, FOOTER_IS_SHOW, USER_KEY, USER_DATA, DEACTIVE, MESSAGE, SERVER_NO_VALUE, TOKEN_NOT_FOUND } from '../../../redux/Types';
import { updateSidebarUIConstraints } from '../../../redux/sidebar/Action';
import { updateHeaderUIConstraints } from '../../../redux/header/Action';
import { updateFooterUIConstraints } from '../../../redux/footer/Action';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { sessionLogin } from '../../../redux/login/Action';

class ResetPassword extends PureComponent {
    static propTypes = {

    }

    constructor(props) {
        super(props);

        this.hideHeaderAndSidebar();
    }

    componentDidMount = () => {
        const { is_reset_password } = this.props;

        if (is_reset_password === DEACTIVE) this._replacePage('/');
    }

    _replacePage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.replace(url);
    }

    componentWillUnmount = () => {
        this.showHeaderAndSidebar();
        this.resetData();
    }

    hideHeaderAndSidebar = () => {
        const { updateSidebarUIConstraints, updateHeaderUIConstraints, updateFooterUIConstraints } = this.props;

        updateSidebarUIConstraints({
            [SIDEBAR_IS_SHOW]: true
        });
        updateHeaderUIConstraints({
            [HEADER_IS_SHOW]: true
        });
        updateFooterUIConstraints({
            [FOOTER_IS_SHOW]: true
        });
    }

    showHeaderAndSidebar = () => {
        const { updateSidebarUIConstraints, updateHeaderUIConstraints, updateFooterUIConstraints } = this.props;

        updateSidebarUIConstraints({
            [SIDEBAR_IS_SHOW]: false
        });
        updateHeaderUIConstraints({
            [HEADER_IS_SHOW]: false
        });
        updateFooterUIConstraints({
            [FOOTER_IS_SHOW]: false
        });
    }

    submit = (e) => {
        e.preventDefault();

        const { password, confirm_password, updateUIConstraints, resetPassword, loading } = this.props;
        if (loading) return;

        const requestBody = {
            password,
            confirm_password
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateUIConstraints({
                        [RESET_PASSWORD_ERRORS]: []
                    });

                    resetPassword();
                } else updateUIConstraints({
                    [RESET_PASSWORD_ERRORS]: response && response.length ? response : []
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
        const { reqeustStatus, loading, navigation, sessionLogin } = this.props;
        const { is_reset_password } = this.props;

        if (is_reset_password !== prevProps.is_reset_password) {
            alert("reset password" + is_reset_password);
            if (is_reset_password === DEACTIVE) this._replacePage('/');
        }

        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Password changed successfully.");
                    sessionLogin();
                    break;
                case ERROR:
                    const message = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].message ? reqeustStatus[MESSAGE].message : null;

                    switch (message) {
                        case SERVER_NO_VALUE:
                            ToastsStore.error("No Record Found.");
                            break;
                        case TOKEN_NOT_FOUND:
                            ToastsStore.error("User token is not available.");
                            break;
                    }

                    break;
            }
        }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <span className="form-text text-right text-error">{data.message}</span>;

        return <div />
    }

    resetData = () => {
        const { resetResetDataState } = this.props;

        resetResetDataState();
    }

    render() {
        const { loading } = this.props;

        return (
            <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                    {/* <!--begin::Portlet--> */}
                    <div className="row">
                        <div className="offset-lg-2 col-lg-8">

                            {/* <!--begin::Portlet--> */}
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Reset Password
														</h3>
                                    </div>
                                </div>

                                {/* <!--begin::Form--> */}
                                <form className="kt-form kt-form--label-right" id="kt_form_1" onSubmit={this.submit.bind(this)}>
                                    <div className="kt-portlet__body">
                                        <div className="form-group form-group-last kt-hide">
                                            <div className="alert alert-danger" role="alert" id="kt_form_1_msg">
                                                <div className="alert-icon"><i className="flaticon-warning"></i></div>
                                                <div className="alert-text">
                                                    Oh snap! Change a few things up and try submitting again.
																</div>
                                                <div className="alert-close">
                                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                                        <span aria-hidden="true"><i className="la la-close"></i></span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-sm-12">New Password *</label>
                                            <div className="col-lg-9 col-md-9 col-sm-12">
                                                <input type="password" className="form-control" name="password" onChange={(e) => this.onChangeText(RESET_PASSWORD_FORM_PASSWORD, e.target.value)} placeholder="Enter new password" />
                                                {/* display error */}
                                                {this._handleErrorMessage("password")}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-sm-12">Confirm Password *</label>
                                            <div className="col-lg-9 col-md-9 col-sm-12">
                                                <input type="password" className="form-control" name="confirm_password" onChange={(e) => this.onChangeText(RESET_PASSWORD_FORM_CONFIRM_PASSWORD, e.target.value)} placeholder="Enter confirm password" />
                                                {/* display error */}
                                                {this._handleErrorMessage("confirm_password")}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="kt-portlet__foot">
                                        <div className="kt-form__actions">
                                            <div className="row">
                                                <div className="col-lg-9 ml-lg-auto">
                                                    <button type="submit" className="btn btn-brand">{loading ? "Loading..." : "Submit"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {/* <!--end::Form--> */}
                            </div>

                            {/* <!--end::Portlet--> */}
                        </div>

                    </div>
                </div>

                {/* <!-- end:: Content --> */}
            </div>
        )
    }
}

const mapToProps = ({ reset_password, user }) => {
    const reset_password_data = reset_password && reset_password[RESET_PASSWORD_KEY] ? reset_password[RESET_PASSWORD_KEY] : undefined;
    const formData = reset_password_data && reset_password_data[RESET_PASSWORD_FORM] ? reset_password_data[RESET_PASSWORD_FORM] : undefined;
    const password = formData && formData[RESET_PASSWORD_FORM_PASSWORD] ? formData[RESET_PASSWORD_FORM_PASSWORD] : undefined;
    const confirm_password = formData && formData[RESET_PASSWORD_FORM_CONFIRM_PASSWORD] ? formData[RESET_PASSWORD_FORM_CONFIRM_PASSWORD] : undefined;
    const errors = reset_password_data && reset_password_data[RESET_PASSWORD_ERRORS] ? reset_password_data[RESET_PASSWORD_ERRORS] : [];
    const loading = reset_password_data && reset_password_data[RESET_PASSWORD_REQEUST_LOADING] ? reset_password_data[RESET_PASSWORD_REQEUST_LOADING] : false;
    const reqeustStatus = reset_password_data && reset_password_data[RESET_PASSWORD_REQUEST_STATUS] ? reset_password_data[RESET_PASSWORD_REQUEST_STATUS] : {};
    const user_data = user && user[USER_KEY] ? user[USER_KEY] : undefined;
    const is_reset_password = user_data && user_data[USER_DATA] && user_data[USER_DATA].reset_password ? user_data[USER_DATA].reset_password : 0;

    console.log("errors ===> forgot password", errors);

    return ({
        password,
        confirm_password,
        errors,
        loading,
        reqeustStatus,
        is_reset_password
    });
}

export default connect(mapToProps, {
    updateFormData,
    updateUIConstraints,
    updateSidebarUIConstraints,
    updateHeaderUIConstraints,
    updateFooterUIConstraints,
    sessionLogin,
    resetPassword,
    resetResetDataState
})(ResetPassword);