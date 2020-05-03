import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, Vibration } from 'react-native';
import Utils from '../util/Utils';
import { WText } from '../ui';
import Colors from '../styles/Colors';
import { SUCCESS, ERROR, EMPTY } from '../../redux/Types';

class Toaster extends PureComponent {
    constructor(props) {
        super(props);

        this.containerRight = new Animated.Value(-Utils.getDeviceDimentions().width - 10);
    }

    static propTypes = {
        type: PropTypes.oneOf([SUCCESS, ERROR, EMPTY, ""]),
        message: PropTypes.string
    }

    componentDidMount = () => {
        this.init();
    }

    getColor = () => {
        const { type } = this.props;

        switch (type) {
            case SUCCESS:
                return Colors.theme_color;
            case ERROR:
                return Colors.danger1;
            default:
                return Colors.transparent;
        }
    }

    init = () => {
        const { message } = this.props;

        Animated.sequence([
            Animated.delay(300),
            Animated.timing(this.containerRight, {
                duration: 1000,
                toValue: Utils.scaleSize(10)
            })
        ]).start();
        if (message)
            Vibration.vibrate(500);
    }

    render() {
        const { container } = this.getStyles();
        const { message } = this.props;

        return (
            <Animated.View style={container}>
                <WText fontSize={Utils.scaleSize(14)} lines={0}>{message}</WText>
            </Animated.View>
        );
    }

    getStyles = () => {

        return ({
            container: {
                position: 'absolute',
                top: Utils.scaleSize(10),
                right: this.containerRight,
                minHeight: Utils.scaleSize(40),
                justifyContent: 'center',
                backgroundColor: this.getColor(),
                padding: 10,
                marginLeft: Utils.scaleSize(40),
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

export default Toaster;