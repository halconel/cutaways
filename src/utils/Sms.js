import SendSMS from 'react-native-sms';

export default function sendGetStatus(phone) {
  SendSMS.send({
    body: 'Get status',
    recipients: [phone],
    successTypes: ['sent', 'queued'],
    allowAndroidSendWithoutReadPermission: true,
  }, (completed, cancelled, error) => {
    console.log(`SMS Callback: completed: ${completed} cancelled: ${cancelled} error: ${error}`);
  });
}
