import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, DRIVER_KEY, DRIVER_EDIT_FORM, DRIVER_EDIT_NAME, DRIVER_EDIT_EMAIL, DRIVER_EDIT_AGE, DRIVER_EDIT_VECHILE_NUMBER, DRIVER_EDIT_VECHILE_NAME, DRIVER_EDIT_LICENSE, DRIVER_EDIT_FORM_LOADING, DRIVER_EDIT_PHONE_NUMBER, DRIVER_EDIT_FORM_UPLOADED_IMAGES, DRIVER_EDIT_IS_UPLOADING_IMAGES, DRIVER_REQUEST_STATUS, DRIVER_EDIT_ADDRESS, STATUS, MESSAGE, DRIVER_FORM_ERROR, SUCCESS, ERROR, DRIVER_EDIT_STREET_ADDRESS, DRIVER_EDIT_CITY, DRIVER_EDIT_COUNTRY, DRIVER_EDIT_STATE, DRIVER_EDIT_ZIPCODE, DRIVER_EDIT_LATITUDE, DRIVER_EDIT_LONGITUDE, DRIVER_EDIT_FULL_ADDRESS, DRIVER_EDIT_IMAGE_UPLOADED_FILE, SERVER_VALIDATION_ERROR, SERVER_NO_VALUE, PHONE_NO_PRESENT, EMAIL_PRESENT } from '../../../redux/Types'
import { updateDriverUIConstraints,editDriver,getDriverviaId, resetDriverState, updateEdit1DriverFormData } from '../../../redux/driver/Action'
import { Helper } from '../../../apis'
import { SelectCalendar, SelectCategory, UploadImageContainer } from '../../../components/dashboard/product'
import { refillAddSubCategory, getLatlong } from '../../../apis/APIs'
import SelectSubCategory from '../../../components/dashboard/product/SelectSubCategory'
import Utils from '../../../components/util/Utils'
import { ToastsStore } from 'react-toasts'
import Imagecroper from '../../../components/dashboard/driver/Imagecroper'
import { refillUserUploadFile } from '../../../apis/APIs';
import $ from 'jquery'
import swal from 'sweetalert';

