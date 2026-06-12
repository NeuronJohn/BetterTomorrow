@echo off
echo Checking Expo dependency compatibility...
npx expo install --fix
npx expo-doctor
pause
