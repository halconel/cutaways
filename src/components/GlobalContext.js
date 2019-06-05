/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { AsyncStorage } from 'react-native';
import { uuidv4 } from '../utils/Utils';
import { parseMatches, getMatches } from '../utils/Nmea';

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
      if (value !== null) this.setState({ beacons: JSON.parse(value) });
    });
  }

  today = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return `${mm}.${dd}.${yyyy}`;
  }

  addBeacon = (props) => {
    const { beacons } = this.state;
    // Основные поля: имя и телефон
    const newBeacon = {
      key: uuidv4(),
      title: props.title,
      phone: props.phone,
    };
    // Если было передано gps сообщение, парсим его и добавляем значения для маяка
    if (props.message.length > 0) {
      const m = getMatches(props.message);
      if (m != null) {
        const gpsData = parseMatches(m);
        Object.assign(newBeacon, gpsData);
        newBeacon.lastUpd = this.today();
      }
    }
    // Обновим стайт приложения
    this.setState({ beacons: [...beacons, newBeacon] });
    // Запишем состояние в хранилище
    AsyncStorage.setItem('@cutaways:beacons', JSON.stringify([...beacons, newBeacon])).done();
  };

  updateBeacon = (props) => {
    const { beacons } = this.state;
    const beacon = beacons.find(b => b.key === props.id);
    // Основные поля: имя и телефон
    beacon.title = props.title;
    beacon.phone = props.phone;
    // Если было передано gps сообщение, парсим его и добавляем значения для маяка
    if (props.message.length > 0) {
      const m = getMatches(props.message);
      if (m != null) {
        const gpsData = parseMatches(m);
        Object.assign(beacon, gpsData);
        beacon.lastUpd = this.today();
      }
    }

    // Обновим стайт приложения
    this.setState({ beacons: [...beacons] });
    // Запишем состояние в хранилище
    AsyncStorage.setItem('@cutaways:beacons', JSON.stringify([...beacons])).done();
  };

  deleteBeacon = (id) => {
    let { beacons } = this.state;
    beacons = beacons.filter(el => el.key !== id);
    this.setState({ beacons });
    // Запишем состояние в хранилище
    AsyncStorage.setItem('@cutaways:beacons', JSON.stringify([...beacons])).done();
  };

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
