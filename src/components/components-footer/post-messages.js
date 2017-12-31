import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  TextInput,
  Alert,
  FlatList,
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import { __d } from "../helpers/index";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class PostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <TextInput
          placeholder="Message..."
          placeholderStyle={{ color: "#e1e1e1" }}
          underlineColorAndroid="transparent"
          style={[styles.txt_input_mess, {
              fontStyle: this.state.message !== "" ? "normal" : "italic",
          }]}
          onChangeText={message => {
            this.setState({
              message: message
            });
          }}
          value={this.state.message}
          multiline={true}
        />
        <TouchableOpacity
          onPress={() => {

            this.state.message !== ""
              ? this.postMessage()
              : Alert.alert("Warning!", "Message is not empty!");
          }}
          style={styles.btn_post_mess_view}
        >
          <Text
            style={styles.btn_post_mess_txt}
          >
            Post Message
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  postMessage() {
    // send notification
    Object.values(this.FirebaseApi.members).map((v, i) => {
      fetch(this.Global.urlPushNoti, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "accept-encoding": "gzip, deflate"
        },
        body: JSON.stringify({
          to: v.token,
          sound: "default",
          body: this.state.message
        })
      })
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(e => console.log(e));
    });
    let timeAtPost = new Date(); // get time at post
    let hours = timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
    let minutes = timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous

    // format time: dd/mm/yyyy - hh:mm
    let formatTime =
      timeAtPost.getDate() +
      "/" +
      (timeAtPost.getMonth() + 1) +
      "/" +
      timeAtPost.getFullYear() +
      " - " +
      hours +
      timeAtPost.getHours() +
      ":" +
      minutes +
      timeAtPost.getMinutes();

    // post message + time
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("postedMessages")
      .push()
      .set({
        message: this.state.message,
        timeAtPost: formatTime,
      });
    this.Global.componentFooter = false;
  }
}
const styles = StyleSheet.create({
   container:{
       flex: 1,
       alignItems: "center"
   },
    txt_input_mess:{
        width: width - __d(30),
        height: __d(100),
        padding: __d(10),
        fontSize: __d(13),
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        borderRadius: __d(5),
        marginTop: __d(15)
    },
    btn_post_mess_view:{
        justifyContent: "center",
        alignItems: "center",
        width: __d(150),
        height: __d(50),
        marginTop: __d(20),
        borderRadius: __d(5),
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        backgroundColor: "#5DADE2"
    },
    btn_post_mess_txt:{
        color: "#fff",
        fontSize: __d(13)
    }
});