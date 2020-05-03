import React, { PureComponent } from 'react';
import { Header, keyboardAwareFunc } from '../../common/base_components';
import { WView } from '../../common/ui';
import Colors from '../../common/styles/Colors';
import Utils from '../../common/util/Utils';
import { NOTIFICATIONS_SCREEN } from '../../redux/Types';
import { NotificationsList } from '../../common/components/notification';

const ScrollViewOrderView = keyboardAwareFunc(NotificationsList);
class Notifications extends PureComponent {

    constructor(props) {
        super(props);
    }

    _onBack = () => {
        const { navigation } = this.props;

        navigation.pop();
    }

    render() {
        const { container } = this.getStyles();
        const { navigation } = this.props;

        return (
            <WView flex stretch dial={2} style={container}>
                <Header
                    onBack={this._onBack.bind(this)}
                    screenType={NOTIFICATIONS_SCREEN}
                />
                <WView flex stretch backgroundColor={Colors.white} dial={2}>
                    <NotificationsList {...this.props} />
                </WView>
            </WView>
        );
    }

    getStyles = () => {

        return ({
            container: {
                maxHeight: Utils.getHeightInPortraitMode,
                backgroundColor: Colors.white
            }
        });
    }
}

export default Notifications;