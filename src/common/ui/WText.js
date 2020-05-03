import React from 'react';
import { Text as RNText, Platform } from 'react-native';
import WStyles from './WStyles';
import Colors from '../styles/Colors';

const Text = (props) => {
    const {
        lines = 1,
        fontWeight = "300",
        fontStyle = "normal",
        fontFamily,
        letterSpacing = 0,
        color = Colors.text_color,
        style,
        center,
        right,
        transparent,
        margin,
        padding,
        onPress,
        ...rest
    } = props;
    const textAlign = center ? 'center' : right ? 'right' : null;
    const fontSize = props.fontSize ? props.fontSize : 12;
    const backgroundColor = transparent ? 'transparent' : null;
    const _WStyles = WStyles(margin, padding);

    return (
        <RNText
            {...rest}
            onPress={onPress}
            style={[{ fontSize, fontStyle, fontFamily, letterSpacing, textAlign, color, backgroundColor, fontWeight: fontWeight }, _WStyles, style]}
            numberOfLines={lines}
        >
            {props.children}
        </RNText>
    );
}

export default Text;
