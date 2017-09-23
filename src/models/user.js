import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated, AsyncStorage } from "react-native";
import { Actions, Router, Scene } from "react-native-mobx";
import { observer } from "mobx-react/native";

@autobind
class User{
  constructor(){}
  @observable user;
  @observable isAuthenticated = false;

}

const user = new User();
export default user;