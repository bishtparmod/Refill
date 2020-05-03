import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { WView, WText } from '../ui';
import NetInfo from "@react-native-community/netinfo";
import Colors from '../styles/Colors';
import { connect } from 'react-redux'

class ConnectionInfo extends PureComponent {

    static propTypes = {
        onConnectionStatusChange: PropTypes.func
    }

    constructor(props) {
        super(props);

        this.state = {
            isShowAlert: false,
            response: {
                status: '',
                message: ''
            }
        }

        this._isMount = true;
        this.init();
        this.interval = undefined;
        this.connectStatus = "online";
    }

    showMessage = (status) => {
        const { onConnectionStatusChange } = this.props;

        if (this.connectStatus === status) {

            return;
        }

        this.connectStatus = status;
        if (status === "offline") {
            this._setState({
                isShowAlert: true,
                response: {
                    message: "Offline",
                    status: "offline"
                }
            });
            onConnectionStatusChange && onConnectionStatusChange(false);
            return;
        }

        this._setState({
            isShowAlert: true,
            response: {
                message: "Back Online",
                status: "online"
            }
        });
        setTimeout(() => {
            this._setState({
                isShowAlert: false,
                response: {
                    message: "",
                    status: ""
                }
            });
            this.connectStatus = "online";
        }, 2000);
        onConnectionStatusChange && onConnectionStatusChange(true);
    }

    _setState = (state, cb) => {
        if (!this._isMount) return;

        if (cb) this.setState(state, cb);
        else this.setState(state);
    }

    init = () => {
        this._handleSetInterval(this._handleSetInterval.bind(this));
    }

    _handleSetInterval = (cb) => {
        setTimeout(async () => {
            try {
                //Check interval
                const isConnected = await NetInfo.isConnected.fetch();
                this.handleFirstConnectivityChange(isConnected);

                if (!this._isMount) return;
                cb && cb(this._handleSetInterval.bind(this));
            } catch (error) { }
        }, 1 * 1000);
    }

    handleFirstConnectivityChange = (isConnected) => {
        this.showMessage(isConnected ? "online" : "offline");
    }

    componentWillUnmount = () => {
        this._isMount = false;
    }

    render() {
        const { isShowAlert, response } = this.state;

        if (!isShowAlert) return null;

        return (
            <WView backgroundColor={response.status === "online" ? Colors.green : Colors.red} dial={5} padding={[2, 10]}>
                <WText color={Colors.white} center>{response.message}</WText>
            </WView>
        )
    }
}

const mapToProps = ({ }) => {

    return ({});
}

export default connect(mapToProps)(ConnectionInfo);