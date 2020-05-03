import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Routes from '../Routes';
import PostLoginRoutes from '../PostLoginRoutes';
import WelcomeRoutes from '../WelcomeRoutes';
import { WView, WSpinner } from '../common/ui';
import Colors from '../common/styles/Colors';
import { connect } from 'react-redux';
import { USER_KEY, USER_ROOT, DEVICE_ROOT, DEVICE_KEY, DEVICE_IS_LOGGED_IN, DEVICE_ROUTE_LOADING, STATUS, SUCCESS, RESPONSE, USER_DATA, DEVICE_IS_LOGIN_SKIPPED, WELCOME_SCREEN_KEY, WELCOME_SCREEN_REQEUST_LOADING, DEVICE_IS_WELCOME_SCREEN_SKIPPED } from '../redux/Types';
import { updateDeviceUIConstraints } from '../redux/device/Action';
import { RefillStorage } from '../apis';
import { updateUserUIConstraints } from '../redux/user/Action';
import { getWelcomeScreenData } from '../redux/welcomeScreen/Action';

class MainScene extends PureComponent {
    static propTypes = {

    }

    componentDidMount = () => {
        this.init();
    }

    init = async () => {
        const { updateDeviceUIConstraints, updateUserUIConstraints, getWelcomeScreenData } = this.props;

        //Intialize data
        updateDeviceUIConstraints({
            [DEVICE_ROUTE_LOADING]: true
        });

        //User Data
        const user_data_obj = await RefillStorage.getRefillLoginData();
        const user_data = user_data_obj && user_data_obj[STATUS] === SUCCESS ? user_data_obj[RESPONSE] : {};

        //Skip Login Data
        const skip_login_data_obj = await RefillStorage.getRefillSkipLoginData();
        const skip_login_data = skip_login_data_obj && skip_login_data_obj[STATUS] === SUCCESS ? skip_login_data_obj[RESPONSE] : {};

        //Skip Welcome Screen Data
        const skip_welcome_screen_data_obj = await RefillStorage.getRefillSkipWelcomeScreenData();
        const skip_welcome_screen_data = skip_welcome_screen_data_obj && skip_welcome_screen_data_obj[STATUS] === SUCCESS ? skip_welcome_screen_data_obj[RESPONSE] : {};

        //Finalize data
        const is_logged_in = user_data && user_data._id && user_data.reset_password !== 1 ? true : false;
        const is_login_skipped = skip_login_data && skip_login_data[DEVICE_IS_LOGIN_SKIPPED] ? true : false;
        const is_welcome_screen_skipped = skip_welcome_screen_data && skip_welcome_screen_data[DEVICE_IS_WELCOME_SCREEN_SKIPPED] ? true : false;

        updateDeviceUIConstraints({
            [DEVICE_ROUTE_LOADING]: false,
            [DEVICE_IS_LOGGED_IN]: is_logged_in,
            [DEVICE_IS_LOGIN_SKIPPED]: is_login_skipped,
            [DEVICE_IS_WELCOME_SCREEN_SKIPPED]: is_welcome_screen_skipped
        });
        updateUserUIConstraints({
            [USER_DATA]: is_logged_in ? user_data : {}
        });

        if (!is_welcome_screen_skipped) {
            getWelcomeScreenData();
        }
    }

    Loading = () => <WView dial={5} flex backgroundColor={Colors.white}>
        <WSpinner size={'large'} color={Colors.theme_color} />
    </WView>

    render() {
        const { isLogin, checkingLogin, isLoginSkipped, isWelcomeScreenLoading, isWelcomeScreenSkipped, ...rest } = this.props;

        if (checkingLogin || isWelcomeScreenLoading) return (
            <this.Loading />
        );

        if (isLogin || isLoginSkipped) return (
            <PostLoginRoutes
                {...rest}
            />
        );

        if (isWelcomeScreenSkipped) {
            return (
                <Routes
                    {...rest}
                />
            );
        }

        return (
            <WelcomeRoutes
                {...rest}
            />
        );
    }
}


const mapToProps = ({ user, device, welcome_screen }) => {
    const user_info = user && user[USER_KEY] ? user[USER_KEY] : {};
    const device_info = device && device[DEVICE_KEY] ? device[DEVICE_KEY] : {};
    const welcome_screen_info = welcome_screen && welcome_screen[WELCOME_SCREEN_KEY] ? welcome_screen[WELCOME_SCREEN_KEY] : {};

    const isLogin = device_info && device_info[DEVICE_IS_LOGGED_IN] ? device_info[DEVICE_IS_LOGGED_IN] : false;
    const isWelcomeScreenLoading = welcome_screen_info && welcome_screen_info[WELCOME_SCREEN_REQEUST_LOADING] ? welcome_screen_info[WELCOME_SCREEN_REQEUST_LOADING] : false;
    const isLoginSkipped = device_info && device_info[DEVICE_IS_LOGIN_SKIPPED] ? device_info[DEVICE_IS_LOGIN_SKIPPED] : false;
    const isWelcomeScreenSkipped = device_info && device_info[DEVICE_IS_WELCOME_SCREEN_SKIPPED] ? device_info[DEVICE_IS_WELCOME_SCREEN_SKIPPED] : false;
    const checkingLogin = device_info && device_info[DEVICE_ROUTE_LOADING] ? device_info[DEVICE_ROUTE_LOADING] : false;

    return ({
        isLogin,
        isLoginSkipped,
        checkingLogin,
        isWelcomeScreenLoading,
        isWelcomeScreenSkipped
    });
}

export default connect(mapToProps, {
    updateUserUIConstraints,
    updateDeviceUIConstraints,
    getWelcomeScreenData
})(MainScene);
