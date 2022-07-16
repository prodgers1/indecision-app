import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_ROOM_DATA = 'SEARCH_ROOM_DATA';

export default {
  async setSearchData(data) {
    await SaveItem(SEARCH_ROOM_DATA, data);
  },
  async getSearchData() {
    return await GetItem(SEARCH_ROOM_DATA);
  },
};

async function SaveItem(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log(e);
  }
}

async function GetItem(key) {
  try {
    const data = await AsyncStorage.getItem(key);
    return JSON.parse(data);
  } catch (e) {
    console.log(e);
  }
}
