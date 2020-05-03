import React from 'react'
import PropTypes from 'prop-types'
import { WTouchable, WText, WSpinner } from '.';
import Colors from '../styles/Colors';

export default WButton = ({ isLoading, dial, label, containerStyle, component, onPress, btnPadding, fontSize, fontWeight, color }) => {
    return (
        <WTouchable dial={dial} onPress={isLoading ? () => { } : onPress} style={containerStyle} padding={btnPadding}>
            {
                isLoading ?
                    <WSpinner />
                    :
                    component && typeof component === "function" ? component() :
                        <WText fontSize={fontSize} fontWeight={fontWeight} color={color}>{label}</WText>
            }
        </WTouchable>
    )
}

WButton.propTypes = {
    isLoading: PropTypes.bool,
    label: PropTypes.string,
    containerStyle: PropTypes.any,
    component: PropTypes.func,
    onPress: PropTypes.func,
    btnPadding: PropTypes.array,
    dial: PropTypes.number.isRequired,
    fontSize: PropTypes.number,
    fontWeight: PropTypes.string,
    color: PropTypes.string
}

WButton.defaultProps = {
    isLoading: false,
    dial: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white
}
