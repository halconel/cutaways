/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { uuidv4 } from '../utils/Utils';
import { AsyncStorage } from 'react-native';

const fistBeacon = {
  key: uuidv4(),
  title: 'Моя основная система',
  phone: '+7 (916) 132-12-13',
  pos: 'N: 5554.2413 E: 03723.1130',
  lat: 55.904022,
  lon: 37.385217,
  lastUpd: '10.02.2019',
  voltage: 3.97,
  messagesCount: 0,
};

const secondBeacon = {
  key: uuidv4(),
  title: 'Студентическая система №1',
  phone: '+7 (916) 421-99-01',
  pos: 'N: 5553.9613 E: 03143.1127',
  lat: 0,
  lon: 0,
  lastUpd: '02.02.2019',
  voltage: 3.05,
  messagesCount: 2,
};

const thirdBeacon = {
  key: uuidv4(),
  title: 'Студентическая система №2',
  phone: '+7 (916) 421-99-11',
  pos: 'N: 5553.9613 E: 03143.1127',
  lat: 0,
  lon: 0,
  lastUpd: '02.02.2019',
  voltage: 3.59,
  messagesCount: 1,
};

const GlobalContext = React.createContext({
  value: {
    beacons: [],
    addBeacon: this.addBeacon,
    updateBeacon: this.updateBeacon,
    deleteBeacon: this.deleteBeacon,
  },
});

export class GlobalContextProvider extends React.Component {
  state = {
    beacons: [],
  }

  constructor(props) {
    super(props);
    AsyncStorage.getItem('@cutaways:beacons').then((value) => {
      console.log(value);
      this.setState({ beacons: JSON.parse(value) });
    });
  }


  addBeacon = (props) => {
    const { beacons } = this.state;
    const newBeacon = {
      key: uuidv4(),
      title: props.title,
      phone: props.phone,
    };
    this.setState({ beacons: [...beacons, newBeacon] });
    AsyncStorage.setItem('@cutaways:beacons', JSON.stringify([...beacons, newBeacon])).done();
    console.log(JSON.stringify([...beacons, newBeacon]));
  };

  updateBeacon = (id, props) => { };

  deleteBeacon = (id) => { };

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          addBeacon: this.addBeacon,
          updateBeacon: this.updateBeacon,
          deleteBeacon: this.deleteBeacon,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {context => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
