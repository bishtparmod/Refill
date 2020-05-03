import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, PRODUCT_KEY, ADD_PRODUCT_FORM, ADD_PRODUCT_REQEUST_LOADING, ADD_PRODUCT_REQUEST_STATUS, ADD_PRODUCT_ERRORS, ADD_PRODUCT_FORM_NAME, ADD_PRODUCT_FORM_SHORT_DESCRIPTION, ADD_PRODUCT_FORM_LONG_DESCRIPTION, ADD_PRODUCT_FORM_BRAND, ADD_PRODUCT_FORM_DISTRIBUTOR, ADD_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, ADD_PRODUCT_FORM_RETAIL_PRICE, ADD_PRODUCT_FORM_REFILL_PRICE, ADD_PRODUCT_FORM_DISCOUNT, ADD_PRODUCT_FORM_NOTES, ADD_PRODUCT_FORM_ALERT, ADD_PRODUCT_FORM_QUANTITY, ADD_PRODUCT_FORM_SIZE, ADD_PRODUCT_FORM_WEIGHT, ADD_PRODUCT_FORM_UNITS, ADD_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, ADD_PRODUCT_FORM_MFG_DATE, ADD_PRODUCT_FORM_EXPIRY_DATE, ADD_PRODUCT_FORM_CODE, ADD_PRODUCT_FORM_PUP_GTIN_CODE, MESSAGE, SUCCESS, ERROR, STATUS, ADD_PRODUCT_FORM_CATEGORY_ID, ADD_PRODUCT_FORM_SUB_CATEGORY_ID, ADD_PRODUCT_IMAGES, ADD_PRODUCT_FORM_UPLOADED_IMAGES, ADD_PRODUCT_IS_UPLOADING_IMAGES, ADD_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_FORM_PRODUCT_ID, EDIT_PRODUCT_FORM, EDIT_PRODUCT_FORM_NAME, EDIT_PRODUCT_FORM_SHORT_DESCRIPTION, EDIT_PRODUCT_FORM_LONG_DESCRIPTION, EDIT_PRODUCT_FORM_BRAND, EDIT_PRODUCT_FORM_DISTRIBUTOR, EDIT_PRODUCT_FORM_DELIVERY_TIME_IN_DAYS, EDIT_PRODUCT_FORM_RETAIL_PRICE, EDIT_PRODUCT_FORM_REFILL_PRICE, EDIT_PRODUCT_FORM_DISCOUNT, EDIT_PRODUCT_FORM_NOTES, EDIT_PRODUCT_FORM_ALERT, EDIT_PRODUCT_FORM_QUANTITY, EDIT_PRODUCT_FORM_WEIGHT, EDIT_PRODUCT_FORM_SIZE, EDIT_PRODUCT_FORM_UNITS, EDIT_PRODUCT_FORM_AVERAGE_LIFE_IN_DAYS, EDIT_PRODUCT_FORM_MFG_DATE, EDIT_PRODUCT_FORM_EXPIRY_DATE, EDIT_PRODUCT_FORM_CODE, EDIT_PRODUCT_FORM_PUP_GTIN_CODE, EDIT_PRODUCT_FORM_CATEGORY_ID, EDIT_PRODUCT_FORM_SUB_CATEGORY_ID, EDIT_PRODUCT_FORM_UPLOADED_IMAGES, EDIT_PRODUCT_ERRORS, EDIT_PRODUCT_REQEUST_LOADING, EDIT_PRODUCT_REQUEST_STATUS, EDIT_PRODUCT_IMAGES, EDIT_PRODUCT_UPLOAD_TOTAL_IMAGES_COUNT, EDIT_PRODUCT_IS_UPLOADING_IMAGES, USER_CUSTOMER_NAME, USER_CUSTOMER_EMAIL, USER_CUSTOMER_PHONENO, USER_CUSTOMER_NOTES, USER_CUSTOMER_ADDRESS, USER_CUSTOMER_CITY, USER_CUSTOMER_STATE, USER_CUSTOMER_COUNTRY, USER_CUSTOMER_ZIPCODE, USER_EDIT_FORM, USER_CUSTOMER_ERROR, USER_CUSTOMER_ID, USER_EDIT_REQUEST_STATUS, USER_CUSTOMER_LOADING, USER_CUSTOMER_LATITUDE, USER_CUSTOMER_LONGITUDE, USER_CUSTOMER_STREET, USER_CUSTOMER_BILLING_LONGITUDE, USER_CUSTOMER_COMPANY_ADDRESS, USER_CUSTOMER_BILLING_STREET, USER_CUSTOMER_BILLING_COUNTRY, USER_CUSTOMER_BILLING_ZIPCODE, USER_CUSTOMER_BILLING_CITY, USER_CUSTOMER_BILLING_STATE, USER_CUSTOMER_BILLING_LATITUDE, PHONE_NO_PRESENT, SERVER_NO_VALUE, SERVER_VALIDATION_ERROR, EMAIL_PRESENT, USER_CUSTOMER_SHIPPING_CITY, USER_CUSTOMER_SHIPPING_STATE, USER_CUSTOMER_SHIPPING_ZIPCODE, USER_CUSTOMER_SHIPPING_COUNTRY, USER_CUSTOMER_SHIPPING_STREET, USER_CUSTOMER_SHIPPING_PHONE, USER_CUSTOMER_SHIPPING_NAME, USER_CUSTOMER_BILLING_NAME, USER_CUSTOMER_BILLING_PHONE, USER_CUSTOMER_SHIPPING_LATITUDE, USER_CUSTOMER_SHIPPING_LONGITUDE } from '../../../redux/Types'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer, EditUploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory, getLatlong } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import {} from '../../../redux/Types'
import $ from 'jquery'
import { updateEditUserFormData,getUserviaId,updateUsersUIConstraints, editUserData } from '../../../redux/users/Action'


