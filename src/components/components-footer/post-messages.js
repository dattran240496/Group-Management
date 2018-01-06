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
  Image,
  KeyboardAvoidingView,
    Platform
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import { __d } from "../helpers/index";
import Dash from "react-native-dash";
import Modal from "react-native-modalbox";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class PostMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      title: ""
    };
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <View
            style={{
              width: width - __d(20),
              height: __d(50),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Image
              source={require("./images/chat.png")}
              style={{
                width: __d(20),
                height: __d(20),
                resizeMode: "contain"
              }}
            />
            <Text
              style={{
                fontSize: __d(16),
                paddingLeft: __d(10)
              }}
            >
              CREATE NOTIFICATION
            </Text>
          </View>
          <Dash
            dashGap={5}
            dashLength={7}
            dashThickness={1}
            style={{ width: width - __d(21), height: __d(1) }}
          />
          <TextInput
            placeholder="Title"
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[
              styles.txt_input_mess,
              {
                fontStyle: this.state.title !== "" ? "normal" : "italic",
                height: __d(30),
                padding: 0,
                paddingLeft: __d(10)
              }
            ]}
            onChangeText={title => {
              this.setState({
                title: title
              });
            }}
            value={this.state.title}
          />
          <TextInput
            placeholder="Message"
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[
              styles.txt_input_mess,
              {
                fontStyle: this.state.message !== "" ? "normal" : "italic",
                  textAlignVertical: Platform.OS === "android" ?  "top" : null,
                  paddingTop: __d(10)
              }
            ]}
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
            <Text style={styles.btn_post_mess_txt}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    let month = (timeAtPost.getMonth() + 1).toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
    let day = timeAtPost.getDate().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
      let hours = timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
      let minutes = timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
    // format time: dd/mm/yyyy - hh:mm
    let mometTimeAtPost = moment(timeAtPost, "YYYY-MM-DDhh:mm:ss");
      let formatTime = mometTimeAtPost.format("YYYY-MM-DDhh:mm:ss");

      this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("postedMessages")
      .push()
      .set({
        message: this.state.message,
        title: this.state.title,
        timeAtPost: formatTime
      });
    this.Global.componentFooter = false;
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: width - __d(20),
    height: __d(300),
    backgroundColor: "#fff"
  },
  txt_input_mess: {
    width: width - __d(50),
    height: __d(130),
    paddingLeft: __d(10),
      paddingRight: __d(10),
    fontSize: __d(13),
    borderColor: "#5DADE2",
    borderWidth: 1,
    marginTop: __d(15)
  },
  btn_post_mess_view: {
    justifyContent: "center",
    alignItems: "center",
    width: __d(80),
    height: __d(30),
    marginTop: __d(20),
    borderRadius: __d(5),
    borderColor: "#e1e1e1",
    borderWidth: 1,
    backgroundColor: "#5DADE2"
  },
  btn_post_mess_txt: {
    color: "#fff",
    fontSize: __d(13)
  }
});
