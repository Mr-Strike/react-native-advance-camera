import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import ImageCropper from 'react-native-advance-image-cropper'

import CropperFooter from './cropperFooter'
import Styles from './style'

export default class ImageCropperView extends Component {
  renderImageCropper() {
    const {
      imageClicked, saveImageAfterCrop, goBackFrom,
      borderWidth, footerHeight, unSelectedAreaOpacity
    } = this.props
    const { container } = Styles
    const { height, uri, width } = imageClicked

    return (
      <View style={container}>
        <ImageCropper
          BORDER_WIDTH={borderWidth}
          FOOTER_HEIGHT={footerHeight}
          footerComponent={<CropperFooter goBackFrom={goBackFrom} onDone={saveImageAfterCrop} />}
          imageHeight={height}
          imageUri={uri}
          imageWidth={width}
          NOT_SELECTED_AREA_OPACITY={unSelectedAreaOpacity}
          onDone={saveImageAfterCrop}
        />
      </View>
    )
  }

  render() {
    return this.renderImageCropper()
  }
}

ImageCropperView.propTypes = {
  goBackFrom: PropTypes.func.isRequired, // Executes on back press from a specific Screen
  imageClicked: PropTypes.object.isRequired, // It is the Clicked Image Object
  saveImageAfterCrop: PropTypes.func.isRequired, // Executes on positive response from image cropper
  borderWidth: PropTypes.number.isRequired,
  footerHeight: PropTypes.number.isRequired,
  unSelectedAreaOpacity: PropTypes.number.isRequired,
}
