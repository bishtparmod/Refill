import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1, SALES_DELIVERYCHARGES_KEY, DELIVERYCHARGES_FORM, SALESTAX_FORM, SALESTAX_VALUE, DELIVERYCHARGES_VALUE, SALESTAX_FORM_ERROR, SALESTAX_FORM_LOADING, DELIVERYCHARGES_FORM_ERROR, DELIVERYCHARGES_FORM_LOADING, DELIVERYCHARGES_AMOUNT, TOKEN_NOT_FOUND, SERVER_NO_VALUE, SERVER_VALIDATION_ERROR } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import { } from '../../../redux/Types'
import { updateEditSalestaxFormData, editDeliveryCharge, editSalesTax, updateSalestaxUIConstraints, updateSalestaxState, getSalestaxviaId, updateEditDeliveryChargeFormData } from '../../../redux/SalesTax/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCroper from '../../../components/dashboard/ImageCroper'

class SalesTax extends PureComponent {

    componentDidMount() {
        const { getSalestaxviaId } = this.props
        getSalestaxviaId()
    }

    onChangeText = (key, value) => {
        const { updateEditSalestaxFormData } = this.props;

        updateEditSalestaxFormData({
            [key]: value
        });
    }

    onChangeText1 = (key, value) => {
        const { updateEditDeliveryChargeFormData } = this.props;

        updateEditDeliveryChargeFormData({
            [key]: value
        });
    }

