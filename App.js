import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, SafeAreaView } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";

const App = () => {
  const [yourLocation, setYourLocation] = useState();
  const [locations, setLocations] = useState([])
  const [errorMsg, setErrorMsg] = useState();

  const getYourLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
    }

    let locate = await Location.getCurrentPositionAsync({});
    setYourLocation({
      latitude: locate.coords.latitude,
      longitude: locate.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    });
  }
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        setLocations([...locations], result.uri)
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  useEffect(() => {
    getYourLocation()
  }, []);
  
  useEffect(() => {
    getPermissionAsync()
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (yourLocation) {
    text = JSON.stringify(yourLocation);
  }

  console.log("location", yourLocation)

  return (
    <MapView
      style={styles.container}
      initialRegion={yourLocation}
    // onLongPress={ (event) => console.log(event.nativeEvent.coordinate) }
    >
      <Marker
        title="You're here!"
        pinColor="red"
        coordinate={yourLocation}
      />
      {locations.map((item, id) => {
        return (
          <Marker
            key={id}
            coordinate={item.coordinate}
          >
            <Callout tooltip={false}
              alphaHitTest={true}>
              <Text>Marker {id}</Text>
              <Button title="Pick an image from camera roll" onPress={() => _pickImage(id)} />
              {item.image && <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />}
            </Callout>
          </Marker>
        );
      })}
    </MapView>

  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});