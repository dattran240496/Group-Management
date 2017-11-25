const React = require('react-native');
const { PixelRatio, Dimensions, Platform } = React;

const pixelRatio = PixelRatio.get();
const {width , height} = Dimensions.get('window');
const defaultWidth = 375;

const recapture = size => {
    let replaceSize = size * (width / defaultWidth);
    if(Platform.OS === "android") {
        replaceSize = parseInt(Math.ceil(replaceSize));
    };
    return replaceSize;
};

module.exports = recapture;
