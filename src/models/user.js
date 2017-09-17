import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { Actions, Router, Scene } from "react-native-mobx";
@autobind
class User {
  constructor(props) {}
  @observable user = null;
}
