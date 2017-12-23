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
      notification: {}
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
        <View style={styles.swiper}>
          <Swiper>
            <View style={styles.swiper_view}>
              <Text style={styles.swiper_title_txt}>
                CLASS MANAGEMNT IS SIMPLE
              </Text>

              <Text style={styles.swiper_info_txt}>
                Make class management easier with the application.
              </Text>
            </View>

            <View style={styles.swiper_view}>
              <Text style={styles.swiper_title_txt}>
                CLASS MANAGEMNT IS SIMPLE
              </Text>

              <Text style={styles.swiper_info_txt}>
                Make class management easier with the application.
              </Text>
            </View>

            <View style={styles.swiper_view}>
              <Text style={styles.swiper_title_txt}>
                CLASS MANAGEMENT IS SIMPLE
              </Text>

              <Text style={styles.swiper_info_txt}>
                Make class management easier with the application.
              </Text>
            </View>
          </Swiper>
        </View>

        <View style={styles.body_view}>
          <TouchableOpacity
            onPress={() => {
              Actions.enterGroupName();
            }}
            style={styles.body_btn_view}
          >
            <Image
              source={require("./images/home-page/new-group.png")}
              style={styles.body_btn_img}
            />
            <Text style={styles.body_btn_txt}>New Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.FirebaseApi.groupData = null;
              this.Global.modalType = "loading";
              Actions.groupList();
            }}
            style={[
              styles.body_btn_view,
              {
                marginLeft: __d(10)
              }
            ]}
          >
            <Image
              source={require("./images/home-page/group-list.png")}
              style={[
                styles.body_btn_img,
                {
                  width: __d(60),
                  height: __d(60)
                }
              ]}
            />
            <Text style={styles.body_btn_txt}>Find Group</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Actions.myGroup();
            }}
            style={[
              styles.body_btn_view,
              {
                marginTop: __d(10)
              }
            ]}
          >
            <Image
              source={require("./images/home-page/my-group.png")}
              style={styles.body_btn_img}
            />
            <Text style={styles.body_btn_txt}>My Group</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Actions.account();
            }}
            style={[
              styles.body_btn_view,
              {
                marginLeft: __d(10),
                marginTop: __d(10)
              }
            ]}
          >
            <Image
              source={require("./images/home-page/account.png")}
              style={styles.body_btn_img}
            />
            <Text style={styles.body_btn_txt}>Account</Text>
          </TouchableOpacity>
        </View>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1e1e1"
  },
  swiper: {
    width: width,
    height: __d(250)
  },
  swiper_view: {
    backgroundColor: "#5DADE2",
    width: width,
    height: __d(250),
    justifyContent: "center",
    alignItems: "center"
  },
  swiper_title_txt: {
    color: "#fff",
    fontSize: __d(18),
    fontWeight: "bold"
  },
  swiper_info_txt: {
    color: "#fff",
    fontSize: __d(16),
    textAlign: "center",
    paddingTop: __d(5)
  },
  body_view: {
    flex: 1,
    justifyContent: "center",
    paddingTop: (height - __d(520)) / 2,
    flexWrap: "wrap",
    flexDirection: "row"
  },
  body_btn_view: {
    width: __d(130),
    height: __d(130),
    borderRadius: __d(10),
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e1e1e1",
    borderWidth: __d(1),
    backgroundColor: "#fff",
    paddingTop: __d(15)
  },
  body_btn_img: {
    width: __d(40),
    height: __d(40),
    resizeMode: "contain",
    flex: 1
  },
  body_btn_txt: {
    flex: 1,
    paddingTop: __d(5)
  }
});
