import React, { PureComponent } from 'react';
import { View, Animated, PanResponder, Image, TouchableWithoutFeedback } from 'react-native';
import { WRow, WView, WText, WTouchable } from '../../../common/ui';
import Utils from '../../../common/util/Utils';
import Colors from '../../styles/Colors';
import { CardDeleteBtn } from '.';
import { SCREEN_TYPE_PAYMENT, PRODUCT_DETAIL_FORM_ORDER_CARD_ID, PRODUCT_DETAIL_KEY, PRODUCT_DETAIL_FORM } from '../../../redux/Types';
import { updateProductDetailFormData } from '../../../redux/prodcutDetail/Action';
import { connect } from 'react-redux';

class ListCardContainerItem extends PureComponent {
    constructor(props) {
        super(props);

        this.init();
        this.containerAnim = new Animated.Value(0);
        this.deleteContainerWidthAnim = new Animated.Value(0);
    }

    init = () => {
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                // this.containerAnim.extractOffset();
            },
            onPanResponderMove: (evt, gestureState) => {
                const { dx, vx } = gestureState;

                Animated.parallel([
                    Animated.spring(this.containerAnim, {
                        toValue: dx
                    }),
                    Animated.spring(this.deleteContainerWidthAnim, {
                        toValue: -dx
                    })
                ]).start();
            },
            onPanResponderRelease: (evt, gestureState) => {
                const { dx, vx } = gestureState;

                if (-dx > 50) {
                    this.enableDelete();
                } else if (dx > 50) {
                    Animated.parallel([
                        Animated.spring(this.containerAnim, {
                            toValue: 0
                        }),
                        Animated.spring(this.deleteContainerWidthAnim, {
                            toValue: 0
                        })
                    ]).start();
                } else Animated.parallel([
                    Animated.spring(this.containerAnim, {
                        toValue: 0
                    }),
                    Animated.spring(this.deleteContainerWidthAnim, {
                        toValue: 0
                    })
                ]).start();
            }
        });
    }

    enableDelete = () => {
        Animated.parallel([
            Animated.spring(this.containerAnim, {
                toValue: -100
            }),
            Animated.spring(this.deleteContainerWidthAnim, {
                toValue: 100
            })
        ]).start();
    }

    _actionBtn = () => {
        const { screen_type, item = {}, updateProductDetailFormData } = this.props;
        const { id } = item;

        switch (screen_type) {
            case SCREEN_TYPE_PAYMENT:
                updateProductDetailFormData({
                    [PRODUCT_DETAIL_FORM_ORDER_CARD_ID]: id
                });
                break;
            default:
                this.enableDelete();
        }
    }

    getItemBackgroundColor = () => {
        const { screen_type, item = {}, card_id } = this.props;
        const { id } = item;
        const is_payment = screen_type === SCREEN_TYPE_PAYMENT ? true : false;

        if (is_payment) {
            return (card_id === id ? Colors.black : Colors.white);
        };

        return Colors.black;
    }

    _renderItemBody = () => {
        const cardIcon = require("../../../../assets/img/card.png");
        const rightIcon = require("../../../../assets/img/right_arrow.png");
        const { iconStyle, btnContainer, container, radioBtnContainer } = this.getStyles();
        const { item, screen_type, card_id } = this.props;
        const is_payment = screen_type === SCREEN_TYPE_PAYMENT ? true : false;

        return (
            <WRow flex stretch dial={5} stretch padding={[Utils.scaleSize(10), 0]} style={container}>
                <WView dial={5} padding={[0, Utils.scaleSize(10)]}>
                    <Image source={cardIcon} style={iconStyle} resizeMode={"contain"} />
                </WView>
                <WView dial={4} flex>
                    <WText fontSize={Utils.scaleSize(14)} fontFamily={"Poppins-Bold"} fontWeight={"bold"} color={Colors.text_color_dark} left>{item.name}</WText>
                    <WText fontSize={Utils.scaleSize(12)} fontFamily={"Poppins-Light"} fontWeight={"500"} color={Colors.text_color_light_dark} left>xxxx-xxxx-xxxx-{item.last4}</WText>
                </WView>
                <WTouchable dial={5} padding={[0, Utils.scaleSize(10)]} onPress={this._actionBtn.bind(this)}>
                    <WView dial={5} padding={[Utils.scaleSize(5), Utils.scaleSize(5)]} style={[btnContainer, is_payment ? radioBtnContainer : {}]} backgroundColor={this.getItemBackgroundColor()}>
                        {
                            is_payment ?
                                <WView style={[iconStyle]} />
                                : <Image source={rightIcon} style={[iconStyle, { tintColor: Colors.white }]} resizeMode={"contain"} />
                        }
                    </WView>
                </WTouchable>
            </WRow>
        );
    }

    render() {
        const { itemContainer, deleteCotainer } = this.getStyles();
        const { item, screen_type } = this.props;

        if (screen_type === SCREEN_TYPE_PAYMENT) {
            return (
                <WRow backgroundColor={Colors.white}>
                    <Animated.View style={itemContainer}>
                        {this._renderItemBody()}
                    </Animated.View>
                </WRow>
            );
        }

        return (
            <WRow backgroundColor={Colors.white}>
                <Animated.View style={itemContainer} {...this._panResponder.panHandlers}>
                    {this._renderItemBody()}
                </Animated.View>
                <Animated.View style={deleteCotainer}>
                    <CardDeleteBtn card_id={item.id} />
                </Animated.View>
            </WRow>
        );
    }

    getStyles = () => {

        const deleteContainerOpacity = this.deleteContainerWidthAnim.interpolate({
            inputRange: [0, 50, 100],
            outputRange: [0, 0.5, 1],
            extrapolate: 'clamp'
        });

        return ({
            itemContainer: {
                height: Utils.scaleSize(70),
                transform: [{
                    translateX: this.containerAnim
                }],
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                backgroundColor: Colors.white,
            },
            container: {
                borderStyle: 'solid',
                borderBottomWidth: 1,
                borderColor: Colors.light_color
            },
            iconStyle: {
                width: Utils.scaleSize(20),
                height: Utils.scaleSize(20)
            },
            btnContainer: {
                backgroundColor: Colors.text_color_dark,
                borderRadius: Utils.scaleSize(5),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
            deleteCotainer: {
                position: 'absolute',
                right: 0,
                width: this.deleteContainerWidthAnim,
                height: Utils.scaleSize(70),
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                opacity: deleteContainerOpacity,
                backgroundColor: Colors.text_color_dark
            },
            touchableStyle: {
                alignSelf: 'stretch'
            },
            radioBtnContainer: {
                maxWidth: Utils.scaleSize(20),
                maxHeight: Utils.scaleSize(20),
                borderRadius: Utils.scaleSize(10)
            }
        });
    }
}

const mapToProps = ({ product_detail }) => {
    const product_detail_info = product_detail && product_detail[PRODUCT_DETAIL_KEY] ? product_detail[PRODUCT_DETAIL_KEY] : {};

    const form_data = product_detail_info && product_detail_info[PRODUCT_DETAIL_FORM] ? product_detail_info[PRODUCT_DETAIL_FORM] : {};
    const card_id = form_data && form_data[PRODUCT_DETAIL_FORM_ORDER_CARD_ID] ? form_data[PRODUCT_DETAIL_FORM_ORDER_CARD_ID] : "";

    return ({
        card_id
    });
}

export default connect(mapToProps, {
    updateProductDetailFormData
})(ListCardContainerItem);