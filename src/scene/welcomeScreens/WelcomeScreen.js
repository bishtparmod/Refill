import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TabsView, TabViews } from '../../common/tabs';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { WelcomeScreenTemplate } from '../../common/form/welcomeScreen.js';
import { connect } from 'react-redux';
import { Platform, ScrollView } from 'react-native';
import { WELCOME_SCREEN_DATA, WELCOME_SCREEN_KEY } from '../../redux/Types';
import { skipWelcomeScreen } from '../../redux/welcomeScreen/Action';

class WelcomeScreen extends PureComponent {
    constructor(props) {
        super(props);

    }

    static propTypes = {
        selectedIndex: PropTypes.number
    }

    static defaultProps = {
        selectedIndex: 0
    }

    componentDidMount() {

    }

    onBack = () => {
    }

    _onSkip = () => {
        const { skipWelcomeScreen } = this.props;

        skipWelcomeScreen();
    }

    render() {
        const {
            selectedIndex,
            loading,
            data,
            header,
            description
        } = this.props;

        const { subContainerStyle, container } = this.getStyle();

        const views = data && data.length ? data.map((ele, index) => {
            return (
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <WelcomeScreenTemplate
                        title={ele.title}
                        description={ele.description}
                        image={{ uri: ele.image }} />
                </ScrollView>
            );
        }) : [];

        const _renderHeader = () => {
            let tabs = Array(views.length).fill({ label: "" });
            return (
                <TabsView
                    tabs={tabs}
                    onSkip={this._onSkip.bind(this)}
                    iconStyle={{ tintColor: Colors.white }}
                    header={header}
                    description={description}
                />
            );
        }

        return (
            <WView dial={2} flex={1} stretch style={{ backgroundColor: Colors.white, height: Utils.getHeightInPortraitMode - 20 }}>
                <TabViews
                    tabPosition="bottom"
                    autoPlayEnable={true}
                    indicator={_renderHeader()}
                    initialPage={selectedIndex ? selectedIndex : 0}
                    style={container}
                >
                    {views.map((ele, index) =>
                        <WView key={`welcome-screen-tab-${index}`} style={subContainerStyle}>
                            {ele}
                        </WView>
                    )}
                </TabViews>
            </WView>
        )
    }

    getStyle = () => {

        return ({
            container: Object.assign({ flex: 1 }, Platform.OS === "ios" ? {} : { marginHorizontal: 10 }),
            subContainerStyle: Object.assign({
                flex: 1,
                overflow: 'hidden',
                backgroundColor: Colors.transparent
            }, {
            })
        });
    }
}


const mapToProps = ({ welcome_screen }) => {
    const welcome_screen_info = welcome_screen && welcome_screen[WELCOME_SCREEN_KEY] ? welcome_screen[WELCOME_SCREEN_KEY] : {};

    const data = welcome_screen_info && welcome_screen_info[WELCOME_SCREEN_DATA] ? welcome_screen_info[WELCOME_SCREEN_DATA] : [];

    return ({
        data
    });
}

export default connect(mapToProps, {
    skipWelcomeScreen
})(WelcomeScreen);