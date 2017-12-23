import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  FlatList
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
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.Firebase;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentDidMount() {
    this.setState({});
    this.Global.groupKey ? this.getInfoAdminAndGroup() : null;
  }
  render() {
      let info = null;
      let isAdmin = false;
      this.Global.groupKey && this.FirebaseApi.accountData ? this.itemRefs
          .child("Group")
          .child(this.Global.groupKey)
          .child("createdGroupBy")
          .on("value", dataSnapshot => {
              info = this.FirebaseApi.accountData[dataSnapshot.val()];
              console.log(dataSnapshot.val());
              console.log(this.FirebaseApi.accountData);
              console.log(info);
              isAdmin = info.email === this.User.user.email ? true : false;
          }) : null;

      console.log(info);
      console.log(isAdmin);
    return (
      <View>
        {this.Global.isFooter
          ? <View style={[styles.func_view]}>
              {
                isAdmin &&
                <TouchableOpacity
                  onPress={() => {
                      this.indexSelected = 1;
                    this.Global.modalType = "check-attendance";
                  }}
                  style={[
                    styles.func_btn_view,
                    {
                      borderLeftWidth: 0
                    }
                  ]}
                >
                  <Icon
                    name="check"
                    color={this.indexSelected === 1 ? "#5DADE2" : "#b3b3b3"}
                    size={__d(35)}
                  />
                </TouchableOpacity>}

              <TouchableOpacity
                onPress={() => {
                    this.indexSelected = 2;
                  Actions.members();
                }}
                style={[
                  styles.func_btn_view,
                  {
                    //marginLeft: __d(10)
                  }
                ]}
              >
                <Icon
                  name="users"
                  color={this.indexSelected === 2 ? "#5DADE2" : "#b3b3b3"}
                  size={__d(35)}
                />
              </TouchableOpacity>

              {
                isAdmin &&
                <TouchableOpacity
                  style={[
                    styles.func_btn_view,
                    {
                      //marginTop: __d(10)
                    }
                  ]}
                  onPress={() => {
                      this.indexSelected = 3;
                    Actions.postMessage();
                  }}
                >
                  <Icon
                    name="commenting-o"
                    color={this.indexSelected === 3 ? "#5DADE2" : "#b3b3b3"}
                    size={__d(35)}
                  />
                </TouchableOpacity>}
              {
                isAdmin &&

                <TouchableOpacity
                  style={[
                    styles.func_btn_view,
                    {
                      //marginLeft: __d(10),
                      //marginTop: __d(10)
                    }
                  ]}
                  onPress={() => {
                      this.indexSelected = 4;
                    Actions.createPoll();
                  }}
                >
                  <Icon
                    name="flag"
                    color={this.indexSelected === 4 ? "#5DADE2" : "#b3b3b3"}
                    size={__d(35)}
                  />
                </TouchableOpacity>}
            </View>
          : null}
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
    width: width,
    height: __d(50),
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 0,
    borderTopColor: "#e1e1e1",
    borderTopWidth: __d(1)
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
