import React from 'react'
import PropTypes from 'prop-types'
import {
  Image,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { map, isEqual, isEmpty } from 'lodash'

import { IconWrapper, HorizontalScroller } from '../Common'

import Styles, { getImageSelectedImage } from './style'
import { deviceWidth, GALLERY_IMAGES, TOUCHABLE_ACTIVE_OPACITY } from '../utils'

export default class GalleryViewWrapper extends React.Component {
  constructor(props) {
    super(props)
    const { selectedImages } = this.props
    const selectedImagesLength = selectedImages.length
    this.state = {
      allImagesArray: selectedImages,
      selectedImage: selectedImages[selectedImagesLength - 1],
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedImages } = this.props
    const selectedImagesLength = nextProps.selectedImages && nextProps.selectedImages.length
    if (selectedImages.length !== selectedImagesLength) {
      this.setState({
        allImagesArray: nextProps.selectedImages,
        selectedImage: !isEmpty(nextProps.selectedImages[selectedImagesLength - 1])
          ? nextProps.selectedImages[selectedImagesLength - 1] : {},
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedImage } = this.state
    if (prevState.selectedImage !== selectedImage) {
      this.resetCarouselArray(selectedImage)
    }
  }

  onCancelFlow = async () => {
    const { goBackFrom } = this.props
    goBackFrom('GALLERY_VIEW')
  }

  onSubmitPhotos = () => {
    const { onSubmitPhoto, selectedImages } = this.props
    onSubmitPhoto(selectedImages)
  }

  renderfooterView = () => {
    const { allImagesArray } = this.state
    const { leftButtonText, rightButtonText } = this.props
    const { footerView } = Styles

    return (
      <View style={footerView}>
        <TouchableOpacity
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          onPress={this.onCancelFlow}
        >
          <Text>{leftButtonText}</Text>
        </TouchableOpacity>
        {
          (allImagesArray.length > 0) && (
            <TouchableOpacity
              activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
              onPress={this.onSubmitPhotos}
            >
              <Text>{rightButtonText}</Text>
            </TouchableOpacity>
          )
        }
      </View>
    )
  }

  resetCarouselArray = itemSelected => {
    const { allImagesArray } = this.state
    const preSelectedImages = map(allImagesArray, (item, index) => {
      const newItem = item
      newItem.isSelected = isEqual(itemSelected, item)
      return newItem
    })
    this.setState({
      allImagesArray: preSelectedImages,
    })
  }

  resetSelectedImage = itemSelected => {
    this.setState({
      selectedImage: itemSelected,
    })
  }

  onClickCarouselItem = itemSelected => {
    const { goToCameraScreen } = this.props
    const { type } = itemSelected
    switch (type) {
      case 'addImage':
        goToCameraScreen()
        break

      case 'clicked':
        this.resetSelectedImage(itemSelected)
        break
      default: console.log('wrong type selected')
    }
  }

  renderImageStackItem = ({ item }) => {
    const { imageUrl } = item
    const { imageStackItem } = Styles
    return (
      <View style={imageStackItem}>
        <IconWrapper
          iconHeight={75}
          iconImage={imageUrl}
          iconWidth={75}
          imageResizeMode="cover"
          styling={getImageSelectedImage(item)}
          submitFunction={() => this.onClickCarouselItem(item)}
        />
      </View>
    )
  }

  getCarouselData = () => {
    const { allImagesArray } = this.state
    const { addButtonPresent } = this.props
    if (addButtonPresent) {
      const addBtnImageItem = {
        imageUrl: GALLERY_IMAGES.ADD_IMAGE_BUTTON,
        type: 'addImage',
      }
      return allImagesArray.concat([addBtnImageItem])
    }

    return allImagesArray
  }

  renderImageStackView = () => (
    <HorizontalScroller
      carouselItem={this.renderImageStackItem}
      startingPosition="end"
      swiperData={this.getCarouselData()}
    />
  )

  renderSelectedImageView = () => {
    const { selectedImage } = this.state
    const { deleteImageFromStack, deleteButtonPresent } = this.props
    const { deleteButtonViewStyle } = Styles
    const { DELETE_IMAGE_BUTTON } = GALLERY_IMAGES
    if (!isEmpty(selectedImage)) {
      const { imageUrl } = selectedImage
      return (
        <View>
          <Image
            source={{
              uri: imageUrl,
            }}
            style={{
              width: deviceWidth(),
              height: deviceWidth(),
            }}
          />
          {deleteButtonPresent && (
            <View style={deleteButtonViewStyle}>
              <IconWrapper
                iconHeight={58}
                iconImage={DELETE_IMAGE_BUTTON}
                iconWidth={58}
                imageResizeMode="contain"
                styling={{ borderWidth: 0 }}
                submitFunction={() => deleteImageFromStack(selectedImage)}
              />
            </View>
          )}
        </View>
      )
    }
    return null
  }

  render() {
    const { mainBody, selectedImageView, imageStackView, footerViewWrapper } = Styles
    return (
      <View style={mainBody}>
        <View style={selectedImageView}>
          {this.renderSelectedImageView()}
        </View>
        <View style={imageStackView}>
          {this.renderImageStackView()}
        </View>
        <View style={footerViewWrapper}>
          {this.renderfooterView()}
        </View>
      </View>
    )
  }
}

GalleryViewWrapper.propTypes = {
  addButtonPresent: PropTypes.bool, // Executes on pressing delete button
  deleteButtonPresent: PropTypes.bool, // Executes on pressing delete button
  deleteImageFromStack: PropTypes.func.isRequired, // Executes on back press from a specific Screen
  goBackFrom: PropTypes.func.isRequired, // To reset left button text
  goToCameraScreen: PropTypes.func.isRequired,
  leftButtonText: PropTypes.string.isRequired, // Executes on submitting the photos clicked
  onSubmitPhoto: PropTypes.func.isRequired, // To Toggle Camera Modal
  renderCameraModal: PropTypes.func.isRequired, // To reset the modal to initial state
  resetModal: PropTypes.func.isRequired, // To reset the button text
  rightButtonText: PropTypes.string.isRequired, // Array with Photo Clicked objects
  selectedImages: PropTypes.array.isRequired, // whether to allow more items to click
}

GalleryViewWrapper.defaultProps = {
  addButtonPresent: true,
  deleteButtonPresent: true,
}
