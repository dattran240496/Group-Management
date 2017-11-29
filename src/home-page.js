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
import { Permissions, Notifications } from "expo";
const { width, height } = Dimensions.get("window");
import { _ } from "lodash";
import Swiper from "react-native-swiper";
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
      notification: {}
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.Global = this.props.Global;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    //this.Global.modalType = "loading";
    this.props.user ? (this.User.user = this.props.user) : null;
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
    //registerForPushNotificationsAsync(this.User.user);
    //console.log(this.FirebaseApi.accountData);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: width,
            height: 200
          }}
        >
          <Swiper>
            <View
              style={{
                backgroundColor: "#5DADE2",
                width: width,
                height: 200,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                CLASS MANAGEMANT IS SIMPLE
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  textAlign: "center",
                  paddingTop: 5
                }}
              >
                Make class management easier with the application.
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#5DADE2",
                width: width,
                height: 200,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                CLASS MANAGEMANT IS SIMPLE
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  textAlign: "center",
                  paddingTop: 5
                }}
              >
                Make class management easier with the application.
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#5DADE2",
                width: width,
                height: 200,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold"
                }}
              >
                CLASS MANAGEMANT IS SIMPLE
              </Text>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 16,
                  textAlign: "center",
                  paddingTop: 5
                }}
              >
                Make class management easier with the application.
              </Text>
            </View>
          </Swiper>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingTop: 30,
            flexWrap: "wrap",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Actions.enterGroupName();
            }}
            style={{
              width: 130,
              height: 130,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1,
              backgroundColor: "#fff",
              paddingTop: 15
            }}
          >
            <Image
              source={require("./images/home-page/new-group.png")}
              style={{
                flex: 1,
                width: 40,
                height: 40,
                resizeMode: "contain"
              }}
            />
            <Text
              style={{
                flex: 1,
                paddingTop: 5
              }}
            >
              New Group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Actions.groupList();
            }}
            style={{
              width: 130,
              height: 130,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1,
              marginLeft: 10,
              backgroundColor: "#fff",
              paddingTop: 15
            }}
          >
            <Image
              source={require("./images/home-page/group-list.png")}
              style={{
                width: 60,
                height: 60,
                resizeMode: "contain",
                flex: 1
              }}
            />
            <Text
              style={{
                flex: 1,
                paddingTop: 5
              }}
            >
              Find Group
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Actions.myGroup();
            }}
            style={{
              width: 130,
              height: 130,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1,
              marginTop: 10,
              backgroundColor: "#fff",
              paddingTop: 15
            }}
          >
            <Image
              source={require("./images/home-page/my-group.png")}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
                flex: 1
              }}
            />
            <Text
              style={{
                flex: 1,
                paddingTop: 5
              }}
            >
              My Group
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              width: 130,
              height: 130,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1,
              marginLeft: 10,
              marginTop: 10,
              backgroundColor: "#fff"
            }}
          >
            <Text>NULL</Text>
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
          createdGroupBy: child.child("createdGroupBy").val(),
          groupPass: child.child("groupPass").val(),
          groupName: child.child("groupName").val(),
          key: child.key,
          groupMember: child.child("groupMember").val()
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

  getMyGroup() {
    this.itemRefs
      .child("Account")
      .child(this.User.user.id)
      .child("MyGroup")
      .on("value", dataSnapshot => {
        this.FirebaseApi.myGroup = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.myGroup[child.key] = {
            groupName: child.child("groupName").val(),
            groupKey: child.key
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

  getAccount() {
    this.itemRefs.child("Account").on("value", dataSnapshot => {
      this.FirebaseApi.accountData = [];
      dataSnapshot.forEach(child => {
        this.FirebaseApi.accountData[child.key] = {
          email: child.child("infoAccount").child("email").val(),
          family_name: child.child("infoAccount").child("family_name").val(),
          given_name: child.child("infoAccount").child("given_name").val(),
          name: child.child("infoAccount").child("name").val(),
          picture: child.child("infoAccount").child("picture").val(),
          token: child.child("token").val()
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e1e1"
  }
});
