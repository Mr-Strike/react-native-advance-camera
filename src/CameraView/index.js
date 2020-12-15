import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native'
import { RNCamera } from 'react-native-camera'

import Styles from './style'
import { CROSS_ICON, CAMERA_IMAGES } from '../utils'

export default class CameraViewWrapper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraType: 'back',
    }
  }

  renderCaptureButton = () => {
    const { captureImage } = Styles
    const { disableButton } = this.props
    return (
      <TouchableOpacity
        disabled={disableButton}
        onPress={this.takePicture}>
        <Image
          source={CAMERA_IMAGES.CAMERA_CAPTURE_ICON}
          style={captureImage}
        />
      </TouchableOpacity>
    )
  }

  renderCameraSwapButton = () => {
    const { swapButtonImage } = Styles
    return (
      <TouchableOpacity onPress={this.onSwitchCameraPressed}>
        <Image
          source={CAMERA_IMAGES.SWITCH_CAMERA}
          style={swapButtonImage}
        />
      </TouchableOpacity>
    )
  }

  renderCameraCloseButton = () => {
    const { closeButtonImage } = Styles
    const { handleBackButtonOnCamera } = this.props
    return (
      <TouchableOpacity onPress={handleBackButtonOnCamera}>
        <Image
          source={CROSS_ICON}
          style={closeButtonImage}
        />
      </TouchableOpacity>
    )
  }

  // To render bottom tile of the footer
  renderBottomTile = () => {
    const { bottomTileElem, bottomTile } = Styles
    const { isSwapButton } = this.props
    return (
      <View style={bottomTile}>
        <View style={bottomTileElem}>
          {}
        </View>
        <View style={bottomTileElem}>
          {this.renderCaptureButton()}
        </View>
        <View style={bottomTileElem}>
          {
            this.renderSwap(isSwapButton)
          }
        </View>
      </View>
    )
  }

  renderSwap = isSwapButton => (isSwapButton ? this.renderCameraSwapButton() : false)

  // To render top tile of the footer
  renderTopTile = () => {
    const { titleTextStyle, topTile } = Styles
    const { titleText, headerText } = this.props
    const imageRequiredFor = titleText ? `'${titleText}'` : false

    if (headerText) {
      return (<View style={topTile}><Text style={titleTextStyle}>{headerText}</Text></View>)
    }
    return (
      (!!imageRequiredFor) ? (<View style={topTile}>
        <Text style={titleTextStyle}>Take a photo for:</Text>
        <Text style={titleTextStyle}>{imageRequiredFor}</Text>
      </View>) : null
    )
  }

  renderTopView = () => (
    <View>
      <View>
        {this.renderCameraCloseButton()}
      </View>
    </View>
  )

  renderBottomView = () => (
    <View>
      <View>
        {this.renderTopTile()}
      </View>
      <View>
        {this.renderBottomTile()}
      </View>
    </View>
  )

  onSwitchCameraPressed = () => {
    const { cameraType } = this.state
    const rotateCamera = (cameraType === 'front') ? 'back' : 'front'
    this.setState({
      cameraType: rotateCamera,
    })
  }

  takePicture = async () => {
    const {
      takePicture, disableButton,
      setDisableButtion, setLoading,
    } = this.props
    if (!disableButton) {
      setLoading(true)
      if (this.camera) {
        setDisableButtion(true)
        const options = {
          quality: 0.8,
          autoFocus: 0,
          fixOrientation: true,
          mirrorImage: false,
          skipProcessing: true,
          pauseAfterCapture: true,
        }
        const imageData = await this.camera.takePictureAsync(options)
        setDisableButtion(false)
        takePicture(imageData)
        setLoading(false)
      }
    }
  }

  render() {
    const { bottomView, preview, topView, mainBody, cameraContainer } = Styles
    const { cameraType } = this.state
    const { renderCustomCameraFooterView } = this.props
    return (
      <View style={mainBody}>
        <View style={topView}>
          {this.renderTopView()}
        </View>
        <View style={cameraContainer}>
          <RNCamera
            ref={c => {
              this.camera = c
            }}
            ratio="1:1"
            style={preview}
            type={cameraType}
          />
          <View style={bottomView}>
            {renderCustomCameraFooterView ? renderCustomCameraFooterView() : this.renderBottomView()}
          </View>
        </View>
      </View>
    )
  }
}

CameraViewWrapper.propTypes = {
  disableButton: PropTypes.bool.isRequired,
  handleBackButtonOnCamera: PropTypes.func.isRequired,
  headerText: PropTypes.string, // To Toggle Camera Button
  isNoBlurPresent: PropTypes.bool, // To Toggle Camera Modal
  isSwapButton: PropTypes.bool, // To Toggle Camera Modal
  renderCameraModal: PropTypes.func.isRequired, // Will run on clicking a photo
  setDisableButtion: PropTypes.func,
  setLoading: PropTypes.func,
  takePicture: PropTypes.func.isRequired, // Text for which the Photo is Required
  titleText: PropTypes.string, // Text for which the Photo is Required
  renderCustomCameraFooterView: PropTypes.func, // Function returning a React Component (Custom footer for Camera View)
}

CameraViewWrapper.defaultProps = {
  titleText: '',
  headerText: '',
  isSwapButton: true,
  isNoBlurPresent: true,
  setLoading: () => {},
  setDisableButtion: () => {},
  renderCustomCameraFooterView: undefined
}
