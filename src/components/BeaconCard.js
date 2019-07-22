import React from 'react';
import {
  Title, Paragraph, Card, Button, Surface,
} from 'react-native-paper';
import {
  View, Image, Text, StyleSheet, PermissionsAndroid, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBatteryIcon, voltageToPercent } from './BatteryIcon';
import { uuidv4 } from '../utils/Utils';
import sendGetStatus from '../utils/Sms';

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
  },
  statusContainer: {
    flexDirection: 'row',
  },
  phoneContainer: {
    flexDirection: 'row',
  },
  propsContainer: {},
  contentContainer: {
    flex: 3,
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    width: 32,
    height: 32,
    position: 'absolute',
    right: 32,
    top: -16,
    padding: 8,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderRadius: 16,
  },
  status: {
    paddingLeft: 4,
  },
  image: {
    width: 128,
    height: 128,
  },
  card: {
    margin: 4,
    elevation: 4,
  },
});

const BeaconStatus = ({ voltage, lastUpd }) => {
  const battaryText = voltage ? `${voltageToPercent(voltage) * 100}%` : 'н\\а';
  const lastUpdText = lastUpd || 'Статус не обновлялся';
  return (
    <View style={styles.statusContainer}>
      {getBatteryIcon(voltage)}
      <Paragraph style={styles.status}>{battaryText}</Paragraph>
      <Icon style={styles.status} name="access-time" size={24} color="grey" />
      <Paragraph style={styles.status}>{lastUpdText}</Paragraph>
    </View>
  );
};

const Content = ({ title, phone }) => (
  <View style={styles.propsContainer}>
    <Title>{title}</Title>
    <View style={styles.phoneContainer}>
      <Icon name="phone" size={24} />
      <Paragraph style={styles.status}>{phone}</Paragraph>
    </View>
  </View>
);

const Actions = ({ actions }) => (
  <Card.Actions>
    {actions.map(({ name, ...buttonProps }) => (
      <Button key={uuidv4()} {...buttonProps}>
        {name}
      </Button>
    ))}
  </Card.Actions>
);

function performAction() {
  //console.log('action');
}

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

function onLocate(navigation, id, title) {
  requestPermission().then((resolve) => {
    const passData = { id, title };
    navigation.navigate('RadarScreen', passData);
  })
    .catch((err) => {
      //console.log('There was an error: ' + err); 
    });
}

function onGetStatus(navigation, phone) {
  sendGetStatus(phone);
  this.setState({ modalVisible: true });
}

function BeaconCard({
  id, voltage, lastUpd, title, phone, messagesCount, navigation,
}) {
  const actions = [
    {
      name: 'Поиск',
      icon: 'my-location',
      onPress: () => onLocate(navigation, id, title),
    },
    {
      name: 'SMS-команды',
      icon: 'sms',
      onPress: () => onGetStatus(navigation, phone),
    },
    {
      name: 'Изменить',
      icon: 'edit',
      onPress: () => {
        const passData = {
          id,
          title,
          phone,
          editing: true,
        };
        navigation.navigate('EditScreen', passData);
      },
    },
  ];

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <BeaconStatus voltage={voltage} lastUpd={lastUpd} />
          <Content title={title} phone={phone} />
        </View>
        {null && (
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/no-default-thumbnail.png')} style={styles.image} />
          </View>
        )}
      </Card.Content>

      <Actions actions={actions} />
      {messagesCount > 0 && (
        <Surface style={styles.surface}>
          <Text style={{ color: 'white' }}>{messagesCount}</Text>
        </Surface>
      )}
    </Card>
  );
}

export default BeaconCard;
