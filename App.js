import React from "react";
import "react-native-gesture-handler";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Home, Resto, Order } from "./screens";
import Tabs from "./navigation/Tabs";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={"home"}>
        <Stack.Screen name="home" component={Tabs} />
        <Stack.Screen name="resto" component={Resto} />
        <Stack.Screen name="order" component={Order} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
