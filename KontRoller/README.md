npm install -g react-native-cli

After cloning,
move android and ios folders out,
run react-native eject, then move them back in

If your code changes are not reflected, run:
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

To see the console log:
npx react-native log-android 

cd android
./gradlew wrapper

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

Building signed apk/bundle from android studio directly might not work. I mean, the building itself works, but the generated apk doesn't always work properly. You need to follow these instructions, if so: `https://reactnative.dev/docs/signed-apk-android`

For iOS:
https://github.com/innoveit/react-native-ble-manager
Info.plist: In iOS >= 13 you need to add the NSBluetoothAlwaysUsageDescription string key.


## Android release requirements (2026)

The Android release is maintained in this checkout. The current release is
1.08 (version code 108), package com.soadzoor.kontroller. Google Play's highest
uploaded version was confirmed as 105 before preparing this update. Keep every
new upload's version code higher than all codes already uploaded to any track.
The prior 1.07 / React Native 0.81 bundle is retained separately as a fallback.

Runtime libraries (latest stable versions checked 2026-10-29):
- React Native 0.88.1 and React 19.3.1
- react-native-ble-manager 12.6.0
- @react-native-async-storage/async-storage 3.1.1
- @react-native-picker/picker 2.11.4
- react-native-safe-area-context 5.11.0
- aes-js 3.1.2 (latest stable; unchanged)

Build requirements:
- Node.js ^22.13.0, ^24.3.0, or >=26.0.0; JDK 17
- Android SDK platform 37.0, Build Tools 37.0.0, NDK 27.1.12297006,
  CMake 3.22.1; set the SDK path in android/local.properties
- Gradle 9.4.1 / AGP 9.2.1 / Kotlin 2.2.10 are selected by the matching
  React Native template and plugin
- The app compiles against API 37 and targets API 36; minimum API remains 24
- Hermes and the New Architecture are enabled. Legacy Android DSL/Kotlin flags
  follow the official template for library compatibility with AGP 9.
- Development tooling is matched to React Native's template: TypeScript 6.0.3,
  Jest 29 with @react-native/jest-preset 0.88.1, and ESLint 8.57.1.

Install JavaScript packages with npm ci. The BLE migration uses the new scan
options object, the library's actual peripheral/notification event types, and
removes native event listeners on provider unmount. Async Storage's default
compatibility export is retained so existing v2 stored settings remain readable.

Copy android/signing.properties.example to android/signing.properties and enter
the EXISTING upload key credentials locally. The real signing file and private
keys are ignored by Git. The alias is detected automatically for a single-key
keystore if left blank; a blank key password reuses the store password. The
MYAPP_UPLOAD_* environment/Gradle properties are also supported. An ordinary
release build requires valid upload signing credentials. Unsigned output can be
requested only for local inspection with -PallowUnsignedRelease=true.

On Windows, run scripts/build-android-release.ps1 from PowerShell. It keeps
Gradle caches short and build temporary files within the project, avoiding the
old Ninja path-length limit and restricted-shell temporary-file move errors.
Override the next release number with -VersionCode 109 -VersionName 1.09.
The script produces:
- android/app/build/outputs/bundle/release/app-release.aab (Play upload)
- android/app/build/outputs/apk/release/app-release.apk (direct test install)

For ordinary environments, gradlew.bat :app:bundleRelease :app:assembleRelease
also works from android/ (./gradlew on Linux/macOS). Keep Gradle cache paths
short on Windows. JavaScript and image assets are generated by Gradle; do not
commit a manual index.android.bundle or generated src_components_icon_* images.

Validation:
- npm run ts-check
- node node_modules/jest/bin/jest.js --runInBand
- python scripts/verify_android_pages.py path/to/app-release.aab
- Validate the signed AAB with official bundletool and generate an APK from it.
  Check that generated APK with both the ELF checker and Android Build Tools
  zipalign -c -P 16 -v 4. ELF and ZIP alignment are separate checks.
- Verify the AAB signing certificate matches the existing upload keystore.
- Before production, test startup, permission denial/retry, scanning, connecting,
  reading scooter state, notifications, reconnection, and controls on a physical
  device. Verify saved language/scooter names survive an upgrade installation.
  Also test runtime operation on a 16 KB device or emulator.

Upload and publish through Play Console after testing. Developer/package
verification is separate from target API and native-page-size requirements.
