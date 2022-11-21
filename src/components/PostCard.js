import React from "react";
import { StyleSheet, Text, Image, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const PostCard = ({ postData }) => {
    const post = postData.item;
    const width = Dimensions.get('window').width - ((styles.container.margin + styles.container.borderWidth) * 2);
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.textArea}>
                <View style={styles.topBar}>
                    <View style={styles.topBar1}>
                    <Text style={styles.title}>{post.title}</Text>
                    </View>
                    <View style={styles.topBar2}>
                        <Text style={styles.time}>{post.time}</Text>
                        <Text style={styles.user}>{post.user}</Text>
                    </View>
                </View>
                <Text>{post.desc}</Text>
            </View>
            {(post.image != '') &&
                <View style={styles.icon}>
                    <Image
                        style={[styles.stretch, { width: width }]}
                        source={{ uri: post.image }}
                    />
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: 'grey',
        borderWidth: 2,
    },
    topBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topBar1: {
        flex: 6,
    },
    topBar2: {
        flex: 4,
    },
    title: {
        fontSize: 20
    },
    time: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'right',
    },
    user: {
        fontSize: 15,
        color: 'grey',
        textAlign: 'right',
    },
    textArea: {
        width: '100%',
        padding: 5,
        marginTop: -25,
    },
    icon: {
        width: '100%',
    },
    stretch: {
        height: 200,
        resizeMode: 'cover',
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
    },
});

export default PostCard;