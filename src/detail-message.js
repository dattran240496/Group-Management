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
  ScrollView
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class DetailMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.detailMessage
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    let idAdmin = "";
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
      });
    this.info = this.FirebaseApi.accountData[idAdmin];
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 10
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontStyle: "italic"
          }}
        >
          {this.state.message.timeAtPost}
        </Text>
        <TextInput
          style={{
            width: width - 30,
            height: 120,
            padding: 10,
            borderRadius: 10,
            borderColor: "#e1e1e1",
            borderWidth: 1,
            marginTop: 10,
            fontSize: 13
          }}
          editable={this.info.email === this.User.user.email ? true : false}
          multiline={true}
          value={this.state.message.message}
          onChangeText={txt => {
            let mess = this.state.message;
            mess.message = txt;
            this.setState({
              message: mess
            });
          }}
        />
        {this.info.email === this.User.user.email
          ? <TouchableOpacity
              onPress={() => {
                let timeAtPost = new Date(); // get time at post
                let hours =
                  timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
                let minutes =
                  timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous

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
                  let mess = this.state.message;
                  mess.timeAtPost = formatTime;
                  this.setState({
                      message: mess
                  });
                // post message + time
                this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("postedMessages")
                  .child(this.state.message.key)
                  .update({
                    message: this.state.message.message,
                    timeAtPost: formatTime
                  });
              }}
              style={{
                width: 120,
                height: 40,
                backgroundColor: "#5DADE2",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                marginTop: 15,
                marginLeft: (width - 120) / 2
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 13
                }}
              >
                Submit Message
              </Text>
            </TouchableOpacity>
          : null}
      </View>
    );
  }
}
