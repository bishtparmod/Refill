import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1 } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import {} from '../../../redux/Types'
import { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data, updateSplashUIConstraints } from '../../../redux/splash/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCroper from '../../../components/dashboard/ImageCroper'

class Addsplashscreen extends PureComponent {   

    onChangeText = (key, value) => {
        const { updateEditSplashForm1Data } = this.props;

        updateEditSplashForm1Data({
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

    submit1 = (e) => {
        const { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm1Data({
            [SPLASH_FORM_LOADING1]: true
        });

        const {title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        if (loading1) return;

        const requestBody = {
            title1, content1, image1
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSplashUIConstraints({
                        [SPLASH_FORM_ERROR1]: []   
                    });
                    
                    // editUserData(id)
                } else{ 
                    updateSplashUIConstraints({
                    [SPLASH_FORM_ERROR1]: response && response.length ? response : []
                });
                updateEditSplashForm1Data({
                    [SPLASH_FORM_LOADING1]: false
                });
            }
            }).catch(err => {
                updateEditSplashForm1Data({
                    [SPLASH_FORM_LOADING1]: false
                });
                console.log(err)});
    }

    submit3 = (e) => {
        alert(3)
        const { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm3Data({
            [SPLASH_FORM_LOADING3]: true
        });

        const {title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        if (loading1) return;

        const requestBody = {
            title3, content3, image3
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSplashUIConstraints({
                        [SPLASH_FORM_ERROR1]: []   
                    });
                    
                    // editUserData(id)
                } else{ 
                    updateSplashUIConstraints({
                    [SPLASH_FORM_ERROR1]: response && response.length ? response : []
                });
                updateEditSplashForm3Data({
                    [SPLASH_FORM_LOADING3]: false
                });
            }
            }).catch(err => {
                updateEditSplashForm3Data({
                    [SPLASH_FORM_LOADING3]: false
                });
                console.log(err)});
    }

    submit2 = (e) => {
        alert(2)
        const { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm2Data({
            [SPLASH_FORM_LOADING2]: true
        });

        const {title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        if (loading2) return;

        const requestBody = {
            title2, content2, image2
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSplashUIConstraints({
                        [SPLASH_FORM_ERROR1]: []   
                    });
                    
                    // editUserData(id)
                } else{ 
                    updateSplashUIConstraints({
                    [SPLASH_FORM_ERROR1]: response && response.length ? response : []
                });
                updateEditSplashForm2Data({
                    [SPLASH_FORM_LOADING2]: false
                });
            }
            }).catch(err => {
                updateEditSplashForm2Data({
                    [SPLASH_FORM_LOADING2]: false
                });
                console.log(err)});
    }


    

    render() {
        const {title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3} = this.props
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

								{/* <!-- begin:: Subheader --> */}
								<div className="kt-subheader   kt-grid__item" id="kt_subheader">
									<div className="kt-container  kt-container--fluid ">
										<div className="kt-subheader__main">
											<h3 className="kt-subheader__title">
												Splash Screen </h3>
											<span className="kt-subheader__separator kt-hidden"></span>
											<div className="kt-subheader__breadcrumbs">
												<a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
												<span className="kt-subheader__breadcrumbs-separator"></span>
												<a  className="kt-subheader__breadcrumbs-link">
													Forms </a>
											</div>
										</div>
                                        </div>
								</div>

								{/* <!-- end:: Subheader --> */}

								{/* <!-- begin:: Content --> */}
								<div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
									<div className="row">
                                    <div className="col-md-8 mx-auto">

{/* <!--begin::Portlet--> */}
                                        <div className="kt-portlet">
                                            <div className="kt-portlet__head">
                                                <div className="kt-portlet__head-label">
                                                    <h3 className="kt-portlet__head-title">
                                                        Splash Screen 1
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* <!--begin::Form--> */}
                                            <form className="kt-form" onSubmit={this.submit1.bind(this)}>
                                                <div className="kt-portlet__body">
                                                    <ImageCroper
                                                    id={"image1"} 
                                                    modelId={"myModal1"}
                                                    />
                                                    {/* <div className="form-group form-group-last">
                                                        <input type="file" hidden id="image1" onChange={this.onSelectFile} accept="image/png, image/jpeg" />
                                                        <div className="alert alert-secondary" role="alert" onClick={()=>{this.openFile("image1")}}>
                                                            <div className="alert-text" >
                                                            {croppedImageUrl && (
                                                        <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
                                                        )}
                                                            </div>
                                                        </div>
                                                        {this._handleErrorMessage("image1")}
                                                    </div> */}
                                                    <div className="form-group">
                                                        <label>Title</label>
                                                        <input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Title" 
                                                        onChange={(e) => this.onChangeText(SPLASH_TITLE1, e.target.value)} value={title1}
                                                        />
                                                        {this._handleErrorMessage("title1")}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="exampleTextarea">Description</label>
                                                        <textarea className="form-control"  rows="3"
                                                        onChange={(e) => this.onChangeText(SPLASH_CONTENT1, e.target.value)} value={content1}
                                                        ></textarea>
                                                        {this._handleErrorMessage("content1")}
                                                    </div>
                                                </div>
                                                <div className="kt-portlet__foot">
                                                    <div className="kt-form__actions">
                                                        <button type="submit" className="btn btn-primary">Submit</button>
                                                        <button type="reset" className="btn btn-secondary">Cancel</button>
                                                    </div>
                                                </div>
                                            </form>

                                            {/* <!--end::Form--> */}
                                        </div>
                                        
                                        {/* <!--end::Portlet--> */}

                                        {/* <!--begin::Portlet--> */}

                                        </div>
										</div>
								</div>
                                </div>
        )
    }
}

export default connect(({splash})=>{
    const splash_data = splash && splash[SPLASH_KEY]
    const splash_form1_data = splash && splash[SPLASH_KEY][SPLASH_FORM1]
    const splash_form2_data = splash && splash[SPLASH_KEY][SPLASH_FORM2]
    const splash_form3_data = splash && splash[SPLASH_KEY][SPLASH_FORM3]

    return({
        
        title1:splash_form1_data.splash_title1,
        content1:splash_form1_data.splash_content1,
        image1:splash_form1_data.splash_image1,
        loading1:splash_form1_data.splash_form_loading1,
      
        title2:splash_form2_data.splash_title2,
        content2:splash_form2_data.splash_content2,
        image2:splash_form2_data.splash_image2,
        loading2:splash_form2_data.splash_form_loading2,

        title3:splash_form3_data.splash_title3,
        content3:splash_form3_data.splash_content3,
        image3:splash_form3_data.splash_image3,
        loading3:splash_form3_data.splash_form_loading3,

        errors:splash_data.splash_form_error
    })
},{
    updateEditSplashForm1Data,
    updateEditSplashForm2Data,
    updateEditSplashForm3Data,
    updateSplashUIConstraints
}) (Addsplashscreen)