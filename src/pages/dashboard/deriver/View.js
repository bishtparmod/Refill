import React, { PureComponent } from 'react'
import { updateProductUIConstraints, resetProductState, updateEditProductFormData, getProductViaID, editProduct } from '../../../redux/product/Action'
import { connect } from 'react-redux'
import { updateSystemData } from '../../../redux/system/Action'
import { SYSTEM_DATA_PAGE_TITLE, DRIVER_KEY, DRIVER_EDIT_FORM, DRIVER_EDIT_NAME, DRIVER_EDIT_EMAIL, DRIVER_EDIT_AGE, DRIVER_EDIT_VECHILE_NUMBER, DRIVER_EDIT_VECHILE_NAME, DRIVER_EDIT_LICENSE, DRIVER_EDIT_FORM_LOADING, DRIVER_EDIT_PHONE_NUMBER, DRIVER_EDIT_FORM_UPLOADED_IMAGES, DRIVER_EDIT_IS_UPLOADING_IMAGES, DRIVER_REQUEST_STATUS, DRIVER_EDIT_ADDRESS, STATUS, MESSAGE, DRIVER_FORM_ERROR, SUCCESS, ERROR, DRIVER_EDIT_STREET_ADDRESS, DRIVER_EDIT_CITY, DRIVER_EDIT_COUNTRY, DRIVER_EDIT_STATE, DRIVER_EDIT_ZIPCODE, DRIVER_EDIT_LATITUDE, DRIVER_EDIT_LONGITUDE, DRIVER_EDIT_FULL_ADDRESS, DRIVER_EDIT_PASSWORD } from '../../../redux/Types'
import moment from 'moment';
import { updateDriverUIConstraints,editDriver,getDriverviaId, resetDriverState, updateEdit1DriverFormData } from '../../../redux/driver/Action'
import Utils from '../../../components/util/Utils'

class View extends PureComponent {

    componentDidMount(){
       this.init()
    }

    init = () => {
        const { updateSystemData, getDriverviaId, history }= this.props;
        const location = window.location;
        Utils.log(location)
        const id = location && location.pathname ? location.pathname.split("view/").length ? location.pathname.split("view/")[1] : "" : "";
        setTimeout(()=>{
            if(!id){
                history.push('/deriver/list')
                return;
            }
        },1000)
      
        updateSystemData({
            [SYSTEM_DATA_PAGE_TITLE]: "Refill | View Driver"
        });
        getDriverviaId(id)
    }

