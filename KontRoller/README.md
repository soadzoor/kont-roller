If you don't have "android" and "ios" folders, run this command
react-native upgrade


As per: https://stackoverflow.com/questions/43723958/react-native-android-project-not-found-maybe-run-react-native-android-first

For android:
If the bluetooth scan doesn't seem to be working: make sure you have all these permissions in AndroidManifest.xml:
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

For portrait mode only, add this to the "activity" in AndroidManifest: android:screenOrientation="portrait"


For iOS:
https://github.com/innoveit/react-native-ble-manager
Info.plist: In iOS >= 13 you need to add the NSBluetoothAlwaysUsageDescription string key.
