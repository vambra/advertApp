import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Modal, TextInput, Dimensions, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';


const PostEditWindow = ({ visible, post, buttonCancelEvent, buttonNewPostEvent, buttonUpdatePostEvent }) => {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [user, setUser] = useState('');
  const [windowTitle, setWindowTitle] = useState('');
  const [buttonTitle, setButtonTitle] = useState('');
  const width = Dimensions.get('window').width * 0.9;
  const height = Dimensions.get('window').height * 0.8;

  const handleShow = async () => {
    if (post != null) {
      setPost();
      setWindowTitle('Editing Post');
      setButtonTitle('Confirm');
    }
    else {
      clearPost();
      setWindowTitle('New Post');
      setButtonTitle('Post');
    }
  };

  const setPost = async () => {
    setId(post.item.id);
    setTitle(post.item.title);
    setTime(post.item.time);
    setDesc(post.item.desc);
    setImage(post.item.image);
    setUser(post.item.user);
  }

  const clearPost = async () => {
    setId('');
    setTitle('');
    setTime('');
    setDesc('');
    setImage('');
    setUser('');
  }

  const handlePostEdit = async () => {
    const newPostData = {
      id: id,
      title: title,
      time: Timestamp.now(),
      desc: desc,
      image: image,
      user: user
    };
    console.log("handlePostEdit\n" + newPostData)
    if (post != null) {
      postUpdate(newPostData);
    }
    else {
      postCreate(newPostData);
    }
    handleClose();
  };

  const postCreate = async (newPostData) => {
    try {
      buttonNewPostEvent(newPostData);
      console.log('Post created: ');
    } catch (error) {
      console.log('Could not create post. ' + error);
    }
  };

  const postUpdate = async (newPostData) => {
    try {
      buttonUpdatePostEvent(newPostData);
      console.log('Post updated: ');
    } catch (error) {
      console.log('Could not update post. ' + error);
    }
  };

  const handleClose = async () => {
    clearPost();
    buttonCancelEvent();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView>
      <Modal
        onShow={() => handleShow()}
        animationType="fade"
        transparent visible={visible}
        presentationStyle="overFullScreen">
        <View style={styles.viewWrapper}>
          <View style={[styles.modalView, { height: height, width: width }]}>
            <View style={styles.textView}>
              <Text style={styles.title}>{windowTitle}</Text>
            </View>
            <View style={styles.inputView}>
              <TextInput
                placeholder={'Title'}
                style={styles.textInputTitle}
                onChangeText={(value) => (setTitle(value))}
                value={title} />
              <TextInput
                placeholder={'Description'}
                style={styles.textInputDesc}
                onChangeText={(value) => (setDesc(value))}
                value={desc} />
              <TouchableOpacity
                onPress={() => pickImage()}
                style={styles.button}>
                <Text style={styles.buttonTitle}>Pick an image</Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={{ width: 320, height: 240, margin: 10 }} />}
            </View>
            <View style={styles.modalButtons}>
              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={() => handleClose()}
                  style={styles.button}>
                  <Text style={styles.buttonTitle}>Cancel</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonView}>
                <TouchableOpacity
                  onPress={() => handlePostEdit()}
                  style={styles.button}>
                  <Text style={styles.buttonTitle}>{buttonTitle}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: 'darkslateblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    elevation: 5,
    height: null,
    width: null,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  buttonView: {
    width: '45%',
  },
  inputView: {
    width: '100%',
    alignItems: 'center',
  },
  textView: {
    padding: 20,
    width: '100%',
  },
  textInputTitle: {
    width: "90%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
  textInputDesc: {
    width: "90%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
});

export default PostEditWindow;