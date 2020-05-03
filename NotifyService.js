import PushNotification from 'react-native-push-notification';
import Colors from './src/common/styles/Colors'

export default class NotifService {

  constructor(onNotification) {
    this.configure(() => { }, onNotification);

    this.lastId = 0;
  }

  configure(onRegister, onNotification, gcm = "") {
    PushNotification.configure({
      onRegister: onRegister,
      onNotification: onNotification,
      senderID: gcm,
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  static sendNotification(title, body) {
    PushNotification.localNotification({
        largeIcon: "ic_launcher",
        smallIcon: "ic_notification",
        bigText: body,
        subText: body,
        color: Colors.theme_color,
        vibrate: true,
        vibration: 300,
        tag: 'some_tag',
        group: "group",
        ongoing: false,
        priority: "high",
        visibility: "private",
        importance: "high",

        title: title,
        message: body,
        playSound: false,
        soundName: 'default',
        number: '10'
    });
  }

  static cancelAllNotificaionts() {
    PushNotification.cancelAllLocalNotifications();
  }
}