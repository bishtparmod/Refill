import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { updateFormData, updateUIConstraints, changePassword } from '../../../redux/change_password/Action';
import { Helper } from '../../../apis'
import Utils from '../../../components/util/Utils';
import { CHANGE_PASSWORD_KEY, CHANGE_PASSWORD_FORM, CHANGE_PASSWORD_FORM_PASSWORD, CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, CHANGE_PASSWORD_ERRORS, CHANGE_PASSWORD_REQEUST_LOADING, CHANGE_PASSWORD_REQUEST_STATUS, CHANGE_PASSWORD_FORM_OLD_PASSWORD, STATUS, SUCCESS, ERROR, MESSAGE, SERVER_NO_VALUE, TOKEN_NOT_FOUND, SYSTEM_DATA_PAGE_TITLE } from '../../../redux/Types';
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { updateSystemData } from '../../../redux/system/Action';

class ChangePassword extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Change Password"
        });
    }

    submit = (e) => {
        e.preventDefault();

        const { old_password, password, confirm_password, updateUIConstraints, loading, changePassword } = this.props;
        if (loading) return;

        const requestBody = {
            old_password,
            password,
            confirm_password
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateUIConstraints({
                        [CHANGE_PASSWORD_ERRORS]: []
                    });

                    changePassword();
                } else updateUIConstraints({
                    [CHANGE_PASSWORD_ERRORS]: response && response.length ? response : []
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
                    ToastsStore.success("Password successfully changed.");
                    break;
                case ERROR:
                    const message = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].message ? reqeustStatus[MESSAGE].message : null;

                    switch (message) {
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Old password is entered incorrectly.");
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

    render() {
        const { loading } = this.props;

        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
                <ToastsContainer store={ToastsStore} lightBackground position={ToastsContainerPosition.TOP_RIGHT} />

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Profile </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a  className="kt-subheader__breadcrumbs-link">
                                    Change Password </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                    {/* <!--begin::Portlet--> */}
                    <div className="row">
                        <div className="col-lg-12">

                            {/* <!--begin::Portlet--> */}
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Change Password
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
                                            <label className="col-form-label col-lg-3 col-sm-12">Old Password *</label>
                                            <div className="col-lg-9 col-md-9 col-sm-12">
                                                <input type="password" className="form-control" name="old_password" onChange={(e) => this.onChangeText(CHANGE_PASSWORD_FORM_OLD_PASSWORD, e.target.value)} placeholder="Enter old password" />
                                                {/* display error */}
                                                {this._handleErrorMessage("old_password")}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-sm-12">New Password *</label>
                                            <div className="col-lg-9 col-md-9 col-sm-12">
                                                <input type="password" className="form-control" name="password" onChange={(e) => this.onChangeText(CHANGE_PASSWORD_FORM_PASSWORD, e.target.value)} placeholder="Enter new password" />
                                                {/* display error */}
                                                {this._handleErrorMessage("password")}
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-form-label col-lg-3 col-sm-12">Confirm Password *</label>
                                            <div className="col-lg-9 col-md-9 col-sm-12">
                                                <input type="password" className="form-control" name="confirm_password" onChange={(e) => this.onChangeText(CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD, e.target.value)} placeholder="Enter confirm password" />
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


const mapToProps = ({ change_password }) => {
    const change_password_data = change_password && change_password[CHANGE_PASSWORD_KEY] ? change_password[CHANGE_PASSWORD_KEY] : undefined;
    const formData = change_password_data && change_password_data[CHANGE_PASSWORD_FORM] ? change_password_data[CHANGE_PASSWORD_FORM] : undefined;
    const old_password = formData && formData[CHANGE_PASSWORD_FORM_OLD_PASSWORD] ? formData[CHANGE_PASSWORD_FORM_OLD_PASSWORD] : undefined;
    const password = formData && formData[CHANGE_PASSWORD_FORM_PASSWORD] ? formData[CHANGE_PASSWORD_FORM_PASSWORD] : undefined;
    const confirm_password = formData && formData[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD] ? formData[CHANGE_PASSWORD_FORM_CONFIRM_PASSWORD] : undefined;
    const errors = change_password_data && change_password_data[CHANGE_PASSWORD_ERRORS] ? change_password_data[CHANGE_PASSWORD_ERRORS] : [];
    const loading = change_password_data && change_password_data[CHANGE_PASSWORD_REQEUST_LOADING] ? change_password_data[CHANGE_PASSWORD_REQEUST_LOADING] : false;
    const reqeustStatus = change_password_data && change_password_data[CHANGE_PASSWORD_REQUEST_STATUS] ? change_password_data[CHANGE_PASSWORD_REQUEST_STATUS] : {};

    return ({
        old_password,
        confirm_password,
        password,
        errors,
        loading,
        reqeustStatus
    });
}

export default connect(mapToProps, {
    updateFormData,
    updateUIConstraints,
    changePassword,
    updateSystemData
})(ChangePassword);