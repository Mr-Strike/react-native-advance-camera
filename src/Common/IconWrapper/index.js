import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Image, ImageBackground } from 'react-native'
import { get } from 'lodash'

import styles, { getIconImageStyle, getLoaderImageStyle } from './style'
import {
  getImageSource,
  TOUCHABLE_ACTIVE_OPACITY,
  LOADER_GIF,
} from '../../utils'

export default class IconButtonWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isError: false,
      loading: true,
    }
  }

  setPlaceholderImage = () => {
    this.setState({ isError: true })
  }

  render() {
    const {
      submitFunction,
      iconHeight,
      iconWidth,
      styling,
      imageResizeMode,
      onHold,
      onLeave,
      iconImage,
      placeHolderImage,
      displayLoadingImage,
      onPressIn,
    } = this.props
    const {
      isError,
      loading,
    } = this.state
    const { loaderImg } = styles
    const imageObject = getImageSource(iconImage)
    const sourceImage = isError ? getImageSource(placeHolderImage) : imageObject
    const iconMainHeight = get(styling, 'height', iconHeight)
    const iconMainWidth = get(styling, 'width', iconWidth)
    const iconBorderRadius = get(styling, 'borderRadius', 0)
    return (
      <View>
        <TouchableOpacity
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          disabled={!((submitFunction || onHold || onLeave))}
          onLongPress={onHold}
          onPress={submitFunction}
          onPressIn={onPressIn}
          onPressOut={onLeave}
        >
          {
            (displayLoadingImage) ? (
              <ImageBackground
                imageStyle={[
                  getIconImageStyle(iconMainHeight, iconMainWidth),
                  styling,
                  { resizeMode: imageResizeMode },
                ]}
                onError={this.setPlaceholderImage}
                onLoadEnd={() => this.setState({
                  loading: false,
                })}
                source={sourceImage}
                style={[
                  getIconImageStyle(iconMainHeight, iconMainWidth),
                ]}
              >
                {
                  (loading) && (
                    <View style={getLoaderImageStyle(iconBorderRadius)}>
                      <Image
                        source={LOADER_GIF}
                        style={[
                          loaderImg,
                          { resizeMode: imageResizeMode },
                        ]}
                    />
                    </View>
                  )
                }
              </ImageBackground>
            ) : (
              <Image
                onError={this.setPlaceholderImage}
                source={sourceImage}
                style={[
                  getIconImageStyle(iconHeight, iconWidth),
                  styling,
                  { resizeMode: imageResizeMode },
                ]}
              />
            )
          }
        </TouchableOpacity>
      </View>
    )
  }
}

IconButtonWrapper.propTypes = {
  backgroundColor: PropTypes.string,
  displayLoadingImage: PropTypes.bool,
  iconHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  iconImage: PropTypes.any.isRequired,
  iconWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  imageResizeMode: PropTypes.string,
  onHold: PropTypes.func,
  onLeave: PropTypes.func,
  onPressIn: PropTypes.func,
  placeHolderImage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  styling: PropTypes.object,
  submitFunction: PropTypes.func,
}

IconButtonWrapper.defaultProps = {
  backgroundColor: '#000',
  iconHeight: 50,
  iconWidth: 50,
  imageResizeMode: 'contain',
  onHold: undefined,
  onLeave: undefined,
  onPressIn: undefined,
  styling: {},
  submitFunction: undefined,
  placeHolderImage: '',
  displayLoadingImage: false,
}
