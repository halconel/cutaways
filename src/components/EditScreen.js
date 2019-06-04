import React, { Component, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  TextInput, Button, Text, IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withGlobalContext } from './GlobalContext';

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
  },
});

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
  );
}

function Form(props) {
  const {
    title, phone, message, onChangeName, onChangePhone, onChangeMessage,
  } = props;

  const titleHelper = 'Введите наименование маяка для отображения в списке.';
  const phoneHelper = 'Введите номер телефона в междунароном формате. Например, +7 911 123-12-13';
  const messageHelper = '(Не обязательно) Скопируйте в это поле последнее сообщение от маяка.';

  return (
    <View style={styles.formContainer}>
      <AppInput
        icon="tag"
        label="Имя"
        value={title}
        helper={titleHelper}
        onChangeText={onChangeName}
      />
      <AppInput
        icon="phone"
        label="Номер телефона"
        keyboardType="phone-pad"
        value={phone}
        helper={phoneHelper}
        onChangeText={onChangePhone}
      />
      <AppInput
        icon="map-marker"
        label="Последнее сообщение от маяка"
        value={message}
        helper={messageHelper}
        multiline
        onChangeText={onChangeMessage}
      />
    </View>
  );
}

class EditScreen extends Component {
  constructor(props) {
    super(props);

    const {
      navigation,
      global: { addBeacon, updateBeacon },
    } = props;

    const title = navigation.getParam('title', '');
    const phone = navigation.getParam('phone', '');

    this.state = { title, phone };
    this.navigation = navigation;
    this.addBeacon = addBeacon;
  }

  onChangeName = (title) => {
    this.setState({ title });
    this.navigation.setParams({ title });
  };

  onChangePhone = (phone) => {
    this.setState({ phone });
    this.navigation.setParams({ phone });
  };

  render() {
    const { title, phone } = this.state;

    return (
      <Form
        title={title}
        phone={phone}
        onChangeName={this.onChangeName}
        onChangePhone={this.onChangePhone}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const onSubmit = (navigation, addBeacon, title, phone) => {
  addBeacon({ title, phone });
  navigation.goBack();
};

function TabButtons({ navigation, global: { addBeacon } }) {
  const title = navigation.getParam('title', 'Имя не задано');
  const phone = navigation.getParam('phone', '');

  return (
    <View style={styles.tab}>
      <IconButton
        color="#fff"
        icon="check"
        onPress={() => onSubmit(navigation, addBeacon, title, phone)}
      />
    </View>
  );
}

const withGlobalEditScreen = withGlobalContext(EditScreen);
const WithGlobalTabButton = withGlobalContext(TabButtons);

withGlobalEditScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('titleNavBar', 'Редактирование маяка'),
  headerRight: <WithGlobalTabButton navigation={navigation} />,
});

export default withGlobalEditScreen;
