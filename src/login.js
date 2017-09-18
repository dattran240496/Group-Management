import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import Loading from "./loading";
import { _ } from "lodash";

async function setData(item) {
    try {
        await AsyncStorage.setItem("@user:key", JSON.stringify(item));

    } catch (error) {console.log(error)}
}
async function getUserInfo(accessToken) {
  let _this = this;
  let userInfoResponse = await fetch(
    "https://www.googleapis.com/userinfo/v2/me",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  )
    .then(response => response.json())
    .then(responseJS => {
        console.log(responseJS)
      setData(responseJS);
      return Actions.checkAttendance({ user: responseJS, type: "replace" });
    })
    .catch(error => {
      console.error(error);
    });
}
async function signInWithGoogleAsync() {
  let _this = this;
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId:
        "796165831117-gvkmjfc8fo2756b3cascvufksetoh0rk.apps.googleusercontent.com",
      iosClientId:
        "796165831117-gcqiquek4o7a6mh2pbqovt7tnb1diphb.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    });
    if (result.type === "success") {
      return getUserInfo(result.accessToken);
    } else {
      return console.log("cancel");
    }
  } catch (e) {
    return console.log(e);
  }
}
async function fetchAsync() {
    Actions.loading({ type: "replace" });
    try {
    let value = await AsyncStorage.getItem("@user:key");
    value = JSON.parse(value);
    if (value !== null) {
      return Actions.checkAttendance({ user: value, type: "replace" });
    }
    else   return signInWithGoogleAsync();
    } catch (error) {
    return false;
  }
}
@autobind
@observer
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 50,
            backgroundColor: "red"
          }}
          onPress={fetchAsync.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
