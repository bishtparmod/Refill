import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Loader extends PureComponent {
    static propTypes = {

    }

    render() {
        return (
            <div className="kt-page-content-white kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--transparent kt-aside--enabled kt-aside--fixed kt-page--loading refill-loader">
                {/* begin:: Page */}
                <div className="kt-grid kt-grid--ver kt-grid--root kt-page height-100">
                    <div className="kt-grid kt-grid--hor kt-grid--root  kt-login kt-login--v3 kt-login--signin" id="kt_login">
                        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" style={{ backgroundImage: 'url(assets/media//bg/bg-3.jpg)' }}>
                            <div className="kt-grid__item kt-grid__item--fluid kt-login__wrapper">
                                <div className="kt-login__container refill-container-center">
                                    <div className="kt-login__signin refill-sub-container-center">
                                        <img src="/assets/img/loading.gif" height="100" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* end:: Page */}
            </div>
        )
    }
}
