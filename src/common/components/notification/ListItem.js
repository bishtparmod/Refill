import React, { PureComponent } from 'react';
import { Image, FlatList } from 'react-native';
import { WView, WText, WRow, WTouchable } from '../../ui';
import { ProductListItem } from '../product';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { SERVER_ORDER_STATUS_RECEIVED, SERVER_ORDER_STATUS_PROCESSED, SERVER_ORDER_STATUS_SHIPPED, SERVER_ORDER_STATUS_CANCELLED, SERVER_ORDER_STATUS_SKIPPED, ORDER_VIEW_SCREEN, ORDER_VIEW_REQUEST_ID } from '../../../redux/Types';
import moment from 'moment-timezone';
import { updateOrderViewUIConstraints } from '../../../redux/orderView/Action';
import { connect } from 'react-redux';

class OrderListItemView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onPressNotification = () => {
        const { item = {}, navigation, updateOrderViewUIConstraints } = this.props;
        const { order = [] } = item;
        const { _id } = order[0];

        if (!_id || !navigation) return;

        updateOrderViewUIConstraints({
            [ORDER_VIEW_REQUEST_ID]: _id
        });
        navigation.navigate(ORDER_VIEW_SCREEN);
    }

    getTime = () => {
        const { item = {} } = this.props;
        const { orderStatus, order = [] } = item;
        const { receivedOrderDate, processedOrderDate, shippedOrderDate, cancelledOrderDate, skippedOrderDate } = order[0];

        let date = '';
        switch (orderStatus) {
            case SERVER_ORDER_STATUS_RECEIVED:
                date = receivedOrderDate;
                break;
            case SERVER_ORDER_STATUS_PROCESSED:
                date = processedOrderDate;
                break;
            case SERVER_ORDER_STATUS_SHIPPED:
                date = shippedOrderDate;
                break;
            case SERVER_ORDER_STATUS_CANCELLED:
                date = cancelledOrderDate;
                break;
            case SERVER_ORDER_STATUS_SKIPPED:
                date = skippedOrderDate;
                break;
        }

        if (!date) return '';

        return moment(date).format("DD MMM, YYYY")
    }

    render() {
        const { container, imgContainerStyle, subContainer, cardView } = this.getStyles();
        const { item = {} } = this.props;
        const { orderStatus, order = [] } = item;
        const firstLetter = orderStatus ? orderStatus.toUpperCase().substr(0, 1) : '';
        const { receivedOrderDate } = order[0];

        return (
            <WTouchable dial={5} margin={[Utils.scaleSize(5), 0]} style={container} stretch onPress={this.onPressNotification.bind(this)}>
                <WView flex dial={5} style={[subContainer, cardView]} margin={[0, Utils.scaleSize(5), 0, Utils.scaleSize(20)]} backgroundColor={Colors.white}>
                    <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(30)]} fontSize={Utils.scaleSize(12)} fontWeight={"400"} color={Colors.text_color_light_dark} lines={3}>
                        {`Your order has been ${orderStatus} at ${this.getTime()}`}
                    </WText>
                </WView>
                <WView style={[imgContainerStyle, cardView]} dial={5} backgroundColor={Colors.text_color_light_dark}>
                    <WText fontFamily={"Poppins-Bold"} dial={5} fontSize={Utils.scaleSize(20)} fontWeight={"bold"} color={Colors.white} lines={3}>
                        {firstLetter}
                    </WText>
                </WView>
            </WTouchable>
        );
    }

    getStyles = () => {
        return ({
            container: {
                height: Utils.scaleSize(60)
            },
            subContainer: {
                borderRadius: Utils.scaleSize(5)
            },
            cardView: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            imgContainerStyle: {
                position: 'absolute',
                top: Utils.scaleSize(10),
                left: 0,
                width: Utils.scaleSize(40),
                height: Utils.scaleSize(40),
                borderRadius: Utils.scaleSize(20)
            }
        })
    }
}

const mapToProps = ({ }) => {

    return ({
    });
}
export default connect(mapToProps, {
    updateOrderViewUIConstraints
})(OrderListItemView);