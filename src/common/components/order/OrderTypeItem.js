import React, { PureComponent } from 'react';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { WView, WText, WTouchable } from '../../ui';
import { Image } from 'react-native';
import { updateOrderListUIConstraints } from '../../../redux/orderList/Action';
import { ORDER_LIST_TYPE, ORDER_LIST_REQUEST_PAGE, ORDER_LIST_REQUEST_DATA, ORDER_LIST_KEY } from '../../../redux/Types';
import { connect } from 'react-redux';

class OrderTypeItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    pressOrderType = () => {
        const { type, updateOrderListUIConstraints, order_type } = this.props;

        if(type === order_type) return;

        updateOrderListUIConstraints({
            [ORDER_LIST_TYPE]: type,
            [ORDER_LIST_REQUEST_DATA]: [],
            [ORDER_LIST_REQUEST_PAGE]: 1
        });
    }

    render() {
        const iconPath = require("../../../../assets/img/bucket.png");
        const { imageContainerStyle, imageStyle, container } = this.getStyles();
        const { backgroundColor, label } = this.props;

        return (
            <WTouchable margin={[Utils.scaleSize(5), Utils.scaleSize(5)]} onPress={this.pressOrderType.bind(this)}>
                <WView style={container} dial={5} backgroundColor={backgroundColor}>
                    <WView style={imageContainerStyle}>
                        <Image source={iconPath} style={imageStyle} resizeMode={"contain"} />
                    </WView>
                    <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.white} center>
                        {label}
                    </WText>
                </WView>
            </WTouchable>
        );
    }

    getStyles = () => {
        return ({
            container: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(10),
                width: Utils.scaleSize(60),
                height: Utils.scaleSize(60)
            },
            imageContainerStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null,
                tintColor: Colors.white
            }
        });
    }
}

const mapToProps = ({ order_list }) => {
    const order_list_info = order_list && order_list[ORDER_LIST_KEY] ? order_list[ORDER_LIST_KEY] : {};

    const order_type = order_list_info && order_list_info[ORDER_LIST_TYPE] ? order_list_info[ORDER_LIST_TYPE] : "";

    return ({
        order_type
    });
}
export default connect(mapToProps, {
    updateOrderListUIConstraints
})(OrderTypeItem);