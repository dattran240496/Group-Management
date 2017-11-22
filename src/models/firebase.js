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
  @observable groupData; // info currently group
  @observable accountData; // info user
  @observable myGroup; // list group
  @observable members; //
}


const firebaseApi = new FirebaseApi();
export default firebaseApi;
