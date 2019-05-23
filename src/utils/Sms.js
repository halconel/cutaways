import SendSMS from 'react-native-sms';

export default function getStatus(phone) {
  SendSMS.send({
    body: 'The default body of the SMS!',
    recipients: ['0123456789', '9876543210'],
    successTypes: ['sent', 'queued'],
    allowAndroidSendWithoutReadPermission: true
  }, (completed, cancelled, error) => {

    console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

  });
}