import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: '#000',
  },

  cameraContainer: {
    flex: 1,
  },

  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  bottomView: {
    flex: 0,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },

  topView: {
    flex: 0,
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 15,
    zIndex: 99,
  },

  bottomTileElem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomTile: {
    marginVertical: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  topTile: {
    marginVertical: 20,
  },

  titleTextStyle: {
    textAlign: 'left',
    fontSize: 16,
  },

  swapButtonImage: {
    width: 27,
    height: 27,
    resizeMode: 'contain',
  },

  captureImage: {
    width: 60,
    height: 60,
  },

  closeButtonImage: {
    width: 12,
    height: 12,
    opacity: 0.5,
    padding: 10,
  },

  middleTileWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconSize: {
    height: '100%',
    width: '100%',
  },
  iconWrapper: {
    height: 20,
    width: 20,
  },
  blurIconWrapper: {
    height: 20,
    width: 23,
  },
  iconMarginLeft: {
    marginLeft: 5,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
