import React from 'react';
import { View } from 'react-native';
import WStyles from './WStyles'

/**
 * WRow is a custom component which is representing some default settings and helping us in code reusability in all screens and components.
 * As its name is prefix with "W" it has no meaning it is just name of component to differnetiate component from anothers.
 * As its name Implies Row means flex-direction which is already set to 'row'
 * As showing in component "dial" prop is very important in this, it is using to represet your component childrens and need to pass keyboard digit like "5" means
 * center of component, "1" means top left, "2" means top center and so on taking keyboard pattern upto 9 digit
 *                                    |  |
 *                                    |  |
 *                                    \  /
 *                                     \/
 *              ("whole boundary of this component is flex height width")
                                      ||
                                      \/     
                          ---------------------------
                         |         |        |        |
                         |    1    |   2    |   3    |
                         |         |        |        |
                          ---------------------------
                         |         |        |        |
                         |    4    |    5   |   6    |
                         |         |        |        |
                          ---------------------------
                         |         |        |        |
                         |    7    |   8    |   9    |
                         |         |        |        |
                          ---------------------------  

    All digits 1, 2, 3, 4, 5, 6, 7, 8, 9 are representing position of child component and this component
    is wrapper of them, by doing this we are saving lot of css which we don't need to write like
    justify-content, align-items, margin, padding etc. such a common css again and again.                  
 * @param {*object} props 
 */
const WRow = (props) => {

    const {
        dial = 0,
        flex: _flex,
        spaceBetween,
        spaceAround,
        stretch,
        margin,
        padding,
        style,
        reverse,
        ...otherProps
    } = props;

    const _dial = dial > 0 && dial < 10 ? dial : 0;
    const flex = typeof (_flex) === "number" ? _flex : !_flex ? null : 1

    const _WStyles = WStyles(margin, padding)

    const justifyContent = spaceBetween ? 'space-between' : spaceAround ? 'space-around' : _dial === 0 ? null : _dial % 3 === 0 ? 'flex-end' :
        _dial % 3 === 2 ? 'center' : 'flex-start';

    const alignItems = stretch ? 'stretch' : _dial === 0 ? null : _dial > 6 ? 'flex-end' :
        _dial > 3 ? 'center' : 'flex-start';

    const flexDirection = reverse ? 'row-reverse' : 'row';

    return (
        <View style={[{ flexDirection, justifyContent, alignItems, flex }, _WStyles, style]} {...otherProps} >
            {props.children}
        </View>
    );
};

export default WRow;