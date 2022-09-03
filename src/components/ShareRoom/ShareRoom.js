import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View, StyleSheet, Linking, Dimensions, Pressable } from 'react-native';
import DataStore from '../../store/DataStore';

const ShareRoom = ({ route, navigation }) => {
  const [searchData, setSearchData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      let data = await DataStore.getSearchData();
      setSearchData(data);
    };
    getData();
  }, []);

  return <View>{searchData != null && <Text>Share room code: {searchData.RoomId}</Text>}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default ShareRoom;
