import React, { Component, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withGlobalContext } from './GlobalContext';

function RadarScreen(props) {
  return (
    <View>
      <Text>А вот и экран радара!</Text>
    </View>
  );
}

const withGlobalRadarScreen = withGlobalContext(RadarScreen);

export default withGlobalRadarScreen;
