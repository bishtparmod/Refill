import React from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator } from 'react-native';
import Colors from '../styles/Colors';

export default WSpinner = ({ size, color }) => {
    return (
        <ActivityIndicator
            size={size}
            color={color}
        />
    )
}

WSpinner.propTypes = {
    size: PropTypes.string,
    color: PropTypes.string
}

WSpinner.defaultProps = {
    size: 'small',
    color: Colors.white
}
