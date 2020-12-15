import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Modal,
  StatusBar,
} from 'react-native'
import { map, findIndex, isEqual } from 'lodash'

import CameraView from './CameraView'
import ImageCropperView from './ImageCropperView'
import GalleryView from './GalleryView'
import { Loader } from './Common'

import Styles from './style'
import {
  convertFileUrlToBase64,
  getFileNameFromURI,
  getFileTypeFromURI,
  imageResizer,
  getPlatform,
} from './utils'

export default class CameraFlowWrapper extends React.Component {
  constructor(props) {
    super(props)
    const { defaultScreen } = props
    this.state = {
      isLoading: false,
      initialScreen: defaultScreen,
      imageClicked: null,
      modalType: defaultScreen, // Modal Types: CAMERA_VIEW, CROP_VIEW, GALLERY_VIEW
      selectedImages: [],
      selectedPdf: {},
      disableButton: false,
    }
  }

  setDisableButtion = visibility => {
    this.setState({
      disableButton: visibility,
    })
  }

  handleBackButtonOnCamera = () => {
    const { renderCameraModal } = this.props
    const {
      modalType,
      initialScreen,
      selectedImages,
    } = this.state
    switch (modalType) {
      case 'CAMERA_VIEW':
        this.setDisableButtion(false)
        renderCameraModal(false)
        break

      case 'CROP_VIEW':
        this.setState({
          modalType: 'CAMERA_VIEW',
          isLoading: false,
        })
        break

      case 'GALLERY_VIEW':
        // const newSelectedImageArray = selectedImages.slice(0, selectedImages.length)
        this.setState({
          selectedImages: selectedImages.slice(0, selectedImages.length - 1),
          modalType: 'CROP_VIEW',
          isLoading: false,
        })
        break

      default:
        this.setState({
          modalType: 'CAMERA_VIEW',
        })
    }
    return true
  }

  setLoading = input => {
    this.setState({
      isLoading: input,
    })
  }

  // Executes on positive response from Camera Screen
  takePicture = imageData => {
    console.warn('takePicture', imageData)
    this.setState({
      imageClicked: imageData,
      modalType: 'CROP_VIEW',
    })
  }

  addToImagesStackArray = async imageUrl => {
    const { base64String } = this.props
    const { selectedImages } = this.state
    const preSelectedImages = map(selectedImages, (item, index) => {
      const newItem = item
      newItem.isSelected = false
      return newItem
    })
    preSelectedImages.push({
      uri: imageUrl,
      imageUrl,
      type: 'clicked',
      fileName: getFileNameFromURI(imageUrl),
      fileType: getFileTypeFromURI(imageUrl),
      base64String: base64String ? convertFileUrlToBase64(imageUrl) : null,
      isSelected: true,
    })

    await this.setState({
      isLoading: false,
      selectedImages: preSelectedImages,
      modalType: 'GALLERY_VIEW',
    })
  }

  // Executes on positive response from image cropper
  saveImageAfterCrop = async croppedImageData => {
    this.setState({
      isLoading: true,
    })
    console.warn('image after imagecropper', croppedImageData)
    const resizedImageData = await imageResizer(croppedImageData)
    const {
      uri,
    } = resizedImageData
    const imageUri = uri
    const { getMultipleImages } = this.props
    if (getMultipleImages) {
      this.addToImagesStackArray(imageUri)
    }
    else {
      this.onSubmitPhoto(imageUri)
    }
  }

  // Executes on submitting the photos clicked
  onSubmitPhoto = async imageData => {
    const { onSubmitPhoto, renderCameraModal } = this.props
    this.setState({
      isLoading: false,
    })
    await renderCameraModal(false)
    onSubmitPhoto(imageData)
    this.resetModal()
  }

  // To reset the modal to initial state
  resetModal = () => {
    const { defaultScreen } = this.props
    this.setState({
      imageClicked: null,
      modalType: defaultScreen,
      selectedImages: [],
    })
  }

  goToCameraScreen = () => {
    this.setState({
      modalType: 'CAMERA_VIEW',
    })
  }

  // To render Camera View
  renderCameraView = () => {
    const { modalViewWrapper } = Styles
    const { disableButton } = this.state
    const {
      titleText, renderCameraModal, isSwapButton,
      renderCustomCameraFooterView, cameraProps } = this.props
    return (
      <View style={modalViewWrapper}>
        <CameraView
          disableButton={disableButton}
          handleBackButtonOnCamera={this.handleBackButtonOnCamera}
          isSwapButton={isSwapButton}
          renderCameraModal={renderCameraModal}
          setDisableButtion={this.setDisableButtion}
          setLoading={this.setLoading}
          takePicture={this.takePicture}
          titleText={titleText}
          renderCustomCameraFooterView={renderCustomCameraFooterView}
          { ...cameraProps }
        />
      </View>
    )
  }

