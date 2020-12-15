import React, { Component } from 'react'
import {
  View,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'

import IconWrapper from '../IconWrapper'

import { LOADER_GIF } from '../../utils'

import styles from './style'

export default class Loader extends Component {
  render() {
    const {
      modalBackground,
      activityIndicatorWrapper,
      title,
    } = styles
    const {
      text,
      isLoading,
      loaderChildViewStyle,
    } = this.props
    // console.log('display loader', isLoading)
    const loaderText = text || 'Loading...'
    if (!isLoading) return null
    return (
      <View
        style={[
          modalBackground,
          { backgroundColor: 'rgba(0,0,0,0.1)' },
        ]}
      >
        <View style={[activityIndicatorWrapper, loaderChildViewStyle]}>
          <IconWrapper
            iconImage={LOADER_GIF}
          />
          <Text
            numberOfLines={1}
            style={title}>
            {loaderText}
          </Text>
        </View>
      </View>
    )
  }
}

Loader.propTypes = {
  isLoading: PropTypes.bool,
  loaderChildViewStyle: PropTypes.object,
  text: PropTypes.string,
}

Loader.defaultProps = {
  isLoading: false,
  loaderChildViewStyle: {},
  text: 'Loading...',
}
