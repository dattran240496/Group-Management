import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "./helpers/index";
const { width, height } = Dimensions.get("window");
import firebase from "../api/api";
import moment from "moment";
let geolib = require("geolib");
import { Constants, Location, Permissions } from "expo";

@autobind
@observer
export default class MemberCheckAttendanceModal extends Component {
  @observable location = null;
  @observable admin = null;
  @observable newUpdate = null;
  constructor(props) {
    super(props);
    this.itemRefs = firebase.database().ref("app_expo");
    this.Global = this.props.Global;
    this.User = this.props.User;
  }
  componentWillMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .on("value", dataSnapshot => {
        dataSnapshot.forEach(child => {
          if (child.key === "newUpdate") {
            this.newUpdate = child.val();
          }
        });
      });
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("checkedAttendance")
      .on("value", dataSnapshot => {
        dataSnapshot.forEach(child => {
          if (child.key === this.newUpdate) {
            this.admin = {
              latitude: child.child("latitude").val(),
              longitude: child.child("longitude").val()
            };
          }
        });
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this._getLocationAsync();
          }}
          style={styles.btn_attendance_view}
        >
          <Text>Attendant</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.Global.modalType = false;
          }}
          style={styles.btn_close_view}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }
  async _getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    let distance = 0;
    distance = geolib.getDistance(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      {
        latitude: this.admin.latitude,
        longitude: this.admin.longitude
      }
    );

    if (distance < 20) {
      console.log(this.newUpdate);
      this.itemRefs
        .child("Group")
        .child(this.Global.groupKey)
        .child("checkedAttendance")
        .child(this.newUpdate)
        .child("members")
        .child(this.User.user.id)
        .update({
          email: this.User.user.email
        });
    }
  }
  memberCheckedAttendance() {
    this._getLocationAsync();
    this.setState({});
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(250),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: __d(10)
  },
  btn_attendance_view: {
    width: __d(150),
    height: __d(40),
    borderWidth: __d(1),
    borderRadius: __d(5),
    backgroundColor: "#fff",
    borderColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center"
  },
  btn_close_view: {
    width: __d(150),
    height: __d(40),
    borderWidth: __d(1),
    borderRadius: __d(5),
    backgroundColor: "#fff",
    borderColor: "#e1e1e1",
    justifyContent: "center",
    alignItems: "center",
    marginTop: __d(10)
  }
});
