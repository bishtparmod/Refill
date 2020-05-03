import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, SPLASH_TITLE1, SPLASH_CONTENT3, SPLASH_CONTENT1, SPLASH_TITLE2, SPLASH_TITLE3, SPLASH_CONTENT2, SPLASH_KEY, SPLASH_FORM_LOADING3, SPLASH_FORM1, SPLASH_FORM2, SPLASH_FORM3, SPLASH_FORM_LOADING1, SPLASH_FORM_ERROR, SPLASH_FORM_LOADING2, SPLASH_FORM_ERROR1, SPLASH_FORM_ERROR3, SPLASH_FORM_ERROR2, SPLASH_IMAGE1, SPLASH_IMAGE1_LOADING, SPLASH_IMAGE2_LOADING, SPLASH_IMAGE3_LOADING, SPLASH_IMAGE2, SPLASH_IMAGE3 } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory, refillUserUploadFile } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import {} from '../../../redux/Types'
import { updateEditSplashForm1Data,updateEditSplashForm2Data,updateEditSplashForm3Data,editSplash, updateSplashUIConstraints, getSplashviaId } from '../../../redux/splash/Action'
import $ from 'jquery'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCroper from '../../../components/dashboard/ImageCroper'

class Splash extends PureComponent {   

    componentDidMount(){
        const { getSplashviaId } = this.props
        getSplashviaId()
    }

    onChangeText1 = (key, value) => {
        const { updateEditSplashForm1Data } = this.props;

        updateEditSplashForm1Data({
            [key]: value
        });
    }

    onChangeText2 = (key, value) => {
        const { updateEditSplashForm2Data } = this.props;

        updateEditSplashForm2Data({
            [key]: value
        });
    }

    onChangeText3 = (key, value) => {
        const { updateEditSplashForm3Data } = this.props;

        updateEditSplashForm3Data({
            [key]: value
        });
    }



