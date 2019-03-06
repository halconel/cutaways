import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';


export default class EditScreen extends Component {
  state = {
    title: '',
    phone: '',
  };

  render () {
    const {title, phone} = this.state;
    const { navigation } = this.props;
    const addBeacon = navigation.getParam('callBack');

    return(
    <View style={styles.container}>
      <TextInput 
        style={styles.text}
        label='Имя'
        value={title}
        onChangeText={input => this.setState({ 
          title: input,
          phone: phone 
        })}
      />
      <TextInput 
        style={styles.text}
        label='Номер телефона'
        value={phone}
        placeholder='123'
        onChangeText={input => this.setState({ 
          title: title,
          phone: input 
        })}
      />
      <Button
        style={styles.button} 
        icon="check" 
        mode="contained"
        onPress={() => addBeacon({title, phone})}>
        Сохранить
      </Button>

    </View>
  );}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    margin: 16,
  },
  button: {
    margin: 16,
  }
});