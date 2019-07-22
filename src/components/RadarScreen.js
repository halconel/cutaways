import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Animated, Easing, Platform, Linking
} from 'react-native';
import { IconButton } from 'react-native-paper';
import RNSimpleCompass from 'react-native-simple-compass';
import Arrow from './Arrow';
import { withGlobalContext } from './GlobalContext';
import { distance, barring, angle } from '../utils/Utils';
import InputWithIcon from './InputWithIcon';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    flexDirection: 'row',
  },
  syncContainer: {
    flex: 1,
    // backgroundColor: 'red',
  },
  distanceContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  distanceText: {
    fontSize: 48,
  },
  arrowContainer: {
    flex: 4,
    // backgroundColor: 'yellow',
  },
  screenContainer: {
    flex: 1,
  },
});

const formatDistance = (dist) => {
  if (dist < 1) return `${Math.round(dist * 1000)} м.`;
  return `${Math.round(dist * 10) / 10} км.`;
};

const SyncCommand = (props) => {
  return (
    <Text>Команда маяку</Text>
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
      message: '',
    };
  }

  componentDidMount() {
    const { beacon } = this;
    // GPS
    const posHandler = (position) => {
      const { latitude, longitude } = position.coords;
      const heading = latitude && barring(latitude, longitude, beacon.lat, beacon.lon);
      this.setState({ latitude, longitude, heading });
    };
    const errHandler = error => this.setState({ error: error.message });
    const options = { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 };
    navigator.geolocation.getCurrentPosition(
      posHandler,
      errHandler,
      { enableHighAccuracy: false, timeout: 20000 },
    );
    this.watchId = navigator.geolocation.watchPosition(posHandler, errHandler, options);
    // Compass
    this._subscribe();
  }

  componentWillUpdate() {
    this.spin();
  }

  componentWillUnmount() {
    RNSimpleCompass.stop();
    navigator.geolocation.clearWatch(this.watchId);
    //this._subscription && this._subscription.stop();
    //this._subscription = null;
  }

  _toggle = () => {
    if (this._subscription) this._unsubscribe();
    else this._subscribe();
  };

  _subscribe = () => {
    const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
    RNSimpleCompass.start(degree_update_rate, (degree) => {
      this.setState({ compass: degree });
    });
    //setUpdateIntervalForType(SensorTypes.magnetometer, 250);
    //this._subscription = magnetometer.subscribe(async (sensorData) => {
    //  const { compass } = this.state;
    //  let { x, y } = sensorData;
    //  // Kalman filter
    //  x = kf_x.filter(x);
    //  y = kf_y.filter(y);
    //  // Calc angle
    //  const newAngle = angle({ x, y }) - 90;
    //  if (compass !== newAngle) this.setState({ compass: newAngle });
    //});
  };

  onChangeMessage = (message) => {
    const { id, title, phone } = this.beacon;
    this.setState({ message });
    updateBeacon({
      id,
      title,
      phone,
      message,
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
    const { latitude, longitude, message, compass, error } = this.state;
    const { beacon } = this;

    const messageHelper = 'Скопируйте в это поле текст последнего sms-сообщение от маяка.';
    return (
      <View style={styles.screenContainer}>
        <View style={styles.syncContainer}>
          <SyncCommand
            icon="map-marker"
          />
          <InputWithIcon
            icon="map-marker"
            label="Последнее сообщение от маяка"
            value={message}
            helper={messageHelper}
            multiline
            onChangeText={this.onChangeMessage}
          />
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            {`${latitude ? formatDistance(distance(latitude, longitude, beacon.lat, beacon.lon)) : 'Местоположение телефона не определено'}`}
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Arrow spinValue={this.spinValue} />
        </View>
      </View>
    );
  }
}

function onMap(label, lat, lng) {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lng}`;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url);
}

function onSync() {
  //console.log('Sync');
}

function TabButtons({ navigation, global }) {
  const title = navigation.getParam('title', 'Маяк');
  const id = navigation.getParam('id', null);
  const beacon = global.beacons.find(b => b.key === id);

  return (
    <View style={styles.tab}>
      <IconButton color="#fff" icon="map" onPress={() => onMap(title, beacon.lat, beacon.lon)} />
    </View>
  );
}

const withGlobalRadarScreen = withGlobalContext(RadarScreen);
const WithGlobalTabButton = withGlobalContext(TabButtons);

withGlobalRadarScreen.navigationOptions = ({ navigation }) => ({
  title: 'Поиск',
  headerRight: <WithGlobalTabButton navigation={navigation} />,
});
export default withGlobalRadarScreen;