    render() {
        const { 
            name,
            driverPassword,
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
            zipcode} = this.props
        
        return (
            <div className="ml-5">    
<div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch" id="kt_body">
    <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">   
        <button className="kt-aside-close " id="kt_aside_close_btn"><i className="la la-close"></i></button>
              
        <div className="kt-content  kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content">
             <div className="kt-subheader   kt-grid__item" id="kt_subheader">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-subheader__main">
                        <h3 className="kt-subheader__title">
                            <button className="kt-subheader__mobile-toggle kt-subheader__mobile-toggle--left" id="kt_subheader_mobile_toggle"><span></span></button>
                            Driver</h3>
                        <span className="kt-subheader__separator kt-hidden"></span>
                        <div className="kt-subheader__breadcrumbs">
                            <a  className="kt-subheader__breadcrumbs-home"><i className="flaticon2-shelter"></i></a>
                            <span className="kt-subheader__breadcrumbs-separator"></span>
                            <a  className="kt-subheader__breadcrumbs-link">
                                View </a>
                           
                        </div>
                    </div>
                    </div>
            </div>

           
            <div className="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">

              
                <div className="kt-grid kt-grid--desktop kt-grid--ver kt-grid--ver-desktop kt-app">

                   
                    <button className="kt-app__aside-close" id="kt_user_profile_aside_close">
                        <i className="la la-close"></i>
                    </button>

               
                    <div className="kt-grid__item kt-app__toggle"  id="kt_user_profile_aside" >

                    <div class="kt-portlet kt-portlet--height-fluid">
    <div class="kt-portlet__body">
        <div class="kt-widget kt-widget--user-profile-3">
            <div class="kt-widget__top">
                <div class="kt-widget__media kt-hidden-">
                    <img src={image} alt="image" />
                </div>
                <div class="kt-widget__pic kt-widget__pic--danger kt-font-danger kt-font-boldest kt-font-light kt-hidden">
                    JM
                </div>
                <div class="kt-widget__content">
                    <div class="kt-widget__head">
                        <a href="#" class="kt-widget__username">
                            {name}
                            <i class="flaticon2-correct"></i>
                        </a>

                    </div>

                    <div class="kt-widget__subhead">
                        <a href="#"><i class="flaticon2-new-email"></i>{email}</a>
                        <a href="#"><i class="fas fa-phone"></i>{mobile_number} </a>
                        <a href="#"><i class="fas fa-home"></i>{address}</a>
                    </div>

                    {/* <div class="kt-widget__info">
                        <div class="kt-widget__desc">
                            I distinguish three main text objektive could be merely to inform people.
                            <br /> A second could be persuade people.You want people to bay objective
                        </div>
                      
                    </div> */}
                </div>
            </div>
            <div class="kt-widget__bottom">
                <div class="kt-widget__item">
                    <div class="kt-widget__icon">
                    <i class="flaticon-home"></i>
                    </div>
                    <div class="kt-widget__details">
                        <span class="kt-widget__title">Address</span>
                        <span class="kt-widget__value">
                        <div> {street} {city}<br />{state} {zipcode},<br />{country}</div>
                        </span>
                    </div>
                </div>
                <div class="kt-widget__item">
                    <div class="kt-widget__icon">
                    <i class="flaticon-home"></i>
                    </div>
                    <div class="kt-widget__details">
                        <span class="kt-widget__title">Vehicle Detail</span>
                        <span class="kt-widget__value">
                        <div>Vehicle Name : {vehical_name} <br />
                        Vehicle No : {vehical_no} ,<br />
                        License No : {license_no}</div>
                        Driver Password : {driverPassword}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

                        {/* <!--end:: Widgets/Applications/User/Profile1--> */}
                    </div>

                    {/* <!--End:: App Aside--> */}

                    {/* <!--Begin:: App Content--> */}
                   
                </div>

                {/* <!--End::App--> */}
            </div>

            {/* <!-- end:: Content --> */}
        </div>
    </div>
</div>


{/* <!-- end:: Page --> */}

{/* <!-- begin::Quick Panel --> */}


{/* <!-- begin::Scrolltop --> */}
<div id="kt_scrolltop" className="kt-scrolltop">
    <i className="fa fa-arrow-up"></i>
</div>

{/* <!-- end::Scrolltop --> */}

{/* <!-- begin::Sticky Toolbar --> */}

{/* <!-- end::Sticky Toolbar --> */}


{/* <!--Begin:: Chat--> */}
<div className="modal fade- modal-sticky-bottom-right" id="kt_chat_modal" role="dialog" data-backdrop="false">
    <div className="modal-dialog" role="document">
        <div className="modal-content">
            <div className="kt-chat">
                <div className="kt-portlet kt-portlet--last">
                    <div className="kt-portlet__head">
                        <div className="kt-chat__head ">
                            <div className="kt-chat__left">
                                <div className="kt-chat__label">
                                    <a  className="kt-chat__title">Jason Muller</a>
                                    <span className="kt-chat__status">
                                        <span className="kt-badge kt-badge--dot kt-badge--success"></span> Active
                                    </span>
                                </div>
                            </div>
                            <div className="kt-chat__right">
                                <div className="dropdown dropdown-inline">
                                    <button type="button" className="btn btn-clean btn-sm btn-icon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="flaticon-more-1"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-md">

                                        {/* <!--begin::Nav--> */}
                                        <ul className="kt-nav">
                                            <li className="kt-nav__head">
                                                Messaging
                                                <i className="flaticon2-information" data-toggle="kt-tooltip" data-placement="right" title="Click to learn more..."></i>
                                            </li>
                                            <li className="kt-nav__separator"></li>
                                            <li className="kt-nav__item">
                                                <a  className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-group"></i>
                                                    <span className="kt-nav__link-text">New Group</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a  className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-open-text-book"></i>
                                                    <span className="kt-nav__link-text">Contacts</span>
                                                    <span className="kt-nav__link-badge">
                                                        <span className="kt-badge kt-badge--brand  kt-badge--rounded-">5</span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a  className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-bell-2"></i>
                                                    <span className="kt-nav__link-text">Calls</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a  className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-dashboard"></i>
                                                    <span className="kt-nav__link-text">Settings</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__item">
                                                <a  className="kt-nav__link">
                                                    <i className="kt-nav__link-icon flaticon2-protected"></i>
                                                    <span className="kt-nav__link-text">Help</span>
                                                </a>
                                            </li>
                                            <li className="kt-nav__separator"></li>
                                            <li className="kt-nav__foot">
                                                <a className="btn btn-label-brand btn-bold btn-sm" >Upgrade plan</a>
                                                <a className="btn btn-clean btn-bold btn-sm"  data-toggle="kt-tooltip" data-placement="right" title="Click to learn more...">Learn more</a>
                                            </li>
                                        </ul>

                                        {/* <!--end::Nav--> */}
                                    </div>
                                </div>
                                <button type="button" className="btn btn-clean btn-sm btn-icon" data-dismiss="modal">
                                    <i className="flaticon2-cross"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="kt-portlet__body">
                        <div className="kt-scroll kt-scroll--pull" data-height="410" data-mobile-height="300">
                            <div className="kt-chat__messages kt-chat__messages--solid">
                                <div className="kt-chat__message kt-chat__message--success">
                                    <div className="kt-chat__user">
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/100_12.jpg" alt="image" />
                                        </span>
                                        <a  className="kt-chat__username">Jason Muller</a>
                                        <span className="kt-chat__datetime">2 Hours</span>
                                    </div>
                                    <div className="kt-chat__text">
                                        How likely are you to recommend our company<br  /> to your friends and family?
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--right kt-chat__message--brand">
                                    <div className="kt-chat__user">
                                        <span className="kt-chat__datetime">30 Seconds</span>
                                        <a  className="kt-chat__username">You</a>
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/300_21.jpg" alt="image" />
                                        </span>
                                    </div>
                                    <div className="kt-chat__text">
                                        Hey there, we’re just writing to let you know that you’ve<br  /> been subscribed to a repository on GitHub
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--success">
                                    <div className="kt-chat__user">
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/100_12.jpg" alt="image" />
                                        </span>
                                        <a  className="kt-chat__username">Jason Muller</a>
                                        <span className="kt-chat__datetime">30 Seconds</span>
                                    </div>
                                    <div className="kt-chat__text">
                                        Ok, Understood!
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--right kt-chat__message--brand">
                                    <div className="kt-chat__user">
                                        <span className="kt-chat__datetime">Just Now</span>
                                        <a  className="kt-chat__username">You</a>
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/300_21.jpg" alt="image" />
                                        </span>
                                    </div>
                                    <div className="kt-chat__text">
                                        You’ll receive notifications for all issues, pull requests!
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--success">
                                    <div className="kt-chat__user">
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/100_12.jpg" alt="image" />
                                        </span>
                                        <a  className="kt-chat__username">Jason Muller</a>
                                        <span className="kt-chat__datetime">2 Hours</span>
                                    </div>
                                    <div className="kt-chat__text">
                                        You were automatically <b className="kt-font-brand">subscribed</b> <br />because you’ve been given access to the repository
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--right kt-chat__message--brand">
                                    <div className="kt-chat__user">
                                        <span className="kt-chat__datetime">30 Seconds</span>
                                        <a  className="kt-chat__username">You</a>
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/300_21.jpg" alt="image" />
                                        </span>
                                    </div>
                                    <div className="kt-chat__text">
                                        You can unwatch this repository immediately <br />by clicking here: <a  className="kt-font-bold kt-link"></a>
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--success">
                                    <div className="kt-chat__user">
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/100_12.jpg" alt="image" />
                                        </span>
                                        <a  className="kt-chat__username">Jason Muller</a>
                                        <span className="kt-chat__datetime">30 Seconds</span>
                                    </div>
                                    <div className="kt-chat__text">
                                        Discover what students who viewed Learn <br  />Figma - UI/UX Design Essential Training also viewed
                                    </div>
                                </div>
                                <div className="kt-chat__message kt-chat__message--right kt-chat__message--brand">
                                    <div className="kt-chat__user">
                                        <span className="kt-chat__datetime">Just Now</span>
                                        <a  className="kt-chat__username">You</a>
                                        <span className="kt-media kt-media--circle kt-media--sm">
                                            <img src="/assets/media/users/300_21.jpg" alt="image" />
                                        </span>
                                    </div>
                                    <div className="kt-chat__text">
                                        Most purchased Business courses during this sale!
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="kt-portlet__foot">
                        <div className="kt-chat__input">
                            <div className="kt-chat__editor">
                                <textarea placeholder="Type here..." style={{"height": "50px"}}></textarea>
                            </div>
                            <div className="kt-chat__toolbar">
                                <div className="kt_chat__tools">
                                    <a ><i className="flaticon2-link"></i></a>
                                    <a ><i className="flaticon2-photograph"></i></a>
                                    <a ><i className="flaticon2-photo-camera"></i></a>
                                </div>
                                <div className="kt_chat__actions">
                                    <button type="button" className="btn btn-brand btn-md  btn-font-sm btn-upper btn-bold kt-chat__reply">reply</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</div>
        )
    }
}


