import React, { Component } from 'react';
import {
  Title, Paragraph, Card, Button, Surface,
} from 'react-native-paper';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function getBattaryIcon(percent) {
  if (percent > 0.775) return <Icon name="battery-full" size={24} color="green" />;
  if (percent > 0.55) return <Icon name="battery-three-quarters" size={24} color="green" />;
  if (percent > 0.325) return <Icon name="battery-half" size={24} color="green" />;
  if (percent > 0.1) return <Icon name="battery-quarter" size={24} color="red" />;
  return <Icon name="battery-empty" size={24} color="red" />;
}

function voltageToPercent(voltage) {
  if (voltage > 4.19) {
    return 1.0;
  }
  if (voltage > 3.5) {
    return (voltage - 3.5) / 0.7;
  }
  return 0.0;
}

const onLocate = (navigation) => {
  navigation.navigate('RadarScreen');
};

export default (BeaconCard = props => (
  <Card style={styles.card}>
    <Card.Content style={styles.description}>
      <View style={styles.text}>
        <View style={styles.status}>
          {getBattaryIcon(voltageToPercent(props.voltage))}
          <Paragraph style={styles.date}>{props.lastUpd}</Paragraph>
        </View>

        <Title>{props.title}</Title>
        <Paragraph>{props.phone}</Paragraph>
        <Paragraph>{props.pos}</Paragraph>
      </View>
      <Image source={require('../../assets/no-default-thumbnail.png')} style={styles.image} />
    </Card.Content>

    <Card.Actions>
      <Button onPress={() => onLocate(props.navigation)}>Поиск</Button>
      <Button>Статус</Button>
      <Button>Редактировать</Button>
    </Card.Actions>
    {props.messagesCount > 0 && (
      <Surface style={styles.surface}>
        <Text style={{ color: 'white' }}>{props.messagesCount}</Text>
      </Surface>
    )}
  </Card>
));

const styles = StyleSheet.create({
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
  date: {
    margin: 4,
  },
  status: {
    flexDirection: 'row',
  },
  text: {
    flex: 3,
  },
  image: {
    width: 130,
    height: 130,
  },
  description: {
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 4,
  },
  card: {
    margin: 4,
    elevation: 4,
  },
});
