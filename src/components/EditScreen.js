import React, { Component, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal, Portal, TextInput, Button, Text, IconButton,
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
  tab: {
    flexDirection: 'row',
  },
  modalContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    margin: 16,
  },
  modalText: {
    padding: 16,
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
    title,
    phone,
    message,
    onChangeName,
    onChangePhone,
    onChangeMessage,
    visible,
    proceedDeleting
  } = props;

  const titleHelper = 'Введите наименование маяка для отображения в списке.';
  const phoneHelper = 'Введите номер телефона в междунароном формате. Например, +7 911 123-12-13';
  const messageHelper = 'Скопируйте в это поле последнее сообщение от маяка.\n(Не обязательно)';

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
      <DeleteModal visible={visible} proceedDeleting={proceedDeleting} />
    </View>
  );
}

function DeleteModal(props) {
  const { visible, proceedDeleting } = props;
  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => proceedDeleting(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Удалить маяк из списка?</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              icon="check"
              onPress={() => proceedDeleting(true)}
              style={{ flex: 1 }}
            >
              Да
            </Button>
            <Button
              icon="cancel"
              onPress={() => proceedDeleting(false)}
              style={{ flex: 1 }}
            >
              Нет
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

class EditScreen extends Component {
  constructor(props) {
    super(props);

    const {
      navigation,
      global: { addBeacon, updateBeacon, deleteBeacon },
    } = props;

    const title = navigation.getParam('title', '');
    const phone = navigation.getParam('phone', '');

    this.state = { title, phone, modalVisible: false };
    this.navigation = navigation;
    this.id = navigation.getParam('id', null);
    this.addBeacon = addBeacon;
    this.updateBeacon = updateBeacon;
    this.deleteBeacon = deleteBeacon;
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.navigation.setParams({ setModalVisible: this.setModalVisible.bind(this) });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onChangeName = (title) => {
    this.setState({ title });
    this.navigation.setParams({ title });
  };

  onChangePhone = (phone) => {
    this.setState({ phone });
    this.navigation.setParams({ phone });
  };

  onChangeMessage = (message) => {
    this.setState({ message });
    this.navigation.setParams({ message });
  };

  proceedDeleting = (confirmed) => {
    this.setState({ modalVisible: false });
    if (confirmed === true) {
      if (this.id !== null) this.deleteBeacon(this.id);
      this.navigation.goBack();
    }
  }

  render() {
    const { title, phone, modalVisible } = this.state;

    return (
      <Form
        title={title}
        phone={phone}
        onChangeName={this.onChangeName}
        onChangePhone={this.onChangePhone}
        onChangeMessage={this.onChangeMessage}
        onSubmit={this.onSubmit}
        visible={modalVisible}
        proceedDeleting={this.proceedDeleting}
      />
    );
  }
}

const onSubmit = (navigation, addBeacon, updateBeacon, id, title, phone, message) => {
  if (id) updateBeacon({ id, title, phone, message });
  else addBeacon({ title, phone, message });
  navigation.goBack();
};

const onTrash = (navigation, id, deleteBeacon) => {
  const setModalVisible = navigation.getParam('setModalVisible', null);
  if (setModalVisible) setModalVisible(true);
};

function TabButtons({ navigation, global: { addBeacon, updateBeacon, deleteBeacon } }) {
  const title = navigation.getParam('title', 'Имя не задано');
  const phone = navigation.getParam('phone', '');
  const message = navigation.getParam('message', '');
  const id = navigation.getParam('id', '');

  return (
    <View style={styles.tab}>
      <IconButton
        color="#fff"
        icon="check"
        onPress={() => onSubmit(navigation, addBeacon, updateBeacon, id, title, phone, message)}
      />
      {navigation.getParam('editing', null) && (
        <IconButton
          color="#fff"
          icon="delete"
          onPress={() => onTrash(navigation, id, deleteBeacon)}
        />
      )}
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
