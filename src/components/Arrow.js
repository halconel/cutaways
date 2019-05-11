import React, { Component } from 'react';
import {
  Text, View, StyleSheet, Image, Animated, Easing, Dimensions,
} from 'react-native';

export default class Arrow extends Component {
  constructor() {
    super();
    this.spinValue = new Animated.Value(0);
    this.state = {
      location: null,
      errorMessage: null,
      heading: null,
      truenoth: null,
    };
  }

  componentWillUpdate() {
    this.spin();
  }

  spin() {
    const start = JSON.stringify(this.spinValue);
    const heading = Math.round(this.state.heading);

    let rot = +start;
    const rotM = rot % 360;

    if (rotM < 180 && heading > rotM + 180) rot -= 360;
    if (rotM >= 180 && heading <= rotM - 180) rot += 360;

    rot += heading - rotM;

    Animated.timing(this.spinValue, {
      toValue: rot,
      duration: 300,
      easing: Easing.easeInOut,
    }).start();
  }

  render() {
    let display = 'Loading...';

    if (this.state.errorMessage) display = this.state.errorMessage;

    const spin = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['-0deg', '-360deg'],
    });

    display = Math.round(JSON.stringify(this.spinValue));

    if (display < 0) display += 360;
    if (display > 360) display -= 360;

    return (
      <View>
        <View style={styles.imageContainer}>
          <Animated.Image
            resizeMode="contain"
            source={require('../../assets/arrow-up.png')}
            style={{
              width: deviceWidth / 5,
              // height: 40,
              // left: deviceWidth / 2 - (deviceWidth - 10) / 2,
              top: deviceHeight / 2 - (deviceHeight / 2 - 10) / 2,
              transform: [{ rotate: spin }],
            }}
          />
        </View>
        <Text style={styles.text}>{`${display}°`}</Text>
      </View>
    );
  }
}

// Device dimensions so we can properly center the images set to 'position: absolute'
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  text: {
    flex: 1,
    color: '#263544',
    fontSize: 40,
    backgroundColor: 'yellow',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
    backgroundColor: 'blue',
  },
});
