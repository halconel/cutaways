import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BeaconCard from './BeaconCard';

const fistBeacon = (
  <BeaconCard
    title="Моя основная система"
    phone="+7 (916) 132-12-13"
    pos="N: 5554.2500 E: 03723.1608"
    lastUpd="10.02.2019"
    voltage={4.25}
    messagesCount={0}
  />
);

const secondBeacon = (
  <BeaconCard
    title="Студентическая система №1"
    phone="+7 (916) 421-99-01"
    pos="N: 5553.9613 E: 03143.1127"
    lastUpd="02.02.2019"
    voltage={3.05}
    messagesCount={2}
  />
);

const thirdBeacon = (
  <BeaconCard
    title="Студентическая система №2"
    phone="+7 (916) 421-99-11"
    pos="N: 5553.9613 E: 03143.1127"
    lastUpd="02.02.2019"
    voltage={3.59}
    messagesCount={1}
  />
);

export default class BeaconsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      beacons: [fistBeacon, secondBeacon, thirdBeacon],
    };
  }

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {this.state.beacons}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
