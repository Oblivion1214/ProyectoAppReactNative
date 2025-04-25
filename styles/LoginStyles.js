// styles/LoginStyles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFCC80',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    marginBottom: 24,
    resizeMode: 'contain'
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 4
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 8
  },
  error: {
    color: 'red',
    marginBottom: 12
  }
});
