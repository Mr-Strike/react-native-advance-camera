import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import ImageCropper from 'react-native-advance-image-cropper'

import CropperFooter from './cropperFooter'
import Styles from './style'

export default class ImageCropperView extends Component {
  renderImageCropper() {
    const { imageClicked, saveImageAfterCrop, goBackFrom } = this.props
    const { container } = Styles
    const { height, uri, width } = imageClicked

    return (
      <View style={container}>
        <ImageCropper
          BORDER_WIDTH={20}
          FOOTER_HEIGHT={100}
          footerComponent={<CropperFooter goBackFrom={goBackFrom} onDone={saveImageAfterCrop} />}
          imageHeight={height}
          imageUri={uri}
          imageWidth={width}
          NOT_SELECTED_AREA_OPACITY={0.3}
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
}
