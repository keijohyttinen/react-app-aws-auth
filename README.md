
React native app (redux) Android&iOS demo offering registering and logging in authentication (+Facebook auth) by using real AWS services.
It contains fastlane script to upload apk to Hockey app

For getting AWS+FB authentication for this project, you need to setup your own AWS account and create a project, e.g. with AWS Mobile hub.
After that you can get export of AWS backend information, i.e. file aws-export.js
The file must be added into app/api/aws-export.js for app to be able to connect AWS.

# Requirements

- Mac with XCode
- React native env https://facebook.github.io/react-native/docs/getting-started.html
- yarn https://yarnpkg.com/en/

# Install dependencies

yarn install

# Make Development build in Mac

react-native run-ios

# Watch console logs

react-native log-ios

# Build and deploy android dev

npm run-script android-pkg

# Fastlane deploy for dev apk to HockeyApp

cd android; fastlane deploydev

# Make android resource bundle, i.e include assets

npm run-script bundle-android  

Note: above command may take several minutes (and it looks like nothing happens).
May speed up if delete the index.android.* files in android/app/src/main/assets/ directory

# Make android package

npm run-script build-android

# Clean android build

react-native start --reset-cache
npm run-script clean-android



--------------------------
