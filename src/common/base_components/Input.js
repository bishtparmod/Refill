import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { WView, WTextInput, WText, WRow } from '../ui';
import Colors from '../styles/Colors';
import Utils from '../util/Utils';
import { Text, Image, Animated, Platform } from 'react-native';

const MAX_LABEL_FONT_SIZE = Utils.scaleSize(14);
const MIN_LABEL_FONT_SIZE = Utils.scaleSize(10);
const MAX_LABEL_LEFT_SIZE = Utils.scaleSize(35);
const MIN_LABEL_LEFT_SIZE = Utils.scaleSize(30);
const MAX_LABEL_TOP_SIZE = Utils.scaleSize(Platform.OS === "android" ? 7 : 7);
const MIN_LABEL_TOP_SIZE = Utils.scaleSize(Platform.OS === "android" ? -5 : -6);
export default class Input extends PureComponent {

    static propTypes = {
        placeholderTextColor: PropTypes.string,
        secureTextEntry: PropTypes.bool,
        returnKeyType: PropTypes.string,
        source: PropTypes.any,
        labelName: PropTypes.string.isRequired,
        keyboardType: PropTypes.string,
        onSubmitEditing: PropTypes.func.isRequired,
        margin: PropTypes.array,
        padding: PropTypes.array,
        iconPath: PropTypes.any,
        isLoading: PropTypes.bool,
        containerStyle: PropTypes.any,
        flex: PropTypes.number,
        loading: PropTypes.bool,
        onBlur: PropTypes.func,
        onFocus: PropTypes.func,
        onChangeText: PropTypes.func,
        onChange: PropTypes.func,
        message: PropTypes.string,
        onPressMessage: PropTypes.func,
        leftIcon: PropTypes.any,
        isHorizontal: PropTypes.bool,
        isVertical: PropTypes.bool,
        labelIconPath: PropTypes.any
    }

    static defaultProps = {
        placeholderTextColor: Colors.transparent,
        keyboardType: "default",
        secureTextEntry: false,
        returnKeyType: "next",
        placeholderName: " Refill "
    }

    constructor(props) {
        super(props);

        this.state = {
            isFloat: false
        }

        this._isMount = true;
        this.enableFloat = false;
        this.text = props.value ? props.value : "";

        this.labelTopAnim = new Animated.Value(MAX_LABEL_TOP_SIZE);
        this.labelLeftAnim = new Animated.Value(MAX_LABEL_LEFT_SIZE);
        this.labelFontAnim = new Animated.Value(MAX_LABEL_FONT_SIZE);
    }

    _setState = (value, cb) => {
        if (!this._isMount) return;

        if (cb) this.setState(value, cb);
        else this.setState(value);
    }

    componentWillUnmount = () => {
        this._isMount = false;
    }

    success = () => {
        const { success } = this.props;

        if (success && success.tintColor) return success.tintColor;

        return Colors.white;
    }

    error = () => {
        const { error } = this.props;

        if (error && error.tintColor) return error.tintColor;

        return Colors.danger;
    }

    onFocus = () => {
        Animated.parallel([
            Animated.timing(this.labelTopAnim, {
                toValue: MIN_LABEL_TOP_SIZE,
                duration: 400
            }),
            Animated.timing(this.labelFontAnim, {
                toValue: MIN_LABEL_FONT_SIZE,
                duration: 400
            }),
            Animated.timing(this.labelLeftAnim, {
                toValue: MIN_LABEL_LEFT_SIZE,
                duration: 400
            })
        ]).start();

        this.enableFloat = true;
    }

    onBlur = () => {
        const { value } = this.props;
        if (value) return;

        Animated.parallel([
            Animated.timing(this.labelTopAnim, {
                toValue: MAX_LABEL_TOP_SIZE,
                duration: 400
            }),
            Animated.timing(this.labelFontAnim, {
                toValue: MAX_LABEL_FONT_SIZE,
                duration: 400
            }),
            Animated.timing(this.labelLeftAnim, {
                toValue: MAX_LABEL_LEFT_SIZE,
                duration: 400
            })
        ]).start();

        this.enableFloat = false;
    }

    componentDidUpdate = (prevProps) => {
        const { value } = this.props;

        if (value !== prevProps.value) {
            if (!this.enableFloat) {
                this.onFocus();
                this.enableFloat = value && value.length ? true : false;
            }
        }
    }

