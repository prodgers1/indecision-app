import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Text, View, StyleSheet, Linking, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

const Room = ({ route, navigation }) => {
  const { roomId } = route.params;

  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await getLocation();
      setIsLoading(false);
    })();

    navigation.setOptions({
      title: `Room: ${roomId}`,
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
      console.log(last);
      if (last) {
        setLocation(last);
        setCoords({ longitude: last.coords.longitude, latitude: last.coords.latitude });
      } else {
        const current = await Location.getCurrentPositionAsync();
        console.log(current);
        setLocation(current);
        setCoords({ longitude: current.coords.longitude, latitude: current.coords.latitude });
      }
    } catch (error) {
      console.log(error);
    }
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
            <Text style={styles.label}>Select an area to search</Text>
            <MapView
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.05, // ?
                longitudeDelta: 0.02, // ?
              }}
              onPress={(e) => {
                setCoords(e.nativeEvent.coordinate);
                console.log(e.nativeEvent.coordinate);
              }}
              style={styles.map}
            >
              <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />
            </MapView>
          </View>
          <View>
            <Text>Hi</Text>
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
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 16,
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
});

export default Room;
