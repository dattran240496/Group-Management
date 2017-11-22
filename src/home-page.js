import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  TextInput,
  Alert,
  Platform
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { Permissions, Notifications } from "expo";
const { width, height } = Dimensions.get("window");
import { _ } from "lodash";
//import registerForPushNotificationsAsync from "./api/registerForPushNotificationsAsync"
const PUSH_ENDPOINT = "https://exponent-push-server.herokuapp.com/tokens";
@autobind
@observer
export default class Homepage extends Component {
  @observable isDisable = false;
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupPass: "",
      notification: {}
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.Global = this.props.Global;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    //this.Global.modalType = "loading";
    this.props.user ? (this.User.user = this.props.user) : null;
    !this.FirebaseApi.groupData
      ? this.getGroupName()
      : (this.Global.modalType = false);
    !this.FirebaseApi.myGroup
      ? this.getMyGroup()
      : (this.Global.modalType = false);
    !this.FirebaseApi.accessToken
      ? this.getAccount()
      : (this.Global.modalType = false);
    //this.isDisable = !!(this.FirebaseApi.groupData && this.FirebaseApi.myGroup);
    //this.isDisable ? this.Global.modalType = false : null;
  }
  componentDidMount() {
    //registerForPushNotificationsAsync(this.User.user);
    //console.log(this.FirebaseApi.accountData);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Actions.enterGroupName();
            }}
            style={{
              width: 120,
              height: 50,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>New Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Actions.groupList();
            }}
            style={{
              marginTop: 10,
              width: 120,
              height: 50,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>Find Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Actions.myGroup();
            }}
            style={{
              marginTop: 10,
              width: 120,
              height: 50,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>My Group</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 10,
            justifyContent: "center",
            alignItems: "center",
            width: width
          }}
        >
          <TouchableOpacity
            style={{
              width: 100,
              height: 30,
              backgroundColor: "#e1e1e1",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 3
            }}
            onPress={() => {
              this.FirebaseApi.groupData = null;
              this.FirebaseApi.accountData = null;
              this.FirebaseApi.myGroup = null;
              AsyncStorage.removeItem("@user:key");
              Actions.login({ type: "replace" });
            }}
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  getGroupName() {
    let group = {};
    let key = {};
    this.itemRefs.child("Group").on("value", dataSnapshot => {
      this.FirebaseApi.groupData = [];
      dataSnapshot.forEach(child => {
        key = {};
        this.FirebaseApi.groupData.push({
            createdGroupBy: child.child("createdGroupBy").val(),
            groupPass: child.child("groupPass").val(),
            groupName: child.child("groupName").val(),
            key: child.key
        });
      });
      this.FirebaseApi.myGroup &&
      this.FirebaseApi.groupData &&
      this.FirebaseApi.accountData &&
      this.Global.modalType === "loading"
        ? (this.Global.modalType = false)
        : null;
    });
  }

  getMyGroup() {
    this.itemRefs
      .child("Account")
      .child(this.User.user.id)
      .child("MyGroup")
      .on("value", dataSnapshot => {
        this.FirebaseApi.myGroup = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.myGroup.push({
              groupName: child.child("groupName").val(),
              groupKey: child.key
          });
        });
        this.FirebaseApi.myGroup &&
        this.FirebaseApi.groupData &&
        this.FirebaseApi.accountData &&
        this.Global.modalType === "loading"
          ? (this.Global.modalType = false)
          : null;
      });
  }

  getAccount() {
    this.itemRefs.child("Account").on("value", dataSnapshot => {
      this.FirebaseApi.accountData = [];
      dataSnapshot.forEach(child => {
        this.FirebaseApi.accountData[child.key] = {
          email: child.child("infoAccount").child("email").val(),
          family_name: child.child("infoAccount").child("family_name").val(),
          given_name: child.child("infoAccount").child("given_name").val(),
          name: child.child("infoAccount").child("name").val(),
          picture: child.child("infoAccount").child("picture").val(),
          token: child.child("token").val()
        };
      });
      this.FirebaseApi.myGroup &&
      this.FirebaseApi.groupData &&
      this.FirebaseApi.accountData &&
      this.Global.modalType === "loading"
        ? (this.Global.modalType = false)
        : null;
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
