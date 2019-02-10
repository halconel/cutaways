import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import MyAppBar from "./components/MyAppBar";

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ fontWeight: "bold" }}>Hi</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  }
});
