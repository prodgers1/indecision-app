import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as signalR from '@microsoft/signalr';
import IndecisionApi from './src/api/IndecisionApi';
import Home from './src/components/Home/Home';

export default function App() {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(IndecisionApi.getBaseApiUrl())
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.start().then(() => {
      setConnection(conn);
    });
  }, []);

  return (
    <View style={styles.container}>
      {connection != null && <Home connection={connection} />}
      {connection == null && (
        <View>
          <Text>Unable to connect to the server. Please close the app and try again.</Text>
        </View>
      )}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
