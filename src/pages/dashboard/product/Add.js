import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateAddProductFormData, createProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'

class AddProduct extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {

        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

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

        window.$('#product_mfg_date').datepicker({
            rtl: window.KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        }).on("changeDate", function (e) {
        });

        window.$('#product_expiry_date').datepicker({
            rtl: window.KTUtil.isRTL(),
            todayHighlight: true,
            orientation: "bottom left",
            templates: arrows
        });

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Add Product"
        });
    }


    submit = (e) => {
        e.preventDefault();

        const {
            name,
            short_description,
            long_description,
            brand,
            distributor,
            delivery_time_in_days,
            retail_price,
            refill_price,
            notes,
            alert,
            quantity,
            weight,
            size,
            units,
            average_life_in_days,
            mfg_date,
            expiry_date,
            code,
            pup_gtin_code,
            category_id,
            sub_category_id,
            images,

            loading,
            image_uploading,
            image_uploading_count,
            uploaded_images,

            updateProductUIConstraints,
            createProduct
        } = this.props;
        if (loading || image_uploading) return;

        const requestBody = {
            name,
            short_description,
            long_description,
            brand,
            distributor,
            delivery_time_in_days,
            retail_price,
            refill_price,
            // notes,
            // alert,
            quantity,
            weight,
            size,
            units,
            // average_life_in_days,
            // mfg_date,
            // expiry_date,
            code,
            pup_gtin_code,
            category_id,
            sub_category_id,
            images
        };


        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateProductUIConstraints({
                        [ADD_PRODUCT_ERRORS]: []
                    });

                    if (images && images.length > 0 && image_uploading_count === images.length) {
                        if (uploaded_images && uploaded_images.length === images.length) {
                            // updateProductUIConstraints({
                            //     [ADD_PRODUCT_IS_UPLOADING_IMAGES]: false
                            // });
                            createProduct();
                        }
                    } else {
                        updateProductUIConstraints({
                            [ADD_PRODUCT_IS_UPLOADING_IMAGES]: true
                        });
                    }
                } else updateProductUIConstraints({
                    [ADD_PRODUCT_ERRORS]: response && response.length ? response : []
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
        const { updateAddProductFormData } = this.props;

        updateAddProductFormData({
            [key]: value
        });
    }

    componentDidUpdate = (prevProps) => {
        const { reqeustStatus, images, uploaded_images, image_uploading_count, updateProductUIConstraints, createProduct, image_uploading, history } = this.props;

        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:
                    this.resetProductData();
                    ToastsStore.success("Product has been created successfully");
                    history.replace('/product/list');
                    break;
                case ERROR:
                    const status = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].status ? reqeustStatus[MESSAGE].status : 500;
                    const emptyKeys = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].status && reqeustStatus[MESSAGE].emptyKeys && reqeustStatus[MESSAGE].emptyKeys.message ? reqeustStatus[MESSAGE].emptyKeys.message : [];

                    switch (status) {
                        case 422:
                            let _emptyKeys = emptyKeys && emptyKeys.length ? emptyKeys.map(ele => {
                                return ({
                                    fieldName: ele.fieldName,
                                    message: `Required data in ${ele.type}.`
                                });
                            }) : [];

                            updateProductUIConstraints({
                                [ADD_PRODUCT_ERRORS]: _emptyKeys
                            });
                            ToastsStore.error("Validation Error", 2000);
                            break;
                        case 421:
                                ToastsStore.error(reqeustStatus[MESSAGE].message, 2000);
                            break;
                        default:
                    }
                    break;
            }
        }

        if (image_uploading_count !== prevProps.image_uploading_count) {
            if (images && image_uploading_count === images.length) {
                Utils.log("Uploading end");

                if (uploaded_images && uploaded_images.length === images.length) {
                    updateProductUIConstraints({
                        [ADD_PRODUCT_IS_UPLOADING_IMAGES]: false
                    });
                    createProduct();
                }
            }
        }
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    componentWillUnmount = () => {
        this.resetProductData();
    }

    resetProductData = () => {
        const { resetProductState } = this.props;

        resetProductState();
    }

    render() {
        const {
            name,
            short_description,
            long_description,
            brand,
            distributor,
            delivery_time_in_days,
            retail_price,
            refill_price,
            notes,
            alert,
            quantity,
            weight,
            units,
            average_life_in_days,
            mfg_date,
            expiry_date,
            code,
            size,
            pup_gtin_code,
            category_id,
            sub_category_id,

            loading,
            image_uploading
        } = this.props;

        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Product </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a  className="kt-subheader__breadcrumbs-link">
                                    Add </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
                    <div className="kt-portlet">
                        <div className="kt-portlet__body kt-portlet__body--fit">
                            <div className="kt-grid  kt-wizard-v1 kt-wizard-v1--white" id="kt_contacts_add" data-ktwizard-state="step-first">
                                <div className="kt-grid__item kt-grid__item--fluid kt-wizard-v1__wrapper">

                                    {/* <!--begin: Form Wizard Form--> */}
                                    <form className="kt-form" onSubmit={this.submit.bind(this)}>

                                        {/* <!--begin: Form Wizard Step 1--> */}
                                        <div className="kt-wizard-v1__content" data-ktwizard-type="step-content" data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Products Details:</div>
                                            <div className="kt-section kt-section--first">
                                                <div className="kt-wizard-v1__form">
                                                    <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="kt-section__body">
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Image</label>
                                                                    <UploadImageContainer
                                                                        error_label={this._handleErrorMessage("images")}
                                                                    />
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Name*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter product name" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_NAME, e.target.value)} value={name} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("name")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Short Description*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Enter short description" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_SHORT_DESCRIPTION, e.target.value)} value={short_description}></textarea>
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("short_description")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Long Description*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Enter long description" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_LONG_DESCRIPTION, e.target.value)} value={long_description}></textarea>
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("long_description")}
                                                                    </div>
                                                                </div>

                                                                <SelectCategory
                                                                    error_label={this._handleErrorMessage("category_id")}
                                                                    handleOnChangeCategory={(id) => this.onChangeText(ADD_PRODUCT_FORM_CATEGORY_ID, id)}
                                                                    label={"Category"}
                                                                    _id={"product_category_list"}
                                                                />

                                                                {
                                                                    category_id ?
                                                                        <SelectSubCategory
                                                                            error_label={this._handleErrorMessage("sub_category_id")}
                                                                            handleOnChangeSubCategory={(id) => this.onChangeText(ADD_PRODUCT_FORM_SUB_CATEGORY_ID, id)}
                                                                            label={"Sub Category"}
                                                                            category_id={category_id}
                                                                            _id={"product_sub_category_list"}
                                                                        /> : null
                                                                }

                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Brand*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter brand" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_BRAND, e.target.value)} value={brand} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("brand")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Distributor*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter distributor" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_DISTRIBUTOR, e.target.value)} value={distributor} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("distributor")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Delivery Time in Days*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter delivery time in days" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, e.target.value)} value={delivery_time_in_days} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("delivery_time_in_days")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Retail Price*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter retail price" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_RETAIL_PRICE, e.target.value)} value={retail_price} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("retail_price")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Refill Price*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter refill price" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_REFILL_PRICE, e.target.value)} value={refill_price} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("refill_price")}
                                                                    </div>
                                                                </div>
                                                               
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Notes</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Enter notes" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_NOTES, e.target.value)} value={notes}></textarea>
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("notes")}
                                                                    </div>
                                                                </div>
                                                                {/* <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Alert</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <textarea className="form-control" id="exampleTextarea" rows="3" placeholder="Enter alerts" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_ALERT, e.target.value)} value={alert}></textarea>
                                                                        {this._handleErrorMessage("alert")}
                                                                    </div>
                                                                </div> */}
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Quantity*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter quantity" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_QUANTITY, e.target.value)} value={quantity} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("quantity")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Size*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Example : 100 x 100 unit" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_SIZE, e.target.value)} value={size} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("size")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Weight*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter weight" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_WEIGHT, e.target.value)} value={weight} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("weight")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Units*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <select className="form-control" aria-invalid="false" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_UNITS, e.target.value)} value={units}>
                                                                            <option>Select Unit...</option>
                                                                            <option value="ounce">ounce</option>
                                                                            <option value="litre">litre</option>
                                                                            <option value="ml">ml</option>
                                                                            <option value="gm">gm</option>
                                                                            <option value="kg">kg</option>
                                                                        </select>
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("units")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Average Life in Days</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter average life in days" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, e.target.value)} value={average_life_in_days} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("average_life_in_days")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Mfg Date</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <SelectCalendar
                                                                            _id="product_mfg_date"
                                                                            placeholder="Select mfg date"
                                                                            handleOnChange={(date) => this.onChangeText(ADD_PRODUCT_FORM_MFG_DATE, date)}
                                                                            value={mfg_date}
                                                                            calendarOptions={{
                                                                                rtl: window.KTUtil.isRTL(),
                                                                                todayHighlight: true,
                                                                                orientation: "bottom left",
                                                                                endDate: new Date()
                                                                            }}
                                                                        />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("mfg_date")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Expiry Date</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <SelectCalendar
                                                                            _id="product_expiry_date"
                                                                            placeholder="Select expiry date"
                                                                            handleOnChange={(date) => this.onChangeText(ADD_PRODUCT_FORM_EXPIRY_DATE, date)}
                                                                            value={expiry_date}
                                                                            calendarOptions={{
                                                                                rtl: window.KTUtil.isRTL(),
                                                                                todayHighlight: true,
                                                                                orientation: "bottom left",
                                                                                startDate: new Date()
                                                                            }}
                                                                        />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("expiry_date")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Code*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter code" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_CODE, e.target.value)} value={code} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("code")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">PUP/GTIN Code*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter PUP/GTIN Code" onChange={(e) => this.onChangeText(ADD_PRODUCT_FORM_PUP_GTIN_CODE, e.target.value)} value={pup_gtin_code} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("pup_gtin_code")}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* <!--end: Form Wizard Step 1--> */}


                                        {/* <!--begin: Form Actions --> */}
                                        <div className="kt-form__actions">
                                            <button type="submit" className="btn btn-brand btn-md btn-tall btn-wide kt-font-bold kt-font-transform-u">
                                                {image_uploading ? "Uploading..." : loading ? "Loading..." : "Submit"}
                                            </button>
                                        </div>

                                        {/* <!--end: Form Actions --> */}
                                    </form>

                                    {/* <!--end: Form Wizard Form--> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- end:: Content --> */}
            </div>
        )
    }
}

