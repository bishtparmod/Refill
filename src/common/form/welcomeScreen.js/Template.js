import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { WView, WText } from '../../ui';
import Colors from '../../styles/Colors';
import Utils from '../../util/Utils';
import { Image } from 'react-native';

class Template extends PureComponent {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        image: PropTypes.any,
        title: PropTypes.string,
        description: PropTypes.string
    }

    static defaultProps = {
        image: { uri: "https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" },
        title: "Free Shipping Ever",
        description: "lkasjd alskdjf alskdjf sdkljdkdlaj"
    }

    render() {
        const { image, title, description } = this.props;
        const { imageStyle, textBodyContainer, imageContainer } = this.getStyles();

        return (
            <WView dial={5} flex spaceBetween stretch backgroundColor={Colors.transparent}>
                <WView stretch dial={5} style={imageContainer}>
                    <Image source={image} style={imageStyle} resizeMode={"cover"} />
                </WView>
                <WView flex padding={[Utils.scaleSize(5), Utils.scaleSize(10)]} dial={5} style={textBodyContainer}>
                    <WText color={Colors.text_color_dark} padding={[Utils.scaleSize(10), 0]} fontFamily={"Poppins-Bold"} fontSize={Utils.scaleSize(18)} fontWeight={"bold"} center>{title}</WText>
                    <WText color={Colors.text_color_light_dark} fontFamily={"Poppins-Medium"} fontSize={Utils.scaleSize(14)} fontWeight={"400"} center lines={0}>{description}</WText>
                </WView>
            </WView>
        );
    }

    getStyles = () => {
        const height = Utils.getHeightInPortraitMode;

        return ({
            imageContainer: {
                minHeight: height/2 - 20,
                backgroundColor: Colors.light_color
            },
            textBodyContainer: {
            },
            imageStyle: {
                flex: 1,
                width: null,
                height: null
            },
            textBodyContainer: {
                minHeight: (Utils.getDeviceDimentions().height / 3) - 120
            }
        });
    }
}

export default Template;