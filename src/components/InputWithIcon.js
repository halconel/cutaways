import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
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
});

export default function InputWithIcon({ icon, helper, ...textProps }) {
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

InputWithIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  helper: PropTypes.string.isRequired,
};
