/*------------------------
Module
NMEA GPRMC Parser

GPRMC format:
  $GPRMC,hhmmss.ss,A,llll.ll,a,yyyyy.yy,a,x.x,x.x,ddmmyy,x.x,a*hh

  RMC  = Recommended Minimum Specific GPS/TRANSIT Data
       1    = UTC of position fix
       2    = Data status (A-ok, V-invalid)
       3    = Latitude of fix
       4    = N or S
       5    = Longitude of fix
       6    = E or W
       7    = Speed over ground in knots
       8    = Track made good in degrees True
       9    = UT date
       10   = Magnetic variation degrees (Easterly var. subtracts from true course)
       11   = E or W
       (12) = NMEA 2.3 introduced FAA mode indicator (A=Autonomous, D=Differential, E=Estimated, N=Data not valid)
       (13) = NMEA 4.10 introduced nav status
       12   = Checksum
*/

function parseTime(time, date) {

  if (time === '') {
    return null;
  }

  const ret = new Date();

  if (date) {
    const year = date.slice(4);
    const month = date.slice(2, 4) - 1;
    const day = date.slice(0, 2);

    if (year.length === 4) {
      ret.setUTCFullYear(Number(year), Number(month), Number(day));
    } else {
      // If we need to parse older GPRMC data, we should hack something like
      // year < 73 ? 2000+year : 1900+year
      // Since GPS appeared in 1973
      ret.setUTCFullYear(Number(`20${year}`), Number(month), Number(day));
    }
  }

  ret.setUTCHours(Number(time.slice(0, 2)));
  ret.setUTCMinutes(Number(time.slice(2, 4)));
  ret.setUTCSeconds(Number(time.slice(4, 6)));

  // Extract the milliseconds, since they can be not present, be 3 decimal place, or 2 decimal places, or other?
  const msStr = time.slice(7);
  const msExp = msStr.length;
  let ms = 0;
  if (msExp !== 0) {
    ms = parseFloat(msStr) * (10 ** (3 - msExp));
  }
  ret.setUTCMilliseconds(Number(ms));

  return ret;
}

function parseRMCGLLStatus(status) {

  switch (status) {
    case 'A':
      return 'active';
    case 'V':
      return 'void';
    case '':
      return null;
  }
  throw new Error(`INVALID RMC/GLL STATUS: ${status}`);
}

function parseCoord(coord, dir) {
  // Latitude can go from 0 to 90; longitude can go from -180 to 180.
  if (coord === '') { return null; }

  let n, sgn = 1;

  switch (dir) {

    case 'S':
      sgn = -1;
    case 'N':
      n = 2;
      break;

    case 'W':
      sgn = -1;
    case 'E':
      n = 3;
      break;
  }

  /*
   * Mathematically, but more expensive and not numerical stable:
   *
   * raw = 4807.038
   * deg = Math.floor(raw / 100)
   *
   * dec = (raw - (100 * deg)) / 60
   * res = deg + dec // 48.1173
   */

  return sgn * (parseFloat(coord.slice(0, n)) + parseFloat(coord.slice(n)) / 60);
}

function parseKnots(knots) {
  if (knots === '') { return null; }

  return parseFloat(knots) * 1.852;
}

function parseNumber(num) {
  if (num === '') {
    return null;
  }
  return parseFloat(num);
}

function parseRMCVariation(vari, dir) {
  if (vari === '' || dir === '') { return null; }

  const q = (dir === 'W') ? -1.0 : 1.0;

  return parseFloat(vari) * q;
}

function parseFAA(faa) {
  // Only A and D will correspond to an Active and reliable Sentence

  switch (faa[0]) {
    case '':
      return null;
    case 'A':
      return 'autonomous';
    case 'D':
      return 'differential';
    case 'E':
      return 'estimated'; // dead reckoning
    case 'M':
      return 'manual input';
    case 'S':
      return 'simulated';
    case 'N':
      return 'not valid';
    case 'P':
      return 'precise';
    case 'R':
      return 'rtk'; // valid (real time kinematic) RTK fix
    case 'F':
      return 'rtk-float'; // valid (real time kinematic) RTK float
  }
  throw new Error(`INVALID FAA MODE: ${faa}`);
}

function parseGPRS(msg) {
  const rmc = msg.split(',');
  if (rmc.length < 13) return {};
  return {
    time: parseTime(rmc[0], rmc[8]),
    status: parseRMCGLLStatus(rmc[1]),
    lat: parseCoord(rmc[2], rmc[3]),
    lon: parseCoord(rmc[4], rmc[5]),
    speed: parseKnots(rmc[6]),
    track: parseNumber(rmc[7]), // heading
    variation: parseRMCVariation(rmc[9], rmc[10]),
    faa: rmc.length > 12 ? parseFAA(rmc[11]) : null,
    navStatus: rmc.length > 13 ? rmc[12] : null,
  };
}

function parseGSM(msg) {
  return {};
}

function parseMovement(mvt) {
  switch (mvt) {
    case '':
      return { mvt: null };
    case 'M':
      return { mvt: 'is mooving' };
    case 'S':
      return { mvt: 'standing still' };
  }
  throw new Error(`INVALID MOOVING STATUS: ${mvt}`);
}

function parseCharging(chrg) {
  switch (chrg) {
    case '':
      return null;
    case 'R':
      return 'discharging';
    case 'M':
      return 'charging';
  }
  throw new Error(`INVALID BATTARY STATUS: ${chrg}`);
}

function parseBattary(msg) {
  const btr = msg.split(',');
  if (btr.length < 2) return {};
  return {
    voltage: parseNumber(btr[0]) / 100,
    charging: parseCharging(btr[1]),
  };
}

export function parseMatches(mathces) {
  return {
    ...parseGPRS(mathces[1]),
    ...parseGSM(mathces[2]),
    ...parseMovement(mathces[3]),
    ...parseBattary(mathces[4]),
  };
}

export function getMatches(msg) {
  const regex = /^\$GP[A-Z]{3},(.*?\* [0-9A-F]{2},[0-9A-F]{2});.*GSM: (.*?);.*(\w);.*Batt: (\d*?,\w)/gm;
  return regex.exec(msg);
}
