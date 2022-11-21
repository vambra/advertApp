import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from "./src/screens/stack_screens/LoginScreen";
import UserPostsScreen from "./src/screens/tab_screens/UserPostsScreen";
import OtherPostsScreen from "./src/screens/tab_screens/OtherPostsScreen";
import UserScreen from "./src/screens/tab_screens/UserScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={LoginScreen}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={TabHome} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabHome() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelPosition: "beside-icon",
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 15
        },
        tabBarIconStyle: { display: "none" },
      }}>
      <Tab.Screen name="My Posts" component={UserPostsScreen} />
      <Tab.Screen name="Others' Posts" component={OtherPostsScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  )
}

export default App;