import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Animated, Dimensions,
} from 'react-native';

export default class Arrow extends Component {
  render() {
    const spin = this.props.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['-0deg', '-360deg'],
    });

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Animated.Image
            resizeMode="contain"
            source={require('../../assets/arrow-up.png')}
            style={{
              width: deviceWidth / 4,
              height: deviceWidth / 4,
              transform: [{ rotate: spin }],
            }}
          />
        </View>
      </View>
    );
  }
}

// Device dimensions so we can properly center the images set to 'position: absolute'
const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 3,
    justifyContent: 'center',
    opacity: 0.8,
  },
});
