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
import { _ } from "lodash";

@autobind
@observer
export default class EnterGroupName extends Component {
  @observable errors = {};
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupPass: "",
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.getGroupName();
  }
  componentWillMount() {
    console.log(this.User.user);
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
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 40,
            paddingLeft: 10,
            borderWidth: 1.5,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.groupName !== "" ? "normal" : "italic"
          }}
          onChangeText={txt => {
            this.setState({ groupName: txt });
          }}
        />
        {!_.isEmpty(this.errors) && <Text style={{ color: "red", marginTop: 5 }}>
              {this.errors}
            </Text>
          }

        <TextInput
          placeholder="Group pass..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            marginTop: 5,
            width: width,
            height: 40,
            paddingLeft: 10,
            borderBottomWidth: 1.5,
            borderBottomColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.groupPass !== "" ? "normal" : "italic"
          }}
          onChangeText={txt => {
            this.setState({ groupPass: txt });
          }}
        />
        <TouchableOpacity
          onPress={() => {
            this.pushGroupName();
          }}
          style={{
            marginTop: 10,
            width: 120,
            height: 50,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#e1e1e1",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={{}}>Create Group</Text>
        </TouchableOpacity>
      </View>
    );
  }
  pushGroupName() {
      if (this.validate(this.state.groupName)) {
      this.errors = {};
      let groupName = this.state.groupName.replace(".", "%");
      __DEV__ && console.log(groupName);
      this.FirebaseApi.groupData.map((v, i) => {
        if (v._key === this.state.groupName) {
          Alert.alert("Warning!", "Group name existed!");
        }
      });
      this.itemRefs.child("Group").child(groupName).update({
        createdGroupBy: this.User.user.id,
        groupPass: this.state.groupPass
      });
      let value;
      //this.itemRefs.child("Account").child(this.User.user.id).child("CreatedGroup").child(this.state.groupName).update("true");

    }else {

        this.errors = "Group names can not have special characters!";
      }
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

  validate(value) {
    let regx = new RegExp(/^[A-Za-z0-9.]+$/);
    return regx.test(value);
  }
}
