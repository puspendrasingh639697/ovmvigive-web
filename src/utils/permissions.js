
// utils/permissions.js
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';

export const requestCamAudioPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      // Android permissions
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      ]);

      const grantedCamera = permissions[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED;
      const grantedAudio = permissions[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;

      console.log('Android Permissions:', {
        camera: grantedCamera,
        audio: grantedAudio
      });

      if (!grantedCamera || !grantedAudio) {
        console.log('Android permissions denied');
        return false;
      }

      return true;
      
    } else {
      // iOS - Use mediaDevices API to trigger native iOS permissions
      try {
        const { mediaDevices } = require('react-native-webrtc');
        
        // This will automatically show iOS permission dialogs
        const stream = await mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: true
        });
        
        if (stream) {
          // Immediately stop the stream as we just needed permissions
          stream.getTracks().forEach(track => track.stop());
          return true;
        }
        return false;
      } catch (error) {
        console.log('iOS permission denied:', error);
        return false;
      }
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
};

export const requestAudioOnlyPermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.MODIFY_AUDIO_SETTINGS,
      ]);
      
      return (
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // iOS audio only
      try {
        const { mediaDevices } = require('react-native-webrtc');
        const stream = await mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false
        });
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          return true;
        }
        return false;
      } catch (error) {
        console.log('iOS audio permission denied:', error);
        return false;
      }
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};