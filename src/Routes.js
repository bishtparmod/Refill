import React, { PureComponent } from 'react';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { Signup, Login, ChangePassword, ForgotPassword, ResetPassword } from './scene/preLogin';
import { keyboardAwareFunc } from './common/base_components';

const RouteConfigs = {
    Signup: {
        screen: keyboardAwareFunc(Signup),
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },
    Login: {
        screen: keyboardAwareFunc(Login),
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },
    ForgotPassword: {
        screen: keyboardAwareFunc(ForgotPassword),
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },
    ResetPassword: {
        screen: keyboardAwareFunc(ResetPassword),
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    }
};

const StackNavigatorConfig = {
    initialRouteName: 'Login'
};

const Navigator = createAppContainer(createStackNavigator(RouteConfigs, StackNavigatorConfig));

class RNRoutes extends PureComponent {

    constructor(props) {
        super(props);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    }

    static router = Navigator.router;

    onNavigationStateChange(prevState, currentState) {
    }

    render() {
        const { screenProps, navigation } = this.props;

        return (
            <Navigator
                navigation={navigation}
                onNavigationStateChange={this.onNavigationStateChange}
                screenProps={screenProps}
            />
        );
    }
}

export default RNRoutes;
