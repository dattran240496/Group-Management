import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Expo from "expo";
import { Actions } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";

@autobind
@observer
export default class App extends Component {
  @observable email = null;
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.signInWithGoogleAsync()}
          style={{ width: 100, height: 100, backgroundColor: "red" }}
        />
        <Text style={{ paddingTop: 10, fontSize: 12 }}>
          {this.email}
        </Text>
      </View>
    );
  }

  signInWithGoogleAsync() {
    try {
      const result = Expo.Google.logInAsync({
        androidClientId:
          "796165831117-gvkmjfc8fo2756b3cascvufksetoh0rk.apps.googleusercontent.com",
        iosClientId:
          "796165831117-gcqiquek4o7a6mh2pbqovt7tnb1diphb.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      if (result.type === "success") {
        this.getUserInfo(result.accessToken);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return console.log(e);
    }
  }
  getUserInfo(accessToken) {
    let userInfoResponse = "";
    console.log(accessToken);
    fetch("https://www.googleapis.com/userinfo/v2/me", {
      method: "GET",
      headers: { Authorization: "Bearer " + accessToken },
      "Content-Type": "application/json",
      Accept: "application/json"
    })
      .then(response => response.json())
      .then(responseJS => {
        this.email = responseJS.email;
        return;
      })
      .catch(error => {
        console.error(error);
      });
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
