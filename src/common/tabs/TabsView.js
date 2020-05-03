import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Platform, TouchableOpacity, Animated } from 'react-native'
import TabViews from './TabViews';
import { WView, WText, WRow } from '../ui';
import Colors from '../styles/Colors';
import Utils from '../util/Utils';

/**
 * Tabs
 */
export default class TabsView extends Component {
    static propTypes = {
        ...View.propTypes,
        initialPage: PropTypes.number,
        pager: PropTypes.instanceOf(TabViews),
        tabs: PropTypes.arrayOf(PropTypes.shape({
            text: PropTypes.string,
            iconSource: Image.propTypes.source,
            selectedIconSource: Image.propTypes.source
        })).isRequired,
        changePageWithAnimation: PropTypes.bool,
    }

    constructor(props) {
        super(props);

        this.containerHeightAnim = new Animated.Value(0);
    }

    componentDidMount = () => {
        Animated.timing(this.containerHeightAnim, {
            toValue: Utils.scaleSize(100),
            duration: 500
        }).start();
    }

    /**
     * default properties
     */
    static defaultProps = {
        tabs: [],
        changePageWithAnimation: true
    }

    state = {
        selectedIndex: this.props.initialPage,
        left: 0
    }

    render() {
        const { stretch, iconStyle } = styles;
        let {
            tabs, pager, style, itemStyle, selectedItemStyle,
            selectedIconStyle, textStyle, selectedTextStyle, changePageWithAnimation,
            onTabPress, header, description, onSkip
        } = this.props;
        const forwardIcon = require("../../../assets/img/right_arrow.png");

        if (!tabs || tabs.length === 0) return null

        let tabsView = tabs.map((tab, index) => {
            let isSelected = this.state.selectedIndex === index
            return (
                <TouchableOpacity
                    style={[styles.itemContainer, isSelected ? selectedItemStyle : itemStyle]}
                    activeOpacity={0.6}
                    key={index}
                    onPress={() => {
                        if (typeof tab.onTabPress === "function") {
                            tab.onTabPress();
                            return;
                        }
                        if (!isSelected) {
                            if (this.props.changePageWithAnimation)
                                pager.setPage(index);
                            else pager.setPageWithoutAnimation(index);
                        }
                        return;
                    }}
                >
                    <WView dial={5}>
                        <WView style={isSelected ? styles.active : styles.deactive} backgroundColor={isSelected ? Colors.theme_color : Colors.light_color} />
                    </WView>
                </TouchableOpacity>
            )
        })

        return (
            <Animated.View style={[styles.container, style, { height: this.containerHeightAnim }]}>
                <WRow dial={5}>
                    <WText padding={[10, 10]} color={Colors.text_color_dark} fontWeight={"700"} fontSize={Utils.scaleSize(14)} onPress={onSkip}>Skip</WText>
                </WRow>
                <View style={[stretch]}>
                    <View style={[styles.subContainer]} >
                        {tabsView}
                    </View>
                </View>
                <WRow dial={5}>
                    <WText padding={[10, 10]} color={Colors.text_color_dark} fontWeight={"700"} fontSize={Utils.scaleSize(14)} onPress={onSkip}>Login To Your account</WText>
                    <Image source={forwardIcon} style={iconStyle} resizeMode={"contain"} />
                </WRow>
            </Animated.View>
        )
    }

    onPageSelected(e) {
        this.setState({ selectedIndex: e.position })
    }

    onPageScroll(e) {
    }
}

//Styels for this component
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.transparent,
        marginBottom: Utils.scaleSize(20),
        overflow: 'hidden'
    },
    subContainer: {
        height: Utils.scaleSize(20),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginVertical: Utils.scaleSize(5)
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5
    },
    stretch: {
        alignItems: 'stretch',
        alignSelf: 'stretch'
    },
    active: {
        width: 40,
        height: 10,
        borderRadius: 5
    },
    deactive: {
        width: 20,
        height: 10,
        borderRadius: 5
    },
    iconStyle: {
        width: 20,
        height: 15
    }
});