const mapToProps = ({ product }) => {
    Utils.log("product   ======   >",product)
    const product_data = product && product[PRODUCT_KEY] ? product[PRODUCT_KEY] : undefined;

    const addProductFormData = product_data && product_data[ADD_PRODUCT_FORM] ? product_data[ADD_PRODUCT_FORM] : undefined;
    const name = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_NAME] ? addProductFormData[ADD_PRODUCT_FORM_NAME] : "";
    const short_description = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_SHORT_DESCRIPTION] ? addProductFormData[ADD_PRODUCT_FORM_SHORT_DESCRIPTION] : "";
    const long_description = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_LONG_DESCRIPTION] ? addProductFormData[ADD_PRODUCT_FORM_LONG_DESCRIPTION] : "";
    const brand = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_BRAND] ? addProductFormData[ADD_PRODUCT_FORM_BRAND] : "";
    const distributor = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_DISTRIBUTOR] ? addProductFormData[ADD_PRODUCT_FORM_DISTRIBUTOR] : "";
    const delivery_time_in_days = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS] ? addProductFormData[ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS] : "";
    const retail_price = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_RETAIL_PRICE] ? addProductFormData[ADD_PRODUCT_FORM_RETAIL_PRICE] : "";
    const refill_price = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_REFILL_PRICE] ? addProductFormData[ADD_PRODUCT_FORM_REFILL_PRICE] : "";
    // const discount = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_DISCOUNT] ? addProductFormData[ADD_PRODUCT_FORM_DISCOUNT] : "";
    const notes = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_NOTES] ? addProductFormData[ADD_PRODUCT_FORM_NOTES] : "";
    const alert = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_ALERT] ? addProductFormData[ADD_PRODUCT_FORM_ALERT] : "";
    const quantity = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_QUANTITY] ? addProductFormData[ADD_PRODUCT_FORM_QUANTITY] : "";
    const weight = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_WEIGHT] ? addProductFormData[ADD_PRODUCT_FORM_WEIGHT] : "";
    const size = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_SIZE] ? addProductFormData[ADD_PRODUCT_FORM_SIZE] : "";
    const units = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_UNITS] ? addProductFormData[ADD_PRODUCT_FORM_UNITS] : "";
    const average_life_in_days = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS] ? addProductFormData[ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS] : "";
    const mfg_date = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_MFG_DATE] ? addProductFormData[ADD_PRODUCT_FORM_MFG_DATE] : "";
    const expiry_date = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_EXPIRY_DATE] ? addProductFormData[ADD_PRODUCT_FORM_EXPIRY_DATE] : "";
    const code = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_CODE] ? addProductFormData[ADD_PRODUCT_FORM_CODE] : "";
    const pup_gtin_code = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_PUP_GTIN_CODE] ? addProductFormData[ADD_PRODUCT_FORM_PUP_GTIN_CODE] : "";
    const category_id = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_CATEGORY_ID] ? addProductFormData[ADD_PRODUCT_FORM_CATEGORY_ID] : "";
    const sub_category_id = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_SUB_CATEGORY_ID] ? addProductFormData[ADD_PRODUCT_FORM_SUB_CATEGORY_ID] : "";
    const uploaded_images = addProductFormData && addProductFormData[ADD_PRODUCT_FORM_UPLOADED_IMAGES] && addProductFormData[ADD_PRODUCT_FORM_UPLOADED_IMAGES].length ? addProductFormData[ADD_PRODUCT_FORM_UPLOADED_IMAGES] : undefined;

    const errors = product_data && product_data[ADD_PRODUCT_ERRORS] ? product_data[ADD_PRODUCT_ERRORS] : [];
    const loading = product_data && product_data[ADD_PRODUCT_REQEUST_LOADING] ? product_data[ADD_PRODUCT_REQEUST_LOADING] : false;
    const reqeustStatus = product_data && product_data[ADD_PRODUCT_REQUEST_STATUS] ? product_data[ADD_PRODUCT_REQUEST_STATUS] : {};
    const images = product_data && product_data[ADD_PRODUCT_IMAGES] && product_data[ADD_PRODUCT_IMAGES].length ? product_data[ADD_PRODUCT_IMAGES] : undefined;
    const image_uploading_count = product_data && product_data[ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] ? product_data[ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT] : 0;
    const image_uploading = product_data && product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] ? product_data[ADD_PRODUCT_IS_UPLOADING_IMAGES] : false;


    return ({
        name,
        short_description,
        long_description,
        brand,
        distributor,
        delivery_time_in_days,
        retail_price,
        refill_price,
        notes,
        alert,
        quantity,
        weight,
        size,
        units,
        average_life_in_days,
        mfg_date,
        expiry_date,
        code,
        pup_gtin_code,
        category_id,
        sub_category_id,
        uploaded_images,

        errors,
        loading,
        reqeustStatus,

        images,
        images_length: images && images.length ? images.length : 0,
        uploaded_images_length: uploaded_images && uploaded_images ? uploaded_images.length : 0,
        image_uploading_count,
        image_uploading
    });
}

