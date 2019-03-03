import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider, BottomNavigation } from 'react-native-paper';

import MyAppBar from './components/MyAppBar';
import BeaconList from './components/BeaconsList';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#388e3c',
    accent: '#00600f',
  },
};

const ListRoute = () => <BeaconList />;

type Props = {};
export default class App extends Component<Props> {
  state = {
    index: 0,
    routes: [
      { key: 'list', title: 'Список маяков', icon: 'list' },
      { key: 'settings', title: 'Настройки', icon: 'settings' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    list: ListRoute,
    settings: ListRoute,
  });

  render() {
    return (
      <PaperProvider theme={theme}>
        <MyAppBar />
        <BottomNavigation
          navigationState={this.state}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
      </PaperProvider>
    );
  }
}
