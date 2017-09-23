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
import firebase from "./api/api";
async function setData(item) {
  try {
    await AsyncStorage.setItem("@user:key", JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
}
async function getUserInfo(accessToken, itemRefs) {
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
      setData(responseJS);
      itemRefs.child("Account").child(responseJS.id).update({
        email: responseJS.email
      });
        return Actions.checkAttendance({ user: responseJS, type: "replace" });
    })
    .catch(error => {
      console.error(error);
    });
}
async function signInWithGoogleAsync(itemRefs) {
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
      return getUserInfo(result.accessToken, itemRefs);
    } else {
      return Actions.login({type: 'replace'});
    }
  } catch (e) {
    return Actions.login({type: 'replace'});
  }
}
async function fetchAsync(itemRefs) {
  Actions.loading({ type: "replace" });
  try {
    let value = await AsyncStorage.getItem("@user:key");
    value = JSON.parse(value);
    if (value !== null) {
        return Actions.checkAttendance({ user: value, type: "replace"});
    } else return signInWithGoogleAsync(itemRefs);
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
    this.itemRefs = firebase.database().ref("app_expo");
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            width: 150,
            height: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#e1e1e1",
            justifyContent: "center",
            alignItems: "center"
          }}
          onPress={() => fetchAsync(this.itemRefs)}
        >
          <Text
            style={{
              fontSize: 15
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
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
