import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Appbar } from 'react-native-paper';
import MyAppBar from './components/MyAppBar'

type Props = {};
export default class App extends Component<Props> {

  _goBack = () => console.log('Went back');
  _onSearch = () => console.log('Searching');
  _onMore = () => console.log('Shown more');

  render() {
    return (
        <MyAppBar />
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});