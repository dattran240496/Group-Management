import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  TextInput,
  Alert
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class Homepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupPass: ""
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.getGroupName();
  }
  componentWillMount() {
    this.User.user = this.props.user;
      this.getMyGroup();
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
    let group = [];
    let key = {};
    this.itemRefs.child("Group").on("value", dataSnapshot => {
      this.FirebaseApi.groupData = [];
      dataSnapshot.forEach(child => {
        key = {};
        key[child.key] = {
          _createGroupBy: child.child("createdGroupBy").val(),
          _groupPass: child.child("groupPass").val()
        };
        this.FirebaseApi.groupData.push(key);
      });
    });

    return this.FirebaseApi.groupData;
  }
  getMyGroup() {
    this.itemRefs
      .child("Account")
      .child(this.User.user.id)
      .child("MyGroup")
      .on("value", dataSnapshot => {
        this.FirebaseApi.myGroup = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.myGroup.push(child.key);
        });
      });
    return this.FirebaseApi.myGroup;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
