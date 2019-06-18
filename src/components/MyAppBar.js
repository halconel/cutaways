import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';

export default class MyAppBar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _goBack = () => { }

  _onSearch = () => { }

  _onMore = () => { }

  render() {
    return (
      <Appbar.Header>
        <Appbar.BackAction onPress={this._goBack} />
        <Appbar.Content title="Список маяков" />
        <Appbar.Action icon="search" onPress={this._onSearch} />
        <Appbar.Action icon="more-vert" onPress={this._onMore} />
      </Appbar.Header>
    );
  }
}
