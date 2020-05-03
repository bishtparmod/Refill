import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, Image, PixelRatio } from 'react-native';
import { WRow, WView, WTouchable } from '.';
import Colors from '../styles/Colors';
import Utils from '../util/Utils';

export default WTextInput = ({
    placeholderTextColor,
    placeholderName,
    keyboardType,
    onSubmitEditing,
    secureTextEntry,
    returnKeyLabel,
    returnKeyType,
    source,
    style,
    getFocus,
    multilineStyle,
    editable,
    multiline,
    isError,
    inputContainerStyle,
    isPassword,
    toggleSecureTextEntry,
    isAlignRight,
    component,
    currency,
    value,
    onChangeText,
    ...rest
}) => {

    const { container, inputText, multilineTextInputStyle, iconStyle } = styles;
    const viewIcon = require('../../../assets/img/view.png');
    const noViewIcon = require('../../../assets/img/no_view.png');

    return (
        <WRow dial={multiline ? 8 : 5} style={[container, multilineStyle, inputContainerStyle, isError && isError.status ? { borderColor: Colors.white } : inputContainerStyle]}>
            {
                component ?
                    component(isError)
                    : null
            }
            <TextInput
                {...rest}
                ref={getFocus}
                editable={editable}
                underlineColorAndroid={"transparent"}
                placeholderTextColor={placeholderTextColor}
                placeholder={placeholderName}
                onSubmitEditing={onSubmitEditing}
                multiline={multiline}
                secureTextEntry={secureTextEntry}
                returnKeyType={returnKeyType}
                keyboardType={keyboardType}
                onChangeText={value => onChangeText(value)}
                value={value}
                style={[inputText, style, multiline ? multilineTextInputStyle : {}, isAlignRight ? { textAlign: 'right' } : {}]}
            />
            {
                isPassword ?
                    <WTouchable margin={[0, 10, 0, 0]} onPress={toggleSecureTextEntry} dial={5}>
                        <Image source={secureTextEntry ? viewIcon : noViewIcon} style={[iconStyle, { tintColor: Colors.white }]} />
                    </WTouchable>
                    : null
            }
        </WRow >
    )
}

WTextInput.propTypes = {
    placeholderTextColor: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    returnKeyType: PropTypes.string,
    source: PropTypes.any,
    placeholderName: PropTypes.string.isRequired,
    keyboardType: PropTypes.string,
    value: PropTypes.string.isRequired,
    onSubmitEditing: PropTypes.func.isRequired,
    multilineStyle: PropTypes.any,
    multiline: PropTypes.bool,
    isError: PropTypes.object,
    isPassword: PropTypes.bool,
    toggleSecureTextEntry: PropTypes.func,
    component: PropTypes.func,
    isAlignRight: PropTypes.bool,
    currency: PropTypes.bool
}

WTextInput.defaultProps = {
    placeholderTextColor: Colors.placeholderColor,
    keyboardType: "default",
    secureTextEntry: false,
    returnKeyType: "next",
    multiline: false,
    editable: true,
    isError: {},
    isPassword: false
}

const styles = {
    container: { alignItems: 'stretch', alignSelf: "stretch", height: Utils.scaleSize(35), borderRadius: Utils.scaleSize(20), borderColor: Colors.white, borderWidth: (2 / PixelRatio.getPixelSizeForLayoutSize(1)) * 2, borderStyle: "solid" },
    inputText: {
        flex: 1,
        height: Utils.scaleSize(35),
        padding: 0,
        paddingHorizontal: 5,
        fontSize: Utils.scaleSize(14),
        fontStyle: "normal",
        letterSpacing: 0,
        paddingVertical: 0,
        color: Colors.text_color
    },
    multilineTextInputStyle: {
        flex: 1,
        height: null,
        marginTop: Utils.scaleSize(10),
        justifyContent: "flex-start"
    },
    iconStyle: {
        width: Utils.scaleSize(20),
        height: Utils.scaleSize(20)
    }
}