const mapToProps = ({ product, driver }) => {
    const driver_data = driver && driver[DRIVER_KEY] ? driver[DRIVER_KEY] : undefined;
    const editDriverFormData = driver_data && driver_data[DRIVER_EDIT_FORM] ? driver_data[DRIVER_EDIT_FORM] : undefined;

    const name = editDriverFormData && editDriverFormData[DRIVER_EDIT_NAME] ? editDriverFormData[DRIVER_EDIT_NAME] : "";
    const driverPassword = editDriverFormData && editDriverFormData[DRIVER_EDIT_PASSWORD] ? editDriverFormData[DRIVER_EDIT_PASSWORD] : "";
    const email = editDriverFormData && editDriverFormData[DRIVER_EDIT_EMAIL] ? editDriverFormData[DRIVER_EDIT_EMAIL] : "";
    const age = editDriverFormData && editDriverFormData[DRIVER_EDIT_AGE] ? editDriverFormData[DRIVER_EDIT_AGE] : "";
    const mobile_number = editDriverFormData && editDriverFormData[DRIVER_EDIT_PHONE_NUMBER] ? editDriverFormData[DRIVER_EDIT_PHONE_NUMBER] : "";
    const vehical_no = editDriverFormData && editDriverFormData[DRIVER_EDIT_VECHILE_NUMBER] ? editDriverFormData[DRIVER_EDIT_VECHILE_NUMBER] : "";
    const vehical_name = editDriverFormData && editDriverFormData[DRIVER_EDIT_VECHILE_NAME] ? editDriverFormData[DRIVER_EDIT_VECHILE_NAME] : "";
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
   
    return ({
        name,
        driverPassword,
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
        zipcode
    });
}

export default connect(mapToProps, {
    updateDriverUIConstraints,
    updateEdit1DriverFormData,
    updateSystemData,
    resetDriverState,
    editDriver,
    getDriverviaId
})(View);