  // To render Image Cropper View
  renderCropperView = () => {
    const { modalViewWrapper } = Styles
    const { imageClicked } = this.state
    const { cropperProps } = this.props
    return (
      <View style={modalViewWrapper}>
        <ImageCropperView
          goBackFrom={this.handleBackButtonOnCamera}
          imageClicked={imageClicked}
          saveImageAfterCrop={this.saveImageAfterCrop}
          { ...cropperProps }
        />
      </View>
    )
  }

  // To render Gallery View
  renderGalleryView = () => {
    const { modalViewWrapper } = Styles
    const { renderCameraModal, gallerySubmitButtonText, galleryCancelButtonText } = this.props
    const { selectedImages } = this.state
    return (
      <View style={modalViewWrapper}>
        <GalleryView
          deleteImageFromStack={selectedImage => this.deleteImageFromStack(selectedImage)}
          goBackFrom={this.handleBackButtonOnCamera}
          goToCameraScreen={this.goToCameraScreen}
          leftButtonText={galleryCancelButtonText}
          onSubmitPhoto={this.onSubmitPhoto}
          renderCameraModal={renderCameraModal}
          resetModal={this.resetModal}
          rightButtonText={gallerySubmitButtonText}
          selectedImages={selectedImages}
        />
      </View>
    )
  }

  onSubmitDocument = () => {
    const { selectedPdf } = this.state
    this.onSubmitPhoto(selectedPdf)
  }

  deleteImageFromStack = selectedImage => {
    const { selectedImages } = this.state
    const selectedImageIndex = findIndex(selectedImages, item => isEqual(item, selectedImage))
    this.setState({
      selectedImages: [
        ...selectedImages.slice(0, selectedImageIndex),
        ...selectedImages.slice(selectedImageIndex + 1, selectedImages.length),
      ],
    })
  }

  render() {
    const { modalProps } = this.props
    const {
      modalType,
      isLoading,
    } = this.state
    const { modalContainerViewStyle } = Styles
    const platform = getPlatform()
    return (
      <View style={modalContainerViewStyle}>
        {
          (platform === 'ios') && (
            <StatusBar
              hidden
            />
          )
        }
        <Modal
          {...modalProps}
          animated={true}
          onRequestClose={() => this.handleBackButtonOnCamera()}
        >
          <Loader
            isLoading={isLoading}
          />
          {
            (modalType === 'CAMERA_VIEW') && (this.renderCameraView())
          }
          {
            (modalType === 'CROP_VIEW') && (this.renderCropperView())
          }
          {
            (modalType === 'GALLERY_VIEW') && (this.renderGalleryView())
          }
        </Modal>
      </View>
    )
  }
}

CameraFlowWrapper.propTypes = {
  base64String: PropTypes.bool,
  defaultScreen: PropTypes.string,
  descText: PropTypes.string,
  galleryCancelButtonText: PropTypes.string,
  gallerySubmitButtonText: PropTypes.string,
  getMultipleImages: PropTypes.bool, // Boolean to tell whether to take multiple photos or not
  isSignatureUser: PropTypes.bool,
  isSwapButton: PropTypes.bool, // To Toggle Camera Button
  modalProps: PropTypes.object, // To provide Modal View properties
  onSubmitPhoto: PropTypes.func.isRequired, // Function to run after submitting photos
  renderCameraModal: PropTypes.func.isRequired, // To Toggle Camera Modal
  titleText: PropTypes.string, // Title for which Modal is enabled
  renderCustomCameraFooterView: PropTypes.func, // Function returning a React Component (Custom footer for Camera View)

  cropperProps: PropTypes.shape({
    borderWidth: PropTypes.number,
    footerHeight: PropTypes.number,
    unSelectedAreaOpacity: PropTypes.number,  // Between 0-1
  }),

  cameraProps: PropTypes.shape({
    cameraType: "back" | "front", // "back" | "front"
  }),
}

CameraFlowWrapper.defaultProps = {
  base64String: false,
  defaultScreen: 'CAMERA_VIEW',
  getMultipleImages: false,
  modalProps: {
    visible: false,
    transparent: false,
    animationType: 'slide',
  },
  isSignatureUser: false,
  isSwapButton: true, // To Toggle Camera Button
  titleText: '',
  descText: 'You will need to upload both front and back of the ID',
  gallerySubmitButtonText: 'Done',
  galleryCancelButtonText: 'Cancel',
  renderCustomCameraFooterView: undefined,

  // Image Cropper Props
  cropperProps: {
    borderWidth: 20,
    footerHeight: 100,
    unSelectedAreaOpacity: 0.4,  // Between 0-1
  },

  // Camera Props
  cameraProps: {
    cameraType: 'back'
  }
}
