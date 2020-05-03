import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-native';
import { WView, WText } from '../../ui'
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { Calendar } from '../../base_components';
import { connect } from 'react-redux';
import { ADD_CARD_KEY, ADD_CARD_IS_CALENDAR_VISIBLE, ADD_CARD_FORM_CVV, ADD_CARD_FORM_EXPIRE_DATE } from '../../../redux/Types';
import { updateAddCardFormData, updateAddCardUIConstraints } from '../../../redux/addCard/Action';

class CalendarAlert extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        isVisible: PropTypes.isVisible
    }

    selectDate = (date) => {
        const { updateAddCardFormData } = this.props;

        updateAddCardFormData({
            [ADD_CARD_FORM_EXPIRE_DATE]: date
        })
    }

    onDone = () => {
        const { updateAddCardUIConstraints } = this.props;

        updateAddCardUIConstraints({
            [ADD_CARD_IS_CALENDAR_VISIBLE]: false
        })
    }

    _renderCalendar = () => {
        return (
            <WView dial={2} stretch padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                <WText dial={5} padding={[Utils.scaleSize(10), 0]} onPress={this.onDone.bind(this)} fontSize={Utils.scaleSize(20)} fontWeight={"500"} color={Colors.text_color_dark} right>Done</WText>
                <Calendar
                    onDateChange={this.selectDate.bind(this)} />
            </WView>
        )
    }

    render() {
        const { isVisible } = this.props;

        return (
            <Modal
                visible={isVisible}
                onRequestClose={() => { }}
                transparent={true}
            >
                <WView flex stretch dial={8} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={'rgba(255, 255, 255, 0.5)'}>
                    {this._renderCalendar()}
                </WView>
            </Modal>
        );
    }

    getStyles = () => {
        return ({
            iconStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            }
        });
    }
}

const mapToProps = ({ add_card }) => {

    const add_card_info = add_card && add_card[ADD_CARD_KEY] ? add_card[ADD_CARD_KEY] : {};

    const isVisible = add_card_info && add_card_info[ADD_CARD_IS_CALENDAR_VISIBLE] ? add_card_info[ADD_CARD_IS_CALENDAR_VISIBLE] : false;

    return ({
        isVisible
    });
}

export default connect(mapToProps, {
    updateAddCardFormData,
    updateAddCardUIConstraints
})(CalendarAlert);