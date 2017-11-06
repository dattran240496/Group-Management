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
const PUSH_ENDPOINT = 'https://exponent-push-server.herokuapp.com/tokens';
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
    this.User.user = this.props.user;
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
          registerForPushNotificationsAsync(this.User.user);
  }

  _handleButtonPress = () => {
    const localnotification = {
      title: "Example Title!",
      body: "This is the body text of the local notification",
      android: {
        sound: true
      },
      ios: {
        sound: true
      }
    };
    let sendAfterFiveSeconds = Date.now();
    sendAfterFiveSeconds += 5000;

    const schedulingOptions = { time: sendAfterFiveSeconds };
    Notifications.scheduleLocalNotificationAsync(
      localnotification,
      schedulingOptions
    );
  };

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

          <TouchableOpacity
            onPress={this._handleButtonPress.bind(this)}
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
            <Text>Notification</Text>
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
        this.FirebaseApi.groupData[child.key] = {
          _createGroupBy: child.child("createdGroupBy").val(),
          _groupPass: child.child("groupPass").val()
        };
        //this.FirebaseApi.groupData[];
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
          this.FirebaseApi.myGroup.push(child.key);
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
          picture: child.child("infoAccount").child("picture").val()
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
async function registerForPushNotificationsAsync(user) {
  // Android remote notification permissions are granted during the app
  // install, so this will only ask on iOS
  const { Permissions } = Expo;
  let { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  //
  console.log(status);
  // Stop here if the user did not grant permissions
  if (status !== "granted") {
    alert(
      "Hey! You might want to enable notifications for my app, they are good."
    );

    return;
  }
  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  //token = "ExponentPushToken[" + user.id + "]";
  //userID = firebase.auth().currentUser.uid;
    console.log(token);

  //firebase.database().ref('/users/' + userID).update({ token: token });

  // // POST the token to our backend so we can use it to send pushes from there
  await fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
    })
  });
  return 1;
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
