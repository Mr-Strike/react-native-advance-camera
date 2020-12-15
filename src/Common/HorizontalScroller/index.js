import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, ScrollView } from 'react-native'
import { map } from 'lodash'

export default class HorizontalScrollerWrapper extends Component {
  imageStackScroll = null
  renderSwiperData = () => {
    const { swiperData, carouselItem } = this.props
    return (
      map(swiperData, (elemVal, elemIndex) => {
        const swiperElemData = {
          item: elemVal,
          index: elemIndex,
        }
        return (
          <View key={elemIndex}>
            {carouselItem(swiperElemData)}
          </View>
        )
      })
    )
  }

  onScrollerContentChange = () => {
    const { startingPosition } = this.props
    if (this.imageStackScroll) {
      switch (startingPosition) {
        case 'start':
          this.imageStackScroll.scrollTo({ x: 0, y: 0, animated: false })
          break
  
        case 'end':
          this.imageStackScroll.scrollToEnd({ animated: false })
          break
  
        default: this.imageStackScroll.scrollTo({ x: 0, y: 0, animated: false })
      }
    }
  }

  render() {
    return (
      <View>
        <ScrollView
          ref={(refer) => {
            this.imageStackScroll = refer
          }}
          horizontal
          onContentSizeChange={this.onScrollerContentChange}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {this.renderSwiperData()}
        </ScrollView>
      </View>
    )
  }
}

HorizontalScrollerWrapper.propTypes = {
  carouselItem: PropTypes.func.isRequired,
  startingPosition: PropTypes.string, // 'start', 'center' or 'end'
  swiperData: PropTypes.array.isRequired,
}

HorizontalScrollerWrapper.defaultProps = {
  startingPosition: 'start',
}
