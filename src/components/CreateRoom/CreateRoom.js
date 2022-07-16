import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View, StyleSheet, Linking, Dimensions, Pressable } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import PriceButtonGroup from '../ButtonGroup/PriceButtonGroup';
import { SafeAreaView, ScrollView } from 'react-native-web';
import IndecisionApi from '../../api/IndecisionApi';
import * as Constants from '../../Constants';
import DataStore from '../../store/DataStore';

const Room = ({ route, navigation }) => {
  const { connection } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({});
  const [radius, setRadius] = useState(1);
  const [values, setValues] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getLocation();
      setIsLoading(false);
    })();

    navigation.setOptions({
      title: `Create Room`,
    });
  }, []);

  const getLocation = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setErrorMessage(
          'Permission to access location was denied. \n\nThis app requires location services to show restaurants in the target location. \n\nPlease enable location services for this app in the Settings of your phone.'
        );
        return;
      }
      const last = await Location.getLastKnownPositionAsync();

      if (last) {
        setLocation(last);
        setCoords({ longitude: last.coords.longitude, latitude: last.coords.latitude });
      } else {
        const current = await Location.getCurrentPositionAsync();

        setLocation(current);
        setCoords({ longitude: current.coords.longitude, latitude: current.coords.latitude });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createRoom = async () => {
    connection.off('createRoom');
    connection.on('createRoom', async (data) => {
      console.log(`Connection ID: ${data.ConnectionId}`);
      console.log(`Room ${data.RoomId} created`);

      const searchData = {
        Radius: radius,
        Latitude: coords.latitude,
        Longitude: coords.longitude,
        Prices: values,
        RoomId: data.RoomId,
        Connection: connection,
      };
      console.log(searchData);
      await DataStore.setSearchData(searchData);

      navigation.navigate(Constants.ROUTES.ShareRoom);
    });

    await IndecisionApi.createRoom(connection.connectionId);
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator animating={isLoading} />}

      {!isLoading && errorMessage != null && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <Button onPress={() => Linking.openSettings()} title="Settings" />
        </View>
      )}

      {!isLoading && errorMessage == null && location != null && (
        <View style={styles.container}>
          <View>
            <Text style={[styles.label, styles.marginLeftLarge]}>Tap on the map to set your area to search</Text>
            <MapView
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.05, // ?
                longitudeDelta: 0.02, // ?
              }}
              onPress={(e) => {
                setCoords(e.nativeEvent.coordinate);
                // console.log(e.nativeEvent.coordinate);
              }}
              style={styles.map}
            >
              <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
            </MapView>
          </View>
          <View>
            <Text style={styles.label}>
              Find restaurants within:
              {radius == 1 && ' 1 Mile'}
              {radius > 1 && ` ${radius} Miles`}
            </Text>
            <Slider
              style={styles.radiusSlider}
              value={radius}
              minimumValue={1}
              maximumValue={10}
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#FFFFFF"
              onValueChange={(r) => setRadius(r)}
              step={1}
            />
          </View>
          <View>
            <PriceButtonGroup values={values} setValues={setValues} />
          </View>
          <View>
            <Pressable style={styles.createButton} onPress={createRoom}>
              <Text style={styles.createText}>Create</Text>
            </Pressable>
          </View>
          <View>
            <Text style={styles.spacing}> </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  marginLeftLarge: {
    marginLeft: 40,
  },
  errorContainer: {
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textAlign: 'center',
    marginTop: 20,
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
  },
  radiusSlider: {
    width: Dimensions.get('window').width * 0.8,
    height: 45,
  },
  createButton: {
    borderWidth: 2,
    borderRadius: 5,
    padding: 20,
    width: Dimensions.get('window').width * 0.9,
  },
  createText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  spacing: {
    height: 50,
  },
});

export default Room;