class Edit extends PureComponent {
    static propTypes = {

    }
    constructor(){
        super()
        this.autocomplete=null
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { updateSystemData, getDriverviaId, history } = this.props;

        const location = window.location;
        Utils.log(location)
        const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";
        setTimeout(()=>{
            if(!id){
                history.push('/deriver/list')
                return;
            }
        },1000)
        
        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | Edit Driver"
        });
        getDriverviaId(id)
    }

    UploadImage(){
        const { updateDriverUIConstraints, imageFile, editDriver, location} =this.props
        const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";
        updateDriverUIConstraints({
            [DRIVER_EDIT_IS_UPLOADING_IMAGES]: true
        });
        refillUserUploadFile(imageFile)
            .then((result)=>{
                Utils.log("image uploaded",result)
                if(result.key){
                    this.onChangeText(DRIVER_EDIT_FORM_UPLOADED_IMAGES,result.location)
                    updateDriverUIConstraints({
                        [DRIVER_EDIT_IS_UPLOADING_IMAGES]: false
                    });
                    this.onChangeText(DRIVER_EDIT_FORM_LOADING,true)
                    editDriver(id)
                    return;
                }  
            })
            .catch((error)=>{
                updateDriverUIConstraints({
                    [DRIVER_EDIT_IS_UPLOADING_IMAGES]: false
                });
                Utils.log("image uploadederror",error)
            })
    }


    modelSubmit = (e) => {
        const {
            country,
            city,
            state,
            zipcode,
            street,
            updateDriverUIConstraints,
        } = this.props;
       
        const requestBody = {
            country,
            city,
            state,
            zipcode,
            street
        };

        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                    window.$('#addressModal').modal('hide');   
                } else updateDriverUIConstraints({
                    [DRIVER_FORM_ERROR]: response && response.length ? response : []
                });
            }).catch(err => {
                this.onChangeText(DRIVER_EDIT_FORM_LOADING,false)
                console.log(err)
            });
    }


    submit = (e) => {
        e.preventDefault();
       
        const {
            name,
            email,
            age,
            image,
            vehical_name,
            vehical_no,
            license_no,
            loading,
            mobile_number,
            address,
            street,
            city,
            country,
            state,
            latitude,
            longitude,
            zipcode,
            imageLoading,
            updateDriverUIConstraints,
            location,
            imageFile,
            editDriver
        } = this.props;
        if (loading || imageLoading ) return;
        
        const requestBody = {
            name,
            email,
            age,
            vehical_name,
            vehical_no,
            license_no,
            mobile_number,
            image,
            street,
            city,
            country,
            state,
            latitude,
            longitude,
            zipcode,
            address
        };
       
        if(street === "" || country=== "" || state==="" || city==="" || zipcode==="")
        {
            window.$('#addressModal').modal('show');   
        }
        const id = location && location.pathname ? location.pathname.split("edit/").length ? location.pathname.split("edit/")[1] : "" : "";
        
        Helper.validate(Object.keys(requestBody), requestBody)
            .then(({ status, response }) => {
                if (status) {
                 
                    updateDriverUIConstraints({
                        [DRIVER_FORM_ERROR]: []
                    });
                    if(imageFile){
                        this.UploadImage() 
                    }else{
                        this.onChangeText(DRIVER_EDIT_FORM_LOADING,true)
                        editDriver(id) 
                    }
                   
                } else updateDriverUIConstraints({
                    [DRIVER_FORM_ERROR]: response && response.length ? response : []
                });
            }).catch(err => {
                this.onChangeText(DRIVER_EDIT_FORM_LOADING,false)
                console.log(err)
            });
    }

    /** On error */
    isError = (key) => {
        const { errors } = this.props;

        if (errors && errors.length) {
            return errors.findIndex(ele => (ele.fieldName === key)) > -1 ? { status: true, message: errors[errors.findIndex(ele => (ele.fieldName === key))].message } : { status: false, message: "" };
        } else return { status: false, message: "" }
    }

    onChangeText = (key, value) => {
        const { updateEdit1DriverFormData } = this.props;
        if(key === "driver_edit_phone_number" ){
            
            value = value.replace(/\D/gi, '');
            value = value.replace(/(\d{3})/, '$1-');
            value = value.replace(/(\d{3})(\d{1})/, '$1-$2');
            value = value.replace(/(\d{4})(\d{1})/, '$1-$2');
            // value = value.replace(/(\d{4})(\d{4})/, '$1-$2');
            
            updateEdit1DriverFormData({
                [key]: value
            });
            
            return;
        }
        updateEdit1DriverFormData({
            [key]: value
        });
    }

    // autocomplete api
    suggestionApi() {
        try {
            var input = document.getElementById('address')
            console.log("google api key",input)
            const google= window.google
            var that= this
            var autocomplete = new google.maps.places.SearchBox(input);
            google.maps.event.addListener(autocomplete, 'places_changed', function () {
                console.log("autocomplete.getPlaces();",autocomplete.getPlaces())
                if(autocomplete.getPlaces()[0].name){
                    const address= autocomplete.getPlaces()[0].name
                    that.onChangeText(DRIVER_EDIT_FULL_ADDRESS,address)
                    that.getLatlogs(address)
                    window.$('#addressModal').modal('show');   
                }
                if(autocomplete.getPlaces()[0].address_components){
                    console.log(" autocomplete.getPlaces();", that.get_address_components(autocomplete.getPlaces()[0].address_components)) 
                    const Address= that.get_address_components(autocomplete.getPlaces()[0].address_components)
                    var finalAddress=""
                    for(var i=0; i<Address.length; i++){
                        if(Address[i] !== ""){
                            finalAddress= finalAddress+ "," + Address[i]
                        } else{
                            window.$('#addressModal').modal('show');   
                        } 
                    }
                console.log("finaladdress===>", finalAddress)
                return;
                } 
              });
        } catch (error) {
          console.log("error===>", error)
        }
      }

      getLatlogs(address){
        getLatlong(address).then((res)=>{
            this.onChangeText(DRIVER_EDIT_LATITUDE,"30.704649")
            this.onChangeText(DRIVER_EDIT_LONGITUDE,"76.717873")
            console.log("res ===== >",res)
           }).catch((error)=>console.log("error",error))
     }


     get_address_components(address_components) {
        var address = "";
        var driver_street_address = "";
        var suburb = "";
        var driver_country = "";
        var driver_zipcode = "";
        var driver_city = "";
        var driver_state = "";

           
      $(address_components).each(function (i, item) {
            if ($.inArray("street_number", item.types) != -1) {
                address += item.short_name;
            } else if ($.inArray("route", item.types) != -1) {
                driver_street_address += " " + item.short_name;
            } else if ($.inArray("country", item.types) != -1) {
                driver_country = item.long_name;
            } else if ($.inArray("administrative_area_level_1", item.types) != -1) {
                suburb += item.short_name + " ";
                driver_state = item.short_name
            } else if ($.inArray("administrative_area_level_2", item.types) != -1) {
                driver_city = item.short_name;
            } else if ($.inArray("locality", item.types) != -1) {
                suburb += item.long_name.toUpperCase() + ", ";
            } else if ($.inArray("postal_code", item.types) != -1) {
                driver_zipcode = item.short_name
            }
        });

        return [driver_street_address, driver_country, driver_zipcode, driver_city, driver_state];
    }


    componentDidUpdate = (prevProps) => {
        const { reqeustStatus, updateDriverUIConstraints, editDriver,  history } = this.props;
        console.log("prevProps  => ",prevProps)
        const prevReqeustStatus = prevProps && prevProps.reqeustStatus ? prevProps.reqeustStatus : {};
        if (reqeustStatus[STATUS] !== prevReqeustStatus[STATUS]) {
            switch (reqeustStatus[STATUS]) {
                case SUCCESS:
                    this.resetDriverData();
                    ToastsStore.success("Driver has been updated successfully");
                    history.replace('/deriver/list');
                    break;
                case ERROR:
                    const status = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].message ? reqeustStatus[MESSAGE].message : 500;
                    const emptyKeys = reqeustStatus[MESSAGE] && reqeustStatus[MESSAGE].status && reqeustStatus[MESSAGE].emptyKeys && reqeustStatus[MESSAGE].emptyKeys.message ? reqeustStatus[MESSAGE].emptyKeys.message : [];

                    switch (status) {
                        case SERVER_VALIDATION_ERROR:
                            const fields = ["driver_city","driver_country","driver_full_address","driver_id","driver_latitude","driver_longitude","driver_state","driver_street_address","driver_zipcode","email","image","licenseNumber","name","phone","vehicalName","vehicalNumber"];
                            const index = emptyKeys.findIndex(ele => fields.indexOf(ele.fieldName) !== -1);
                        console.log("driver_zipcode",index)
                            if (index === -1) {
                                ToastsStore.error("Validation error, Please try again", 3000);
                                this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            }
                            else{
                                 ToastsStore.error(emptyKeys[index].message, 6000);
                                 this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                                }
                            break;
                        case PHONE_NO_PRESENT:
                            ToastsStore.error(reqeustStatus[MESSAGE].data.message, 3000);
                            this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        case EMAIL_PRESENT:
                            ToastsStore.error(reqeustStatus[MESSAGE].data.message, 3000);
                            this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        case SERVER_NO_VALUE:
                            ToastsStore.error("Driver not Found, Please try again", 3000);
                            this.onChangeText(DRIVER_EDIT_FORM_LOADING, false)
                            break;
                        default:
                    }
                    break;
            }
        }

        
    }

    _handleErrorMessage = (key) => {
        const data = this.isError(key);

        if (data && data.status) return <span className="form-text text-error text-right">{data.message}</span>;

        return <div />
    }

    componentWillUnmount = () => {
        this.resetDriverData();
    }

    resetDriverData = () => {
        const { resetDriverState } = this.props;

        resetDriverState();
    }

    render() {
        const {
            name,
            email,
            age,
            vehical_name,
            vehical_no,
            license_no,
            loading,
            errors,
            mobile_number,
            address,
            image,
            street,
            city,
            country,
            state,
            latitude,
            longitude,
            zipcode,
            imageLoading
        } = this.props;
        return (
            <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">

                {/* <!-- begin:: Subheader --> */}
                <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                    <div className="kt-container  kt-container--fluid ">
                        <div className="kt-subheader__main">
                            <h3 className="kt-subheader__title">
                                Driver </h3>
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
                                    <form className="kt-form" onSubmit={this.submit.bind(this)}>

                                        {/* <!--begin: Form Wizard Step 1--> */}
                                        <div className="kt-wizard-v1__content" data-ktwizard-type="step-content" data-ktwizard-state="current">
                                            <div className="kt-heading kt-heading--md">Driver Details:</div>
                                            <div className="kt-section kt-section--first">
                                                <div className="kt-wizard-v1__form">
                                                    <div className="row">
                                                        <div className="col-xl-12">
                                                            <div className="kt-section__body">
                                                            <Imagecroper
                                                                id={"editimage"} 
                                                                modelId={"driverId"}
                                                                imageUrl={image}
                                                                />
                                                               
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Name*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter Driver name" onChange={(e) => this.onChangeText(DRIVER_EDIT_NAME, e.target.value)} value={name} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("name")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">E-mail*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input type="text" className="form-control" id="exampleTextarea" rows="3" placeholder="Enter E-mail" onChange={(e) => this.onChangeText(DRIVER_EDIT_EMAIL, e.target.value)} value={email} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("email")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Phone No*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input type="text" className="form-control" id="exampleTextarea" rows="3" placeholder="Enter Phone no" onChange={(e) => this.onChangeText(DRIVER_EDIT_PHONE_NUMBER, e.target.value)} value={mobile_number} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("mobile_number")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Address</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input type="text" id="address" className="form-control" rows="3" placeholder="Enter Address" 
                                                                        onChange={(e) => {
                                                                            this.onChangeText(DRIVER_EDIT_FULL_ADDRESS, e.target.value)
                                                                            this.suggestionApi()
                                                                        }} 
                                                                        value={address}
                                                                        />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("address")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Age*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input type ="text" className="form-control" id="exampleTextarea" rows="3" placeholder="Enter Age" onChange={(e) => this.onChangeText(DRIVER_EDIT_AGE, e.target.value)} value={age} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("age")}
                                                                    </div>
                                                                </div>

                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Vehicle Name*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter Vehicle Name" onChange={(e) => this.onChangeText(DRIVER_EDIT_VECHILE_NAME, e.target.value)} value={vehical_name} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("vehical_name")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Vehicle number*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter Vehicle Number" onChange={(e) => this.onChangeText(DRIVER_EDIT_VECHILE_NUMBER, e.target.value)} value={vehical_no} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("vehical_no")}
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-xl-3 col-lg-3 col-form-label">Licence number*</label>
                                                                    <div className="col-lg-9 col-xl-9">
                                                                        <input className="form-control" type="text" placeholder="Enter Licence Number" onChange={(e) => this.onChangeText(DRIVER_EDIT_LICENSE, e.target.value)} value={license_no} />
                                                                        {/* display error */}
                                                                        {this._handleErrorMessage("license_no")}
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
                                                {imageLoading ? "Upload Image" :loading ? "Loading..." : "Submit"}
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
                            <label className="col-xl-3 col-lg-3 col-form-label">Street</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Street" onChange={(e) => this.onChangeText(DRIVER_EDIT_STREET_ADDRESS, e.target.value)} value={street} />
                                {/* display error */}
                                {this._handleErrorMessage("street")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">City</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter City" onChange={(e) => this.onChangeText(DRIVER_EDIT_CITY, e.target.value)} value={city} />
                                {/* display error */}
                                {this._handleErrorMessage("city")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">State</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter State" onChange={(e) => this.onChangeText(DRIVER_EDIT_STATE, e.target.value)} value={state} />
                                {/* display error */}
                                {this._handleErrorMessage("state")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Zipcode*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Zipcode" onChange={(e) => this.onChangeText(DRIVER_EDIT_ZIPCODE, e.target.value)} value={zipcode} />
                                {/* display error */}
                                {this._handleErrorMessage("zipcode")}
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-xl-3 col-lg-3 col-form-label">Country*</label>
                            <div className="col-lg-9 col-xl-9">
                                <input className="form-control" type="text" placeholder="Enter Country" onChange={(e) => this.onChangeText(DRIVER_EDIT_COUNTRY, e.target.value)} value={country} />
                                {/* display error */}
                                {this._handleErrorMessage("country")}
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
            </div>
        )
    }
}

