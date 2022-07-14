import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Platform } from 'react-native';

import IndecisionApi from '../../../src/api/IndecisionApi';
import JoinRoomAlert from '../Alerts/JoinRoomAlert';
import * as Constants from '../../Constants';

const Home = ({ connection, navigation }) => {
  useEffect(() => {
    connection.on('createRoom', (data) => {
      console.log(`Connection ID: ${data.ConnectionId}`);
      console.log(`Room ${data.RoomId} created`);
      navigation.navigate(Constants.ROUTES.CreateRoom, { roomId: data.RoomId });
    });

    connection.on('joinRoom', (data) => {
      console.log(`Connection ID ${data.ConnectionId} joining room ${data.RoomId}`);
    });
  }, []);

  const createRoom = async () => {
    await IndecisionApi.createRoom(connection.connectionId);
  };

  return (
    <View style={styles.container}>
      <Text>Indecision</Text>
      {connection != null && (
        <View style={styles.buttonContainer}>
          <Text>Connection Id: {connection.connectionId}</Text>
          <Button onPress={createRoom} title="Create Room" />
          <JoinRoomAlert connection={connection} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    margin: 10,
  },
});

export default Home;
