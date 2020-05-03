import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FOOTER_KEY, FOOTER_IS_SHOW } from '../../redux/Types'
import { connect } from 'react-redux'

class Footer extends PureComponent {
    static propTypes = {

    }

    render() {
        const { is_show } = this.props;

        if (is_show) return <div />;

        return (
            <div className="kt-footer kt-grid__item" id="kt_footer">
                <div className="kt-container  kt-container--fluid ">
                    <div className="kt-footer__wrapper">
                        <div className="kt-footer__copyright">
                            2019&nbsp;&copy;&nbsp;<a href="http://keenthemes.com/metronic" target="_blank" className="kt-link">Keenthemes</a>
                        </div>
                        <div className="kt-footer__menu">
                            <a href="http://keenthemes.com/metronic" target="_blank" className="kt-link">About</a>
                            <a href="http://keenthemes.com/metronic" target="_blank" className="kt-link">Team</a>
                            <a href="http://keenthemes.com/metronic" target="_blank" className="kt-link">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapToProps = ({ footer }) => {
    const footer_data = footer && footer[FOOTER_KEY] ? footer[FOOTER_KEY] : undefined;
    const is_show = footer_data && footer_data[FOOTER_IS_SHOW] ? footer_data[FOOTER_IS_SHOW] : false;

    return ({
        is_show
    });
}

export default connect(mapToProps)(Footer);