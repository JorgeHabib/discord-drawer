import React from 'react';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import Routes from './src/routes';

const App: React.FC = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#c3c3c3' }}>
      <StatusBar style="auto" />
      <Routes />
    </View>
  );
};
export default App;
