import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Colors from '../styles/Colors';

const keyboardAwareFunc = (Component) => {
    return class extends PureComponent {
        render = () => <KeyboardAwareScrollView
            bounces={false}
            nestedScrollEnabled={true}
            style={{ flexGrow: 1, backgroundColor: Colors.white }}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={{ flexGrow: 1 }}>
            <Component {...this.props} />
        </KeyboardAwareScrollView>
    }
}

export default keyboardAwareFunc;