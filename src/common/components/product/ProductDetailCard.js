import React, { PureComponent } from 'react';
import { Image, Animated, View } from 'react-native';
import { WView, WText, WRow } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import ProductPlaceOrderForm from './ProductPlaceOrderForm';
import { connect } from 'react-redux';
import { PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_REQUEST_DATA, PRODUCT_DETAIL_IS_ORDER_TYPE_ALERT, PRODUCT_DETAIL_FORM, PRODUCT_DETAIL_ORDERS_ESTIMATE_LIST, DEVICE_IS_LOGGED_IN, DEVICE_KEY, PRODUCT_DETAIL_ORDERS_IS_REFILL } from '../../../redux/Types';
import moment from 'moment-timezone';
import ProductDetailSelectOrderDateAlert from './ProductDetailSelectOrderDateAlert';
import ProductDetailOrderType from './ProductDetailOrderType';
import { ProductRefillOrderForm } from '.';

const MAX_IMAGE_CONTAINER_HEIGHT = Utils.scaleSize(200);
class ProductDetailCard extends PureComponent {
    constructor(props) {
        super(props);

        const y0 = this.props.navigation.getParam('y0') - 100;
        this.imgContainerAnim = new Animated.Value(y0);
        this.bodyContainerAnim = new Animated.Value(y0);
    }

    componentDidMount = () => {
        this.initTransition();
    }

    initTransition = () => {
        Animated.parallel([
            Animated.timing(this.imgContainerAnim, {
                toValue: 0,
                duration: 500
            }),
            Animated.timing(this.bodyContainerAnim, {
                duration: 500,
                toValue: 0
            })
        ]).start();
    }

    DetailContainer = ({ }) => {
        const { priceContainerStyle } = this.getStyles();
        const { data = {}, isLogin, navigation, is_refill } = this.props;
        const { name, retailPrice, refillPrice, size, longDescription, manufactureAt, expiryAt } = data;

        return (
            <WView stretch dial={2} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                <WRow dial={5} stretch>
                    <WView dial={4} flex={1}>
                        <WText fontSize={Utils.scaleSize(16)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{name}</WText>
                        <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>{moment(manufactureAt).format("DD MMM, YYYY")} To {moment(manufactureAt).format("DD MMM-YYYY")}</WText>
                    </WView>
                    <WView dial={6} margin={[10, 10]} style={priceContainerStyle} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.theme_color} left>{Utils.formatCurrency(refillPrice)}</WText>
                        <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Refill Special</WText>
                    </WView>
                </WRow>
                <WRow dial={5} stretch>
                    <WView dial={4} flex={1}>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>({size})</WText>
                        <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Dimensions</WText>
                    </WView>
                    <WView dial={6} padding={[Utils.scaleSize(10), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                        <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>
                            {Utils.formatCurrency(retailPrice)}
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>{" Retail Price"}</WText>
                        </WText>
                    </WView>
                </WRow>
                <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} fontWeight={"400"} color={Colors.text_color_light_dark} left lines={0}>
                    {longDescription}
                </WText>
                {
                    is_refill ?
                        <ProductRefillOrderForm
                            navigation={navigation} />
                        :
                        <ProductPlaceOrderForm
                            navigation={navigation} />
                }
            </WView>
        );
    }

    render() {
        const image = { uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOekvk-UHVhyyHZvXoI3obKhwkg90XVX6AKe0pbup8wj-S9gH1&s" };
        const { imageStyle, imageContainer, bodyContainer } = this.getStyles();
        const { data = {} } = this.props;
        const { images } = data;
        const img = images && images.length ? { uri: images[0].image } : null;

        return (
            <WView dial={2} flex>
                <ProductDetailSelectOrderDateAlert />
                <ProductDetailOrderType />
                <Animated.View style={imageContainer}>
                    <Image source={img} style={imageStyle} resizeMode={"cover"} />
                </Animated.View>
                <Animated.View style={bodyContainer}>
                    <this.DetailContainer />
                </Animated.View>
            </WView>
        );
    }

    getStyles = () => {
        const y0 = this.props.navigation.getParam('y0') - 100;

        const imgWidth = this.imgContainerAnim.interpolate({
            inputRange: [0, y0],
            outputRange: [Utils.getDeviceDimentions().width, Utils.scaleSize(100)]
        });

        const imgHeight = this.imgContainerAnim.interpolate({
            inputRange: [0, y0],
            outputRange: [MAX_IMAGE_CONTAINER_HEIGHT, Utils.scaleSize(80)]
        });

        const imgTopRightBorderRadius = this.imgContainerAnim.interpolate({
            inputRange: [0, y0],
            outputRange: [0, Utils.scaleSize(Utils.getDeviceDimentions().width - 20 / 2)]
        });

        return ({
            imageContainer: {
                width: imgWidth,
                height: imgHeight,
                position: 'absolute',
                top: this.imgContainerAnim,
                borderTopRightRadius: imgTopRightBorderRadius,
                // borderTopLeftRadius: imgTopRightBorderRadius,
                // borderBottomRightRadius: imgTopRightBorderRadius,
                // borderBottomLeftRadius: imgTopRightBorderRadius,
                overflow: 'hidden',
                left: 0,
                backgroundColor: Colors.light_color
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            },
            bodyContainer: {
                marginTop: MAX_IMAGE_CONTAINER_HEIGHT,
                transform: [
                    { translateY: this.bodyContainerAnim }
                ],
                alignSelf: 'stretch'
            },
            priceContainerStyle: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(5)
            }
        });
    }
}

const mapToProps = ({ product_detail, device }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};
    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};

    const data = product_detail_info && product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] ? product_detail_info[PRODUCT_DETAIL_REQUEST_DATA] : {};
    const isLogin = device_info && device_info[DEVICE_IS_LOGGED_IN] ? device_info[DEVICE_IS_LOGGED_IN] : false;
    const is_refill = product_detail_info && product_detail_info[PRODUCT_DETAIL_ORDERS_IS_REFILL] ? product_detail_info[PRODUCT_DETAIL_ORDERS_IS_REFILL] : false;

    return ({
        data,
        is_refill
    });
}
export default connect(mapToProps)(ProductDetailCard);