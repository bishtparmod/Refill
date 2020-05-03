import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SUCCESS, EMPTY, STATUS, MESSAGE, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_STATUS, PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS, ORDER_LIST_TYPE, CURRENT_ORDER, ORDER_LIST_SCREEN } from '../../../redux/Types';
import { Modal, Image } from 'react-native';
import { WView, WText } from '../../ui';
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { updateOrderListUIConstraints } from '../../../redux/orderList/Action';
import { Toaster } from '../../base_components';

class Alert extends PureComponent {
    constructor(props) {
        super(props);

        this.toaster_id = undefined;
        this.toaster_ids = [];
    }

    state = {
        isToaster: false
    }

    getRandomId = () => {
        return `${new Date().getTime()}${parseInt(Math.random() * 1000000)}`;
    }

    componentDidUpdate = (propTypes) => {
        const { type } = this.props;

        if (propTypes.type !== type) {
            if (type !== EMPTY) {
                this.toaster_id = this.getRandomId();
                this.toaster_ids.push(this.toaster_id);
                this.init();
            }
        }
    }

    init = () => {
        const { type } = this.props;
        this.setState({ isToaster: true });

        setTimeout(() => {
            const index = this.toaster_ids && this.toaster_ids.length ? this.toaster_ids.findIndex(ele => ele === this.toaster_id) : -1;

            if (index === 0) {
                this.setState({ isToaster: false });
                this.toaster_ids.splice(0, 1);
            } else if (index !== -1 && this.toaster_ids && this.toaster_ids.length) {
                this.toaster_ids.splice(0, 1);
            }

            this._successResponseHandler();
        }, type === SUCCESS ? 1000 : 5000);
    }

    _successResponseHandler = () => {
        const { type, updateOrderListUIConstraints, navigation } = this.props;

        if (type !== SUCCESS || !navigation) return;

        updateOrderListUIConstraints({
            [ORDER_LIST_TYPE]: CURRENT_ORDER
        });
        navigation.popToTop();
        navigation.popToTop();
        navigation.navigate(ORDER_LIST_SCREEN);
    }

    render() {
        const { isToaster } = this.state;
        const { container, iconStyle } = this.getStyles();
        const checkedIcon = require("../../../../assets/img/checked.png");
        const { type, message } = this.props;

        if (!isToaster) return null;

        if (type === SUCCESS)
            return (
                <Modal
                    visible={true}
                    transparent={true}
                    onRequestClose={() => {

                    }}>
                    <WView flex dial={5} stretch backgroundColor={'rgba(0, 0, 0, 0.5)'}>
                        <WView dial={5} margin={[0, Utils.scaleSize(20)]} padding={[Utils.scaleSize(30), 0]} backgroundColor={Colors.white} style={container}>
                            <Image source={checkedIcon} style={iconStyle} />
                            <WText margin={[Utils.scaleSize(12), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} center>Your Order Has Been Submitted</WText>
                        </WView>
                    </WView>
                </Modal>
            );

        return (
            <Toaster
                type={type}
                message={message} />
        );
    }

    getStyles = () => {

        return ({
            container: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(15)
            },
            iconStyle: {
                width: Utils.scaleSize(120),
                height: Utils.scaleSize(120),
                tintColor: Colors.theme_color
            }
        });
    }
}

const mapToProps = ({ product_detail }) => {
    const product_detail_key = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};

    const request_status = product_detail_key && product_detail_key[PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS] ? product_detail_key[PRODUCT_DETAIL_ORDERS_PLACE_REQUEST_STATUS] : {};
    const type = request_status && request_status[STATUS] ? request_status[STATUS] : '';
    const message = request_status && request_status[MESSAGE] ? request_status[MESSAGE] : '';

    return ({
        type,
        message
    });
}

export default connect(mapToProps, {
    updateOrderListUIConstraints
})(Alert);