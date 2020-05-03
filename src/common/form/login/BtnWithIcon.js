import React from 'react';
import PropTypes from 'prop-types';
import { WRow, WView, WText } from '../../ui';
import { Image } from 'react-native';
import Utils from '../../util/Utils';

const BtnWithIcon = ({ label, iconPath, style, color }) => {
    const { iconContainerStyle, iconStyle, container } = styles;

    return (
        <WRow flex={1} dial={4} style={[container, style]}>
            <WView padding={[0, 15]} dial={5} style={iconContainerStyle}>
                <Image source={iconPath} style={iconStyle} resizeMode={"contain"} />
            </WView>
            <WText fontSize={Utils.scaleSize(16)} color={color}>{label}</WText>
        </WRow>
    );
}

BtnWithIcon.propTypes = {
    label: PropTypes.string.isRequired,
    iconPath: PropTypes.any.isRequired,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ])
}

const styles = {
    container: {
        width: Utils.scaleSize(130),
        height: Utils.scaleSize(30),
        maxHeight: Utils.scaleSize(30),
        borderRadius: Utils.scaleSize(15)
    },
    iconContainerStyle: {
        height: Utils.scaleSize(35)
    },
    iconStyle: {
        width: Utils.scaleSize(16),
        height: Utils.scaleSize(16),
        resizeMode: "contain"
    }
}

export default BtnWithIcon;