import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import FloatingActionButton from '../../components/FloatingActionButton';
import PostEditWindow from '../../components/PostEditWindow';
import UserPostCard from '../../components/UserPostCard';
import { db, auth, storage } from '../../../firebaseConfig';
import { collection, getDocs, setDoc, doc, addDoc, query, where, Timestamp, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


function UserPostsScreen({ navigation }) {
    const [editWindowVisible, setEditWindowVisible] = useState(false);
    const [postData, setPostData] = useState(null);
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
            const q = query(collection(db, "posts"), where("user", "==", auth.currentUser.uid));
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

    const updatePost = async (newPostData) => {
        console.log("updating post: " + newPostData)
        console.log("setPostDatabutton\n" + postData, newPostData.id)
        //update post
        if (newPostData.image != '') {
            const assetString = 'post-images/' + newPostData.id
            const storageRef = ref(storage, assetString);

            fetch(newPostData.image)
                .then(response => {
                    return response.blob();
                })
                .then(blob => {
                    uploadBytes(storageRef, blob).then(snapshot => {
                        getDownloadURL(storageRef).then(downloadURL => {
                            console.log('Uploaded file. Download link:', downloadURL);
                            return downloadURL;
                        })
                            .then((downloadURL) => {
                                setDoc(doc(db, "posts", newPostData.id), {
                                    user: auth.currentUser.uid,
                                    title: newPostData.title,
                                    time: Timestamp.now(),
                                    desc: newPostData.desc,
                                    image: downloadURL
                                }).then(() => {
                                    retrieveData();
                                })
                            })

                            .catch((error) => {
                                console.log('Error uploading new post image.', error)
                            })
                    });
                })

        }
        else {
            retrieveData();
        }
    };

    const newPost = async (newPostData) => {

        const docRef = await addDoc(collection(db, "posts"), {
            user: auth.currentUser.uid,
            title: newPostData.title,
            time: Timestamp.now(),
            desc: newPostData.desc,
            image: ''
        });
        console.log("Post written with ID: ", docRef.id);


        if (newPostData.image != '') {
            const assetString = 'post-images/' + docRef.id
            const storageRef = ref(storage, assetString);

            fetch(newPostData.image)
                .then(response => {
                    return response.blob();
                })
                .then(blob => {
                    uploadBytes(storageRef, blob).then(snapshot => {
                        getDownloadURL(storageRef).then(downloadURL => {
                            console.log('Uploaded file. Download link:', downloadURL);
                            return downloadURL;
                        })
                            .then((downloadURL) => {
                                setDoc(doc(db, "posts", docRef.id), {
                                    user: auth.currentUser.uid,
                                    title: newPostData.title,
                                    time: Timestamp.now(),
                                    desc: newPostData.desc,
                                    image: downloadURL
                                }).then(() => {
                                    retrieveData();
                                })
                            })

                            .catch((error) => {
                                console.log('Error uploading new post image.', error)
                            })
                    });
                })

        }
        else {
            retrieveData();
        }


    };

    const deletePost = async (post) => {
        console.log("deleting post: " + post.item.id)
        //delete post
        await deleteDoc(doc(db, "posts", post.item.id));

        if (post.item.image != '') {
            const assetString = 'post-images/' + post.item.id;
            const storageRef = ref(storage, assetString);
            deleteObject(storageRef).then(() => {
                console.log('post image deleted');
                retrieveData();
            }).catch((error) => {
                console.log('error deleting image.', error)
            });
        }
        else {
            retrieveData();
        }


    };

    return (
        <SafeAreaView style={styles.container}>
            <PostEditWindow
                visible={editWindowVisible}
                post={postData}
                buttonCancelEvent={() => setEditWindowVisible(false)}
                buttonNewPostEvent={(newPostData) => newPost(newPostData)}
                buttonUpdatePostEvent={(newPostData) => updatePost(newPostData)}
            />
            {!loading &&
                <FlatList
                    style={styles.flatlist}
                    refreshing={loading}
                    onRefresh={() => retrieveData()}
                    data={postList}
                    renderItem={(item) => (
                        <UserPostCard postData={item}
                            editEvent={() => (setEditWindowVisible(true), setPostData(item))}
                            DeleteEvent={() => deletePost(item)}
                        />
                    )}
                />
            }
            {loading &&
                <ActivityIndicator size="large" color="darkslateblue" />
            }
            <View style={styles.addButton}>
                <FloatingActionButton
                    event={() => (setEditWindowVisible(true), setPostData(null))}
                />
            </View>

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
    },
    addButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    flatlist: {
        width: '100%',
    }
});

export default UserPostsScreen;