    isError = (key) => {
        const { SalesTaxErrors, deliverchargeErrors } = this.props;

        if ((SalesTaxErrors && SalesTaxErrors.length) || (deliverchargeErrors && deliverchargeErrors.length)) {
            const test = SalesTaxErrors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: SalesTaxErrors[SalesTaxErrors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" }

            const test1 = deliverchargeErrors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: deliverchargeErrors[deliverchargeErrors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" }
            return { test, test1 }
        } else {
            const test = { status: false, message: "" }
            const test1 = { status: false, message: "" }
            return { test, test1 }
        }


    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);
        if (data && data.test.status) return <span className="form-text text-error text-right">{data.test.message}</span>;
        if (data && data.test1.status) return <span className="form-text text-error text-right">{data.test1.message}</span>;

        return <div />
    }


    submit1 = (e) => {
        const { updateEditSalestaxFormData, updateSalestaxUIConstraints, editSalesTax } = this.props
        e.preventDefault();
        updateEditSalestaxFormData({
            [SALESTAX_FORM_LOADING]: true
        });

        const { SalesTaxValue, SalesTaxloading } = this.props
        if (SalesTaxloading) return;

        const requestBody = {
            SalesTaxValue
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSalestaxUIConstraints({
                        [SALESTAX_FORM_ERROR]: []
                    });
                    editSalesTax()
                } else {
                    updateSalestaxUIConstraints({
                        [SALESTAX_FORM_ERROR]: response && response.length ? response : []
                    });
                    updateEditSalestaxFormData({
                        [SALESTAX_FORM_LOADING]: false
                    });
                }
            }).catch(err => {
                updateEditSalestaxFormData({
                    [SALESTAX_FORM_LOADING]: false
                });
                console.log(err)
            });
    }

    submit2 = (e) => {
        const { updateEditDeliveryChargeFormData, updateSalestaxUIConstraints, editDeliveryCharge } = this.props
        e.preventDefault();
        updateEditDeliveryChargeFormData({
            [DELIVERYCHARGES_FORM_LOADING]: true
        });

        const { deliverchargeValue, deliverchargeloading, deliverchargeAmount } = this.props
        if (deliverchargeloading) return;

        const requestBody = {
            deliverchargeValue,
            deliverchargeAmount
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSalestaxUIConstraints({
                        [DELIVERYCHARGES_FORM_ERROR]: []
                    });

                    editDeliveryCharge()
                } else {
                    updateSalestaxUIConstraints({
                        [DELIVERYCHARGES_FORM_ERROR]: response && response.length ? response : []
                    });
                    updateEditDeliveryChargeFormData({
                        [DELIVERYCHARGES_FORM_LOADING]: false
                    });
                }
            }).catch(err => {
                updateEditDeliveryChargeFormData({
                    [DELIVERYCHARGES_FORM_LOADING]: false
                });
                console.log(err)
            });
    }

    componentDidUpdate = (prevProps) => {
        const { requestStatus } = this.props;

        const prevReqeustStatus = prevProps && prevProps.requestStatus ? prevProps.requestStatus : {};
        if (requestStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (requestStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Salestax successfully Updated", 3000);
                    this.onChangeText(SALESTAX_FORM_LOADING, false)
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    this.onChangeText(SALESTAX_FORM_LOADING, false)
                    break;
                case ERROR:
                    const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    const emptyKeys = requestStatus[MESSAGE] && requestStatus[MESSAGE].emptyKeys ? requestStatus[MESSAGE].emptyKeys : [];

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            const fields = ["sales_tax"];
                            const index = emptyKeys.findIndex(ele => fields.indexOf(ele.fieldName) !== -1);

                            if (index === -1) {
                                ToastsStore.error("Validation error, Please try again", 3000);
                                this.onChangeText(SALESTAX_FORM_LOADING, false)
                            }
                            else{
                                 ToastsStore.error(emptyKeys[index].message, 6000);
                                 this.onChangeText(SALESTAX_FORM_LOADING, false)
                                }
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Saletax not Found, Please try again", 3000);
                            this.onChangeText(SALESTAX_FORM_LOADING, false)
                            break;
                        default:
                    }
                    break;
            }
        }
    }


    render() {
        const { SalesTaxValue, deliverchargeValue, deliverchargeAmount, deliverchargeloading, SalesTaxloading } = this.props
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                SalesTax & DeliveryCharges </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a className="kt-subheader__breadcrumbs-link">
                                    Forms </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="row">
                        <div className="col-md-6">

                            {/* <!--begin::Portlet--> */}
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Sales Tax
                                </h3>
                                    </div>
                                </div>

                                {/* <!--begin::Form--> */}
                                <form className="kt-form"
                                    onSubmit={this.submit1.bind(this)}
                                >
                                    <div className="kt-portlet__body">
                                        <div className="form-group">
                                            <label>SalesTax</label>
                                            <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Tax value"
                                                onChange={(e) => this.onChangeText(SALESTAX_VALUE, e.target.value)} value={SalesTaxValue}
                                            />
                                            {this._handleErrorMessage("SalesTaxValue")}
                                        </div>
                                    </div>
                                    <div className="kt-portlet__foot">
                                        <div className="kt-form__actions">
                                            <button type="submit" className="btn btn-primary">{SalesTaxloading ? "Loading.. " : "Submit"}</button>
                                            <button type="reset" className="btn btn-secondary">Cancel</button>
                                        </div>
                                    </div>
                                </form>

                                {/* <!--end::Form--> */}
                            </div>

                            {/* <!--end::Portlet--> */}

                            {/* <!--begin::Portlet--> */}

                        </div>
                        <div className="col-md-6">

                            {/* <!--begin::Portlet--> */}
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Delivery Charges
                                    </h3>
                                    </div>
                                </div>

                                {/* <!--begin::Form--> */}
                                <form className="kt-form"
                                    onSubmit={this.submit2.bind(this)}
                                >
                                    <div className="kt-portlet__body">
                                        <div className="form-group form-group-last">

                                            <div className="alert alert-secondary" role="alert">
                                                <div className="alert-icon"><i className="flaticon-warning kt-font-brand"></i></div>
                                                <div className="alert-text" >
                                                    Applicable on amount less then {deliverchargeAmount}
                                                </div>
                                            </div>

                                        </div>
                                        <div className="form-group">
                                            <label>Delivery Charges</label>
                                            <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Delivery Charges"
                                                onChange={(e) => this.onChangeText1(DELIVERYCHARGES_VALUE, e.target.value)} value={deliverchargeValue}
                                            />
                                            {this._handleErrorMessage("deliverchargeValue")}
                                        </div>
                                        <div className="form-group">
                                            <label>Delivery Charges limit</label>
                                            <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Delivery Charges"
                                                onChange={(e) => this.onChangeText1(DELIVERYCHARGES_AMOUNT, e.target.value)} value={deliverchargeAmount}
                                            />
                                            {this._handleErrorMessage("deliverchargeAmount")}
                                        </div>
                                    </div>
                                    <div className="kt-portlet__foot">
                                        <div className="kt-form__actions">
                                            <button type="submit" className="btn btn-primary">{deliverchargeloading ? "Loading..." : "Submit"}</button>
                                            <button type="reset" className="btn btn-secondary">Cancel</button>
                                        </div>
                                    </div>
                                </form>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(({ sales_deliverycharges }) => {
    const SalesTax_data = sales_deliverycharges[SALES_DELIVERYCHARGES_KEY]
    const DeliveryCharge_data = sales_deliverycharges[SALES_DELIVERYCHARGES_KEY]
    const SalesTaxForm_data = sales_deliverycharges[SALES_DELIVERYCHARGES_KEY][SALESTAX_FORM]
    const DeliveryChargeForm_data = sales_deliverycharges[SALES_DELIVERYCHARGES_KEY][DELIVERYCHARGES_FORM]
    return ({
        requestStatus: SalesTax_data.sales_deliverycharges_request_sattus,

        SalesTaxValue: SalesTaxForm_data.salestax_value,
        SalesTaxloading: SalesTaxForm_data.salestax_form_loading,
        SalesTaxErrors: SalesTax_data.salestax_form_error,

        deliverchargeAmount: DeliveryChargeForm_data.deliverycharges_amount,
        deliverchargeValue: DeliveryChargeForm_data.deliverycharges_value,
        deliverchargeloading: DeliveryChargeForm_data.deliverycharges_form_loading,
        deliverchargeErrors: DeliveryCharge_data.deliverycharges_form_error
    })
}, {
    updateEditSalestaxFormData,
    updateSalestaxUIConstraints,
    updateEditDeliveryChargeFormData,
    updateSalestaxState,
    getSalestaxviaId,
    editDeliveryCharge,
    editSalesTax
})(SalesTax)