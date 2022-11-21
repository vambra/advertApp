import React from "react";
import { StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const FloatingActionButton = ({ event }) => {
  const size = 80
  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  }
  const iconSize = size / 3 * 2;

  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={event}
        style={[styles.container, sizeStyle]}>
        <Icon
          name={'add'}
          color="#fff"
          size={iconSize}
        />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkslateblue',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white',
  },
});

export default FloatingActionButton;