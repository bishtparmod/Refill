import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { SIDEBAR_KEY, SIDEBAR_IS_SHOW, SIDEBAR_PAGE_PATH } from '../../redux/Types'
import { updateSidebarUIConstraints } from '../../redux/sidebar/Action'
import $ from "jquery";

class Sidebar extends PureComponent {
    static propTypes = {

    }

    constructor(){
        super()
        this.state={
            dropdown:true
        }
    }

    opendropdown(){
        const { dropdown } = this.state
        this.setState({
            dropdown:!dropdown
        })

        if(dropdown){
            $("#open-menu").addClass("kt-menu__item--open");
        }else{
            $("#open-menu").removeClass("kt-menu__item--open");
        }
    }

    componentDidMount = () => {
        const { updateSidebarUIConstraints } = this.props;

        updateSidebarUIConstraints({
            [SIDEBAR_PAGE_PATH]: window.location.pathname
        });
    }

    _openPage = (url) => {
        const { history, updateSidebarUIConstraints } = this.props;

        if (!url) return;
        updateSidebarUIConstraints({
            [SIDEBAR_PAGE_PATH]: url
        });

        history.push(url);
    }

    getClasses = (key) => {
        const { page_path } = this.props;

        if (page_path.replace(/\//gi, " ").indexOf(key) !== -1) return 'kt-menu__item kt-menu__item--active';
        if (page_path.replace(/\//gi, " ") === " " && key === "home") return 'kt-menu__item kt-menu__item--active';

        return 'kt-menu__item';
    }

    render() {
        const { is_show } = this.props;

        if (is_show) return <div />;

        return (
            <div className="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside" style={{overflow:"auto"}}>
                <div className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid" id="kt_aside_menu_wrapper">
                    <div id="kt_aside_menu" className="kt-aside-menu " data-ktmenu-vertical="1" data-ktmenu-scroll="1">
                        <ul className="kt-menu__nav ">
                            <li className={this.getClasses("home")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/')}><i className="kt-menu__link-icon flaticon2-architecture-and-city"></i><span className="kt-menu__link-text">Dashboard</span></a></li>
                            <li className={this.getClasses("product")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/product/list')}><i className="kt-menu__link-icon fab fa-product-hunt"></i><span className="kt-menu__link-text">Product </span></a></li>
                            <li className={this.getClasses("user")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/user/list')}><i className="kt-menu__link-icon flaticon-user"></i><span className="kt-menu__link-text">User </span></a></li>
                            <li className={this.getClasses("order")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/order/list')}><i className="kt-menu__link-icon flaticon2-paper" ></i><span className="kt-menu__link-text">Order </span></a></li>
                            {/* <li className={this.getClasses("report")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/report/list')}><i className="kt-menu__link-icon flaticon-graphic"></i><span className="kt-menu__link-text">Reports </span></a></li> */}
                            {/* <li className={this.getClasses("offer")} aria-haspopup="true"><a className="kt-menu__link refill-cursor"><i className="kt-menu__link-icon flaticon2-shopping-cart"></i><span classNameName="kt-menu__link-text">Offer </span></a></li> */}
                            <li className="kt-menu__item  kt-menu__item--submenu" id="open-menu" aria-haspopup="true" data-ktmenu-submenu-toggle="hover"><a  className="kt-menu__link kt-menu__toggle" onClick={()=>this.opendropdown()}><i className="kt-menu__link-icon flaticon2-browser-2"></i><span className="kt-menu__link-text">Store</span><i className="kt-menu__ver-arrow la la-angle-right"></i></a>
                                <div className="kt-menu__submenu "><span className="kt-menu__arrow"></span>
                                    <ul className="kt-menu__subnav">
                                        <li className="kt-menu__item  kt-menu__item--parent" aria-haspopup="true"><span className="kt-menu__link"><span className="kt-menu__link-text">Subheaders</span></span></li>
                                        <li className={this.getClasses("splash")} aria-haspopup="true"><a onClick={this._openPage.bind(this, '/splash')} className="kt-menu__link "><i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i><span className="kt-menu__link-text">Splash Content</span></a></li>
                                        {/* <li className="kt-menu__item " aria-haspopup="true"><a  className="kt-menu__link "><i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i><span className="kt-menu__link-text">Payment Gateway</span></a></li> */}
                                        <li className={this.getClasses("discount")} aria-haspopup="true"><a onClick={this._openPage.bind(this, '/discount')} className="kt-menu__link "><i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i><span className="kt-menu__link-text">Discount and offer</span></a></li>
                                        <li className={this.getClasses("sales")} aria-haspopup="true"><a onClick={this._openPage.bind(this, '/sales')} className="kt-menu__link "><i className="kt-menu__link-bullet kt-menu__link-bullet--dot"><span></span></i><span className="kt-menu__link-text">Sale tax and Delivery charges</span></a></li>
                                    </ul>
                                </div>
                            </li>
                            <li className={this.getClasses("deriver")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/deriver/list')}><i className="kt-menu__link-icon flaticon-graphic"></i><span className="kt-menu__link-text">Driver </span></a></li>
                            <li className={this.getClasses("category")} aria-haspopup="true"><a className="kt-menu__link refill-cursor" onClick={this._openPage.bind(this, '/category/list')}><i className="kt-menu__link-icon flaticon2-menu-2"></i><span className="kt-menu__link-text">Category </span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ sidebar }) => {
    const sidebar_data = sidebar && sidebar[SIDEBAR_KEY] ? sidebar[SIDEBAR_KEY] : undefined;
    const is_show = sidebar_data && sidebar_data[SIDEBAR_IS_SHOW] ? sidebar_data[SIDEBAR_IS_SHOW] : false;
    const page_path = sidebar_data && sidebar_data[SIDEBAR_PAGE_PATH] ? sidebar_data[SIDEBAR_PAGE_PATH] : "";

    return ({
        is_show,
        page_path
    });
}

export default connect(mapToProps, {
    updateSidebarUIConstraints
})(Sidebar);