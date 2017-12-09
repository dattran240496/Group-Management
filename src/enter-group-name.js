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
import { __d } from "./components/helpers/index";

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
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {}
  render() {
    return (
      <View style={styles.container}>
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
        />
        {!_.isEmpty(this.errors["groupName"]) &&
          <Text style={styles.error_txt}>
            {this.errors["groupName"]}
          </Text>}

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
        />
        <TextInput
          placeholder="Confirm group pass..."
          placeholderStyle={{ color: "#e1e1e1" }}
          secureTextEntry={true}
          underlineColorAndroid="transparent"
          style={[
            styles.text_input_view,
            {
              fontStyle: this.state.confirmGroupPass !== "" ? "normal" : "italic"
            }
          ]}
          onChangeText={txt => {
            this.setState({ confirmGroupPass: txt });
          }}
        />
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
          <Text style={styles.btn_add_new_group_txt}>Create Group</Text>
        </TouchableOpacity>
      </View>
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
            groupPass: this.state.groupPass
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
              email: this.User.user.email
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
    flex: 1,
    alignItems: "center",
    backgroundColor: "#e1e1e1",
    paddingTop: __d(20)
  },
  error_txt: {
    color: "red",
    marginTop: __d(5)
  },
  text_input_view: {
    width: width - __d(30),
    height: __d(40),
    paddingLeft: __d(10),
    fontSize: __d(15),
    backgroundColor: "#fff",
      borderTopWidth: __d(1.5),
      borderTopColor: "#e1e1e1",
  },
  btn_add_new_group: {
    width: width - __d(30),
    height: __d(50),
    borderBottomLeftRadius: __d(5),
    borderBottomRightRadius: __d(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5DADE2"
  },
  btn_add_new_group_txt: {
    color: "#fff",
    fontSize: __d(20)
  }
});