class Edit extends PureComponent {

    constructor(props){
        super(props)
        this.initForm()
        this.autocomplete = null
        this.suggestionApi();
    }
    
    initForm = () => {
        const { history, updateEditUserFormData, getUserviaId } = this.props;
         
        const location = window.location;
        Utils.log(location)
        const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";
        setTimeout(()=>{
            if(!id){
                history.push('/user/list')
                return;
            }
        },1000)
        

        updateEditUserFormData({
            [USER_CUSTOMER_ID]: id
        });
        getUserviaId(id);
        
    }

    onChangeText = (key, value) => {
        const { updateEditUserFormData } = this.props;
        if(key === "user_customer_phoneno" || key === "user_customer_shipping_phone" || key === "user_customer_billing_phone"){
            
            value = value.replace(/\D/gi, '');
            value = value.replace(/(\d{3})/, '$1-');
            value = value.replace(/(\d{3})(\d{1})/, '$1-$2');
            value = value.replace(/(\d{4})(\d{1})/, '$1-$2');
            // value = value.replace(/(\d{4})(\d{4})/, '$1-$2');
            
            updateEditUserFormData({
                [key]: value
            });
            
            return;
        }
        updateEditUserFormData({
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

    modelSubmit = (e) => {
        const {
            customerCity,
            customerCountry,
            customerZipcode,
            customerState,
            customerShippingName,
            customerShippingPhone,
            updateUsersUIConstraints,
        } = this.props;
       
        const requestBody = {
            customerCity,
            customerCountry,
            customerZipcode,
            customerState,
            customerShippingName,
            customerShippingPhone,
        };


        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    window.$('#addressModal').modal('hide');   
                } else updateUsersUIConstraints({
                    [USER_CUSTOMER_ERROR]: response && response.length ? response : []
                });
            }).catch(err => {
                this.onChangeText(USER_CUSTOMER_LOADING,false)
                console.log(err)
            });
    }

