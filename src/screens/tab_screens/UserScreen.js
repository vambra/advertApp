import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AsyncStorage } from 'react-native';
import { auth } from '../../../firebaseConfig';

const storageKey = '@userLoginData';

function UserScreen({ navigation }) {

    const logoutUser = async () => {
        try {
            await AsyncStorage.removeItem(storageKey);
        } catch (error) {
            console.log('Could not forget user. ' + error);
        } finally {
            navigation.replace("Login");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text>User: {auth.currentUser.uid}</Text>
            <TouchableOpacity
                onPress={() => logoutUser()}
                style={styles.button} >
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'darkslateblue',
        marginTop: 20,
        width: '40%',
        padding: 15,
        borderRadius: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default UserScreen;