import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Platform
} from "react-native";
import Expo, { Notifications, Permissions } from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import Loading from "./loading";
import { _ } from "lodash";
import firebase from "./api/api";
import { __d } from "./components/helpers/index";
import Swiper from "react-native-swiper";
const PUSH_ENDPOINT = "https://your-server.com/users/push-token";

@autobind
@observer
export default class Login extends Component {
  @observable register = null;
  constructor(props) {
    super(props);

    this.User = this.props.User;
    this.Firebase = this.props.Firebase;
    this.Global = this.props.Global;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {}
  render() {
    return (
      <View style={[styles.container]}>
        <Image
          source={require("./images/login/logo.png")}
          style={styles.img_logo}
        />
        <Image
          source={require("./images/login/page-4.png")}
          style={styles.img_logo}
        />
        <View style={styles.func_view}>
          <TouchableOpacity
            style={styles.btn_login_view}
            onPress={() => {
              this.Global.modalType = "loading";
              this.fetchAsync(this.itemRefs);
            }}
          >
            <Text style={styles.btn_login_txt}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.location_txt}>Location: Việt Nam</Text>
        </View>
      </View>
    );
  }

  async getDataWhenInstallApp() {
    try {
      let value = await AsyncStorage.getItem("@isInstallApp:key");
      if (value !== null) {
        this.isInstalledApp = true;
      } else {
        this.isInstalledApp = false;
      }
    } catch (error) {
      return false;
    }
  }
  // set user data into local
  async setData(item, token) {
    try {
      await AsyncStorage.setItem("@user:key", JSON.stringify(item.id));
    } catch (error) {
      console.log(error);
    }
  }

  // get token of device to notification func
  async registerForPushNotificationsAsync() {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    // Get the token that uniquely identifies this device

    let token = await Notifications.getExpoPushTokenAsync();

    return token;
  }
  // get user info in local
  async getUserInfo(accessToken, itemRefs) {
    let _this = this;
    let isLogin = false;

    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    )
      .then(response => response.json())
      .then(responseJS => {
        this.itemRefs.child("Account").on("value", dataSnapshot => {
          dataSnapshot.forEach(child => {
            if (child.key === responseJS.id) {
              isLogin = true;
            }
          });
        });
        let register = _this.registerForPushNotificationsAsync();
        let token = "";
        register.then(function(o) {
          token = o;
          console.log(token);
          token
            ? (
                itemRefs.child("Account").child(responseJS.id).update({
                  token: token
                }),
                (responseJS["token"] = token)
              )
            : null;
        });
        !isLogin
          ? itemRefs.child("Account").child(responseJS.id).update({
              infoAccount: responseJS
            })
          : null;
        this.setData(responseJS);
        Actions.homePage({ user: responseJS.id, type: "replace" });
        this.Global.modalType = false;
      })
      .catch(error => {
        console.error(error);
      });
  }

  // sign google
  async signInWithGoogleAsync(itemRefs) {
    let _this = this;
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId:
          "796165831117-gvkmjfc8fo2756b3cascvufksetoh0rk.apps.googleusercontent.com",
        iosClientId:
          "796165831117-gcqiquek4o7a6mh2pbqovt7tnb1diphb.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      if (result.type === "success") {
        return this.getUserInfo(result.accessToken, itemRefs);
      } else {
        return Actions.login({ type: "replace" });
      }
    } catch (e) {
      this.Global.modalType = false;
      return Actions.login({ type: "replace" });
    }
  }

  async fetchAsync(itemRefs) {
    //Actions.loading({ type: "replace" });
    try {
      let value = await AsyncStorage.getItem("@user:key");
      value = JSON.parse(value);
      console.log(value);
      if (value !== null) {
        return Actions.homePage({ user: value, type: "replace" });
      } else {
        return this.signInWithGoogleAsync(itemRefs);
      }
    } catch (error) {
      return false;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0
  },
  img_logo: {
    flex: 1.2,
    resizeMode: "contain"
  },
  func_view: {
    flex: 1,
    alignItems: "center"
  },
  btn_login_view: {
    width: __d(150),
    height: __d(50),
    borderRadius: __d(5),
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#5DADE2"
  },
  btn_login_txt: {
    fontSize: __d(18),
    color: "#fff",
    paddingLeft: __d(5),
    fontWeight: "bold"
  },
  location_txt: {
    fontSize: __d(15),
    color: "#5DADE2",
    paddingLeft: __d(5),
    fontWeight: "bold",
    position: "absolute",
    bottom: __d(15),
    backgroundColor: "transparent"
  }
});
