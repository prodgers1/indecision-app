import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as signalR from '@microsoft/signalr';
import IndecisionApi from './src/api/IndecisionApi';
import Home from './src/components/Home/Home';
import CreateRoom from './src/components/CreateRoom/CreateRoom';
import * as Constants from './src/Constants';
import ShareRoom from './src/components/ShareRoom/ShareRoom';
import DataStore from './src/store/DataStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(IndecisionApi.getBaseApiUrl())
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    conn.start().then(() => {
      setConnection(conn);
    });
  }, []);

  const HomeScreenComponent = ({ navigation }) => {
    return (
      <View style={styles.container}>
        {connection != null && <Home navigation={navigation} connection={connection} />}
        {connection == null && (
          <View>
            <Text>Unable to connect to the server. Please close the app and try again.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name={Constants.ROUTES.Home} component={HomeScreenComponent} title="Indecision" />
        <Stack.Screen name={Constants.ROUTES.CreateRoom} component={CreateRoom} title="Create Room" />
        <Stack.Screen name={Constants.ROUTES.ShareRoom} component={ShareRoom} title="Share Room" />
      </Stack.Navigator>
    </NavigationContainer>
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
