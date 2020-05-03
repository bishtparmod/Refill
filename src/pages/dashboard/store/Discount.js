import React, { PureComponent } from 'react'
import { SelectCalendar, UploadImageContainer } from '../../../components/dashboard/product'
import SelectCategory from '../../../components/dashboard/store/Selectcategory'
import Selectsubcategory from '../../../components/dashboard/store/Selectsubcategory'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1, DISCOUNT_KEY, DISCOUNT_FORM, DISCOUNT_CATEGORY, DISCOUNT_SUBCATEGORY, DISCOUNT_START_DATE, DISCOUNT_END_DATE, DISCOUNT_DISCRIPTION, DISCOUNT_PERCENTAGE, DISCOUNT_FORM_ERROR, DISCOUNT_FORM_LOADING, DISCOUNT_TYPE, DISCOUNT_REQUEST_STATUS, TOKEN_NOT_FOUND, SERVER_VALIDATION_ERROR, SERVER_NO_VALUE } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { refillAddSubCategory } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import { } from '../../../redux/Types'
import { updateEditDiscountFormData, updateDiscountUIConstraints, updateDiscountState, makeOffer, resetOfferDataState } from '../../../redux/discount/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCroper from '../../../components/dashboard/ImageCroper'
import DiscountTable from '../../../components/dashboard/store/DiscountTable'

