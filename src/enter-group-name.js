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
      confirmGroupPass: "",
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {}
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          backgroundColor: "#e1e1e1",
            paddingTop: 20
        }}
      >
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width - 30,
            height: 40,
            paddingLeft: 10,
            // borderWidth: 1.5,
            // borderColor: "#e1e1e1",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            fontSize: 15,
            fontStyle: this.state.groupName !== "" ? "normal" : "italic",
            backgroundColor: "#fff"
          }}
          onChangeText={txt => {
            this.setState({ groupName: txt });
          }}
        />
        {!_.isEmpty(this.errors["groupName"]) &&
          <Text style={{ color: "red", marginTop: 5 }}>
            {this.errors["groupName"]}
          </Text>}

        <TextInput
          placeholder="Group pass..."
          placeholderStyle={{ color: "#e1e1e1" }}
          secureTextEntry={true}
          style={{
            width: width - 30,
            height: 40,
            paddingLeft: 10,
            // borderBottomWidth: 1.5,
            // borderBottomColor: "#e1e1e1",
            borderTopWidth: 1.5,
            borderTopColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.groupPass !== "" ? "normal" : "italic",
            backgroundColor: "#fff"
          }}
          onChangeText={txt => {
            this.setState({ groupPass: txt });
          }}
        />
          <TextInput
              placeholder="Confirm group pass..."
              placeholderStyle={{ color: "#e1e1e1" }}
              secureTextEntry={true}
              style={{
                  width: width - 30,
                  height: 40,
                  paddingLeft: 10,
                  borderTopWidth: 1.5,
                  borderTopColor: "#e1e1e1",
                  fontSize: 15,
                  fontStyle: this.state.confirmGroupPass !== "" ? "normal" : "italic",
                  backgroundColor: "#fff"
              }}
              onChangeText={txt => {
                  this.setState({ confirmGroupPass: txt });
              }}
          />
          {!_.isEmpty(this.errors["password"]) &&
          <Text style={{ color: "red", marginTop: 5 }}>
              {this.errors["password"]}
          </Text>}
        <TouchableOpacity
          onPress={() => {
            this.pushGroupName();
          }}
          style={{
            width: width - 30,
            height: 50,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            justifyContent: "center",
            alignItems: "center",
              backgroundColor: '#5DADE2'
          }}
        >
          <Text style={{
              color: '#fff',
              fontSize: 20
          }}>Create Group</Text>
        </TouchableOpacity>
      </View>
    );
  }
  pushGroupName() {
    let isNameExisted = false;
    if (this.state.groupPass === this.state.confirmGroupPass){
        this.errors["password"] = null;
        if (this.validate(this.state.groupName)) {
            this.errors = {};
            let groupName = this.state.groupName.replace(".", "%");
            this.FirebaseApi.groupData.map((v, i) => {
                if (v.groupName === groupName) {
                    isNameExisted = true;
                    return Alert.alert("Warning!", "Group name existed!");
                }
            });
            if (!isNameExisted) {
                this.itemRefs.child("Group").push().update({
                    groupName: groupName,
                    createdGroupBy: this.User.user.id,
                    groupPass: this.state.groupPass
                });
                let groupKey = "";
                this.itemRefs.child("Group").on("value", dataSnapshot => {
                    dataSnapshot.forEach(child => {
                        child.child("groupName").val() === groupName
                            ? (groupKey = child.key)
                            : null;
                    });
                });
                this.itemRefs
                    .child("Account")
                    .child(this.User.user.id)
                    .child("MyGroup")
                    .child(groupKey)
                    .update({
                        groupName: groupName
                    });
                return Actions.pop();
            }
        } else {
            this.setState({})
            this.errors["groupName"] = "Group names can not have special characters!";
        }
    }else{
        this.setState({}),
        this.errors["password"] = "Password and Confirm password is not match!"
    }

  }

  validate(value) {
    let regx = new RegExp(/^[A-Za-z0-9.]+$/);
    return regx.test(value);
  }
}
