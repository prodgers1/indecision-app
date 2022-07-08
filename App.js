import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

export default function App() {
  const apiUrlBase = 'http://localhost:7071/api';
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(apiUrlBase)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.on('createRoom', (data) => {
      console.log(`Room ${data} created`);
    });

    conn.start().then(() => {
      setConnection(conn);
    });
  }, []);

  const createRoom = () => {
    axios.post(`${apiUrlBase}/createRoom`);
  };

  return (
    <View style={styles.container}>
      <Text>My first change!</Text>
      {connection != null && (
        <>
          <Text>Connection Id: {connection.connectionId}</Text> <Button onPress={createRoom} title="Create Room" />
        </>
      )}

      <StatusBar style="auto" />
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
