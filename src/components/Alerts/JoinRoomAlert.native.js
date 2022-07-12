import Dialog from 'react-native-dialog';
import { Button, View } from 'react-native';
import { useState } from 'react';
import IndecisionApi from '../../../src/api/IndecisionApi';

const JoinRoomAlert = (props) => {
  const [roomId, setRoomId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showJoinRoom = () => {
    setShowModal(true);
  };

  const handleCancelModal = () => {
    setShowModal(false);
  };

  const handleJoinRoom = async () => {
    await IndecisionApi.joinRoom(roomId, props.connection.connectionId);
    setShowModal(false);
  };

  const handleSetRoom = (room) => {
    setRoomId(room);
  };

  return (
    <View>
      <Button onPress={showJoinRoom} title="Join Room" />
      <Dialog.Container visible={showModal}>
        <Dialog.Title>Join Room</Dialog.Title>
        <Dialog.Description>Enter the Room ID you wish to join</Dialog.Description>
        <Dialog.Input onChangeText={(room) => handleSetRoom(room)} />
        <Dialog.Button label="Cancel" onPress={handleCancelModal} />
        <Dialog.Button label="Join" onPress={handleJoinRoom} />
      </Dialog.Container>
    </View>
  );
};

export default JoinRoomAlert;
