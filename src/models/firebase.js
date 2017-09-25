import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";

@autobind
class FirebaseApi {
    constructor(){}
  @observable groupData;
  @observable accountData = [];
  @observable myGroup;
}
const firebaseApi = new FirebaseApi();
export default firebaseApi;
