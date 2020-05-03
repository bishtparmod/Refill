import React, { PureComponent } from 'react';
import { Animated, Easing } from 'react-native';
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Home, ProductDetail, ProductList, OrderSummary, OrderList, OrderView, Notifications, CustomerSupport, Chat } from './scene/postLogin';
import Header from './common/base_components/Header';
import { EDIT_SCREEN } from './redux/Types';
import EditProfile from './scene/postLogin/editProfile/EditProfile';
import { DrawableContainer, keyboardAwareFunc } from './common/base_components';
import ChangePassword from './scene/postLogin/editProfile/ChangePassword';
import AddShippingAndBillingAddress from './scene/postLogin/editProfile/AddShippingAndBillingAddress';
import AddCard from './scene/postLogin/editProfile/AddCard';
import ListCard from './scene/postLogin/editProfile/ListCard';
import NavigationService from './NavigationService';

const RouteConfigsWithoutTransitions = {
    ProductDetail: {
        screen: ProductDetail,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
}

const StackNavigatorConfigWithoutTransitions = {
    initialRouteName: 'ProductDetail',
    transitionConfig: () => ({
        transitionSpec: {
            duration: 0
        },
        screenInterpolator: () => { }
    })
};

const StackNavigatorWithoutTransitions = createStackNavigator(RouteConfigsWithoutTransitions, StackNavigatorConfigWithoutTransitions);

const RouteConfigsOrderList = {
    OrderList: {
        screen: OrderList,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    OrderView: {
        screen: OrderView,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
}

const StackNavigatorConfigOrderList = {
    initialRouteName: 'OrderList'
};

const StackNavigatorOrderList = createStackNavigator(RouteConfigsOrderList, StackNavigatorConfigOrderList);

const EditProfileRouteConfigs = {
    EditProfile: {
        screen: EditProfile,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    ChangePassword: {
        screen: keyboardAwareFunc(ChangePassword),
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    AddShippingAndBillingAddress: {
        screen: keyboardAwareFunc(AddShippingAndBillingAddress),
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    AddCard: {
        screen: keyboardAwareFunc(AddCard),
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    ListCard: {
        screen: ListCard,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
}

const EditProfileStackNavigatorConfig = {
    initialRouteName: 'EditProfile'
};

const EditProfileStackNavigator = createStackNavigator(EditProfileRouteConfigs, EditProfileStackNavigatorConfig);

const StackRouteConfigs = {
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    EditProfile: {
        screen: EditProfileStackNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    ProductDetail: {
        screen: StackNavigatorWithoutTransitions,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    ProductList: {
        screen: ProductList,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    OrderSummary: {
        screen: OrderSummary,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    OrderList: {
        screen: StackNavigatorOrderList,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    Notifications: {
        screen: Notifications,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    CustomerSupport: {
        screen: keyboardAwareFunc(CustomerSupport),
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },
    Chat: {
        screen: Chat,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
};

const StackNavigatorConfig = {
    initialRouteName: 'Home',
    transitionConfig: () => ({
        transitionSpec: {
            duration: 0
        }
    })
};

const StackNavigator = createStackNavigator(StackRouteConfigs, StackNavigatorConfig);

const RouteConfigs = {
    Home: {
        screen: StackNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    }
};

const DrawerNavigatorConfig = {
    initialRouteName: 'Home',
    contentComponent: DrawableContainer
};

const Navigator = createAppContainer(createDrawerNavigator(RouteConfigs, DrawerNavigatorConfig));

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
                ref={ref => NavigationService.setTopLevelNavigator(ref)}
                navigation={navigation}
                onNavigationStateChange={this.onNavigationStateChange}
                screenProps={screenProps}
            />
        );
    }
}

export default RNRoutes;
