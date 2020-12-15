import {
  StyleSheet,
} from 'react-native'

import { deviceHeight } from '../../utils'

const styles = StyleSheet.create({
  modalBackground: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 99999,
    minHeight: deviceHeight(),
    width: '100%',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#000000',
    height: 100,
    width: 160,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 5,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
})

export default styles
