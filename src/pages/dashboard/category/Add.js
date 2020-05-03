import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { CATEGORY_KEY, CATEGORY_FORM, CATEGORY_FORM_NAME, SUB_CATEGORY_FORM, SUB_CATEGORY_FORM_NAME, SUB_CATEGORY_FORM_CATEGORY_ID, CATEGORY_ERRORS, SUB_CATEGORY_ERRORS, CATEGORY_REQEUST_LOADING, SUB_CATEGORY_REQEUST_LOADING, CATEGORY_REQUEST_STATUS, SUB_CATEGORY_REQUEST_STATUS, STATUS, SERVER_NO_VALUE, TOKEN_NOT_FOUND, ERROR, SUCCESS, SYSTEM_DATA_PAGE_TITLE, MESSAGE, SERVER_PRESENT, CATEGORY_FORM_ICON } from '../../../redux/Types'
import { updateCategoryFormData, updateCategoryUIConstraints, createCategory, resetCategoryDataState, updateSubCategoryFormData, createSubCategory } from '../../../redux/category/Action'
import { updateSystemData } from '../../../redux/system/Action'
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';
import { Helper } from '../../../apis'
import { SelectCategory } from '../../../components/dashboard/category/index.js'

class AddProduct extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData } = this.props;

        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Add Category"
        });
    }

    /**
     * Category Submit
     */
    submit = (e) => {
        e.preventDefault();

        const { category_name, updateCategoryUIConstraints, category_loading, createCategory } = this.props;
        if (category_loading) return;

        const requestBody = {
            category_name
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateCategoryUIConstraints({
                        [CATEGORY_ERRORS]: []
                    });

                    createCategory();
                } else updateCategoryUIConstraints({
                    [CATEGORY_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    /**
     * Sub Category Submit
     */
    subCategorySubmit = (e) => {
        e.preventDefault();

        const { sub_category_name, sub_category_id, updateCategoryUIConstraints, sub_category_loading, createSubCategory } = this.props;
        if (sub_category_loading) return;

        const requestBody = {
            sub_category_name,
            sub_category_id
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateCategoryUIConstraints({
                        [SUB_CATEGORY_ERRORS]: []
                    });

                    createSubCategory();
                } else updateCategoryUIConstraints({
                    [SUB_CATEGORY_ERRORS]: response && response.length ? response : []
                });
            }).catch(err => console.log(err));
    }

    /** On error */
    isError = (key) => {
        const { category_errors: errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    /** On Sub Category error */
    isSubCategoryError = (key) => {
        const { sub_category_errors: errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    onChangeText = (key, value) => {
        const { updateCategoryFormData } = this.props;

        updateCategoryFormData({
            [key]: value
        });
    }

    onChangeSubCategoryFormText = (key, value) => {
        const { updateSubCategoryFormData } = this.props;

        updateSubCategoryFormData({
            [key]: value
        });
    }

    componentDidUpdate = (prevProps) => {
        const { categoryReqeustStatus, subCategoryReqeustStatus } = this.props;

        const prevReqeustStatus = prevProps && prevProps.categoryReqeustStatus ? prevProps.categoryReqeustStatus : {};
        if (categoryReqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (categoryReqeustStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Category has been created successfully.");
                    this.resetData();
                    break;
                case ERROR:
                    const message = categoryReqeustStatus[MESSAGE] && categoryReqeustStatus[MESSAGE].message ? categoryReqeustStatus[MESSAGE].message : null;

                    switch (message) {
                        case SERVER_NO_VALUE:
                            ToastsStore.error("No Record Found. ");
                            break;
                        case SERVER_PRESENT:
                            ToastsStore.error("Category is already present.");
                            break;
                        case TOKEN_NOT_FOUND:
                            ToastsStore.error("User token is not available.");
                            break;
                        default:
                            ToastsStore.error("Please try again");
                    }

                    break;
            }
        }

        const prevSubCategoryReqeustStatus = prevProps && prevProps.subCategoryReqeustStatus ? prevProps.subCategoryReqeustStatus : {};
        if (subCategoryReqeustStatus[STATUS] !== prevSubCategoryReqeustStatus[STATUS]) {
            switch (subCategoryReqeustStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("Sub Category has been created successfully.");
                    this.resetData();
                    break;
                case ERROR:
                    const message = subCategoryReqeustStatus[MESSAGE] && subCategoryReqeustStatus[MESSAGE].message ? subCategoryReqeustStatus[MESSAGE].message : null;

                    switch (message) {
                        case SERVER_NO_VALUE:
                            ToastsStore.error("No Record Found.");
                            break;
                        case SERVER_PRESENT:
                            ToastsStore.error("Sub Category is already present.");
                            break;
                        case TOKEN_NOT_FOUND:
                            ToastsStore.error("User token is not available.");
                            break;
                        default:
                            ToastsStore.error("Please try again");
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

    /**
     * Handle Sub Category Error
     */
    _handleSubCategoryErrorMessage = (key) => {
        const data = this.isSubCategoryError(key);

        if (data && data.status) return <span className="form-text text-right text-error">{data.message}</span>;

        return <div />
    }

    componentWillUnmount = () => {
        this.resetData();
    }

    resetData = () => {
        const { resetCategoryDataState } = this.props;

        resetCategoryDataState();
    }

    getRandomFileName = () => {
        const test= parseInt(`${new Date().getTime()}${Math.random() * 1000}`)
      return test+".jpg";
   }

    selectIcon(e){
        const file = e.target.files[0]
        let reader = new FileReader();
        const changeImage= new File([file],this.getRandomFileName())
        reader.onloadend = function () {
            this.onChangeText(CATEGORY_FORM_ICON,reader.result)
        }
        reader.readAsDataURL(file);

    }

    render() {
        const { category_loading, sub_category_loading, category_name, sub_category_name } = this.props;

        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Category </h3>
                            <span className="kt-subheader__separator kt-hidden"></span>
                            <div className="kt-subheader__breadcrumbs">
                                <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                                <span className="kt-subheader__breadcrumbs-separator"></span>
                                <a className="kt-subheader__breadcrumbs-link">
                                    Add </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- end:: Subheader --> */}

                {/* <!-- begin:: Content --> */}
                <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

                    {/* <!--Begin:: Portlet--> */}
                    <div className="kt-portlet kt-portlet--tabs">
                        <div className="kt-portlet__head">
                            <div className="kt-portlet__head-toolbar">
                                <ul className="nav nav-tabs nav-tabs-space-lg nav-tabs-line nav-tabs-bold nav-tabs-line-3x nav-tabs-line-brand" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link active" data-toggle="tab" href="#kt_apps_contacts_view_tab_2" role="tab">
                                            Add Category
														</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link " data-toggle="tab" href="#kt_apps_contacts_view_tab_3" role="tab">
                                            Add Sub-Category
														</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="kt-portlet__body">
                            <div className="tab-content  kt-margin-t-20">

                                {/* <!--Begin:: Tab Content--> */}
                                <div className="tab-pane active" id="kt_apps_contacts_view_tab_2" role="tabpanel">
                                    <form className="kt-form kt-form--label-right" onSubmit={this.submit.bind(this)}>
                                        <div className="kt-form__body">
                                            <div className="kt-section kt-section--first">
                                                <div className="kt-section__body">
                                                    <div className="row">
                                                        <label className="col-xl-3"></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <h3 className="kt-section__title kt-section__title-sm">Category Info:</h3>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-lg-3 col-form-label">Name</label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <input className="form-control" type="text" placeholder="Enter category name" value={category_name} onChange={(e) => this.onChangeText(CATEGORY_FORM_NAME, e.target.value)} />
                                                            {/* display error */}
                                                            {this._handleErrorMessage("category_name")}
                                                        </div>
                                                    </div>
                                                    {/* <div className="form-group row">
                                                        <label className="col-xl-3 col-lg-3 col-form-label">Icon</label>
                                                        <div class="col-lg-9 col-xl-6">
                                                            <div class="kt-avatar kt-avatar--outline m-2" id="kt_contacts_add_avatar" onClick={()=>{document.getElementById('select_category_icon').click()}}>
                                                                <div class="kt-avatar__holder">
                                                                    <input type="file" hidden="true" accept="image/*" id="select_category_icon" onChange={(e)=>{this.selectIcon(e)}} />
                                                                </div>
                                                                <div class="refill-sub-container-center">
                                                                    <img src="/assets/img/plus.png" height="40" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                            </div>
                                                            <div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-separator kt-separator--space-lg kt-separator--fit kt-separator--border-solid"></div>
                                        <div className="kt-form__actions">
                                            <div className="row">
                                                <div className="col-xl-3"></div>
                                                <div className="col-lg-9 col-xl-6">
                                                    <button className="btn btn-brand btn-bold">{category_loading ? "Loading..." : "Submit"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* <!--End:: Tab Content--> */}

                                {/* <!--Begin:: Tab Content--> */}
                                <div className="tab-pane" id="kt_apps_contacts_view_tab_3" role="tabpanel">
                                    <form className="kt-form kt-form--label-right" onSubmit={this.subCategorySubmit.bind(this)}>
                                        <div className="kt-form__body">
                                            <div className="kt-section">
                                                <div className="kt-section__body">
                                                    <div className="row">
                                                        <label className="col-xl-3"></label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <h3 className="kt-section__title kt-section__title-sm">Sub-Category Info:</h3>
                                                        </div>
                                                    </div>
                                                    <SelectCategory
                                                        error_label={this._handleSubCategoryErrorMessage("sub_category_id")}
                                                    />
                                                    <div className="form-group row">
                                                        <label className="col-xl-3 col-lg-3 col-form-label">Name</label>
                                                        <div className="col-lg-9 col-xl-6">
                                                            <input className="form-control" type="text" placeholder="Enter sub-category name" value={sub_category_name} onChange={(e) => this.onChangeSubCategoryFormText(SUB_CATEGORY_FORM_NAME, e.target.value)} />
                                                            {/* display error */}
                                                            {this._handleSubCategoryErrorMessage("sub_category_name")}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="kt-separator kt-separator--space-lg kt-separator--fit kt-separator--border-solid"></div>
                                        <div className="kt-form__actions">
                                            <div className="row">
                                                <div className="col-xl-3"></div>
                                                <div className="col-lg-9 col-xl-6">
                                                    <button type="submit" className="btn btn-brand btn-bold">{sub_category_loading ? "Loading..." : "Submit"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* <!--End:: Tab Content--> */}
                            </div>
                        </div>
                    </div>

                    {/* <!--End:: Portlet--> */}
                </div>

                {/* <!-- end:: Content --> */}
            </div>
        )
    }
}


const mapToProps = ({ category }) => {
    const category_data = category && category[CATEGORY_KEY] ? category[CATEGORY_KEY] : undefined;
    const categoryFormData = category_data && category_data[CATEGORY_FORM] ? category_data[CATEGORY_FORM] : undefined;
    const subCategoryFormData = category_data && category_data[SUB_CATEGORY_FORM] ? category_data[SUB_CATEGORY_FORM] : undefined;
    
    const category_name = categoryFormData && categoryFormData[CATEGORY_FORM_NAME] ? categoryFormData[CATEGORY_FORM_NAME] : "";
    const category_icon = categoryFormData && categoryFormData[CATEGORY_FORM_ICON] ? categoryFormData[CATEGORY_FORM_ICON] : "";
    
    const sub_category_name = subCategoryFormData && subCategoryFormData[SUB_CATEGORY_FORM_NAME] ? subCategoryFormData[SUB_CATEGORY_FORM_NAME] : "";
    const sub_category_id = subCategoryFormData && subCategoryFormData[SUB_CATEGORY_FORM_CATEGORY_ID] ? subCategoryFormData[SUB_CATEGORY_FORM_CATEGORY_ID] : "";
    
    const category_errors = category_data && category_data[CATEGORY_ERRORS] ? category_data[CATEGORY_ERRORS] : [];
    const sub_category_errors = category_data && category_data[SUB_CATEGORY_ERRORS] ? category_data[SUB_CATEGORY_ERRORS] : [];
    
    const category_loading = category_data && category_data[CATEGORY_REQEUST_LOADING] ? category_data[CATEGORY_REQEUST_LOADING] : false;
    const sub_category_loading = category_data && category_data[SUB_CATEGORY_REQEUST_LOADING] ? category_data[SUB_CATEGORY_REQEUST_LOADING] : false;
    
    const categoryReqeustStatus = category_data && category_data[CATEGORY_REQUEST_STATUS] ? category_data[CATEGORY_REQUEST_STATUS] : {};
    const subCategoryReqeustStatus = category_data && category_data[SUB_CATEGORY_REQUEST_STATUS] ? category_data[SUB_CATEGORY_REQUEST_STATUS] : {};


    return ({
        category_name,
        category_icon,
        sub_category_name,
        sub_category_id,
        category_errors,
        sub_category_errors,
        category_loading,
        sub_category_loading,
        categoryReqeustStatus,
        subCategoryReqeustStatus
    });
}

export default connect(mapToProps, {
    updateCategoryFormData,
    updateCategoryUIConstraints,
    updateSystemData,
    createCategory,
    resetCategoryDataState,
    updateSubCategoryFormData,
    createSubCategory
})(AddProduct);