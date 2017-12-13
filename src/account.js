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
  FlatList,
  Image,
  ScrollView
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
import { __d } from "./components/helpers/index";
@autobind
@observer
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.User = this.props.User;
      this.itemRefs = firebase.database().ref("app_expo");
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        {this.User.user &&
          <Image
            style={styles.user_ava}
            source={{ uri: this.User.user.picture }}
          />}
        {this.User.user &&
          <Text style={styles.user_name}>
            {this.User.user.email}
          </Text>}
        <View style={styles.sign_out_view}>
          <TouchableOpacity
            style={styles.sign_out_btn_view}
            onPress={() => {
              this.FirebaseApi.groupData = null;
              this.FirebaseApi.accountData = null;
              this.FirebaseApi.myGroup = null;
              AsyncStorage.removeItem("@user:key");
              this.itemRefs.child("Account").child(this.User.user.id).update({
                  token: ""
              });
              Actions.login({ type: "replace" });
            }}
          >
            <Text style={styles.sign_out_btn_txt}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  user_ava: {
    width: __d(100),
    height: __d(100),
    borderRadius: __d(50),
    resizeMode: "contain"
  },
  user_name: {
    color: "#000",
    paddingTop: __d(10)
  },
  sign_out_view: {
    position: "absolute",
    bottom: __d(20),
    justifyContent: "center",
    alignItems: "center",
    width: width
  },
  sign_out_btn_view: {
    width: __d(120),
    height: __d(35),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5)
  },
  sign_out_btn_txt: {
    fontSize: __d(13),
    color: "#fff"
  }
});
