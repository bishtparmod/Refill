import React, { PureComponent } from 'react';
import { FlatList, Image } from 'react-native';
import ListCardContainerItem from './ListCardContainerItem';
import { WRow, WText } from '../../../common/ui';
import Utils from '../../../common/util/Utils';

class ListCardContainer extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const plusIcon = require("../../../../assets/img/plus.png");
        const { imageStyle } = this.getStyles();

        return (
            <FlatList
                data={[1]}
                renderItem={({ item, index }) => {
                    return (<ListCardContainerItem />);
                }}
                ListFooterComponent={
                    <WRow dial={5}>
                        <Image source={plusIcon} style={imageStyle} resizeMode={"contain"} />
                        <WText padding={[0, Utils.scaleSize(10)]}>
                            Add payment Method
                        </WText>
                    </WRow>
                }
            />
        );
    }

    getStyles = () => {
        return ({
            imageStyle: {
                width: 20,
                height: 20
            }
        });
    }
}

export default ListCardContainer;