    billingmodelSubmit = () => {
        const {
            billingCity,
            billingCountry,
            billingZipcode,
            billingState,
            billingName,
            billingPhone,
            updateUsersUIConstraints,
        } = this.props;
       
        const requestBody = {
            billingCity,
            billingCountry,
            billingZipcode,
            billingState,
            billingName,
            billingPhone,
        };


        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    window.$('#billingaddressModal').modal('hide');   
                } else updateUsersUIConstraints({
                    [USER_CUSTOMER_ERROR]: response && response.length ? response : []
                });
            }).catch(err => {
                this.onChangeText(USER_CUSTOMER_LOADING,false)
                console.log(err)
            });
    }


    submit = (e) => {
        const { updateEditUserFormData } = this.props
        e.preventDefault();
        

        const { location,editUserData,updateUsersUIConstraints,loading,userData,customerAddress,customerCity,customerCountry,email,name,mobile_number,customerState,customerZipcode,
            billingZipcode,billingCountry,billingCity, billingState,billingName,billingPhone,customerShippingName,customerShippingPhone } = this.props
        if (loading) return;

        const requestBody = {
        customerAddress,customerCity,customerCountry,email,name,mobile_number,customerState,customerZipcode,
            billingZipcode,billingCountry,billingCity, billingState,billingName,billingPhone,customerShippingName,customerShippingPhone
        };
        if(customerCountry=== "" || customerState==="" || customerCity==="" || customerZipcode==="" || customerShippingName==="" || customerShippingPhone==="")
        {
            window.$('#addressModal').modal('show');   
            return;
        }

        if( billingCountry=== "" || billingState==="" || billingCity==="" || billingZipcode==="" || billingName === "" || billingPhone === "")
        {
            window.$('#billingaddressModal').modal('show');   
            return;
        }
        
        updateEditUserFormData({
            [USER_CUSTOMER_LOADING]: true
        });
        const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    updateUsersUIConstraints({
                        [USER_CUSTOMER_ERROR]: []   
                    });
                    
                    editUserData(id)
                } else{ 
                    updateUsersUIConstraints({
                    [USER_CUSTOMER_ERROR]: response && response.length ? response : []
                });
                updateEditUserFormData({
                    [USER_CUSTOMER_LOADING]: false
                });
            }
            }).catch(err => {
                updateEditUserFormData({
                    [USER_CUSTOMER_LOADING]: false
                });
                console.log(err)});
    }

    componentDidUpdate = (prevProps) => {
        const { reqeustStatus, updateUsersUIConstraints, editProduct, history,customerAddress, billingAddress } = this.props;
        Utils.log("reqeustStatus ===== >",prevProps)
        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        document.getElementById('address').value = customerAddress
        document.getElementById('billingaddress').value = billingAddress
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:
                    ToastsStore.success("User has been updated successfully");
                    history.replace('/user/list');
                    break;
                case ERROR:
                    const status = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].message ? reqeustStatus[MESSAGE].message : 500;
                    const emptyKeys = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].message && reqeustStatus[MESSAGE].emptyKeys && reqeustStatus[MESSAGE].emptyKeys.message ? reqeustStatus[MESSAGE].emptyKeys.message : [];

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            const fields = ["customer_shipping_zip_code","customer_billing_zip_code"];
                            const index = emptyKeys.findIndex(ele => fields.indexOf(ele.fieldName) !== -1);
                            if (index === -1) {
                                ToastsStore.error("Validation error, Please try again", 3000);
                                // this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            }
                            else{
                                 ToastsStore.error(emptyKeys[index].message, 6000);
                                //  this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                                }
                            break;
                        case PHONE_NO_PRESENT:
                            ToastsStore.error(reqeustStatus[MESSAGE].data.message, 3000);
                            // this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        case EMAIL_PRESENT:
                            ToastsStore.error(reqeustStatus[MESSAGE].data.message, 3000);
                            // this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("User not Found, Please try again", 3000);
                            // this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        default:
                    }

                    switch (status) {
                        case 422:
                            let _emptyKeys = emptyKeys && emptyKeys.length ? emptyKeys.map(ele => {
                                return ({
                                    fieldName: ele.fieldName,
                                    message: `Required data in ${ele.type}.`
                                });
                            }) : [];

                            updateUsersUIConstraints({
                                [EDIT_PRODUCT_ERRORS]: _emptyKeys
                            });
                            ToastsStore.error("Validation Error", 2000);
                            break;
                        default:
                    }
                    break;
            }
        }      
    }

     // autocomplete api
     suggestionApi() {
        try {
            var input = document.getElementById('address')
            const google= window.google
            var that= this
            var autocomplete = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(autocomplete, 'places_changed', function () {
                if(autocomplete.getPlaces()[0].name){
                    const address= autocomplete.getPlaces()[0].name
                    that.onChangeText(USER_CUSTOMER_ADDRESS,address)
                    that.getLatlogs(address)
                    window.$('#addressModal').modal('show');   
                }
                if(autocomplete.getPlaces()[0].address_components){
                    const Address= that.get_address_components(autocomplete.getPlaces()[0].address_components)
                    var finalAddress=""
                    that.onChangeText(USER_CUSTOMER_SHIPPING_STREET,Address[0])
                    that.onChangeText(USER_CUSTOMER_SHIPPING_COUNTRY,Address[1])
                    that.onChangeText(USER_CUSTOMER_SHIPPING_ZIPCODE,Address[2])
                    that.onChangeText(USER_CUSTOMER_SHIPPING_CITY,Address[3])
                    that.onChangeText(USER_CUSTOMER_SHIPPING_STATE,Address[4])
                    for(var i=0; i<Address.length; i++){
                        if(Address[i] !== ""){
                            finalAddress= finalAddress+ "," + Address[i]
                        } else{
                            window.$('#addressModal').modal('show');   
                        } 
                    }
                return;
                } 
              });
        } catch (error) {
          console.log("error===>", error)
        }
      }

      getLatlogs(address){
         getLatlong(address).then((res)=>{
             this.onChangeText(USER_CUSTOMER_SHIPPING_LATITUDE,"30.704649")
             this.onChangeText(USER_CUSTOMER_SHIPPING_LONGITUDE,"76.717873")
            }).catch((error)=>console.log("error",error))
      }

      get_address_components(address_components) {
        var address = "";
        var street_address = "";
        var suburb = "";
        var country = "";
        var zipcode = "";
        var city = "";
        var state = "";

           
      $(address_components).each(function (i, item) {
            if ($.inArray("street_number", item.types) != -1) {
                address += item.short_name;
            } else if ($.inArray("route", item.types) != -1) {
                street_address += " " + item.short_name;
            } else if ($.inArray("country", item.types) != -1) {
                country = item.long_name;
            } else if ($.inArray("administrative_area_level_1", item.types) != -1) {
                suburb += item.short_name + " ";
                state = item.short_name
            } else if ($.inArray("administrative_area_level_2", item.types) != -1) {
                city = item.short_name;
            } else if ($.inArray("locality", item.types) != -1) {
                suburb += item.long_name.toUpperCase() + ", ";
            } else if ($.inArray("postal_code", item.types) != -1) {
                zipcode = item.short_name
            }
        });
        return [street_address, country,zipcode, city, state];
    }


     // autocomplete api
     billingsuggestionApi() {
        try {
            var input = document.getElementById('billingaddress')
            const google= window.google
            var that= this
            var autocomplete = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(autocomplete, 'places_changed', function () {

                if(autocomplete.getPlaces()[0].name){
                    const address= autocomplete.getPlaces()[0].name
                    that.onChangeText(USER_CUSTOMER_COMPANY_ADDRESS,address)
                    that.billinggetLatlogs(address)
                    window.$('#billingaddressModal').modal('show');   
                }
                if(autocomplete.getPlaces()[0].address_components){
                  
                    const Address= that.get_address_components(autocomplete.getPlaces()[0].address_components)
                    var finalAddress=""
                    that.onChangeText(USER_CUSTOMER_BILLING_STREET,Address[0])
                    that.onChangeText(USER_CUSTOMER_BILLING_COUNTRY,Address[1])
                    that.onChangeText(USER_CUSTOMER_BILLING_ZIPCODE,Address[2])
                    that.onChangeText(USER_CUSTOMER_BILLING_CITY,Address[3])
                    that.onChangeText(USER_CUSTOMER_BILLING_STATE,Address[4])
                    for(var i=0; i<Address.length; i++){
                        if(Address[i] !== ""){
                            finalAddress= finalAddress+ "," + Address[i]
                        } else{
                            window.$('#billingaddressModal').modal('show');   
                        } 
                    }
                return;
                } 
              });
        } catch (error) {
          console.log("error===>", error)
        }
      }

      billinggetLatlogs(address){
         getLatlong(address).then((res)=>{
             this.onChangeText(USER_CUSTOMER_BILLING_LATITUDE,"30.704649")
             this.onChangeText(USER_CUSTOMER_BILLING_LONGITUDE,"76.717873")
            }).catch((error)=>console.log("error",error))
      }

     get_billingaddress_components(address_components) {
        var address = "";
        var billing_street_address = "";
        var suburb = "";
        var billing_country = "";
        var billing_zipcode = "";
        var billing_city = "";
        var billing_state = "";

           
      $(address_components).each(function (i, item) {
            if ($.inArray("street_number", item.types) != -1) {
                address += item.short_name;
            } else if ($.inArray("route", item.types) != -1) {
                billing_street_address += " " + item.short_name;
            } else if ($.inArray("country", item.types) != -1) {
                billing_country = item.long_name;
            } else if ($.inArray("administrative_area_level_1", item.types) != -1) {
                suburb += item.short_name + " ";
                billing_state = item.short_name
            } else if ($.inArray("administrative_area_level_2", item.types) != -1) {
                billing_city = item.short_name;
            } else if ($.inArray("locality", item.types) != -1) {
                suburb += item.long_name.toUpperCase() + ", ";
            } else if ($.inArray("postal_code", item.types) != -1) {
                billing_zipcode = item.short_name
            }
        });
        return [billing_street_address, billing_country, billing_zipcode, billing_city, billing_state];
    }


    render() {
        const {loading,reqeustStatus,userData,customerAddress,customerCity,customerCountry,email,name,mobile_number,customerState,customerZipcode, 
            billingName, billingPhone,   billingAddress,billingCity,billingCountry,billingState,billingZipcode,customerShippingName,customerShippingPhone } = this.props
        console.log("render",userData)
        Utils.log("reqeustStatus ===== >",reqeustStatus)
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

            {/* <!-- begin:: Subheader --> */}
            <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            User </h3>
                        <span className="kt-subheader__separator kt-hidden"></span>
                        <div className="kt-subheader__breadcrumbs">
                            <a href="#" className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a  className="kt-subheader__breadcrumbs-link">
                                Edit </a>
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
                                <form className="kt-form" 
                                onSubmit={this.submit.bind(this)}
                                >

                                    {/* <!--begin: Form Wizard Step 1--> */}
                                    <div className="kt-wizard-v1__content" data-ktwizard-type="step-content" data-ktwizard-state="current">
                                        <div className="kt-heading kt-heading--md">User Details:</div>
                                        <div className="kt-section kt-section--first">
                                            <div className="kt-wizard-v1__form">
                                                <div className="row">
                                                    <div className="col-xl-12">
                                                        <div className="kt-section__body">
                                                           
                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"> Name*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" type="text" placeholder="Enter Customer name"
                                                                    // id="test1" onChange={()=>this.suggestionApi()}
                                                                     onChange={(e) => this.onChangeText(USER_CUSTOMER_NAME, e.target.value)} value={name} 
                                                                     />
                                                                    {/* display error */}
                                                                    {this._handleErrorMessage("name")}
                                                                </div>
                                                            </div>
                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"> Email*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" type="text" placeholder="Enter Customer Email"
                                                                     onChange={(e) => this.onChangeText(USER_CUSTOMER_EMAIL, e.target.value)} value={email}  
                                                                     />
                                                                    {/* display error */}
                                                                    {this._handleErrorMessage("email")}
                                                                </div>
                                                            </div>
                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"> Phoneno*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" type="text" placeholder="Enter Customer Phoneno"
                                                                     onChange={(e) => this.onChangeText(USER_CUSTOMER_PHONENO, e.target.value)} value={mobile_number} 
                                                                     />
                                                                    {/* display error */}
                                                                    {this._handleErrorMessage("mobile_number")}
                                                                </div>
                                                            </div>


                                                            {/* <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"> Notes*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" type="text" placeholder="Enter Customer Notes" 
                                                                    onChange={(e) => this.onChangeText(USER_CUSTOMER_NOTES, e.target.value)} value={customerNotes} 
                                                                     />
                                                                    
                                                                    {this._handleErrorMessage("customerNotes")}
                                                                </div>
                                                            </div> */}
                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label">Shipping Address*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" id="address" type="text" placeholder="Enter Customer Address" 
                                                                   onChange={(e) => this.suggestionApi()} 
                                                                    />
                                                                    {/* display error */}
                                                                    {this._handleErrorMessage("customerAddress")}
                                                                </div>
                                                            </div>
                                                            <div className="form-group row">
                                                                <label className="col-xl-3 col-lg-3 col-form-label"> Billing Address*</label>
                                                                <div className="col-lg-9 col-xl-9">
                                                                    <input className="form-control" id="billingaddress" type="text" placeholder="Enter Customer Address" 
                                                                   onChange={(e) => this.billingsuggestionApi()} 

                                                                    />
                                                                    {/* display error */}
                                                                    {this._handleErrorMessage("billingAddress")}
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
                                            { loading ? "Loading..." : "Submit"}
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
            <div class="modal" id="addressModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Fill valid Address</h4>
                            <button type="button" class="close" data-dismiss="modal"></button>
                        </div> 
                        <div class="modal-body">
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Username</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Name" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_NAME, e.target.value)} value={customerShippingName} />
                                {/* display error */}
                                {this._handleErrorMessage("customerShippingName")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Phone no</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Phone No" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_PHONE, e.target.value)} value={customerShippingPhone} />
                                {/* display error */}
                                {this._handleErrorMessage("customerShippingPhone")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">City</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter City" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_CITY, e.target.value)} value={customerCity} />
                                {/* display error */}
                                {this._handleErrorMessage("customerCity")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">State</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter State" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_STATE, e.target.value)} value={customerState} />
                                {/* display error */}
                                {this._handleErrorMessage("customerState")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Zipcode*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Zipcode" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_ZIPCODE, e.target.value)} value={customerZipcode} />
                                {/* display error */}
                                {this._handleErrorMessage("customerZipcode")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Country*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Country" onChange={(e) => this.onChangeText(USER_CUSTOMER_SHIPPING_COUNTRY, e.target.value)} value={customerCountry} />
                                {/* display error */}
                                {this._handleErrorMessage("customerCountry")}
                            </div>
                        </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={()=>this.modelSubmit()}>Submit</button>
                        </div>

                        </div>
                    </div>
                </div>
            {/* <!-- end:: Content --> */}
            <div class="modal" id="billingaddressModal">
                    <div class="modal-dialog">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title">Fill valid Billing Address</h4>
                            <button type="button" class="close" data-dismiss="modal"></button>
                        </div> 
                        <div class="modal-body">
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label"> User Name</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Name" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_NAME, e.target.value)} value={billingName} />
                                {/* display error */}
                                {this._handleErrorMessage("billingName")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Phone no</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Phone No" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_PHONE, e.target.value)} value={billingPhone} />
                                {/* display error */}
                                {this._handleErrorMessage("billingPhone")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">City</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter City" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_CITY, e.target.value)} value={billingCity} />
                                {/* display error */}
                                {this._handleErrorMessage("billingCity")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">State</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter State" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_STATE, e.target.value)} value={billingState} />
                                {/* display error */}
                                {this._handleErrorMessage("billingState")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Zipcode*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Zipcode" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_ZIPCODE, e.target.value)} value={billingZipcode} />
                                {/* display error */}
                                {this._handleErrorMessage("billingZipcode")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Country*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Country" onChange={(e) => this.onChangeText(USER_CUSTOMER_BILLING_COUNTRY, e.target.value)} value={billingCountry} />
                                {/* display error */}
                                {this._handleErrorMessage("billingCountry")}
                            </div>
                        </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={()=>this.billingmodelSubmit()}>Submit</button>
                        </div>

                        </div>
                    </div>
                </div>
            {/* <!-- end:: Content --> */}
        </div>
        )
    }
}

