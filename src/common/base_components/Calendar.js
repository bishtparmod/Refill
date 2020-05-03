import React, { PureComponent, Component } from 'react'
import PropTypes from 'prop-types'
import { WView } from '../ui'
import CalendarPicker from 'react-native-calendar-picker'
import Colors from '../styles/Colors';

class Calendar extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        onDateChange: PropTypes,
        customDatesStyles: PropTypes.array,
        allowRangeSelection: PropTypes.bool,
        selectedStartDate: PropTypes.any,
        selectedEndDate: PropTypes.any
    }

    static defaultProps = {
        customDatesStyles: [],
        allowRangeSelection: false,
        selectedDayColor: Colors.theme_color,
        selectedDayTextColor: Colors.white
    }

    render() {
        const { onDateChange, allowRangeSelection, customDatesStyles, selectedStartDate, selectedEndDate, selectedDayColor, selectedDayTextColor, getRef } = this.props;

        return (
            <WView dial={5}>
                <CalendarPicker
                    ref={getRef}
                    minDate={new Date()}
                    selectedDayColor={selectedDayColor}
                    selectedDayTextColor={selectedDayTextColor}
                    dayShape={"square"}
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    onDateChange={onDateChange}
                    customDatesStyles={customDatesStyles}
                    allowRangeSelection={allowRangeSelection}
                />
            </WView>
        );
    }
}

export default Calendar;