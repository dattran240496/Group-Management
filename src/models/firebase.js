import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";
import {Permissions, Notifications} from 'expo'
import firebase from "firebase"
@autobind
class FirebaseApi {
  @observable groupData = null; // info currently group
  @observable accountData = null; // info user
  @observable myGroup = null; // list group
  @observable members = null; //
}


const firebaseApi = new FirebaseApi();
export default firebaseApi;
