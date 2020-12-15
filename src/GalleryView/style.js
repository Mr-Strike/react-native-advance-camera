import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#313943',
  },
  selectedImageView: {
    flex: 1,
    justifyContent: 'center',
  },
  imageStackView: {
    margin: 20,
  },
  imageStackItem: {
    marginRight: 15,
  },
  footerViewWrapper: {
    height: 40,
  },
  footerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  deleteButtonViewStyle: {
    flex: 0,
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 12,
    padding: 2,
    zIndex: 99,
    borderWidth: 0,
  },
})

const getImageSelectedImage = imageItem => {
  const { type, isSelected } = imageItem
  let borderColor
  let borderWidth
  switch (type) {
    case 'clicked':
      if (isSelected) {
        borderColor = '#00A8E5'
        borderWidth = 1
      }
      else {
        borderWidth = 0
      }
      break

    case 'addImage':
      borderColor = '#A2A2A2'
      borderWidth = 1
      break

    default:
      borderColor = '#A2A2A2'
      borderWidth = 1
  }

  return {
    borderRadius: 10,
    borderWidth,
    borderColor,
  }
}

export {
  getImageSelectedImage,
}
