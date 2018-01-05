import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  FlatList,
    Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "../helpers/index";
import Modal from "react-native-modalbox";
import firebase from "../../api/api.js";
import moment from "moment";
import { Constants, Location, Permissions, FileSystem, MapView } from "expo";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class Footer extends Component {
  @observable info = null;
  @observable indexSelected = 0;
  @observable isShow = false;
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.Firebase;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {}
  }
  componentDidMount() {
    this.setState({});
    this.Global.groupKey ? this.getInfoAdminAndGroup() : null;
  }
  render() {
    let info = null;
    let isAdmin = false;
    this.Global.groupKey && this.FirebaseApi.accountData
      ? this.itemRefs
          .child("Group")
          .child(this.Global.groupKey)
          .child("createdGroupBy")
          .on("value", dataSnapshot => {
            info = this.FirebaseApi.accountData[dataSnapshot.val()];
            isAdmin = info ? info.email === this.User.user.email ? true : false : false;
          })
      : null;
    return (
      <View style={{
        flexDirection: "row"
      }}>
        {this.Global.isFooter
          ? <TouchableOpacity
              onPress={() => {
                let iShow = !this.Global.isShowButtonFooter;
                  this.Global.isShowButtonFooter = iShow;
                this.setState({});
              }}
              style={[
                styles.func_view,
                {
                  backgroundColor: this.Global.isShowButtonFooter ? "#a8d3f0" : "#5DADE2",
                    zIndex: 1
                }
              ]}
            >

            </TouchableOpacity>
          : null}
          {
              this.Global.isFooter && this.Global.isShowButtonFooter ? (
                  <View style={{
                      width: __d(120),
                      height: __d(280),
                      justifyContent: "center",
                      alignItems: "center"
                  }}>
                    <TouchableOpacity
                        onPress={()=>{
                            this.Global.isShowButtonFooter = false;
                            isAdmin ? this.Global.modalType = "check-attendance" : this.Global.modalType = "member-check-attendance";
                        }}
                        style={{
                            position: "absolute",
                            top: __d(5),
                            zIndex: 1,
                            left: __d(10)
                        }}>
                      <Image
                          source={require("./images/Menu-check.png")}
                          style={{
                              width: __d(40),
                              height: __d(40),
                              resizeMode: "contain"
                          }}
                      />
                    </TouchableOpacity>
                      {
                          isAdmin ?
                              <TouchableOpacity
                                  onPress={() => {
                                      this.Global.isShowButtonFooter = false;
                                      this.Global.componentFooter = "messages";
                                  }}
                                  style={{
                                      position: "absolute",
                                      left: __d(60),
                                      top: __d(30),
                                      zIndex: 1
                                  }}>
                                <Image
                                    source={require("./images/menu-message.png")}
                                    style={{
                                        width: __d(40),
                                        height: __d(40),
                                        resizeMode: "contain"
                                    }}
                                />
                              </TouchableOpacity>
                              : null
                      }
                      {
                          isAdmin ?
                              <TouchableOpacity
                                  onPress={() => {
                                      this.Global.isShowButtonFooter = false;
                                      this.Global.componentFooter = "poll";
                                  }}
                                  style={{
                                      position: "absolute",
                                      left: __d(90),
                                      top: __d(75),
                                      zIndex: 1
                                  }}>
                                <Image
                                    source={require("./images/menu-poll.png")}
                                    style={{
                                        width: __d(40),
                                        height: __d(40),
                                        resizeMode: "contain"
                                    }}
                                />
                              </TouchableOpacity>
                              : null
                      }
                    <View style={{
                        width: __d(250),
                        height: __d(250),
                        borderRadius: __d(125),
                        borderColor: "#5DADE2",
                        borderWidth: __d(2),
                        position: "absolute",
                        left: -__d(125),
                        zIndex: 0
                    }}>
                    </View>

                  </View>
              ) : null
          }
      </View>
    );
  }
  getInfoAdminAndGroup() {
    let _this = this;
    console.log(this.Global.groupKey);
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        _this.info = _this.FirebaseApi.accountData[dataSnapshot.val()];
      });
  }
}
const styles = StyleSheet.create({
  func_view: {
    width: __d(120),
    height: __d(120),
    backgroundColor: "#5DADE2",
    zIndex: 1,
    borderRadius: __d(60),
      top: __d(60),
      left: -__d(60),
      position: "absolute"
  },
  func_btn_view: {
    flex: 1,
    height: __d(50),
    justifyContent: "center",
    alignItems: "center",
    //borderRadius: __d(5),
    //borderLeftColor: "#e1e1e1",
    //borderLeftWidth: __d(1),
    //backgroundColor: "#5DADE2",
    zIndex: 1
  }
});
