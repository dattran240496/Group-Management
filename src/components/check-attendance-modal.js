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
const { width, height } = Dimensions.get("window");
import firebase from "../api/api";
import moment from "moment";
@autobind
@observer
export default class CheckAttendanceModal extends Component {

  @observable location = null;
  @observable isChecking = false;
  constructor(props) {
    super(props);
    this.itemRefs = firebase.database().ref("app_expo");
    this.Global = this.props.Global;
  }

  componentWillMout() {
    console.log(this.Global.modalType);
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.Global.modalType = false;
          }}
          style={{
            position: "absolute",
            top: -30,
            right: 0,
            width: 50,
            height: 25,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: "#fff"
          }}
        >
          <Icon name="times" color="#000" size={15} />
        </TouchableOpacity>
        {!this.isChecking
          ? <TouchableOpacity
              onPress={() => {
                let _this = this;

                // get current time
                let timeDate = new Date();

                // convert to moment
                let timeMoment = moment(timeDate, "YYYY-MM-DDhh:mm:ss");

                // get admin's location
                navigator.geolocation.getCurrentPosition(
                  position => {
                    console.log(position["coords"].longitude);
                    console.log(position["coords"].latitude);
                    _this.isChecking = true;
                    //update time
                    _this.itemRefs
                      .child("Group")
                      .child(_this.Global.groupName)
                      .update({
                        newUpdate: timeMoment
                          .format("YYYY-MM-DDhh:mm:ss")
                          .toString()
                      });

                    // update isChecking
                    _this.itemRefs
                      .child("Group")
                      .child(_this.Global.groupName)
                      .child("checkedAttendance")
                      .child("isChecking")
                      .update({
                        value: "true",
                      });

                    // update admin's location to members compare with it
                    _this.itemRefs
                      .child("Group")
                      .child(_this.Global.groupName)
                      .child("checkedAttendance")
                      .child(timeMoment.format("YYYY-MM-DDhh:mm:ss"))
                      .update({
                        longitude: position["coords"].longitude,
                        latitude: position["coords"].latitude
                      });
                  },
                  error => {
                    console.log(error);
                  },
                  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                );

              }}
              style={{
                width: 150,
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                backgroundColor: "#fff",
                borderColor: "#e1e1e1",
                borderWidth: 1
              }}
            >
              <Text>Check attendance</Text>
            </TouchableOpacity>
          : <Text>Members have already checked: 0</Text>}

        <TouchableOpacity
          onPress={() => {
            this.isChecking = false;
            this.Global.modalType = false;
            this.itemRefs
              .child("Group")
              .child(this.Global.groupName)
              .child("checkedAttendance")
              .child("isChecking")
              .update({
                value: "false"
              });
          }}
          style={{
            width: 150,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            backgroundColor: "#fff",
            borderColor: "#e1e1e1",
            borderWidth: 1,
            marginTop: 10
          }}
        >
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width - 20,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10
  }
});