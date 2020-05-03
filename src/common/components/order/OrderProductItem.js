import React, { PureComponent } from 'react';
import Utils from "../../util/Utils";
import { WText, WView, WRow, WButton, WTouchable } from '../../ui';
import Colors from "../../styles/Colors";
import { Image, PanResponder, View } from 'react-native';
import { updateProductDetailUIConstraints } from '../../../redux/prodcutDetail/Action';
import { PRODUCT_DETAIL_REQUEST_DATA, ORDER_VIEW_SCREEN, ORDER_VIEW_REQUEST_ID, PRODUCT_DETAIL_SCREEN, SERVER_ORDER_STATUS_REFILL, PRODUCT_DETAIL_ORDERS_IS_REFILL, PRODUCT_DETAIL_ORDERS_REFILL_DATA } from '../../../redux/Types';
import { connect } from 'react-redux';
import { updateOrderViewUIConstraints } from '../../../redux/orderView/Action';

class OrderProductItem extends PureComponent {
    constructor(props) {
        super(props);

        this._panResponder = new PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => true,
            onPanResponderRelease: (evt, { y0, dy }) => {
                const { navigation, item = {}, updateProductDetailUIConstraints } = this.props;
                const { productDetail = {} } = item;

                updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_DATA]: productDetail,
                    [PRODUCT_DETAIL_ORDERS_IS_REFILL]: true,
                    [PRODUCT_DETAIL_ORDERS_REFILL_DATA]: item
                });
                navigation.navigate(PRODUCT_DETAIL_SCREEN, {
                    y0
                });

                console.log("evt ===> ", y0, dy);
            }
        })
    }

    onOrderPress = () => {
        const { navigation, item = {}, updateOrderViewUIConstraints } = this.props;
        const { _id } = item;

        if (!navigation) return;

        updateOrderViewUIConstraints({
            [ORDER_VIEW_REQUEST_ID]: _id
        });
        navigation.navigate(ORDER_VIEW_SCREEN);
    }

    onRefillOrderPress = () => {
        const { navigation, item = {}, updateProductDetailUIConstraints } = this.props;
        const { productDetail = {} } = item;

        updateProductDetailUIConstraints({
            [PRODUCT_DETAIL_REQUEST_DATA]: productDetail,
            [PRODUCT_DETAIL_ORDERS_IS_REFILL]: true,
            [PRODUCT_DETAIL_ORDERS_REFILL_DATA]: item
        });

        navigation.navigate(PRODUCT_DETAIL_SCREEN, {
            y0: 100
        });
    }

    _renderProductItem = () => {
        const { imageContainer, imgStyle, btnContainerStyle } = this.getStyles();
        const { index, item = {} } = this.props;
        const { productDetail = {} } = item;
        const { images, name, retailPrice, refillPrice, size } = productDetail;
        const img = images && images.length ? { uri: images[0].image } : require("../../../../assets/img/user1.png");

        return (
            <WTouchable onPress={this.onOrderPress.bind(this)} margin={[10, 0]}>
                <WRow dial={4} stretch padding={[Utils.scaleSize(5), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                    <WView stretch dial={5} style={imageContainer}>
                        <Image source={img} style={imgStyle} resizeMode={"cover"} />
                    </WView>
                    <WView flex stretch padding={[0, 0, 0, Utils.scaleSize(10)]} dial={4}>
                        <WText padding={[0, 0, Utils.scaleSize(5), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{name}</WText>
                        <WRow spaceBetween>
                            <WView>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"700"} color={Colors.text_color_dark} right>({size})</WText>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} right>Dimensions</WText>
                            </WView>
                            <WView spaceBetween >
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{Utils.formatCurrency(refillPrice)}</WText>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Refill Special</WText>
                            </WView>
                        </WRow>
                    </WView>
                </WRow>
            </WTouchable>
        );
    }

    _renderRefillProductItem = () => {
        const { imageContainer, imgStyle, btnContainerStyle } = this.getStyles();
        const { index, item = {} } = this.props;
        const { productDetail = {} } = item;
        const { images, name, retailPrice, refillPrice, size } = productDetail;
        const img = images && images.length ? { uri: images[0].image } : require("../../../../assets/img/user1.png");

        return (
            <WTouchable onPress={this.onRefillOrderPress.bind(this)} margin={[10, 0]}>
                <WRow dial={4} stretch padding={[Utils.scaleSize(5), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                    <WView stretch dial={5} style={imageContainer}>
                        <Image source={img} style={imgStyle} resizeMode={"cover"} />
                    </WView>
                    <WView flex stretch padding={[0, 0, 0, Utils.scaleSize(10)]} dial={4}>
                        <WText padding={[0, 0, Utils.scaleSize(5), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{name}</WText>
                        <WRow spaceBetween>
                            <WView>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"700"} color={Colors.text_color_dark} right>({size})</WText>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} right>Dimensions</WText>
                            </WView>
                            <WView spaceBetween >
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{Utils.formatCurrency(refillPrice)}</WText>
                                <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Refill Special</WText>
                            </WView>
                        </WRow>
                    </WView>
                </WRow>
            </WTouchable>
        );
    }

    render() {
        const { item = {} } = this.props;
        const { orderStatus } = item;

        if (orderStatus === SERVER_ORDER_STATUS_REFILL) {
            return this._renderRefillProductItem();
        }

        return this._renderProductItem();
    }

    getStyles = () => {
        const { } = this.props;

        return ({
            imageContainer: {
                width: Utils.scaleSize(100),
                height: Utils.scaleSize(60),
                alignSelf: 'center',
                backgroundColor: Colors.light_color
            },
            imgStyle: {
                flex: 1,
                width: null,
                height: null
            },
            btnContainerStyle: {
                backgroundColor: Colors.theme_color,
                minWidth: Utils.scaleSize(80),
                maxWidth: Utils.scaleSize(80),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            }
        });
    }
}

const mapToProps = ({ }) => {

    return ({});
}
export default connect(mapToProps, {
    updateProductDetailUIConstraints,
    updateOrderViewUIConstraints
})(OrderProductItem);