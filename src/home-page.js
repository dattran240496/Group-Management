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
  Platform,
  ScrollView,
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { Permissions, Notifications, Font } from "expo";

const { width, height } = Dimensions.get("window");
import { _ } from "lodash";
import Swiper from "react-native-swiper";
import { __d } from "./components/helpers/index";
//import registerForPushNotificationsAsync from "./api/registerForPushNotificationsAsync"
const PUSH_ENDPOINT = "https://exponent-push-server.herokuapp.com/tokens";
@autobind
@observer
export default class Homepage extends Component {
  @observable isDisable = false;
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      groupPass: "",
      notification: {},
        isFontLoaded: false
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.Global = this.props.Global;
    this.itemRefs = firebase.database().ref("app_expo");
  }
   componentWillMount() {
    //this.Global.modalType = "loading";
    this.props.user ? this.getUserInfo(this.props.user) : null;
    !this.FirebaseApi.groupData
      ? this.getGroupName()
      : (this.Global.modalType = false);
    !this.FirebaseApi.accessToken
      ? this.getAccount()
      : (this.Global.modalType = false);
    this.setDataWhenInstallApp();

    //this.isDisable = !!(this.FirebaseApi.groupData && this.FirebaseApi.myGroup);
    //this.isDisable ? this.Global.modalType = false : null;
  }
    async componentDidMount() {
        await Font.loadAsync({
            'FiraSans-BoldItalic': require('../assets/fonts/FiraSans-BoldItalic.otf'),
        });
        this.setState({
            isFontLoaded: true
        })
    }

  render() {
    let circleLargeHeight = 3 * height / 5;
    let circleSmallHeight = 3 * height / 10;
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingLeft: __d(30)
          }}
        >
          <Image
            source={require("./images/home-page/avata.png")}
            style={{
              width: __d(80),
              height: __d(80),
              resizeMode: "contain"
            }}
          >
            <Image
              source={this.User.user ? { uri: this.User.user.picture } : null}
              style={{
                width: __d(60),
                height: __d(60),
                borderRadius: __d(30),
                resizeMode: "contain",
                marginLeft: __d(10),
                marginTop: __d(3)
              }}
            />
          </Image>
        </View>
        <View
          style={{
            flex: 3,
            justifyContent: "center"
          }}
        >
          <View
            style={{
              width: circleLargeHeight,
              height: circleLargeHeight,
              borderRadius: circleLargeHeight / 2,
              borderWidth: __d(4),
              borderColor: "#5DADE2",
              marginLeft: circleLargeHeight / 2.2
            }}
          >
            <View
              style={{
                width: circleSmallHeight,
                height: circleSmallHeight,
                borderRadius: circleSmallHeight / 2,
                borderWidth: __d(2),
                borderColor: "#5DADE2",
                marginLeft: circleLargeHeight / 4,
                marginTop: circleLargeHeight / 4
              }}
            />
            <View
              style={{
                position: "absolute",
                top: -__d(10),
                flexDirection: "row",
                height: __d(60),
                alignItems: "center",
                backgroundColor: "transparent",
                left: -__d(20)
              }}
            >
              <Text
                style={{
                  fontSize: __d(18),
                  color: "#808080",
                  fontWeight: "bold",
                    fontFamily: this.state.isFontLoaded ? "FiraSans-BoldItalic" : null
                }}
              >
                Find groups
              </Text>
              <TouchableOpacity
                  onPress={()=>{
                      this.Global.modalGroupManagement = "groupList";
                  }}
                style={{
                  height: __d(60)
                }}
              >
                <Image
                  source={require("./images/home-page/item1.png")}
                  style={{
                    resizeMode: "contain",
                    flex: 1
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                top: __d(80),
                flexDirection: "row",
                height: __d(60),
                alignItems: "center",
                backgroundColor: "transparent",
                left: -__d(135)
              }}
            >
              <Text
                style={{
                  fontSize: __d(18),
                  color: "#808080",
                  fontWeight: "bold",
                    fontFamily: this.state.isFontLoaded ? "FiraSans-BoldItalic" : null
                }}
              >
                Create groups
              </Text>
              <TouchableOpacity
                  onPress={()=>{
                      this.Global.modalGroupManagement = "createGroup";
                  }}
                style={{
                  height: __d(60)
                }}
              >
                <Image
                  source={require("./images/home-page/item2.png")}
                  style={{
                    resizeMode: "contain",
                    flex: 1
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                top: __d(220),
                flexDirection: "row",
                height: __d(60),
                alignItems: "center",
                backgroundColor: "transparent",
                left: -__d(125)
              }}
            >
              <Text
                style={{
                  fontSize: __d(18),
                  color: "#808080",
                  fontWeight: "bold",
                    fontFamily: this.state.isFontLoaded ? "FiraSans-BoldItalic" : null
                }}
              >
                My groups
              </Text>
              <TouchableOpacity
                  onPress={()=>{
                      this.Global.modalGroupManagement = "myGroup";
                  }}
                style={{
                  height: __d(60)
                }}
              >
                <Image
                  source={require("./images/home-page/item3.png")}
                  style={{
                    resizeMode: "contain",
                    flex: 1
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: "absolute",
                top: __d(330),
                flexDirection: "row",
                height: __d(60),
                alignItems: "center",
                backgroundColor: "transparent",
                left: -__d(10)
              }}
            >
              <Text
                style={{
                  fontSize: __d(18),
                  color: "#808080",
                  fontWeight: "bold",
                    fontFamily: this.state.isFontLoaded ? "FiraSans-BoldItalic" : null
                }}
              >
                Setting
              </Text>
              <TouchableOpacity
                  onPress={()=>{
                      this.Global.modalGroupManagement = "account";
                  }}
                style={{
                  height: __d(60)
                }}
              >
                <Image
                  source={require("./images/home-page/item4.png")}
                  style={{
                    resizeMode: "contain",
                    flex: 1
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "flex-end",
            paddingRight: __d(15)
          }}
        >
          <Image
            source={require("./images/home-page/logo.png")}
            style={{
              width: width / 2,
              height: height / 5,
              resizeMode: "contain",
              marginTop: __d(15)
            }}
          />
        </View>
        <Image
          source={require("./images/home-page/picture1.png")}
          style={{
            width: width * 1 / 2,
            height: width * 1 / 2,
            resizeMode: "stretch",
            position: "absolute",
            bottom: 0,
            left: 0
          }}
        />
      </View>
    );
  }

  // get all group on firebase
  getGroupName() {
    let group = {};
    let key = {};
    this.itemRefs.child("Group").on("value", dataSnapshot => {
      this.FirebaseApi.groupData = [];
      dataSnapshot.forEach(child => {
        key = {};
        this.FirebaseApi.groupData.push({
          createdGroupBy: child.child("createdGroupBy").val(),
          groupPass: child.child("groupPass").val(),
          groupName: child.child("groupName").val(),
          groupKey: child.key,
          groupMember: child.child("groupMember").val()
        });
      });
      this.FirebaseApi.myGroup &&
      this.FirebaseApi.groupData &&
      this.FirebaseApi.accountData &&
      this.User.user &&
      this.Global.modalType === "loading"
        ? (this.Global.modalType = false)
        : null;
    });
  }

  // get my group on firebase
  getMyGroup() {
    this.itemRefs
      .child("Account")
      .child(this.User.user.id)
      .child("MyGroup")
      .on("value", dataSnapshot => {
        this.FirebaseApi.myGroup = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.myGroup.push({
            groupName: child.child("groupName").val(),
            groupKey: child.key
          });
        });
        this.FirebaseApi.myGroup &&
        this.FirebaseApi.groupData &&
        this.FirebaseApi.accountData &&
        this.User.user &&
        this.Global.modalType === "loading"
          ? (this.Global.modalType = false)
          : null;
      });
  }

  // get all account on firebase
  getAccount() {
    this.itemRefs.child("Account").on("value", dataSnapshot => {
      this.FirebaseApi.accountData = [];
      dataSnapshot.forEach(child => {
        this.FirebaseApi.accountData[child.key] = {
          email: child.child("infoAccount").child("email").val(),
          //family_name: child.child("infoAccount").child("family_name").val(),
          //given_name: child.child("infoAccount").child("given_name").val(),
          name: child.child("infoAccount").child("name").val(),
          picture: child.child("infoAccount").child("picture").val(),
          token: child.child("token").val()
        };
      });
      this.FirebaseApi.myGroup &&
      this.FirebaseApi.groupData &&
      this.FirebaseApi.accountData &&
      this.User.user &&
      this.Global.modalType === "loading"
        ? (this.Global.modalType = false)
        : null;
    });
  }

  getUserInfo(id) {
    this.itemRefs.child("Account").child(id).on("value", dataSnapshot => {
      this.User.user = {
        email: dataSnapshot.child("infoAccount").child("email").val(),
        name: dataSnapshot.child("infoAccount").child("name").val(),
        id: dataSnapshot.child("infoAccount").child("id").val(),
        picture: dataSnapshot.child("infoAccount").child("picture").val(),
        token: dataSnapshot.child("token").val()
      };
      !this.FirebaseApi.myGroup
        ? this.getMyGroup()
        : (this.Global.modalType = false);
    });
    this.FirebaseApi.myGroup &&
    this.FirebaseApi.groupData &&
    this.FirebaseApi.accountData &&
    this.User.user &&
    this.Global.modalType === "loading"
      ? (this.Global.modalType = false)
      : null;
  }

  async setDataWhenInstallApp() {
    try {
      let value = await AsyncStorage.getItem("@isInstallApp:key");
      if (value !== null) {
      } else {
        try {
          await AsyncStorage.setItem("@isInstallApp:key", "true");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      return false;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
