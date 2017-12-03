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
@autobind
@observer
export default class Account extends Component {
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.User = this.props.User;
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        {this.User.user &&
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              resizeMode: "contain"
            }}
            source={{ uri: this.User.user.picture }}
          />}
        {this.User.user &&
          <Text style={{ color: "#000", paddingTop: 10 }}>
            {this.User.user.email}
          </Text>}
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
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
