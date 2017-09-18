import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated, AsyncStorage } from "react-native";
import { Actions, Router, Scene } from "react-native-mobx";
import { observer } from "mobx-react/native";

@autobind
@observer
export default class User extends Component {
  @observable user = {};
  @observable isAuthenticated = false;
  constructor(props) {
    super(props);
    this.state = {};
  }
}
async function fetchAsync() {
  try {
    let value = await AsyncStorage.getItem("@user:key");
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return false;
  }
  return {};
}
