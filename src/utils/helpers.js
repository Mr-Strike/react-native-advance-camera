import { Platform, Dimensions } from 'react-native'
import RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer' // eslint-disable-line
import Toast from 'react-native-root-toast'
import { isNumber } from 'lodash'

const showToast = (
  alertMessage,
  config = {
    backgroundColor: '#FFFFFF',
    duration: 5000,
    position: 22,
    shadow: true,
    textColor: '#1E2B3A',
    textStyle: {
      fontFamily: 'Muli',
      fontSize: 14,
    },
    opacity: 1,
  },
) => Toast.show(alertMessage, config)

const convertFileUrlToBase64 = async url => {
  // eslint-disable-next-line no-useless-catch
  try {
    const options = 'base64'
    const response = await RNFS.readFile(url, options)
    return response
  }
  catch (e) {
    throw e
  }
}

const getFileNameFromURI = uri => uri.substring(uri.lastIndexOf('/') + 1, uri.lastIndexOf('.'))

const getFileTypeFromURI = uri => uri.substring(uri.lastIndexOf('.') + 1)

const getResizedHeight = (imageSize = 0, prevHeight) => {
  const diffToBeMinimized = Math.floor(imageSize / 600000)
  return (prevHeight / (diffToBeMinimized || 4))
}

const imageResizer = async (imageInfo, options = {}) => {
  const {
    path,
    uri,
    size,
    height,
    width,
  } = imageInfo

  const {
    newWidth,
    newHeight,
    compressFormat,
    quality,
    rotation,
    outputPath,
  } = options

  const NEW_WIDTH = newWidth || getResizedHeight(size, width)
  const NEW_HEIGHT = newHeight || getResizedHeight(size, height)
  const COMPRESS_FORMAT = compressFormat || 'JPEG'
  const QUALITY = quality || 70
  const ROTATION = rotation || 0
  const OUTPUT_PATH = outputPath || null

  const resizedImage = await ImageResizer.createResizedImage(path
    || uri, NEW_WIDTH, NEW_HEIGHT, COMPRESS_FORMAT, QUALITY, ROTATION, OUTPUT_PATH).then(response => (
    {
      ...imageInfo,
      ...response,
      height: NEW_HEIGHT,
      width: NEW_WIDTH,
    }
    // response.uri is the URI of the new image that can now be displayed, uploaded...
    // response.path is the path of the new image
    // response.name is the name of the new image with the extension
    // response.size is the size of the new image
  )).catch(err => {
    showToast('Oops, something went wrong. Check that the filename is correct')
    // Oops, something went wrong. Check that the filename is correct and
    // inspect err to get more details.
  })

  return resizedImage
}

const getPlatform = () => (
  Platform.OS
)

/**
 * Returns width of the device
 */
const deviceWidth = () => {
  const dim = Dimensions.get('window')
  return dim.width
}

/**
 * Returns height of the device
 */
const deviceHeight = () => {
  const dim = Dimensions.get('window')
  return dim.height
}

const getImageSource = imagePath => (isNumber(imagePath) ? imagePath : { uri: imagePath })

export {
  getPlatform,
  imageResizer,
  getFileNameFromURI,
  getFileTypeFromURI,
  convertFileUrlToBase64,
  getImageSource,
  deviceWidth,
  deviceHeight,
}
