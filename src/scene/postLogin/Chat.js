import React, { PureComponent } from 'react';
import { Header, keyboardAwareFunc } from '../../common/base_components';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { NOTIFICATIONS_SCREEN, CUSTOMER_SUPPORT_SCREEN } from '../../redux/Types';
import { NotificationsList } from '../../common/components/notification';
import { ChatList } from '../../common/components/chat';

const ScrollViewOrderView = ChatList;
class Chat extends PureComponent {

    constructor(props) {
        super(props);
    }

    _onBack = () => {
        const { navigation } = this.props;

        navigation.pop();
    }

    onMessage = () => {
        const { navigation } = this.props;

        if(!navigation) return;

        navigation.navigate(CUSTOMER_SUPPORT_SCREEN);
    }

    render() {
        const { container, orderBtnStyle } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onBack={this._onBack.bind(this)}
                    screenType={NOTIFICATIONS_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} dial={2}>
                    <ScrollViewOrderView {...this.props} />
                </WView>
                <WView padding={[Utils.scaleSize(5), Utils.scaleSize(20)]}>
                    <WButton
                        onPress={this.onMessage.bind(this)}
                        containerStyle={orderBtnStyle}
                        label={"Message"} />
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
            orderBtnStyle: {
                backgroundColor: Colors.theme_color,
                alignSelf: 'stretch',
                height: Utils.scaleSize(35),
                borderRadius: Utils.scaleSize(18),
                marginVertical: Utils.scaleSize(5),
                marginTop: 10
            }
        });
    }
}

export default Chat;