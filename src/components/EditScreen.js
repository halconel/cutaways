import React, { Component, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { withGlobalContext } from './GlobalContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  iconContainer: {
    height: 56,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 16,
  },
  textContainer: {
    flex: 1,
  },
  icon: {
    flex: 0,
    marginRight: 16,
  },
  helper: {
    paddingHorizontal: 12,
    color: 'grey',
  },
  button: {
    flex: 0,
    alignSelf: 'center',
    marginTop: 16,
  }
})

function AppInput({ icon, helper, ...textProps }) {
  return (
    <View style={styles.inputContainer}>
      {icon && (
        <View style={styles.iconContainer}>
          <Icon style={styles.icon} name={icon} size={24} color="grey" />
        </View>
      )}
      <View style={styles.textContainer}>
        <TextInput {...textProps} />
        {helper && <Text style={styles.helper}>{helper}</Text>}
      </View>
    </View>
  )
}

function Form(props) {
  const {
    title,
    phone,
    onChangeName,
    onChangePhone,
    onSubmit
  } = props

  const titleHelper = "Введите наименование маяка для отображения в списке.";
  const phoneHelper = "Введите номер телефона в междунароном формате. Например, +7 911 123-12-13";

  return (
    <View style={styles.formContainer}>
      <AppInput icon='tag' label='Имя' value={title} helper={titleHelper} onChangeText={onChangeName} />
      <AppInput icon='phone' label='Номер телефона' keyboardType='phone-pad' value={phone} helper={phoneHelper} onChangeText={onChangePhone} />
      <Button style={styles.button} icon="check" mode="contained" onPress={onSubmit}>
        Сохранить
      </Button>
    </View>
  )
}

class EditScreen extends Component {
  constructor(props) {
    super(props)

    const {
      title = '',
      phone = '',
      navigation,
      global: { addBeacon }
    } = props

    this.state = { title, phone }
    this.navigation = navigation
    this.addBeacon = addBeacon
  }

  onChangeName = title => this.setState({ title })
  onChangePhone = phone => this.setState({ phone })
  onSubmit = () => {
    const { title, phone } = this.state

    this.addBeacon({ title, phone })
    this.navigation.goBack()
  }

  render() {
    const { title, phone } = this.state

    return <Form title={title} phone={phone} onChangeName={this.onChangeName} onChangePhone={this.onChangePhone} onSubmit={this.onSubmit} />
  }
}

function TabButtons({ navigation, screenProps }) {
  return (
    <View style={styles.tab}>
      <IconButton color='#fff' icon='check' onPress={() => onSubmit()} />
    </View>
  );
}

const withGlobal_EditScreen = withGlobalContext(EditScreen);
withGlobal_EditScreen.navigationOptions = ({ navigation, screenProps }) => {
  return {
    title: navigation.getParam('title', 'Редактирование маяка'),
    headerRight: <TabButtons navigation={navigation} screenProps={screenProps} />
  }
}

export default withGlobal_EditScreen;