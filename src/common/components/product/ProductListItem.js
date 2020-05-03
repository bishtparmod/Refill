import React, { PureComponent } from 'react';
import Utils from "../../util/Utils";
import { WText, WView, WRow, WButton } from '../../ui';
import Colors from "../../styles/Colors";
import { Image, PanResponder, View } from 'react-native';
import { updateProductDetailUIConstraints } from '../../../redux/prodcutDetail/Action';
import { PRODUCT_DETAIL_REQUEST_DATA, PRODUCT_DETAIL_SCREEN } from '../../../redux/Types';
import { connect } from 'react-redux';

class ProductListItem extends PureComponent {
    constructor(props) {
        super(props);

        this._panResponder = new PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => true,
            onPanResponderRelease: (evt, { y0, dy }) => {
                const { navigation, item, updateProductDetailUIConstraints } = this.props;

                updateProductDetailUIConstraints({
                    [PRODUCT_DETAIL_REQUEST_DATA]: item
                });
                navigation.navigate(PRODUCT_DETAIL_SCREEN, { y0 });

                console.log("evt ===> ", y0, dy);
            }
        })
    }

    render() {
        const { imageContainer, imgStyle, btnContainerStyle } = this.getStyles();
        const { index, item = {} } = this.props;
        const { images, name, retailPrice, refillPrice, size } = item;
        const img = images && images.length ? { uri: images[0].image } : require("../../../../assets/img/user1.png");

        return (
            <WRow dial={4} stretch margin={[10, 0]} padding={[Utils.scaleSize(5), Utils.scaleSize(10)]} backgroundColor={Colors.white}>
                <WView stretch dial={5} style={imageContainer}>
                    <Image source={img} style={imgStyle} resizeMode={"cover"} />
                </WView>
                <WView flex stretch padding={[0, 0, 0, Utils.scaleSize(10)]} dial={4}>
                    <WText padding={[0, 0, Utils.scaleSize(5), 0]} fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{name}</WText>
                    <WRow spaceBetween>
                        <WView>
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{Utils.formatCurrency(retailPrice)}</WText>
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Retail Price</WText>
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{Utils.formatCurrency(refillPrice)}</WText>
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>Refill Special</WText>
                        </WView>
                        <WView spaceBetween >
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Bold"} fontWeight={"700"} color={Colors.text_color_dark} right>({size})</WText>
                            <WText fontSize={Utils.scaleSize(10)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} right>Dimensions</WText>
                            <View {...this._panResponder.panHandlers}>
                                <WButton
                                    btnPadding={[5, 10]}
                                    containerStyle={btnContainerStyle}
                                    label={"Order"} />
                            </View>
                        </WView>
                    </WRow>
                </WView>
            </WRow>
        );
    }

    getStyles = () => {
        const { } = this.props;

        return ({
            imageContainer: {
                width: Utils.scaleSize(100),
                height: Utils.scaleSize(80),
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

const mapToProps = ({}) => {

    return({});
}
export default connect(mapToProps, {
    updateProductDetailUIConstraints
})(ProductListItem);