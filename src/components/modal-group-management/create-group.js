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
  Image,
  KeyboardAvoidingView
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import { _ } from "lodash";
import { __d } from "../helpers/index";

@autobind
@observer
export default class EnterGroupName extends Component {
  @observable errors = {};
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupPass: "",
      confirmGroupPass: ""
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {}
  render() {
    return (
      <KeyboardAvoidingView
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        behavior="padding"
      >
        <View
          style={{
            width: width,
            height: __d(40),
            //position: "absolute",
            //right: -__d(10),
            //top: -__d(20),
            alignItems: "flex-end",
            elevation: 1,
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              width: width - __d(20),
              height: __d(20)
            }}
          />
          <View
            style={{
              width: width,
              height: __d(20),
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: width - __d(20),
                height: __d(20),
                backgroundColor: "#fff"
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.Global.modalGroupManagement = false;
            }}
            style={{
              width: __d(40),
              height: __d(40),
              borderRadius: __d(20),
              borderWidth: __d(1),
              borderColor: "#5DADE2",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              backgroundColor: "#fff",
              zIndex: 100,
              right: __d(0)
            }}
          >
            <Icon name="times" color="#5DADE2" size={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={require("./images/create-group/Popup-CreateGroup.png")}
            style={{
              width: __d(70),
              height: __d(70),
              resizeMode: "contain"
            }}
          />
          <Text
            style={{
              fontSize: __d(15),
              textAlign: "center",
              paddingTop: __d(5)
            }}
          >
            Name of group has not{"\n"}Special Character
          </Text>
          <View
            style={{
              width: width - __d(30),
              height: __d(40),
              flexDirection: "row",
              borderColor: "#5DADE2",
              borderWidth: 1,
              alignItems: "center",
              marginTop: __d(20)
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: __d(50),
                height: __d(40)
              }}
            >
              <Image
                source={require("./images/create-group/man-user.png")}
                style={{
                  width: __d(30),
                  height: __d(30),
                  resizeMode: "contain"
                }}
              />
              <View
                style={{
                  width: __d(2),
                  height: __d(30),
                  backgroundColor: "#5DADE2",
                  position: "absolute",
                  right: 0
                }}
              />
            </View>
            <TextInput
              placeholder="Group name..."
              placeholderStyle={{ color: "#e1e1e1" }}
              underlineColorAndroid="transparent"
              style={[
                styles.text_input_view,
                {
                  borderTopLeftRadius: __d(5),
                  borderTopRightRadius: __d(5),
                  fontStyle: this.state.groupName !== "" ? "normal" : "italic"
                }
              ]}
              onChangeText={txt => {
                this.setState({ groupName: txt });
              }}
              value={this.state.groupName}
            />
          </View>
          {!_.isEmpty(this.errors["groupName"]) &&
            <Text style={styles.error_txt}>
              {this.errors["groupName"]}
            </Text>}

          <View
            style={{
              width: width - __d(30),
              height: __d(40),
              flexDirection: "row",
              borderColor: "#5DADE2",
              borderWidth: 1,
              marginTop: __d(20)
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: __d(50),
                height: __d(40)
              }}
            >
              <Image
                source={require("./images/create-group/password.png")}
                style={{
                  width: __d(30),
                  height: __d(30),
                  resizeMode: "contain"
                }}
              />
              <View
                style={{
                  width: __d(2),
                  height: __d(30),
                  backgroundColor: "#5DADE2",
                  position: "absolute",
                  right: 0
                }}
              />
            </View>
            <TextInput
              placeholder="Group pass..."
              placeholderStyle={{ color: "#e1e1e1" }}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={[
                styles.text_input_view,
                {
                  fontStyle: this.state.groupPass !== "" ? "normal" : "italic"
                }
              ]}
              onChangeText={txt => {
                this.setState({ groupPass: txt });
              }}
              value={this.state.groupPass}
            />
          </View>
          <View
            style={{
              width: width - __d(30),
              height: __d(40),
              flexDirection: "row",
              borderColor: "#5DADE2",
              borderWidth: 1,
              marginTop: __d(20)
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: __d(50),
                height: __d(40)
              }}
            >
              <Image
                source={require("./images/create-group/password.png")}
                style={{
                  width: __d(30),
                  height: __d(30),
                  resizeMode: "contain"
                }}
              />
              <View
                style={{
                  width: __d(2),
                  height: __d(30),
                  backgroundColor: "#5DADE2",
                  position: "absolute",
                  right: 0
                }}
              />
            </View>
            <TextInput
              placeholder="Confirm group pass..."
              placeholderStyle={{ color: "#e1e1e1" }}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              style={[
                styles.text_input_view,
                {
                  fontStyle:
                    this.state.confirmGroupPass !== "" ? "normal" : "italic"
                }
              ]}
              onChangeText={txt => {
                this.setState({ confirmGroupPass: txt });
              }}
              value={this.state.confirmGroupPass}
            />
          </View>
          {!_.isEmpty(this.errors["password"]) &&
            <Text style={styles.error_txt}>
              {this.errors["password"]}
            </Text>}
          <TouchableOpacity
            onPress={() => {
              this.pushGroupName();
            }}
            style={styles.btn_add_new_group}
          >
            <Text style={styles.btn_add_new_group_txt}>Create</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  // push group to firebase
  pushGroupName() {
    let isNameExisted = false;
    if (this.state.groupPass === this.state.confirmGroupPass) {
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
            groupPass: this.state.groupPass,
              distance: 100
            //groupMember: [this.User.user.email]
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
            .child("Group")
            .child(groupKey)
            .child("groupMember")
            .child(this.User.user.id)
            .update({
              email: this.User.user.email,
              name: this.User.user.name
            });
          this.itemRefs
            .child("Account")
            .child(this.User.user.id)
            .child("MyGroup")
            .child(groupKey)
            .update({
              groupName: groupName
            });

          this.Global.modalGroupManagement = false;
        }
      } else {
        this.setState({});
        this.errors["groupName"] =
          "Group names can not have special characters!";
      }
    } else {
      this.setState({}), (this.errors["password"] =
        "Password and Confirm password is not match!");
    }
  }

  validate(value) {
    let regx = new RegExp(/^[A-Za-z0-9.]+$/);
    return regx.test(value);
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(370),
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: __d(20)
  },
  error_txt: {
    color: "red",
    marginTop: __d(5)
  },
  text_input_view: {
    width: width - __d(91),
    height: __d(38),
    paddingLeft: __d(10),
    fontSize: __d(15),
    backgroundColor: "#fff"
  },
  btn_add_new_group: {
    width: __d(90),
    height: __d(30),
    borderRadius: __d(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5DADE2",
    marginTop: __d(15)
  },
  btn_add_new_group_txt: {
    color: "#fff",
    fontSize: __d(13),
    fontWeight: "bold"
  }
});
