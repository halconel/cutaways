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

class BeaconCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      phone: props.phone,
      pos: props.pos,
      lastUpd: props.lastUpd,
      voltage: props.voltage,
      photo: props.photo,
      messagesCount: props.messagesCount,
    };
  }

  render() {
    return (
      <Card style={styles.card}>
        <Card.Content style={styles.description}>
          <View style={styles.text}>
            <View style={styles.status}>
              {getBattaryIcon(voltageToPercent(this.state.voltage))}
              <Paragraph style={styles.date}>{this.state.lastUpd}</Paragraph>
            </View>

            <Title>{this.state.title}</Title>
            <Paragraph>{this.state.phone}</Paragraph>
            <Paragraph>{this.state.pos}</Paragraph>
          </View>
          <Image source={require('../../assets/pasport1.jpg')} style={styles.image} />
        </Card.Content>

        <Card.Actions>
          <Button>Поиск</Button>
          <Button>Статус</Button>
          <Button>Редактировать</Button>
        </Card.Actions>
        {this.state.messagesCount > 0 && (
          <Surface style={styles.surface}>
            <Text style={{ color: 'white' }}>{this.state.messagesCount}</Text>
          </Surface>
        )}
      </Card>
    );
  }
}

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

export default BeaconCard;
