import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../../firebaseConfig';
import PostCard from './../../components/PostCard';
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from '../../../firebaseConfig';


function OtherPostsScreen({ navigation }) {
    const [postList, setPostList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        retrieveData();
    }, [])

    const retrieveData = async () => {
        try {
            setLoading(true);
            setPostList([]);
            var newPostList = [];
            const q = query(collection(db, "posts"), where("user", "!=", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const newObj = {
                    id: doc.id,
                    user: doc.data().user,
                    title: doc.data().title,
                    time: doc.data().time.toDate().toUTCString(),
                    desc: doc.data().desc,
                    image: doc.data().image
                }
                newPostList.push(newObj)
            });
            console.log('Post data retrieved.');
            setPostList(newPostList);
            setLoading(false);
        } catch (error) {
            console.log('Could not retrive data. ' + error);
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {!loading &&
                <FlatList
                    style={styles.flatlist}
                    refreshing={loading}
                    onRefresh={() => retrieveData()}
                    data={postList}
                    renderItem={(item) => (
                        <PostCard postData={item} />
                    )}
                />
            }
            {loading &&
                <ActivityIndicator size="large" color="darkslateblue" />
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flatlist: {
        width: '100%',
    }
});

export default OtherPostsScreen;