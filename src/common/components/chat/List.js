import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import { WView, WText, WSpinner } from '../../ui';
import Utils from '../../util/Utils';
import Colors from '../../styles/Colors';
import { ChatListItem } from '.';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { USERS_COLLECTION, USER_KEY, USER_DATA } from '../../../redux/Types';

class List extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true
        };
    }

    componentDidMount = () => {
        this.init();
    }

    init = () => {
        const { user_id } = this.props;

        this._firebaseSubscription = firestore()
            .collection(USERS_COLLECTION)
            .orderBy('createdDate', 'desc')
            .onSnapshot((querySnapshot) => {
                console.log("onchange ===> hit");
                if (!querySnapshot) return null;

                this.setState({
                    data: querySnapshot.docs.filter(ele => ele.data().userId === user_id).map(ele => ele.data()),
                    loading: false
                }, () => {
                    this.chatListRef.scrollToOffset({ animated: true, offset: 0 });
                });
            });
    }

    componentWillUnmount = () => {
        if (this._firebaseSubscription) this._firebaseSubscription();
    }

    render() {
        const { container } = this.getStyles();
        const { navigation } = this.props;
        const { data, loading } = this.state;

        return (
            <WView dial={2} stretch margin={[0, Utils.scaleSize(20)]} padding={[0, 0, Utils.scaleSize(20), 0]} backgroundColor={Colors.white}>
                <WText fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(20)} fontWeight={"700"} color={Colors.text_color_dark} >
                    Chat
                </WText>
                <FlatList
                    data={data}
                    ref={ref => this.chatListRef = ref}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        loading ?
                            null
                            :
                            <WText fontFamily={"Poppins-Bold"} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.text_color_light_dark} center>
                                Empty Chat List
                        </WText>
                    }
                    ListHeaderComponent={
                        loading ?
                            <WView dial={5} padding={[Utils.scaleSize(20), Utils.scaleSize(10)]}>
                                <WSpinner size={"small"} color={Colors.theme_color} />
                                <WText fontFamily={"Poppins-Bold"} padding={[0, Utils.scaleSize(10)]} fontSize={Utils.scaleSize(14)} fontWeight={"500"} color={Colors.theme_color} >
                                    please wait...
                            </WText>
                            </WView> : null
                    }
                    keyExtractor={(ele, index) => `order-list-${index}`}
                    renderItem={({ item, index }) => {
                        return (
                            <ChatListItem item={item} navigation={navigation} />
                        );
                    }}
                />
            </WView>
        );
    }

    getStyles = () => {
        return ({
            container: {
                shadowColor: Colors.black,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                borderRadius: Utils.scaleSize(20)
            }
        })
    }
}

const mapToProps = ({ user }) => {
    const user_key = user && user[USER_KEY] ? user[USER_KEY] : {};
    const user_data = user_key && user_key[USER_DATA] ? user_key[USER_DATA] : {};
    const user_id = user_data && user_data._id ? user_data._id : "";

    return ({
        user_id
    });
}
export default connect(mapToProps, {

})(List);