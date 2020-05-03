import React, { PureComponent } from 'react';
import { EditProfileContainer } from '../../../common/form/editProfile';
import { View, Animated } from 'react-native';
import Utils from '../../../common/util/Utils';
import { WView } from '../../../common/ui';
import keyboardAwareFunc from '../../../common/base_components/KeyboardAwareFunc';
import Header from '../../../common/base_components/Header';
import { EDIT_SCREEN, NOTIFICATIONS_SCREEN } from '../../../redux/Types';
import Colors from '../../../common/styles/Colors';

const ScrollableEditProfileContainer = keyboardAwareFunc(EditProfileContainer);

class EditProfile extends PureComponent {
    constructor(props) {
        super(props);

        this.containerTopAnim = new Animated.Value(Utils.scaleSize(Utils.getHeightInPortraitMode / 8));
        this.viewHeight = 0;
    }

    componentDidMount = () => {
        Animated.timing(this.containerTopAnim, {
            toValue: Utils.scaleSize(-20),
            duration: 500
        }).start();
    }

    _toggleDrawer = () => {
        const { navigation } = this.props;

        navigation.toggleDrawer();
    }

    onBack = () => {
        const { navigation } = this.props;

        if(!navigation) return;

        navigation.pop();
    }

    _onNotificationPress = () => {
        this.openScreen(NOTIFICATIONS_SCREEN);
    }

    openScreen = (screen, param) => {
        const { navigation } = this.props;

        if (!navigation || !screen) return;

        navigation.navigate(screen, param);
    }

    render() {
        const { container, subContainer, subContainer1 } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onNotificationPress={this._onNotificationPress.bind(this)}
                    onBack={this.onBack.bind(this)}
                    screenType={EDIT_SCREEN} />
                <WView flex style={{ height: Utils.getHeightInPortraitMode }} backgroundColor={Colors.white} margin={[0, Utils.scaleSize(10)]} dial={2}>
                    <Animated.View
                        onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {

                            this.viewHeight = height;
                        }}
                        style={subContainer}>
                        <WView style={subContainer1}>
                            <ScrollableEditProfileContainer
                                navigation={navigation} />
                        </WView>
                    </Animated.View>
                </WView>
            </WView>
        );
    }

    getStyles = () => {

        return ({
            container: {
                maxHeight: Utils.getHeightInPortraitMode,
                backgroundColor: Colors.white
            },
            subContainer: {
                position: 'absolute',
                top: this.containerTopAnim,
                right: Utils.scaleSize(5),
                bottom: Utils.getDeviceDimentions().height > this.viewHeight ? null : 0,
                left: Utils.scaleSize(5),
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            subContainer1: {
                backgroundColor: Colors.white,
                borderRadius: Utils.scaleSize(10),
                overflow: 'hidden',
                elevation: 5
            }
        });
    }
}

export default EditProfile;