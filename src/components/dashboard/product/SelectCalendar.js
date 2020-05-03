import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment';
import $ from "jquery";

export default class SelectCalendar extends PureComponent {
    static propTypes = {
        _id: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        type: PropTypes.string,
        handleOnChange: PropTypes.func,
        refreshFunction:PropTypes.func,
        calendarOptions: PropTypes.object
    }

    static defaultProps = {
        placeholder: "Select date"
    }

    componentDidMount = () => {
        const { _id, value, handleOnChange, calendarOptions, refreshFunction } = this.props;

        var arrows;
        if (window.KTUtil.isRTL()) {
            arrows = {
                leftArrow: '<i className="la la-angle-right"></i>',
                rightArrow: '<i className="la la-angle-left"></i>'
            }
        } else {
            arrows = {
                leftArrow: '<i className="la la-angle-left"></i>',
                rightArrow: '<i className="la la-angle-right"></i>'
            }
        }

        window.$(`#${_id}`).datepicker(Object.assign(calendarOptions, {
            templates: arrows
        })).on("changeDate", function (e) {
            // refreshFunction()
            handleOnChange(new Date(e.date).getTime());
        });

        if (value) {
            window.$(`#${_id}`).datepicker("setDate", moment(value).format('MM/DD/YYYY'));
        }
    }

    componentDidUpdate = (prevProps) => {
        const { value, _id } = this.props;

        if (value !== prevProps.value) {
            if (value) {
                window.$(`#${_id}`).datepicker("setDate", moment(value).format('MM/DD/YYYY'));
            }
        }
    }

    render() {
        const { _id, placeholder, refreshFunction } = this.props;

        return (
            <input type="text" className="form-control" id={_id} readOnly placeholder={placeholder}  />
        )
    }
}
