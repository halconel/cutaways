import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Modal, Portal, Button, Text,
} from 'react-native-paper';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  modalContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    margin: 16,
  },
  modalText: {
    padding: 16,
  },
});

export default function DeleteModal(props) {
  const { visible, proceedDeleting } = props;
  return (
    <Portal>
      <Modal visible={visible} onDismiss={() => proceedDeleting(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Удалить маяк из списка?</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button icon="check" onPress={() => proceedDeleting(true)} style={{ flex: 1 }}>
              Да
            </Button>
            <Button icon="cancel" onPress={() => proceedDeleting(false)} style={{ flex: 1 }}>
              Нет
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

DeleteModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  proceedDeleting: PropTypes.func.isRequired,
};
