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
import firebase from "./api/api";
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
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="Message..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 100,
            padding: 10,
            fontSize: 15,
            borderColor: "#e1e1e1",
            borderWidth: 1,
            fontStyle: this.state.message !== "" ? "normal" : "italic"
          }}
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
            this.postMessage();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 150,
            height: 50,
            marginTop: 20,
            borderRadius: 5,
            borderColor: "#e1e1e1",
            borderWidth: 1
          }}
        >
          <Text>Post Message</Text>
        </TouchableOpacity>
      </View>
    );
  }
  postMessage() {
    console.log(this.FirebaseApi.members);
    Object.values(this.FirebaseApi.members).map((v, i) => {
      console.log(v.token);
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
  }
}
