import {
  StyleSheet,
} from 'react-native'

const getIconImageStyle = (iconHeight, iconWidth, backgroundColor) => (
  {
    height: iconHeight,
    width: iconWidth,
    // alignSelf: 'center',
    // backgroundColor,
    resizeMode: 'contain',
  }
)

const getLoaderImageStyle = borderRadius => (
  {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgb(219, 216, 208)',
    borderRadius,
  }
)

const styles = StyleSheet.create({
  loaderImg: { height: 15, width: 15 }
})

export default styles

export {
  getIconImageStyle,
  getLoaderImageStyle,
}
