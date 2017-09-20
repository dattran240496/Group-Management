import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";

@autobind
class FirebaseApi {
  @observable groupData = [];
  @observable accountData = [];
}
const firebase = new FirebaseApi();
export default firebase;