const mapToProps = ({ product, driver }) => {
    console.log(driver)
    const driver_data = driver && driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined;
    const editDriverFormData = driver_data && driver_data[DRIVER_EDIT_FORM] ? driver_data[DRIVER_EDIT_FORM] : undefined;

    const name = editDriverFormData && editDriverFormData[DRIVER_EDIT_NAME] ? editDriverFormData[DRIVER_EDIT_NAME] : "";
    const email = editDriverFormData && editDriverFormData[DRIVER_EDIT_EMAIL] ? editDriverFormData[DRIVER_EDIT_EMAIL] : "";
    const age = editDriverFormData && editDriverFormData[DRIVER_EDIT_AGE] ? editDriverFormData[DRIVER_EDIT_AGE] : "";
    const mobile_number = editDriverFormData && editDriverFormData[DRIVER_EDIT_PHONE_NUMBER] ? editDriverFormData[DRIVER_EDIT_PHONE_NUMBER] : "";
    const vehical_no = editDriverFormData && editDriverFormData[DRIVER_EDIT_VECHILE_NUMBER] ? editDriverFormData[DRIVER_EDIT_VECHILE_NUMBER] : "";
    const vehical_name = editDriverFormData && editDriverFormData[DRIVER_EDIT_VECHILE_NAME] ? editDriverFormData[DRIVER_EDIT_VECHILE_NAME] : "";
    const imageFile = editDriverFormData && editDriverFormData[DRIVER_EDIT_IMAGE_UPLOADED_FILE] ? editDriverFormData[DRIVER_EDIT_IMAGE_UPLOADED_FILE] : "";
    const image = editDriverFormData && editDriverFormData[DRIVER_EDIT_FORM_UPLOADED_IMAGES] ? editDriverFormData[DRIVER_EDIT_FORM_UPLOADED_IMAGES] : "";
    const license_no = editDriverFormData && editDriverFormData[DRIVER_EDIT_LICENSE] ? editDriverFormData[DRIVER_EDIT_LICENSE] : "";
    const loading = editDriverFormData && editDriverFormData[DRIVER_EDIT_FORM_LOADING] ? editDriverFormData[DRIVER_EDIT_FORM_LOADING] : false;
    const address = editDriverFormData && editDriverFormData[DRIVER_EDIT_FULL_ADDRESS] ? editDriverFormData[DRIVER_EDIT_FULL_ADDRESS] : "";

    const street = editDriverFormData && editDriverFormData[DRIVER_EDIT_STREET_ADDRESS] ? editDriverFormData[DRIVER_EDIT_STREET_ADDRESS] : "";
    const city = editDriverFormData && editDriverFormData[DRIVER_EDIT_CITY] ? editDriverFormData[DRIVER_EDIT_CITY] : "";
    const country = editDriverFormData && editDriverFormData[DRIVER_EDIT_COUNTRY] ? editDriverFormData[DRIVER_EDIT_COUNTRY] : "";
    const state = editDriverFormData && editDriverFormData[DRIVER_EDIT_STATE] ? editDriverFormData[DRIVER_EDIT_STATE] : "";
    const zipcode = editDriverFormData && editDriverFormData[DRIVER_EDIT_ZIPCODE] ? editDriverFormData[DRIVER_EDIT_ZIPCODE] : "";
    const latitude = editDriverFormData && editDriverFormData[DRIVER_EDIT_LATITUDE] ? editDriverFormData[DRIVER_EDIT_LATITUDE] : "";
    const longitude = editDriverFormData && editDriverFormData[DRIVER_EDIT_LONGITUDE] ? editDriverFormData[DRIVER_EDIT_LONGITUDE] : "";

    const reqeustStatus = driver_data && driver_data[DRIVER_REQUEST_STATUS] ? driver_data[DRIVER_REQUEST_STATUS] : {};
    const imageLoading = driver_data && driver_data[DRIVER_EDIT_IS_UPLOADING_IMAGES] ? driver_data[DRIVER_EDIT_IS_UPLOADING_IMAGES] : false;
    const errors = driver_data && driver_data[DRIVER_FORM_ERROR] ? driver_data[DRIVER_FORM_ERROR] : [];
    console.log("data ===> ", driver_data);

    return ({
        name,
        email,
        age,
        mobile_number,
        vehical_name,
        vehical_no,
        license_no,
        loading,
        errors,
        image,
        imageLoading,
        reqeustStatus,
        address,
        street,
        city,
        country,
        state,
        latitude,
        longitude,
        zipcode,
        imageFile
    });
}

export default connect(mapToProps, {
    updateDriverUIConstraints,
    updateEdit1DriverFormData,
    updateSystemData,
    resetDriverState,
    editDriver,
    getDriverviaId
})(Edit);
