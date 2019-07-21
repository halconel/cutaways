import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PropTypes } from 'prop-types';
import InputWithIcon from './InputWithIcon';
import DeleteModal from './DeleteModal';

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
});

export default function EditForm(props) {
  const {
    title,
    phone,
    message,
    onChangeName,
    onChangePhone,
    onChangeMessage,
    visible,
    proceedDeleting,
  } = props;

  const titleHelper = 'Введите наименование маяка для отображения в списке.';
  const phoneHelper = 'Введите номер телефона в международном формате. Например, +7 911 123-12-13';
  const messageHelper = 'Скопируйте в это поле текст последнего sms-сообщение от маяка.';
  return (
    <View style={styles.formContainer}>
      <InputWithIcon
        icon="tag"
        label="Имя"
        value={title}
        helper={titleHelper}
        onChangeText={onChangeName}
      />
      <InputWithIcon
        icon="phone"
        label="Номер телефона"
        keyboardType="phone-pad"
        value={phone}
        helper={phoneHelper}
        onChangeText={onChangePhone}
      />
      <InputWithIcon
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

EditForm.propTypes = {
  title: PropTypes.string,
  phone: PropTypes.string,
  message: PropTypes.string,
  onChangeName: PropTypes.func.isRequired,
  onChangePhone: PropTypes.func.isRequired,
  onChangeMessage: PropTypes.func.isRequired,
  visible: PropTypes.bool,
  proceedDeleting: PropTypes.func,
};
