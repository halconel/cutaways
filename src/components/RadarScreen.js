import React, { Component } from 'react';
import {
  StyleSheet, View, Text, PermissionsAndroid, Animated, Easing, Platform,
} from 'react-native';
import { IconButton, Paragraph, Title } from 'react-native-paper';
import { setUpdateIntervalForType, magnetometer, SensorTypes } from 'react-native-sensors';
import Arrow from './Arrow';
import { withGlobalContext } from './GlobalContext';
import { distance, barring, angle } from '../utils/Utils';
import Kalman from '../utils/KalmanFilter';
import { getBatteryIcon } from './BatteryIcon';

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

const kf_x = new Kalman({ R: 1, Q: 3 });
const kf_y = new Kalman({ R: 1, Q: 3 });

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
      <View style={_styles.icon}>{getBatteryIcon(voltage)}</View>
    </View>
  );
};

const requestPermission = () => {
  if (Platform.OS === 'ios') return Promise.resolve(true);
  return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
    (granted) => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('Location permission denied'));
    },
  );
};

class RadarScreen extends Component {
  constructor(props) {
    super(props);

    const { global: { beacons }, navigation } = this.props;
    const id = navigation.getParam('id', '');
    this.spinValue = new Animated.Value(0);
    this.beacon = beacons.find(b => b.key === id);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      compass: 0,
      heading: null,
    };
  }

  componentDidMount() {
    const { beacon } = this;
    const posHandler = (position) => {
      const { latitude, longitude } = position.coords;
      const heading = latitude && barring(latitude, longitude, beacon.lat, beacon.lon);
      this.setState({ latitude, longitude, heading });
    };
    const errHandler = error => this.setState({ error: error.message });
    const options = { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 };
    requestPermission().then((resolve) => {
      navigator.geolocation.getCurrentPosition(posHandler, errHandler, options);
      this.watchId = navigator.geolocation.watchPosition(posHandler, errHandler, options);
    });
    this._toggle();
  }

  componentWillUpdate() {
    this.spin();
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
    setUpdateIntervalForType(SensorTypes.magnetometer, 250);
    this._subscription = magnetometer.subscribe(async (sensorData) => {
      const { compass } = this.state;
      let { x, y } = sensorData;
      // Kalman filter
      x = kf_x.filter(x);
      y = kf_y.filter(y);
      // Calc angle
      const newAngle = angle({ x, y }) - 90;
      if (compass !== newAngle) this.setState({ compass: newAngle });
    });
  };

  spin() {
    const start = JSON.stringify(this.spinValue);
    const { compass, heading } = this.state;

    let rot = +start;
    const rotM = rot % 360;

    if (rotM < 180 && (compass - heading) > rotM + 180) rot -= 360;
    if (rotM >= 180 && (compass - heading) <= rotM - 180) rot += 360;

    rot += (compass - heading) - rotM;

    Animated.timing(this.spinValue, {
      toValue: rot,
      duration: 300,
      easing: Easing.easeInOut,
    }).start();
  }

  render() {
    const { latitude, longitude, compass, error } = this.state;
    const { beacon } = this;

    return (
      <View style={styles.container}>
        <View style={styles.green}>
          <MainTitle title={beacon.title} voltage={beacon.voltage} />
        </View>
        <View style={styles.red}>
          <Text>Место положение телефона:</Text>
          <Text>{` Широта:  ${latitude}`}</Text>
          <Text>{` Долгота: ${longitude}`}</Text>
          <Text>Место положение маяка:</Text>
          <Text>{` Широта:  ${beacon.lat}`}</Text>
          <Text>{` Долгота: ${beacon.lon}`}</Text>
          <Text>{`Расстаяние (км.): ${latitude && distance(latitude, longitude, beacon.lat, beacon.lon)}`}</Text>
          <Text>{`Азимут (град.): ${latitude && barring(latitude, longitude, beacon.lat, beacon.lon)}`}</Text>
          <Text>{`Компасс (град.): ${compass}`}</Text>
          <Text>{`Ошибка: ${JSON.stringify(error)}`}</Text>
        </View>
        <View style={styles.yellow}>
          <Arrow spinValue={this.spinValue} />
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
