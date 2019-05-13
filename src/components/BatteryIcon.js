import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export function voltageToPercent(voltage) {
  if (voltage === undefined) return undefined;
  if (voltage > 4.19) return 1.0;
  if (voltage > 3.5) return ((voltage - 3.5) / 0.7).toFixed(2);
  return 0.0;
}

export function getBatteryIcon(voltage) {
  const percent = voltageToPercent(voltage);

  if (percent === undefined) return <Icon name="battery-empty" size={24} color="grey" />;
  if (percent > 0.775) return <Icon name="battery-full" size={24} color="green" />;
  if (percent > 0.55) return <Icon name="battery-three-quarters" size={24} color="green" />;
  if (percent > 0.325) return <Icon name="battery-half" size={24} color="green" />;
  if (percent > 0.1) return <Icon name="battery-quarter" size={24} color="red" />;
  return <Icon name="battery-empty" size={24} color="red" rotate={90} />;
}
