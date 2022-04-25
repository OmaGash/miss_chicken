import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { icons, COLORS, SIZES, FONTS, GOOGLE_API_KEY } from "../constants";
import { CardAnimationContext } from "@react-navigation/stack";
import MapViewDirections from "react-native-maps-directions";

const Order = ({ route, navigation }) => {
  const mapView = React.useRef();
  const [resto, setResto] = React.useState(null);
  const [street, setStreet] = React.useState("");
  const [fromLoc, setFromLoc] = React.useState(null);
  const [toLoc, setToLoc] = React.useState(null);
  const [region, setRegion] = React.useState(null);
  const [duration, setDuration] = React.useState(0);
  const [isReady, setIsReady] = React.useState(false);
  const [angle, setAngle] = React.useState(0);

  React.useEffect(() => {
    let { restaurant, currentLocation } = route.params;
    let fromLocation = currentLocation.gps;
    let toLocation = restaurant.location;
    let streetName = currentLocation.streetName;
    let mapRegion = {
      latitude: (fromLocation.latitude + toLocation.latitude) / 2,
      longitude: (fromLocation.longitude + toLocation.longitude) / 2,
      latitudeDelta: Math.abs(fromLocation.latitude - toLocation.latitude) * 2,
      longitudeDelta:
        Math.abs(fromLocation.longitude - toLocation.longitude) * 2,
    };
    setResto(restaurant);
    setStreet(streetName);
    setFromLoc(fromLocation);
    setToLoc(toLocation);
    setRegion(mapRegion);
  }, []);

  function calculateAngle(coordinates) {
    let startLat = coordinates[0]["latitude"];
    let startLng = coordinates[0]["longitude"];
    let endLat = coordinates[1]["latitude"];
    let endLng = coordinates[1]["longitude"];
    let dx = endLat - startLat;
    let dy = endLng - startLng;

    return (Math.atan(dy, dx) * 180) / Math.PI;
  }

  function zoom(option) {
    let multiplier = 0;
    switch (option) {
      case "in":
        multiplier = 0.5;
        break;

      case "out":
        multiplier = 2;
        break;
    }
    let newRegion = {
      latitude: region.latitude,
      longitude: region.longitude,
      latitudeDelta: region.latitudeDelta * multiplier,
      longitudeDelta: region.longitudeDelta * multiplier,
    };

    setRegion(newRegion);
    mapView.current.animateToRegion(newRegion, 200);
  }

  function renderMap() {
    const destinationMarker = () => (
      <Marker coordinate={toLoc}>
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.white,
          }}>
          <View
            style={{
              height: 30,
              width: 30,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
            }}>
            <Image
              source={icons.pin}
              style={{ width: 25, height: 25, tintColor: COLORS.white }}
            />
          </View>
        </View>
      </Marker>
    );
    const carIcon = () => (
      <Marker
        coordinate={fromLoc}
        anchor={{ x: 0.5, y: 0.5 }}
        flat={true}
        rotation={angle}>
        <Image source={icons.car} style={{ width: 40, height: 40 }} />
      </Marker>
    );
    return (
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapView}
          provider={PROVIDER_GOOGLE}
          region={region}
          style={{ flex: 1 }}>
          <MapViewDirections
            onReady={(result) => {
              setDuration(result.duration);
              if (!isReady) {
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: SIZES.width / 20,
                    bottom: SIZES.height / 4,
                    left: SIZES.width / 20,
                    top: SIZES.height / 8,
                  },
                });
                let nextLoc = {
                  latitude: result.coordinates[0]["latitude"],
                  longitude: result.coordinates[0]["longitude"],
                };

                if (result.coordinates.length >= 2) {
                  let angle = calculateAngle(result.coordinates);
                  setAngle(angle);
                }

                setFromLoc(nextLoc);
                setIsReady(true);
              }
            }}
            origin={fromLoc}
            destination={toLoc}
            apikey={GOOGLE_API_KEY}
            strokeWidth={5}
            strokeColor={COLORS.primary}
            optimizeWaypoint={true}
          />
          {destinationMarker()}
          {carIcon()}
        </MapView>
      </View>
    );
  }

  function renderHeader() {
    return (
      <View
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}>
          <Image
            source={icons.red_pin}
            style={{ width: 30, height: 30, marginRight: SIZES.padding }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ ...FONTS.body3 }}>{street}</Text>
          </View>
          <Text style={{ ...FONTS.body3 }}>{Math.ceil(duration)} mins</Text>
        </View>
      </View>
    );
  }

  function renderInfo() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View
          style={{
            width: SIZES.width * 0.9,
            paddingVertical: SIZES.padding * 3,
            paddingHorizontal: SIZES.padding * 2,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.white,
          }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 25 }}
              source={resto?.courier.avatar}
            />
            <View style={{ flex: 1, marginLeft: SIZES.padding }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ ...FONTS.h4 }}>{resto?.courier.name}</Text>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={icons.star}
                    style={{
                      width: 18,
                      height: 18,
                      tintColor: COLORS.primary,
                      marginRight: SIZES.padding,
                    }}
                  />
                  <Text style={{ ...FONTS.body3 }}>{resto?.rating}</Text>
                </View>
              </View>
              <Text style={{ color: COLORS.darkgray, ...FONTS.body4 }}>
                {resto?.name}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: SIZES.padding * 2,
              justifyContent: "space-between",
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("home")}
              style={{
                flex: 1,
                height: 50,
                marginRight: 10,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}>
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                flex: 1,
                height: 50,
                width: SIZES.width * 0.5 - SIZES.padding * 6,
                backgroundColor: COLORS.secondary,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}>
              <Text style={{ ...FONTS.h4, color: COLORS.white }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function renderButtons() {
    return (
      <View
        style={{
          position: "absolute",
          bottom: SIZES.height * 0.35,
          right: SIZES.padding * 2,
          width: 60,
          height: 130,
          justifyContent: "space-between",
        }}>
        <TouchableOpacity
          onPress={() => zoom("in")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text style={{ ...FONTS.body1 }}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => zoom("out")}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.white,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text style={{ ...FONTS.body1 }}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderMap()}
      {renderHeader()}
      {renderInfo()}
      {renderButtons()}
    </View>
  );
};

export default Order;
