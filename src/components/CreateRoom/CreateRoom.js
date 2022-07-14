import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Room = ({ route, navigation }) => {
  const { roomId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `Room: ${roomId}`,
    });
  }, []);

  return (
    <View>
      <Text>Room: {roomId}</Text>
    </View>
  );
};

export default Room;
