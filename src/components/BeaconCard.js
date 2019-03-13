import React from 'react';
import {
  Title, Paragraph, Card, Button, Surface,
} from 'react-native-paper';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { default as IconMI } from 'react-native-vector-icons/MaterialIcons';
import uuidv4 from '../utils/Utils';

function getBattaryIcon(percent) {
  if (percent === undefined) return <Icon name="battery-empty" size={24} color="grey" />;
  if (percent > 0.775) return <Icon name="battery-full" size={24} color="green" />;
  if (percent > 0.55) return <Icon name="battery-three-quarters" size={24} color="green" />;
  if (percent > 0.325) return <Icon name="battery-half" size={24} color="green" />;
  if (percent > 0.1) return <Icon name="battery-quarter" size={24} color="red" />;
  return <Icon name="battery-empty" size={24} color="red" />;
}


function voltageToPercent(voltage) {
  if (voltage === undefined) return undefined;
  if (voltage > 4.19) return 1.0;
  if (voltage > 3.5) return ((voltage - 3.5) / 0.7).toFixed(2);
  return 0.0;
}

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
  propsContainer: {

  },
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

const BeaconStatus = ({ voltage, lastUpd }) => (
  <View style={styles.statusContainer}>
    {getBattaryIcon(voltageToPercent(voltage))}
    {voltage ? (
      <Paragraph style={styles.status}>
        {voltageToPercent(voltage) * 100}
        %
      </Paragraph>
    ) : (
      <Paragraph style={styles.status}>н\а</Paragraph>
    )
    }
    <IconMI style={styles.status} name="access-time" size={24} color="grey" />
    {lastUpd ? (
      <Paragraph style={styles.status}>{lastUpd}</Paragraph>
    ) : (
      <Paragraph style={styles.status}>Статус не обновлялся</Paragraph>
    )
    }
  </View>
);

const Content = ({ title, phone }) => (
  <View style={styles.propsContainer}>
    <Title>{title}</Title>
    <View style={styles.phoneContainer}>
      <IconMI name="phone" size={24} />
      <Paragraph style={styles.status}>{phone}</Paragraph>
    </View>
  </View>
);

const Actions = ({ actions }) => (
  <Card.Actions>
    {actions.map(({ name, ...buttonProps }) => <Button key={uuidv4()} {...buttonProps}>{name}</Button>)}
  </Card.Actions>
);

function performAction() {
  console.log('action');
}

function BeaconCard({
  voltage, lastUpd, title, phone, messagesCount,
}) {
  const actions = [
    {
      name: 'Поиск',
      icon: 'my-location',
      onPress: () => performAction(),
    },
    {
      name: 'Статус',
      icon: 'sync',
      onPress: () => performAction(),
    },
    {
      name: 'Редактировать',
      icon: 'edit',
      onPress: () => performAction(),
    },
  ];

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContainer}>
        <View style={styles.contentContainer}>
          <BeaconStatus voltage={voltage} lastUpd={lastUpd} />
          <Content title={title} phone={phone} />
        </View>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/no-default-thumbnail.png')} style={styles.image} />
        </View>
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