export default connect(({users})=>{
    const {users_key} = users
    Utils.log("user data === > edit",users)
return({
    userData:users_key[USER_EDIT_FORM],
    name:users_key[USER_EDIT_FORM].user_customer_name,
    email:users_key[USER_EDIT_FORM].user_customer_email,
    customerNotes:users_key[USER_EDIT_FORM].user_customer_notes,

    customerAddress:users_key[USER_EDIT_FORM].user_customer_address,
    customerShippingName:users_key[USER_EDIT_FORM].user_customer_shipping_name,
    customerShippingPhone:users_key[USER_EDIT_FORM].user_customer_shipping_phone,
    customerCity:users_key[USER_EDIT_FORM].user_customer_shipping_city,
    customerCountry:users_key[USER_EDIT_FORM].user_customer_shipping_country,
    mobile_number:users_key[USER_EDIT_FORM].user_customer_phoneno,
    customerState:users_key[USER_EDIT_FORM].user_customer_shipping_state,
    customerZipcode:users_key[USER_EDIT_FORM].user_customer_shipping_zipcode,
    
    loading:users_key[USER_EDIT_FORM].user_customer_loading,
    reqeustStatus:users_key[USER_EDIT_REQUEST_STATUS] ? users_key[USER_EDIT_REQUEST_STATUS]  : {},
    errors:users_key[USER_CUSTOMER_ERROR],


    billingAddress:users_key[USER_EDIT_FORM].user_customer_company_address,
    billingName:users_key[USER_EDIT_FORM].user_customer_billing_name,
    billingPhone:users_key[USER_EDIT_FORM].user_customer_billing_phone,
    billingCity:users_key[USER_EDIT_FORM].user_customer_billing_city,
    billingCountry:users_key[USER_EDIT_FORM].user_customer_billing_country,
    billingState:users_key[USER_EDIT_FORM].user_customer_billing_state,
    billingZipcode:users_key[USER_EDIT_FORM].user_customer_billing_zipcode,
})   
},{
    updateEditUserFormData,
    updateUsersUIConstraints,
    getUserviaId,
    editUserData
}) (Edit)