    isError1 = (key) => {
        const { errors1 } = this.props;
        console.log(errors1)
        if (errors1 && errors1.length) {
            return errors1.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors1[errors1.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage1 = (key) => {
        const data = this.isError1(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    isError2 = (key) => {
        const { errors2 } = this.props;
        console.log(errors2)
        if (errors2 && errors2.length) {
            return errors2.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors2[errors2.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage2 = (key) => {
        const data = this.isError2(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    isError3 = (key) => {
        const { errors3 } = this.props;
        console.log(errors3)
        if (errors3 && errors3.length) {
            return errors3.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors3[errors3.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    _handleErrorMessage3 = (key) => {
        const data = this.isError3(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    submit1 = (e) => {
        const { updateEditSplashForm1Data,imageFile1,updateEditSplashForm2Data,updateEditSplashForm3Data,editSplash, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm1Data({
            [SPLASH_FORM_LOADING1]: true
        });

        const {title1,id1, content1,image1, loading1} = this.props
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
                    if(imageFile1 !== ""){    
                        this.UploadImage1()
                    }else{
                        editSplash(id1,title1,content1,image1)
                    }
                   
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
        const { updateEditSplashForm3Data,editSplash, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm3Data({
            [SPLASH_FORM_LOADING3]: true
        });

        const {id3,title3,content3,imageFile3, image3, loading1} = this.props
        if (loading1) return;

        const requestBody = {
            title3, content3, image3
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSplashUIConstraints({
                        [SPLASH_FORM_ERROR3]: []   
                    });
                    if(imageFile3){
                        this.UploadImage3()
                    }else{
                        editSplash(id3,title3,content3,image3)
                    }
                    
                    // editUserData(id)
                } else{ 
                    updateSplashUIConstraints({
                    [SPLASH_FORM_ERROR3]: response && response.length ? response : []
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
        const {updateEditSplashForm2Data,editSplash, updateSplashUIConstraints } = this.props
        e.preventDefault();
        updateEditSplashForm2Data({
            [SPLASH_FORM_LOADING2]: true
        });

        const { title2, id2,content2,imageFile2, image2, loading2} = this.props
        if (loading2) return;

        const requestBody = {
            title2, content2, image2
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateSplashUIConstraints({
                        [SPLASH_FORM_ERROR2]: []   
                    });
                    if(imageFile2){
                        this.UploadImage2()
                    }else{
                        editSplash(id2,title2,content2,image2)
                    }
                    
                    // editUserData(id)
                } else{ 
                    updateSplashUIConstraints({
                    [SPLASH_FORM_ERROR2]: response && response.length ? response : []
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


    UploadImage1(){
        const { updateEditSplashForm1Data, imageFile1,image1,title1,content1,id1, editSplash} =this.props
        updateEditSplashForm1Data({
            [SPLASH_IMAGE1_LOADING]: true
        });
        refillUserUploadFile(imageFile1)
            .then((result)=>{
                Utils.log("image uploaded",result)
                if(result.key){
                    this.onChangeText1(SPLASH_IMAGE1,result.location)
                    this.onChangeText1(SPLASH_IMAGE1_LOADING,false)
                    editSplash(id1,title1,content1,result.location)
                    return;
                }  
            })
            .catch((error)=>{
                updateEditSplashForm1Data({
                    [SPLASH_IMAGE1_LOADING]: false
                });
                Utils.log("image uploadederror",error)
            })
    }

    UploadImage2(){
        const { updateEditSplashForm2Data, imageFile2,image2,title2,content2,id2, editSplash} =this.props
        updateEditSplashForm2Data({
            [SPLASH_IMAGE2_LOADING]: true
        });
        refillUserUploadFile(imageFile2)
            .then((result)=>{
                Utils.log("image uploaded",result)
                if(result.key){
                    this.onChangeText2(SPLASH_IMAGE2,result.location)
                    this.onChangeText2(SPLASH_IMAGE2_LOADING,false)
                    editSplash(id2,title2,content2,result.location)
                    return;
                }  
            })
            .catch((error)=>{
                updateEditSplashForm2Data({
                    [SPLASH_IMAGE2_LOADING]: false
                });
                Utils.log("image uploadederror",error)
            })
    }


    UploadImage3(){
        const { updateEditSplashForm3Data, imageFile3,image3,title3,content3,id3, editSplash} =this.props
        updateEditSplashForm3Data({
            [SPLASH_IMAGE3_LOADING]: true
        });
        refillUserUploadFile(imageFile3)
            .then((result)=>{
                Utils.log("image uploaded",result)
                if(result.key){
                    this.onChangeText3(SPLASH_IMAGE3,result.location)
                    this.onChangeText3(SPLASH_IMAGE3_LOADING,false)
                    editSplash(id3,title3,content3,result.location)
                    return;
                }  
            })
            .catch((error)=>{
                updateEditSplashForm3Data({
                    [SPLASH_IMAGE3_LOADING]: false
                });
                Utils.log("image uploadederror",error)
            })
    }

    _openPage = (url) => {
		const { history } = this.props;

		if (!url) return;

		history.push(url);
	}
   

    render() {
        const {title1, title2, title3, content1, content2, content3, image1, image2, image3, loading1, loading2, loading3,imageLoading1,imageLoading2,imageLoading3} = this.props
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
                                        {/* <div class="kt-subheader__toolbar">
											<div class="kt-subheader__wrapper">
												<a onClick={this._openPage.bind(this, '/store/addscreen')} class="btn kt-subheader__btn-primary">
													Add Screen &nbsp;
												</a>
											</div>
										</div> */}
                                        </div>
								</div>

								{/* <!-- end:: Subheader --> */}

								{/* <!-- begin:: Content --> */}
								<div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
									<div className="row">
                                    <div className="col-md-4">

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
                                                    imageUrl={image1}
                                                    {...this.props}
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
                                                        onChange={(e) => this.onChangeText1(SPLASH_TITLE1, e.target.value)} value={title1}
                                                        />
                                                        {this._handleErrorMessage1("title1")}
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="exampleTextarea">Description</label>
                                                        <textarea className="form-control"  rows="3"
                                                        onChange={(e) => this.onChangeText1(SPLASH_CONTENT1, e.target.value)} value={content1}
                                                        ></textarea>
                                                        {this._handleErrorMessage1("content1")}
                                                    </div>
                                                </div>
                                                <div className="kt-portlet__foot">
                                                    <div className="kt-form__actions">
                                                        <button type="submit" className="btn btn-primary">{imageLoading1 ? "Image Loading": loading1 ? "Loading..." : "Submit"}</button>
                                                        
                                                    </div>
                                                </div>
                                            </form>

                                            {/* <!--end::Form--> */}
                                        </div>
                                        
                                        {/* <!--end::Portlet--> */}

                                        {/* <!--begin::Portlet--> */}

                                        </div>
										<div className="col-md-4">

											{/* <!--begin::Portlet--> */}
											<div className="kt-portlet">
												<div className="kt-portlet__head">
													<div className="kt-portlet__head-label">
														<h3 className="kt-portlet__head-title">
                                                        Splash Screen 2
														</h3>
													</div>
												</div>

												{/* <!--begin::Form--> */}
												<form className="kt-form" onSubmit={this.submit2.bind(this)}>
													<div className="kt-portlet__body">
                                                        <ImageCroper 
                                                        id={"image2"}
                                                        modelId={"myModal2"}
                                                        imageUrl={image2}
                                                        {...this.props}
                                                    />
														{/* <div className="form-group form-group-last">
                                                        <input type="file" hidden id="image2" />
															<div className="alert alert-secondary" role="alert">
																<div className="alert-icon"><i className="flaticon-warning kt-font-brand"></i></div>
																<div className="alert-text" onClick={()=>{this.openFile("image2")}}>
																	The example form below demonstrates common HTML form elements that receive updated styles from Bootstrap with additional classNamees.
																</div>
															</div>
                                                            {this._handleErrorMessage("image2")}
														</div> */}
														<div className="form-group">
															<label>Title</label>
															<input type="text" className="form-control" aria-describedby="emailHelp" placeholder="Title" 
                                                            onChange={(e) => this.onChangeText2(SPLASH_TITLE2, e.target.value)} value={title2}
                                                            />
															{this._handleErrorMessage2("title2")}
														</div>
														<div className="form-group">
															<label htmlFor="exampleTextarea">Description</label>
															<textarea className="form-control"  rows="3"
                                                            onChange={(e) => this.onChangeText2(SPLASH_CONTENT2, e.target.value)} value={content2}
                                                            ></textarea>
                                                            {this._handleErrorMessage2("content2")}
														</div>
														
														
														
													
													</div>
													<div className="kt-portlet__foot">
														<div className="kt-form__actions">
															<button type="submit" className="btn btn-primary">{imageLoading2 ? "Image Loading": loading2 ? "Loading..." : "Submit"}</button>
															
														</div>
													</div>
												</form>

												{/* <!--end::Form--> */}
											</div>

											{/* <!--end::Portlet--> */}

											{/* <!--begin::Portlet--> */}
											
										</div>
										<div className="col-md-4">

											{/* <!--begin::Portlet--> */}
											<div className="kt-portlet">
												<div className="kt-portlet__head">
													<div className="kt-portlet__head-label">
														<h3 className="kt-portlet__head-title">
                                                        Splash Screen 3
														</h3>
													</div>
												</div>

												{/* <!--begin::Form--> */}
												<form className="kt-form" onSubmit={this.submit3.bind(this)}>
													<div className="kt-portlet__body">
                                                        <ImageCroper 
                                                        id={"image3"}
                                                        modelId={"myModal3"}
                                                        imageUrl={image3}
                                                        {...this.props}
                                                    />
														{/* <div className="form-group form-group-last">
                                                        <input type="file" hidden id="image3" />
															<div className="alert alert-secondary" role="alert">
																<div className="alert-icon"><i className="flaticon-warning kt-font-brand"></i></div>
																<div className="alert-text" onClick={()=>{this.openFile("image3")}}>
																	Add the disabled or  boolean attribute on an input to prevent user interactions.
																	Disabled inputs appear lighter and add a <code>not-allowed</code> cursor.
																</div>
															</div>
                                                            {this._handleErrorMessage("image3")}
														</div> */}
														<div className="form-group">
															<label>Title</label>
															<input type="text" className="form-control"  placeholder="Title" 
                                                            onChange={(e) => this.onChangeText3(SPLASH_TITLE3, e.target.value)} value={title3}
                                                            />
                                                            {this._handleErrorMessage3("title3")}
														</div>
																										
														
														<div className="form-group">
															<label htmlFor="exampleTextarea">Description</label>
															<textarea className="form-control"  rows="3"
                                                            onChange={(e) => this.onChangeText3(SPLASH_CONTENT3, e.target.value)} value={content3}
                                                            ></textarea>
                                                            {this._handleErrorMessage3("content3")}
														</div>
													</div>
													<div className="kt-portlet__foot">
														<div className="kt-form__actions">
															<button type="submit" className="btn btn-brand">{imageLoading3 ? "Image Loading": loading3 ? "Loading..." : "Submit"}</button>
															
														</div>
													</div>
												</form>

												{/* <!--end::Form--> */}
											</div>

											{/* <!--end::Portlet--> */}

											{/* <!--begin::Portlet--> */}
											

											{/* <!--begin::Portlet--> */}
											
										</div>
									</div>
								</div>
                                </div>
        )
    }
}

export default connect(({splash})=>{
    Utils.log("imageLoading3",splash)
    const splash_data = splash && splash[SPLASH_KEY]
    const splash_form1_data = splash && splash[SPLASH_KEY][SPLASH_FORM1]
    const splash_form2_data = splash && splash[SPLASH_KEY][SPLASH_FORM2]
    const splash_form3_data = splash && splash[SPLASH_KEY][SPLASH_FORM3]

    return({
        id1:splash_form1_data.splash_id1,
        title1:splash_form1_data.splash_title1,
        content1:splash_form1_data.splash_content1,
        image1:splash_form1_data.splash_image1,
        imageFile1:splash_form1_data.splash_image1_file,
        imageLoading1:splash_form1_data.splash_image1_loading,
        loading1:splash_form1_data.splash_form_loading1,
      
        id2:splash_form2_data.splash_id2,
        title2:splash_form2_data.splash_title2,
        content2:splash_form2_data.splash_content2,
        image2:splash_form2_data.splash_image2,
        imageFile2:splash_form2_data.splash_image2_file,
        imageLoading2:splash_form2_data.splash_image2_loading,
        loading2:splash_form2_data.splash_form_loading2,

        id3:splash_form3_data.splash_id3,
        title3:splash_form3_data.splash_title3,
        content3:splash_form3_data.splash_content3,
        image3:splash_form3_data.splash_image3,
        imageFile3:splash_form3_data.splash_image3_file,
        imageLoading3:splash_form3_data.splash_image3_loading,
        loading3:splash_form3_data.splash_form_loading3,

        errors1:splash_data.splash_form_error1,
        errors2:splash_data.splash_form_error2,
        errors3:splash_data.splash_form_error3
    })
},{
    updateEditSplashForm1Data,
    updateEditSplashForm2Data,
    updateEditSplashForm3Data,
    updateSplashUIConstraints,
    getSplashviaId,
    editSplash
}) (Splash)