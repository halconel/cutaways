import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Alert, PermissionsAndroid,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import * as Sensors from 'react-native-sensors';
import Arrow from './Arrow';
import { withGlobalContext } from './GlobalContext';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
  },
  green: {
    flex: 1,
    backgroundColor: 'green',
  },
  red: {
    flex: 3,
    backgroundColor: 'red',
  },
  yellow: {
    flex: 4,
    // backgroundColor: 'yellow',
  },
  container: {
    flex: 1,
  },
});

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

function distance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const la1 = degreesToRadians(lat1);
  const la2 = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(la1) * Math.cos(la2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function barring(lat1, lon1, lat2, lon2) {
  const dLon = degreesToRadians(lon2 - lon1);

  const la1 = degreesToRadians(lat1);
  const la2 = degreesToRadians(lat2);

  const y = Math.sin(dLon) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
  return radiansToDegrees(Math.atan2(y, x));
}

async function requestLocationPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  ).then;

  if (granted) {
    console.log('You can use the ACCESS_FINE_LOCATION');
  } else {
    console.log('ACCESS_FINE_LOCATION permission denied');
  }
}

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
    requestLocationPermission();
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({ error: error.message }),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
    this._toggle();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    this._subscription && this._subscription.stop();
    this._subscription = null;
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      // this._subscribe();
    }
  };

  _subscribe = () => {
    const { magnetometer } = Sensors;
    this._subscription = magnetometer.subscribe((sensorData) => {
      console.log(sensorData);
      this.setState({ magnetometer: this._angle(sensorData) });
    });
  };

  _angle = (magnetometer) => {
    if (magnetometer) {
      const { x, y } = magnetometer;

      if (Math.atan2(y, x) >= 0) {
        return Math.round(Math.atan2(y, x) * (180 / Math.PI));
      }
      return Math.round((Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI));
    }
    return 0;
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
          <Text>
            Tile:
            {beacon.title}
            Voltage:
            {beacon.voltage}
          </Text>
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
            {this.state.error}
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