    render() {
        const {
            placeholderTextColor,
            isHorizontal,
            isVertical,
            secureTextEntry,
            returnKeyType,
            source,
            labelName,
            placeholderName,
            keyboardType,
            onSubmitEditing,
            margin,
            padding,
            iconPath,
            isLoading,
            containerStyle,
            inputContainer,
            flex,
            isError,
            message,
            onPressMessage,
            leftIcon,
            inputContainerStyle,
            labelIconPath,
            loading, ...rest } = this.props;

        this.input = {
            placeholderTextColor,
            secureTextEntry,
            placeholderName,
            returnKeyType,
            source,
            keyboardType,
            onSubmitEditing,
            margin,
            padding,
            iconPath,
            isLoading,
            containerStyle,
            flex,
            loading,
            isError
        }
        const { container, smallFontSize, labelOnFoucs, labelStyle, leftIconStyle, leftIconContainerStyle, verticalInputContainerStyle, inputStyle, horizontalInputStyle } = this.getStyle();
        const { style } = this.props;
        const fontSize = style && style.fontSize ? Utils.scaleSize(style.fontSize) : Utils.scaleSize(18);

        if (isVertical) {
            const { isError: _isError, ...otherInput } = this.input;

            return (
                <WView stretch dial={4} margin={[10, 0]} style={[inputContainer]}>
                    <WView flex>
                        <WRow dial={4}>
                            {labelIconPath ? <Image source={labelIconPath} style={[leftIconStyle, { tintColor: Colors.text_color_light_dark }]} resizeMode={"contain"} /> : null}
                            {true ? <WText padding={[0, 5]} fontSize={Utils.scaleSize(14)} fontFamily="Poppins-Bold" fontWeight={"500"} color={isError && isError.status ? this.error() : Colors.text_color_light_dark} >{labelName}</WText> : null}
                        </WRow>
                        <WView flex={1}>
                            <WTextInput
                                style={style ? style : inputStyle}
                                inputContainerStyle={inputContainerStyle ? inputContainerStyle : verticalInputContainerStyle}
                                {...otherInput}
                                {...rest}
                            />
                        </WView>
                    </WView>
                    {
                        isError && isError.message ?
                            <WText fontSize={smallFontSize.fontSize} padding={[10, 0]} fontFamily="Poppins-Medium" color={Colors.danger} lines={2} onPress={onPressMessage} right>
                                {isError.message}
                            </WText>
                            : null
                    }
                </WView>
            );
        }


        if (isHorizontal)
            return (
                <WView stretch dial={4} margin={[10, 0]} style={[inputContainer]}>
                    <WRow flex spaceBetween style={[verticalInputContainerStyle]}>
                        <WView flex={2}>
                            <WTextInput
                                style={style ? style : horizontalInputStyle}
                                {...this.input}
                                {...rest}
                            />
                        </WView>
                        <WView flex={1} dial={6} margin={[0, 10, 0, 0]}>
                            {labelName ? <WText fontSize={Utils.scaleSize(10)} fontFamily="Poppins-Bold" fontWeight={"500"} color={isError && isError.status ? this.error() : Colors.text_color_dark} >{labelName}</WText> : null}
                        </WView>
                    </WRow>
                    {
                        isError && isError.message ?
                            <WText fontSize={Utils.scaleSize(14)} padding={[10, 0]} fontFamily="Poppins-Medium" color={Colors.danger} lines={2} onPress={onPressMessage} right>
                                {isError.message}
                            </WText>
                            : null
                    }
                </WView>
            );

        return (
            <WView stretch dial={!labelName && !labelName ? 5 : 8} margin={[10, 0, 5, 0]} style={inputContainer} >
                {/* {labelName ? <WText fontSize={fontSize} fontFamily="Avenir Heavy" fontWeight={"500"} color={isError && isError.status ? this.error() : this.success()} > {labelName}</WText > : null} */}
                {labelName ? <Animated.Text style={labelStyle} > {labelName}</Animated.Text > : null}
                <WTextInput
                    {...this.input}
                    {...rest}
                    component={() => {
                        if (leftIcon)
                            return (<WView dial={5} style={leftIconContainerStyle}>
                                <Image source={leftIcon} style={leftIconStyle} resizeMode={"contain"} />
                            </WView>);
                            
                        return null;
                    }}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                />
                {
                    isError && isError.message ?
                        <WText fontSize={smallFontSize.fontSize} fontFamily="Poppins-Medium" color={Colors.danger} padding={[0, 10]} lines={2} onPress={onPressMessage} right>
                            {isError.message}
                        </WText>
                        : null
                }
            </WView >
        )
    }

    getStyle = () => {
        const { isError } = this.props;

        const labelZInex = this.labelFontAnim.interpolate({
            inputRange: [MIN_LABEL_FONT_SIZE, MAX_LABEL_FONT_SIZE],
            outputRange: [1, 0],
            extrapolate: "clamp"
        })
        return {
            smallFontSize: {
                fontSize: Utils.scaleSize(14)
            },
            labelOnFoucs: {
                position: 'absolute',
                top: -8,
                left: 20,
                color: isError && isError.status ? this.error() : this.success(),
                fontSize: Utils.scaleSize(12),
                fontWeight: "500",
                paddingHorizontal: 10,
                backgroundColor: 'pink'
            },
            labelStyle: {
                position: 'absolute',
                zIndex: labelZInex,
                top: this.labelTopAnim,
                left: this.labelLeftAnim,
                color: Colors.white,
                fontSize: this.labelFontAnim,
                paddingHorizontal: Utils.scaleSize(10),
                fontWeight: "500",
                backgroundColor: Colors.theme_color
            },
            leftIconContainerStyle: {
                maxWidth: 30,
                flex: 1,
                paddingHorizontal: 20
            },
            leftIconStyle: {
                width: 20,
                height: 20
            },
            verticalInputContainerStyle: {
                borderWidth: 0,
                borderRadius: 0,
                borderColor: Colors.text_color_light_dark,
                borderBottomWidth: 1
            },
            inputStyle: {
                color: Colors.text_color_dark,
                fontSize: Utils.scaleSize(18),
                fontWeight: '600',
                fontFamily: 'Poppins-Bold'
            },
            horizontalInputStyle: {
                color: Colors.text_color_dark,
                fontSize: Utils.scaleSize(12),
                fontWeight: '400',
                fontFamily: 'Poppins-Bold'
            }
        }
    }
}