class Discount extends PureComponent {

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        this.initCalendar();
        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Discount and Offer"
        });
    }

    initCalendar = () => {
        var arrows;
        if (window.KTUtil.isRTL()) {
            arrows = {
                leftArrow: '<i className="la la-angle-right"></i>',
                rightArrow: '<i className="la la-angle-left"></i>'
            }
        } else {
            arrows = {
                leftArrow: '<i className="la la-angle-left"></i>',
                rightArrow: '<i className="la la-angle-right"></i>'
            }
        }

        window.$('#offer_start_date').datepicker({
            rtl: window.KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        }).on("changeDate", function (e) {
        });

        window.$('#offer_end_date').datepicker({
            rtl: window.KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });
    }

    resetCalendar = () => {
        window.$('#offer_start_date').datepicker('setDate', null);
        window.$('#offer_end_date').datepicker('setDate', null);
    }

    onChangeText = (key, value) => {
        const { updateEditDiscountFormData } = this.props;
        updateEditDiscountFormData({
            [key]: value
        });
    }

    isError = (key) => {
        const { errors } = this.props;
        console.log(errors)
        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    _resetRadioButton() {
        // document.getElementById('all').checked = false;
        document.getElementById('category').checked = false;
        document.getElementById('subcategory').checked = false;
        document.getElementById('product').checked = false;
    }

    submit = (e) => {

        const { updateEditDiscountFormData, updateDiscountUIConstraints, loading, makeOffer } = this.props
        e.preventDefault();
        updateEditDiscountFormData({
            [DISCOUNT_FORM_LOADING]: true
        });

        const { discountCategory, discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate, discountSubcategory, discountProductId } = this.props
        if (loading) return;
        var requestBody
        if (discountType === "All") {
            requestBody = {
                discountDescription, discountEnddate, discountPercentage, discountStartdate
            };
        } else if (discountType === "Category") {
            requestBody = {
                discountCategory, discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate
            };
        } else if (discountType === "Subcategory") {
            requestBody = {
                discountCategory, discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate, discountSubcategory
            };
        } else if (discountType === "Product") {
            requestBody = {
                discountCategory, discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate, discountSubcategory, discountProductId
            };
        } else {
            requestBody = {
                discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate
            };
        }


        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateDiscountUIConstraints({
                        [DISCOUNT_FORM_ERROR]: []
                    });
                    makeOffer()
                } else {
                    updateDiscountUIConstraints({
                        [DISCOUNT_FORM_ERROR]: response && response.length ? response : []
                    });
                    updateEditDiscountFormData({
                        [DISCOUNT_FORM_LOADING]: false
                    });
                }
            }).catch(err => {
                updateEditDiscountFormData({
                    [DISCOUNT_FORM_LOADING]: false
                });
                console.log(err)
            });
    }

    componentDidUpdate = (prevProps) => {
        const { requestStatus, resetOfferDataState } = this.props;

        const prevReqeustStatus = prevProps && prevProps.requestStatus ? prevProps.requestStatus : {};
        if (requestStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (requestStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Offer successfully enabled", 3000);
                    resetOfferDataState();
                    this.resetCalendar();
                    this._resetRadioButton();
                    break;
                case TOKEN_NOT_FOUND:
                    ToastsStore.error("Token not available, Please try again", 3000);
                    break;
                case ERROR:
                    const status = requestStatus[MESSAGE] && requestStatus[MESSAGE].message ? requestStatus[MESSAGE].message : '';
                    const emptyKeys = requestStatus[MESSAGE] && requestStatus[MESSAGE].emptyKeys ? requestStatus[MESSAGE].emptyKeys : [];

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            const fields = ["discount", "start_date", "end_date"];
                            const index = emptyKeys.findIndex(ele => fields.indexOf(ele.fieldName) !== -1);

                            if (index === -1)
                                ToastsStore.error("Validation error, Please try again", 3000);
                            else ToastsStore.error(emptyKeys[index].message, 6000);
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Product not Found, Please try again", 3000);
                            break;
                        default:
                    }
                    break;
            }
        }
    }


    render() {
        const { discountCategory, discountType, discountDescription, discountEnddate, discountPercentage, discountStartdate, discountSubcategory, loading } = this.props
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Discount & Offers</h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a href="" className="kt-subheader__breadcrumbs-link">
                                    Forms </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="row">
                        <div className="col-md-8 mx-auto ">

                            {/* <!--begin::Portlet--> */}
                            <div className="kt-portlet">
                                <div className="kt-portlet__head">
                                    <div className="kt-portlet__head-label">
                                        <h3 className="kt-portlet__head-title">
                                            Discount & Offers
                                </h3>
                                    </div>
                                </div>

                                {/* <!--begin::Form--> */}
                                <form className="kt-form"
                                    onSubmit={this.submit.bind(this)}
                                >
                                    <div className="kt-portlet__body">
                                        <div className="form-group ">
                                            <label htmlFor="exampleTextarea">Description</label>
                                            <textarea className="form-control" rows="3"
                                                onChange={(e) => this.onChangeText(DISCOUNT_DISCRIPTION, e.target.value)} value={discountDescription}
                                            ></textarea>
                                            {this._handleErrorMessage("discountDescription")}
                                        </div>
                                        <div className="form-group">
                                            <label>Discount in %</label>
                                            <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Discount %"
                                                onChange={(e) => this.onChangeText(DISCOUNT_PERCENTAGE, e.target.value)} value={discountPercentage}
                                            />
                                            {this._handleErrorMessage("discountPercentage")}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleTextarea">Start Date</label>
                                            <SelectCalendar
                                                _id="offer_start_date"
                                                placeholder="Start Date"
                                                handleOnChange={(date) => this.onChangeText(DISCOUNT_START_DATE, date)}
                                                // refreshFunction={this.redraw.bind(this)}
                                                value={discountStartdate}
                                                calendarOptions={{
                                                    rtl: window.KTUtil.isRTL(),
                                                    todayHighlight: true,
                                                    orientation: "bottom left",
                                                    startDate: new Date()
                                                }}
                                            />
                                            {this._handleErrorMessage("discountStartdate")}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="exampleTextarea">End Date</label>
                                            <SelectCalendar
                                                _id="offer_end_date"
                                                placeholder="End Date"
                                                handleOnChange={(date) => this.onChangeText(DISCOUNT_END_DATE, date)}
                                                // refreshFunction={this.redraw.bind(this)}
                                                value={discountEnddate}
                                                calendarOptions={{
                                                    rtl: window.KTUtil.isRTL(),
                                                    todayHighlight: true,
                                                    orientation: "bottom left",
                                                    startDate: new Date()
                                                }}
                                            />
                                            {this._handleErrorMessage("discountEnddate")}
                                        </div>
                                        <div class="form-group">
                                            <label>Select field</label>
                                            <div class="kt-radio-list">
                                                {/* <label class="kt-radio">
                                                    <input type="radio" name="radio1" id="all"
                                                        onChange={(e) => this.onChangeText(DISCOUNT_TYPE, "All")} value={discountType}
                                                    /> All
                                        <span></span>
                                                </label> */}
                                                <label class="kt-radio">
                                                    <input type="radio" name="radio1" id="category"
                                                        onChange={(e) => this.onChangeText(DISCOUNT_TYPE, "Category")} value={discountType}
                                                    /> Category
                                        <span></span>
                                                </label>
                                                <label class="kt-radio ">
                                                    <input type="radio" name="radio1" id="subcategory"
                                                        onChange={(e) => this.onChangeText(DISCOUNT_TYPE, "Subcategory")} value={discountType}
                                                    /> SubCategory
                                        <span></span>
                                                </label>
                                                <label class="kt-radio ">
                                                    <input type="radio" name="radio1" id="product"
                                                        onChange={(e) => this.onChangeText(DISCOUNT_TYPE, "Product")} value={discountType}
                                                    /> Product
                                        <span></span>
                                                </label>
                                                {this._handleErrorMessage("discountType")}
                                            </div>
                                        </div>
                                        {
                                            discountType === "Category" || discountType === "Subcategory" || discountType === "Product"
                                                ?
                                                <SelectCategory
                                                    error_label={this._handleErrorMessage("discountCategory")}
                                                    handleOnChangeCategory={(id) => this.onChangeText(DISCOUNT_CATEGORY, id)}
                                                    label={"Category"}
                                                    _id={"product_category_list"}
                                                />
                                                : null
                                        }

                                        {
                                            discountType === "Subcategory" || discountType === "Product"
                                                ?
                                                <Selectsubcategory
                                                    error_label={this._handleErrorMessage("discountSubcategory")}
                                                    handleOnChangeCategory={(id) => this.onChangeText(DISCOUNT_SUBCATEGORY, id)}
                                                    label={"Sub Category"}
                                                    category_id={discountCategory}
                                                    _id={"product_sub_category_list"}
                                                />
                                                : null
                                        }
                                        {
                                            discountType === "Product" && discountCategory && discountSubcategory
                                                ?
                                                <DiscountTable />
                                                :
                                                null
                                        }

                                    </div>

                                    <div className="kt-portlet__foot">
                                        <div className="kt-form__actions">
                                            <button type="submit" className="btn btn-primary">{loading ? "Loading..." : "Submit"}</button>
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

export default connect(({ discount }) => {
    const discount_data = discount[DISCOUNT_KEY]
    const discount_form = discount[DISCOUNT_KEY][DISCOUNT_FORM]
    return ({
        discountDescription: discount_form.discount_discription,
        discountDescription: discount_form.discount_discription,
        discountType: discount_form.discount_type,
        discountPercentage: discount_form.discount_percentage,
        discountStartdate: discount_form.discount_start_date,
        discountEnddate: discount_form.discount_end_date,
        discountCategory: discount_form.discount_category,
        discountSubcategory: discount_form.discount_subcategory,
        discountProductId: discount_form.discount_product_id,

        loading: discount_data.discount_form_loading,
        errors: discount_data.discount_form_error,
        requestStatus: discount_data[DISCOUNT_REQUEST_STATUS]
    })
}, {
    updateEditDiscountFormData,
    updateDiscountUIConstraints,
    updateDiscountState,
    makeOffer,
    resetOfferDataState,
    updateSystemData
})(Discount)