import React, { Component, Platform } from 'react';
import {
  StyleSheet, View, Text, PermissionsAndroid, Animated, Easing,
} from 'react-native';
import { IconButton, Paragraph, Title } from 'react-native-paper';
import * as Sensors from 'react-native-sensors';
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

const kf_x = new Kalman({ R: 0.01, Q: 2 });
const kf_y = new Kalman({ R: 0.01, Q: 2 });

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
        return Promise.resolve('You can use the location');
      }
      return Promise.reject('Location permission denied');
    },
  );
};

class RadarScreen extends Component {
  constructor(props) {
    super(props);

    this.spinValue = new Animated.Value(0);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      compass: 0,
      heading: null,
    };
  }

  componentDidMount() {
    const posHandler = (position) => {
      const { latitude, longitude } = position.coords;
      this.setState({ latitude, longitude });
    };
    const errHandler = error => this.setState({ error: error.message });
    const options = { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 };

    navigator.geolocation.getCurrentPosition(posHandler, errHandler, options);
    this.watchId = navigator.geolocation.watchPosition(posHandler, errHandler, options);
    this._toggle();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
    this._subscription && this._subscription.stop();
    this._subscription = null;
  }

  componentWillUpdate() {
    this.spin();
  }

  _toggle = () => {
    if (this._subscription) this._unsubscribe();
    else this._subscribe();
  };

  _subscribe = () => {
    const { magnetometer } = Sensors;

    this._subscription = magnetometer.subscribe( async (sensorData) => {
      const { compass } = this.state;
      let { x, y } = sensorData;
      // Kalman filter
      x = kf_x.filter(x);
      y = kf_y.filter(y);
      // Calc angle
      const newAngle = angle({ x, y });
      if (compass !== newAngle) this.setState({ compass: newAngle });
    });
  };

  spin() {
    const start = JSON.stringify(this.spinValue);
    const { compass, heading } = this.state;

    let rot = +start;
    const rotM = rot % 360;

    if (rotM < 180 && compass > rotM + 180) rot -= 360;
    if (rotM >= 180 && compass <= rotM - 180) rot += 360;

    rot += compass - rotM;

    Animated.timing(this.spinValue, {
      toValue: rot,
      duration: 300,
      //easing: Easing.easeInOut,
    }).start();
  }

  render() {
    const {
      global: { beacons },
      navigation,
    } = this.props;

    const { latitude, longitude, compass } = this.state;
    const id = navigation.getParam('id', '');
    const beacon = beacons.find(b => b.key === id);

    return (
      <View style={styles.container}>
        <View style={styles.green}>
          <MainTitle title={beacon.title} voltage={beacon.voltage} />
        </View>
        <View style={styles.red} />
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
