import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Footer from '../../components/dashboard/Footer'
import Header from '../../components/dashboard/Header'
import Sidebar from '../../components/dashboard/Sidebar'
import { Routes } from '.'
import $ from "jquery";

const routes = {
    index: '/',
    product_list: '/product/list',
    product_list: '/product/list',
    reset_password: '/reset_password',
    change_password: '/profile/change_password'
}

export default class Dashboard extends PureComponent {

    constructor(){
        super()
        this.state={
            showSidebar:false
        }       
    }
    
    Opensidebar(){
        this.setState({showSidebar:true})
        $("#kt_aside_mobile_toggler").addClass("kt-header-mobile__toolbar-toggler--active");
        $("#kt_aside").addClass("kt-aside--on");
    }

    Closesidebar(){
        this.setState({showSidebar:false})
        $("#kt_aside_mobile_toggler").removeClass("kt-header-mobile__toolbar-toggler--active");
        $("#kt_aside").removeClass("kt-aside--on");
    }

    _replacePage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.replace(url);
    }

    render() {
        const { showSidebar} = this.state
        return (
            <div>
            <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading">
                {/* begin:: Page */}
                <div id="kt_header_mobile" className="kt-header-mobile  kt-header-mobile--fixed ">
                    <div className="kt-header-mobile__logo">
                        <a href="index&demo=demo11.html">
                            <img alt="Logo" src="/logo.png" height="40" />
                        </a>
                    </div>
                    <div className="kt-header-mobile__toolbar">
                    {showSidebar
                    ?
                    <button className="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left" id="kt_aside_mobile_toggler" onClick={()=>this.Closesidebar()}>
                        <span></span></button>
                    :
                    <button className="kt-header-mobile__toolbar-toggler kt-header-mobile__toolbar-toggler--left" id="kt_aside_mobile_toggler" onClick={()=>this.Opensidebar()}>
                        <span></span></button>
                    }
                        <button className="kt-header-mobile__toolbar-topbar-toggler" id="kt_header_mobile_topbar_toggler"><i className="flaticon-more-1"></i></button>
                    </div>
                </div>
                {/* begin:: Header Mobile */}
                {/* end:: Header Mobile */}

                <div className="kt-grid kt-grid--hor kt-grid--root">
                    <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
                        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                            {/* <!-- begin:: Header --> */}
                            <Header
                                {...this.props}
                            />
                            {/* <!-- end:: Header --> */}

                            <div className="kt-body kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-grid--stretch" id="kt_body" onClick={()=>{this.Closesidebar()}}>
                                <div className="kt-container  kt-container--fluid  kt-grid kt-grid--ver">

                                    {/* <!-- begin:: Aside --> */}
                                    <button className="kt-aside-close " id="kt_aside_close_btn"><i className="la la-close"></i></button>
                                    {/* <!-- begin:: Aside Menu --> */}
                                    <Sidebar
                                        {...this.props}
                                    />
                                    {/* <!-- end:: Aside Menu --> */}

                                    {/* <!-- end:: Aside --> */}
                                    <Routes
                                        {...this.props}
                                    />
                                </div>
                            </div>
                            {/* begin:: Footer */}
                            <Footer />
                            {/* end:: Footer */}
                        </div >
                    </div >
                </div >
                {/* end:: Page */}


                {/* begin::Scrolltop */}
                <div id="kt_scrolltop" className="kt-scrolltop">
                    <i className="fa fa-arrow-up"></i>
                </div>
                {/* end::Scrolltop */}
            </div >
            {/* <ul class="kt-sticky-toolbar" style={{"margin-top": "30px"}}>
    <li class="kt-sticky-toolbar__item kt-sticky-toolbar__item--danger" id="kt_sticky_toolbar_chat_toggler" data-toggle="kt-tooltip" title="Chat Example" data-placement="left">
        <a href="#" data-toggle="modal" data-target="#kt_chat_modal"><i class="flaticon2-chat-1"></i></a>
    </li>
</ul> */}

           </div>
        )
    }
}
