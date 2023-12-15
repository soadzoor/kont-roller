npm install -g react-native-cli

If you don't have "android" and "ios" folders, run this command
react-native upgrade

If it doesn't work, try these:
npm i react-native-eject
npm i @react-native-community/cli
react-native eject

Useful:
react-native doctor

The "ios" and "android" folders contain large, and private files, so it's not part of this public repository.


As per: https://stackoverflow.com/questions/43723958/react-native-android-project-not-found-maybe-run-react-native-android-first

For android:
If the bluetooth scan doesn't seem to be working: make sure you have all these permissions in AndroidManifest.xml:
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

For portrait mode only, add this to the "activity" in AndroidManifest: android:screenOrientation="portrait"

For icon generation, use the following: https://easyappicon.com/

You need to change versionCode, and versionName within `build.gradle` for every new play store release (careful, there are more than one file with the same name, you need the one in android/app/)

If you need to update/rename your android package, you can use this command: `npx react-native-rename "KontRoller" -b "com.soadzoor.kontroller"`


For iOS:
https://github.com/innoveit/react-native-ble-manager
Info.plist: In iOS >= 13 you need to add the NSBluetoothAlwaysUsageDescription string key.
