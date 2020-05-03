import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import ViewPager from './ViewPager';

const VIEWPAGER_REF = 'viewPagerr'
const INDICATOR_REF = 'indicatorr'

/**
 * For management of pages shown in fragmentation on login screen
 */
export default class IndicatorViewPager extends Component {
    static propTypes = {
        ...ViewPager.propTypes,
        indicator: PropTypes.node,
        // pagerStyle: View.propTypes.style,
        autoPlayEnable: PropTypes.bool,
        autoPlayInterval: PropTypes.number,
        horizontalScroll: PropTypes.bool,
        tabPosition: PropTypes.string
    }

    /**
     * default properties
     */
    static defaultProps = {
        indicator: null,
        initialPage: 0,
        autoPlayInterval: 5000,
        autoPlayEnable: false,
        horizontalScroll: true,
        tabPosition: "top"
    }

    constructor(props) {
        super(props)
        this._onPageScroll = this._onPageScroll.bind(this)
        this._onPageSelected = this._onPageSelected.bind(this)
        this._goToNextPage = this._goToNextPage.bind(this)
        this._renderIndicator = this._renderIndicator.bind(this)
        this.setPage = this.setPage.bind(this)
        this.setPageWithoutAnimation = this.setPageWithoutAnimation.bind(this)
        this._startAutoPlay = this._startAutoPlay.bind(this)
        this._stopAutoPlay = this._stopAutoPlay.bind(this)
        this._currentIndex = props.initialPage
        this._childrenCount = React.Children.count(props.children)
    }

    componentDidMount() {
        if (this.props.autoPlayEnable) this._startAutoPlay()
        else this._stopAutoPlay()
    }

    componentDidUpdate(prevProps) {
        const { children, autoPlayEnable } = this.props;
        this._childrenCount = React.Children.count(children)
        if (prevProps.autoPlayEnable !== autoPlayEnable) {
            autoPlayEnable ? this._startAutoPlay() : this._stopAutoPlay()
        }
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]} >
                {this.props.tabPosition === "top" && this._renderIndicator()}
                <ViewPager
                    {...this.props}
                    horizontalScroll={this.props.horizontalScroll}
                    ref={VIEWPAGER_REF}
                    style={[styles.pager, this.props.pagerStyle]}
                    onPageScroll={this._onPageScroll}
                    onPageSelected={this._onPageSelected}
                />
                {this.props.tabPosition === "bottom" && this._renderIndicator()}
            </View>
        )
    }

    componentWillUnmount() {
        this._stopAutoPlay()
    }

    _onPageScroll(params) {
        let indicator = this.refs[INDICATOR_REF]
        indicator && indicator.onPageScroll && indicator.onPageScroll && indicator.onPageScroll(params)
        this.props.onPageScroll && this.props.onPageScroll(params)
    }

    _onPageSelected(params) {
        let indicator = this.refs[INDICATOR_REF]
        indicator && indicator.onPageSelected && indicator.onPageSelected(params)
        this.props.onPageSelected && this.props.onPageSelected(params)
        this._currentIndex = params.position
    }

    //render for header showing in login screen for sign in and sign up
    _renderIndicator() {
        let { indicator, initialPage, changePageWithAnimation } = this.props
        if (!indicator) return null
        return React.cloneElement(indicator, {
            ref: INDICATOR_REF,
            pager: this,
            initialPage: initialPage,
            changePageWithAnimation: changePageWithAnimation
        })
    }

    _goToNextPage() {
        let nextIndex = (this._currentIndex + 1) % this._childrenCount
        this.setPage(nextIndex)
    }

    _startAutoPlay() {
        if (this._timerId) clearInterval(this._timerId)
        this._timerId = setInterval(this._goToNextPage, this.props.autoPlayInterval)
    }

    _stopAutoPlay() {
        if (this._timerId) {
            clearInterval(this._timerId)
            this._timerId = null
        }
    }

    setPage(selectedPage) {
        this.refs[VIEWPAGER_REF].setPage(selectedPage)
    }

    setPageWithoutAnimation(selectedPage) {
        this.refs[VIEWPAGER_REF].setPageWithoutAnimation(selectedPage)
    }
}

const styles = StyleSheet.create({
    container: {
    },
    pager: {
    }
})
