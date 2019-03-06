import React, { Component } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createStackNavigator, createAppContainer } from "react-navigation";

import BeaconsScreen from './components/BeaconsScreen';
import EditScreen from './components/EditScreen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#388e3c',
    accent: '#00600f',
  },
};

const BeaconsContext = React.createContext()

const AppNavigator = createStackNavigator({
  Home: BeaconsScreen,
  EditScreen: EditScreen,
},
{
  initialRouteName: 'Home',
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  },
});

const AppContainer = createAppContainer(AppNavigator)

export default class App extends Component {

  state = {
    beacons: []
  };

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  addBeacon = (props) => {
    const { beacons } = this.state;
    this.setState({
      beacon: [...beacons, {
        key: uuidv4,
        title: props.title,
        phone: props.phone,
      }]
    })
  }

  render() {
    const { beacons } = this.state;

    return (
      <PaperProvider theme={theme}>
        <BeaconsContext.Provider beacons = {beacons} addBeacon = {this.addBeacon}>
          <AppContainer />
        </BeaconsContext.Provider>  
      </PaperProvider>
    )
  }
}
