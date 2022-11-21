import React, { useEffect, useState, useRef } from 'react';
import { AsyncStorage } from 'react-native';
import { SafeAreaView, Text, TextInput, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { auth } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import LottieView from 'lottie-react-native';

const storageKey = '@userLoginData';

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const animation = useRef(null);

    useEffect(() => {
        const retrieveData = async () => {
            try {
                animation.current?.play();
                const valueString = await AsyncStorage.getItem(storageKey);
                const value = JSON.parse(valueString);
                console.log('Retrieved user data: ', valueString);
                if (value != null) {
                    setEmail(value.email);
                    setPassword(value.password);
                    loginUser(value.email, value.password);
                }
            } catch (error) {
                console.log('Could not retrive user. ' + error);
            }
        }
        retrieveData();
    }, [])

    const loginUser = async (email, password) => {
        //animation.current?.pause();
        console.log('logging in', email, password)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('logged in user: ', user.email);
            })
            .then(() => {
                if (remember === true) {
                    rememberUser();
                }
                navigation.navigate("Home");
            })
            .catch(error => {
                alert(error);
                //animation.current?.play();
            });
    }

    const rememberUser = async () => {
        try {
            const userInfo = {
                email: email,
                password: password
            }
            const jsonValue = JSON.stringify(userInfo);
            await AsyncStorage.setItem(storageKey, jsonValue);
            console.log('User remembered: ', email);
        } catch (error) {
            console.log('Could not remember user. ' + error);
        }
    };

    const registerUser = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('registered user: ', user.email, ' ', user.password);
                navigation.navigate("Home");
            })
            .catch(error => alert(error.message));
    }

    return (
        <SafeAreaView style={styles.container}>
            <LottieView
                autoplay
                ref={animation}
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require('./../../../assets/119879-mascotas-aseguradas.json')}
            />
            <TextInput
                placeholder={'Email'}
                style={styles.textInput}
                onChangeText={(value) => (setEmail(value))}
                value={email} />
            <TextInput
                placeholder={'Password'}
                style={styles.textInput}
                onChangeText={(value) => (setPassword(value))}
                value={password}
                secureTextEntry />
            <TouchableOpacity
                onPress={() => loginUser(email, password)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => registerUser()}
                style={styles.button} >
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={remember ? "#f4f3f4" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) => setRemember(value)}
                value={remember}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInput: {
        width: "80%",
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 10,
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

export default LoginScreen;