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
  FlatList
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
export default class MyGroup extends Component {
  @observable errors = {};
  constructor(props) {
    super(props);
    this.state = {
      typeEdit: props.typeEdit,
      newName: "",
      repeatName: ""
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="New group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 40,
            paddingLeft: 10,
            borderWidth: 1.5,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.newName !== "" ? "normal" : "italic"
          }}
          onChangeText={txt => {
            this.setState({ newName: txt });
          }}
        />
        <TextInput
          placeholder="Repeat group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 40,
            paddingLeft: 10,
            borderWidth: 1.5,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.repeatName !== "" ? "normal" : "italic"
          }}
          onChangeText={txt => {
            this.setState({ repeatName: txt });
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.changeName();
          }}
          style={{
            width: 120,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
            borderColor: "#e1e1e1",
            borderWidth: 1,
            borderRadius: 5
          }}
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }
  changeName() {
    let isNameExisted = false;
    let members = Object.keys(this.FirebaseApi.members);

    let _this = this;
    if (this.state.newName === this.state.repeatName) {
      if (this.validate(this.state.newName)) {
        this.errors = {};
        let groupName = this.state.newName.replace(".", "%");
        this.FirebaseApi.groupData.map((v, i) => {
          if (Object.keys(v).toString() === groupName) {
            isNameExisted = true;
            return Alert.alert("Warning!", "Group name existed!");
          }
        });
        if (!isNameExisted) {
          let oldName = this.Global.groupName;
          let child = _this.itemRefs.child("Group").child(oldName);
          child.once("value", function(snapshot) {
            _this.itemRefs
              .child("Group")
              .child(_this.state.newName)
              .set(snapshot.val());
            child.remove();
          });

          let childAdmin = _this.itemRefs
            .child("Account")
            .child(this.User.user.id)
            .child("MyGroup")
            .child(oldName);
          childAdmin.once("value", function(snapshot) {
            _this.itemRefs
              .child("Account")
              .child(_this.User.user.id)
              .child("MyGroup")
              .child(_this.state.newName)
              .set(snapshot.val());
            childAdmin.remove();
          });
          let childMem = null;
          members.map((v, i) => {
            childMem = _this.itemRefs
              .child("Account")
              .child(v)
              .child("MyGroup")
              .child(oldName);
            childMem.once("value", function(snapshot) {
              _this.itemRefs
                .child("Account")
                .child(v)
                .child("MyGroup")
                .child(_this.state.newName)
                .set(snapshot.val());
              childMem.remove();
            });
            this.Global.groupName = _this.state.newName;
          });
          return Actions.pop({type: "refresh"});
        }
      } else {
        return (this.errors = "Group names can not have special characters!");
      }
    } else {
      this.errors = "Must match the previous entry!";
    }
  }
  validate(value) {
    let regx = new RegExp(/^[A-Za-z0-9.]+$/);
    return regx.test(value);
  }
}
