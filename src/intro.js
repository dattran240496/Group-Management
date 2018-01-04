import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  Platform,
  Dimensions
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
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class Intro extends Component {
  @observable register = null;
  @observable isInstalledApp = false;
  @observable indexSwiper = 0;
  constructor(props) {
    super(props);

    this.User = this.props.User;
    this.Firebase = this.props.Firebase;
    this.Global = this.props.Global;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    this.getDataWhenInstallApp();
  }
  render() {
    let instruction_first = (
      <View style={[styles.container]}>
        <Image
          source={require("./images/intro/page-1.png")}
          style={styles.img_intro}
        />
        <View style={styles.intro_info_view}>
          <Text style={styles.intro_info_header_txt}>NOTIFICATION</Text>
          <Text style={styles.intro_info_body_txt}>
            Post every notification quickly
          </Text>
        </View>
        <Image
          source={require("./images/intro/heart.png")}
          style={styles.intro_img_heart}
        />
      </View>
    );
    let instruction_second = (
      <View style={[styles.container]}>
        <Image
          source={require("./images/intro/page-2.png")}
          style={styles.img_intro}
        />
        <View style={styles.intro_info_view}>
          <Text style={styles.intro_info_header_txt}>POLL</Text>
          <Text style={styles.intro_info_body_txt}>
            Easy to create poll neatly
          </Text>
        </View>
        <Image
          source={require("./images/intro/heart.png")}
          style={styles.intro_img_heart}
        />
      </View>
    );
    let instruction_third = (
      <View style={[styles.container]}>
        <Image
          source={require("./images/intro/page-3.png")}
          style={styles.img_intro}
        />
        <View style={styles.intro_info_view}>
          <Text style={styles.intro_info_header_txt}>CHECK ATTENDANCE</Text>
          <Text style={styles.intro_info_body_txt}>
            Check person attendance exactly
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require("./images/intro/heart.png")}
            style={styles.intro_img_heart}
          />
          <TouchableOpacity
            style={styles.btn_started_view}
            onPress={() => {
              Actions.login({ type: "replace" });
            }}
          >
            <Text
              style={styles.btn_started_txt}
            >
              GET STARTED
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
    return (
      <View style={styles.container}>
        {!this.isInstalledApp
          ? <Swiper
              onIndexChanged={index => {
                this.indexSwiper = index;
              }}
              loop={false}
            >
              {instruction_first}
              {instruction_second}
              {instruction_third}
            </Swiper>
          : instruction_third}
        {!this.isInstalledApp && this.indexSwiper !== 2
          ? <TouchableOpacity
              style={styles.btn_skip_view}
              onPress={() => {
                Actions.login({ type: "replace" });
              }}
            >
              <Text
                style={{
                  fontSize: __d(15)
                }}
              >
                Skip
              </Text>
            </TouchableOpacity>
          : null}
      </View>
    );
  }
  async getDataWhenInstallApp() {
    try {
      let value = await AsyncStorage.getItem("@isInstallApp:key");
      if (value !== null) {
          Actions.login({ type: "replace" });
      } else {
        this.isInstalledApp = false;
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
  img_intro: {
    flex: 2,
    resizeMode: "contain"
  },
  intro_info_view: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  intro_info_header_txt: {
    flex: 1,
    fontSize: __d(18),
    fontWeight: "bold"
  },
  intro_info_body_txt: {
    flex: 1,
    fontSize: __d(15),
    color: "#808080"
  },
    intro_img_heart:{
        flex: 1,
        resizeMode: "contain",
        opacity: 0.2
    },
    btn_started_view:{
        width: __d(180),
        height: __d(50),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: __d(5),
        backgroundColor: "#5DADE2",
        zIndex: 1,
        position: "absolute",
        top: __d(10)
    },
    btn_started_txt:{
        color: "#fff",
        fontWeight: "bold"
    },
    btn_skip_view:{
        zIndex: 1,
        position: "absolute",
        bottom: __d(20),
        right: __d(20),
        backgroundColor: "transparent"
    }
});
