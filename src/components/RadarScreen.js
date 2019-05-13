import React, { Component, Platform } from 'react';
import {
  StyleSheet, View, Text, Alert, PermissionsAndroid,
} from 'react-native';
import { IconButton, Paragraph, Title } from 'react-native-paper';
import * as Sensors from 'react-native-sensors';
import Arrow from './Arrow';
import { withGlobalContext } from './GlobalContext';
import { distance, barring, angle } from '../utils/Utils';
import { getBattaryIcon } from './BattaryIcon';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
  },
  red: {
    flex: 4,
    backgroundColor: 'red',
  },
  yellow: {
    flex: 3,
    // backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
  },
});

const MainTitle = ({ title, voltage }) => {
  const _styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      margin: 16,
    },
    title: {
      flex: 3,
    },
    icon: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingTop: 4,
    },
  });

  return (
    <View style={_styles.container}>
      <Title style={_styles.title}>{title}</Title>
      <View style={_styles.icon}>
        {getBattaryIcon(voltage)}
      </View>
    </View>
  );
}

const requestPermission = () => {
  if (Platform.OS === 'ios') return Promise.resolve(true);
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ).then((granted) => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return Promise.resolve("You can use the location")
    }
    return Promise.reject("Location permission denied")
  });
};

class RadarScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      magnetometer: '0',
    };
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.setState({ latitude, longitude });
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000 },
    );
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        distanceFilter: 10,
      },
    );
    // this._toggle();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    this._subscription && this._subscription.stop();
    this._subscription = null;
  }

  _toggle = () => {
    if (this._subscription) this._unsubscribe();
    else this._subscribe();
  };

  _subscribe = () => {
    const { magnetometer } = Sensors;
    this._subscription = magnetometer.subscribe((sensorData) => {
      console.log(sensorData);
      this.setState({ magnetometer: angle(sensorData) });
    });
  };


  render() {
    const {
      global: { beacons },
      navigation,
    } = this.props;

    const { latitude, longitude, magnetometer } = this.state;
    const id = navigation.getParam('id', '');
    const beacon = beacons.find(b => b.key === id);

    return (
      <View style={styles.container}>
        <View style={styles.green}>
          <MainTitle title={beacon.title} voltage={beacon.voltage} />
        </View>
        <View style={styles.red}>
          <Text>Место положение телефона:</Text>
          <Text>
            {' '}
            Широта:
            {latitude}
          </Text>
          <Text>
            {' '}
            Долгота:
            {longitude}
          </Text>
          <Text>Место положение маяка:</Text>
          <Text>
            {' '}
            Широта:
            {beacon.lat}
          </Text>
          <Text>
            {' '}
            Долгота:
            {beacon.lon}
          </Text>
          <Text>
            Расстаяние (км.):
            {' '}
            {latitude && distance(latitude, longitude, beacon.lat, beacon.lon)}
          </Text>
          <Text>
            Азимут (град.):
            {' '}
            {latitude && barring(latitude, longitude, beacon.lat, beacon.lon)}
          </Text>
          <Text>
            Компасс (град.):
            {magnetometer}
          </Text>
          <Text>
            Ошибка:
            {JSON.stringify(this.state.error)}
          </Text>
        </View>
        <View style={styles.yellow}>
          <Arrow heading={90} />
        </View>
      </View>
    );
  }
}

function onMap() {
  console.log('Map');
}

function onSync() {
  console.log('Sync');
}

function TabButtons({ navigation }) {
  const passData = { titleNavBar: 'Добавление маяка' };

  return (
    <View style={styles.tab}>
      <IconButton color="#fff" icon="map" onPress={() => onMap()} />
      <IconButton color="#fff" icon="sync" onPress={() => onSync()} />
    </View>
  );
}

const withGlobalRadarScreen = withGlobalContext(RadarScreen);
withGlobalRadarScreen.navigationOptions = ({ navigation }) => ({
  title: 'Поиск',
  headerRight: <TabButtons navigation={navigation} />,
});
export default withGlobalRadarScreen;
