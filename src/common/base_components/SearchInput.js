import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { WView, WTextInput, WText, WRow } from '../ui';
import Colors from '../styles/Colors';
import Utils from '../util/Utils';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import { HOME_REQEUST_SEARCH_TEXT, HOME_KEY } from '../../redux/Types';
import { updateHomeUIConstraints, listSearchTextData } from '../../redux/home/Action';

class SearchInput extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            isFloat: false
        }

        this._isMount = true;
        this.enableFloat = false;
        this.text = props.value ? props.value : "";

    }

    static propTypes = {
        backgroundColor: PropTypes.string
    }

    static defaultProps = {
        backgroundColor: Colors.white
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

    onChangeText = (key, value) => {
        const { updateHomeUIConstraints, listSearchTextData } = this.props;

        updateHomeUIConstraints({
            [key]: value
        });

        listSearchTextData();
    }

    render() {
        const { container, leftIconStyle, leftIconContainerStyle, horizontalInputStyle, inputContainerStyle } = this.getStyle();
        const { style, search_text, backgroundColor } = this.props;
        const searchIcon = require('../../../assets/img/search.png');

        return (
            <WView stretch dial={4} margin={[0, Utils.scaleSize(30)]} style={[container, style]} backgroundColor={backgroundColor}>
                <WRow spaceBetween>
                    <WView dial={5} margin={[0, 0, 0, Utils.scaleSize([10])]} style={leftIconContainerStyle} >
                        <Image source={searchIcon} style={leftIconStyle} resizeMode={"contain"} />
                    </WView>
                    <WView flex>
                        <WTextInput
                            placeholderName={"Search Products"}
                            placeholderTextColor={Colors.text_color_dark}
                            style={style ? style : horizontalInputStyle}
                            inputContainerStyle={inputContainerStyle}
                            onChangeText={(value) => this.onChangeText(HOME_REQEUST_SEARCH_TEXT, value)}
                            value={search_text}
                            onSubmitEditing={()=>{}}
                        />
                    </WView>
                </WRow>
            </WView>
        )
    }

    getStyle = () => {
        const { isError } = this.props;

        return {
            container: {
                borderRadius: Utils.scaleSize(20),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5
            },
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
                paddingHorizontal: 10
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
            horizontalInputStyle: {
                color: Colors.text_color_dark,
                fontSize: Utils.scaleSize(14),
                fontWeight: '400',
                fontFamily: 'Poppins-Bold'
            },
            inputContainerStyle: {
                borderWidth: 0
            }
        }
    }
}

const mapToProps = ({ home }) => {
    const home_info = home && home[HOME_KEY] ? home[HOME_KEY] : {};

    const search_text = home_info && home_info[HOME_REQEUST_SEARCH_TEXT] ? home_info[HOME_REQEUST_SEARCH_TEXT] : "";

    return ({
        search_text
    });
}
export default connect(mapToProps, {
    updateHomeUIConstraints,
    listSearchTextData
})(SearchInput);
