export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

export function distance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const la1 = degreesToRadians(lat1);
  const la2 = degreesToRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(la1) * Math.cos(la2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function barring(lat1, lon1, lat2, lon2) {
  const dLon = degreesToRadians(lon2 - lon1);

  const la1 = degreesToRadians(lat1);
  const la2 = degreesToRadians(lat2);

  const y = Math.sin(dLon) * Math.cos(la2);
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon);
  return Math.round(radiansToDegrees(Math.atan2(y, x)));
}

export function angle(magnetometer) {
  if (magnetometer) {
    const { x, y } = magnetometer;

    if (Math.atan2(y, x) >= 0) {
      return Math.round(Math.atan2(y, x) * (180 / Math.PI));
    }
    return Math.round((Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI));
  }
  return 0;
}