export default connect(mapToProps, {
    updateProductUIConstraints,
    updateAddProductFormData,
    updateSystemData,
    resetProductState,
    createProduct
})(AddProduct);







// <div className="col-lg-9 col-xl-6">
//                                                                         <div className="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar">
//                                                                             <div className="kt-avatar__holder" style={{ backgroundImage: 'url(/assets/media/users/300_10.jpg)' }}></div>
//                                                                             <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
//                                                                                 <i className="fa fa-pen"></i>
//                                                                                 <input type="file" name="kt_contacts_add_avatar" />
//                                                                             </label>
//                                                                             <span className="kt-avatar__cancel" style={{ display: "flex" }} data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
//                                                                                 <i className="fa fa-times"></i>
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar">
//                                                                             <div className="kt-avatar__holder" style={{ backgroundImage: 'url(./assets/media/users/300_10.jpg)' }}></div>
//                                                                             <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
//                                                                                 <i className="fa fa-pen"></i>
//                                                                                 <input type="file" name="kt_contacts_add_avatar" />
//                                                                             </label>
//                                                                             <span className="kt-avatar__cancel" data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
//                                                                                 <i className="fa fa-times"></i>
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar">
//                                                                             <div className="kt-avatar__holder" style={{ backgroundImage: 'url(./assets/media/users/300_10.jpg)' }}></div>
//                                                                             <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
//                                                                                 <i className="fa fa-pen"></i>
//                                                                                 <input type="file" name="kt_contacts_add_avatar" />
//                                                                             </label>
//                                                                             <span className="kt-avatar__cancel" data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
//                                                                                 <i className="fa fa-times"></i>
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar">
//                                                                             <div className="kt-avatar__holder" style={{ backgroundImage: 'url(./assets/media/users/300_10.jpg)' }}></div>
//                                                                             <label className="kt-avatar__upload" data-toggle="kt-tooltip" title="" data-original-title="Change avatar">
//                                                                                 <i className="fa fa-pen"></i>
//                                                                                 <input type="file" name="kt_contacts_add_avatar" />
//                                                                             </label>
//                                                                             <span className="kt-avatar__cancel" data-toggle="kt-tooltip" title="" data-original-title="Cancel avatar">
//                                                                                 <i className="fa fa-times"></i>
//                                                                             </span>
//                                                                         </div>
//                                                                     </div>