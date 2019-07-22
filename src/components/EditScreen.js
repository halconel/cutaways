import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { PropTypes } from 'prop-types';
import { withGlobalContext } from './GlobalContext';
import EditForm from './EditForm';

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'row',
  },
});

class EditScreen extends Component {
  constructor(props) {
    super(props);

    const {
      navigation,
      global: { addBeacon, updateBeacon, deleteBeacon },
    } = props;

    const title = navigation.getParam('title', '');
    const phone = navigation.getParam('phone', '');

    this.state = { title, phone, message: '', modalVisible: false };
    this.navigation = navigation;
    this.id = navigation.getParam('id', null);
    this.addBeacon = addBeacon;
    this.updateBeacon = updateBeacon;
    this.deleteBeacon = deleteBeacon;
  }

  componentWillMount() {
    // console.log('componentWillMount');
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
  };

  render() {
    const { title, phone, modalVisible, message } = this.state;

    return (
      <EditForm
        title={title}
        phone={phone}
        message={message}
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
  if (id) {
    updateBeacon({
      id,
      title,
      phone,
      message,
    });
  } else addBeacon({ title, phone, message });
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
