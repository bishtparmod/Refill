import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { LOGIN_KEY, LOGIN_REQEUST_LOGOUT_LOADING, HEADER_KEY, HEADER_IS_SHOW } from '../../redux/Types'
import { logout } from '../../redux/login/Action'

class Header extends PureComponent {
    static propTypes = {

    }

    _handleLogout = () => {
        const { logout } = this.props;

        logout();
    }

    /**
     * Open page
     */
    _openPage = (url) => {
        const { history } = this.props;

        if (!url) return;

        history.push(url);
    }

    render() {
        const { logout_loading, is_show } = this.props;

        if (is_show) return <div />;

        return (
            <div id="kt_header" className="kt-header kt-grid__item  kt-header--fixed " data-ktheader-minimize="on">
                <div className="kt-container  kt-container--fluid ">

                    {/* <!-- begin:: Brand --> */}
                    <div className="kt-header__brand " id="kt_header_brand">
                        <div className="kt-header__brand-logo">
                            <a href="/">
                                <img alt="Logo" src="/logo.png" height="56" />
                            </a>
                        </div>
                    </div>

                    {/* <!-- end:: Brand --> */}

                    {/* <!-- begin:: Header Topbar --> */}
                    <div className="kt-header__topbar">

                        {/* <!--begin: User bar --> */}
                        <div className="kt-header__topbar-item kt-header__topbar-item--user">
                            <div className="kt-header__topbar-wrapper" data-toggle="dropdown" data-offset="10px,0px">
                                <span className="kt-header__topbar-icon"><i className="flaticon2-gear"></i></span>
                            </div>
                            <div className="dropdown-menu dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-xl">

                                {/* <!--begin: Navigation --> */}
                                <div className="kt-notification">
                                    <a className="kt-notification__item refill-cursor" onClick={this._openPage.bind(this, '/profile/change_password')}>
                                        <div className="kt-notification__item-icon">
                                            <i className="flaticon2-rocket-1 flaticon2-lock"></i>
                                        </div>
                                        <div className="kt-notification__item-details">
                                            <div className="kt-notification__item-title kt-font-bold">
                                                Change Password
													</div>
                                        </div>
                                    </a>
                                   
                                    <div className="kt-notification__custom kt-space-between">
                                        <a  target="_blank" className=""></a>
                                        <a target="_blank" className="btn btn-label btn-label-brand btn-sm btn-bold refill-cursor" onClick={this._handleLogout.bind(this)}>{logout_loading ? "Loading..." : "Sign Out"}</a>
                                    </div>  
                                </div>

                                {/* <!--end: Navigation --> */}
                            </div>
                        </div>

                        {/* <!--end: User bar --> */}
                    </div>

                    {/* <!-- end:: Header Topbar --> */}
                </div>
            </div>
        )
    }
}

const mapToProps = ({ login, header }) => {
    const login_data = login && login[LOGIN_KEY] ? login[LOGIN_KEY] : undefined;
    const logout_loading = login_data && login_data[LOGIN_REQEUST_LOGOUT_LOADING] ? login_data[LOGIN_REQEUST_LOGOUT_LOADING] : false;

    const header_data = header && header[HEADER_KEY] ? header[HEADER_KEY] : undefined;
    const is_show = header_data && header_data[HEADER_IS_SHOW] ? header_data[HEADER_IS_SHOW] : false;

    return ({
        logout_loading,
        is_show
    });
}

export default connect(mapToProps, {
    logout
})(Header);