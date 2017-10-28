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
import { Constants, Location, Permissions, FileSystem } from 'expo';
@autobind
@observer
export default class CheckAttendanceModal extends Component {

  @observable location = null;
  @observable isChecking = false;
  @observable checkedMembers = 0;
  @observable newUpdate = null;
  constructor(props) {
    super(props);
    this.itemRefs = firebase.database().ref("app_expo");
    this.Global = this.props.Global;
  }

  componentDidMount() {

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
              onPress={async () => {
                let _this = this;

                // get current time
                let timeDate = new Date();

                // convert to moment
                let timeMoment = moment(timeDate, "YYYY-MM-DDhh:mm:ss");
                  let { status } = await Permissions.askAsync(Permissions.LOCATION);
                  let location = await Location.getCurrentPositionAsync({});
                  console.log("location");
                  console.log(location);
                  _this.isChecking = true;
                  //update time
                  _this.newUpdate = timeMoment
                      .format("YYYY-MM-DDhh:mm:ss")
                      .toString();
                  _this.itemRefs
                      .child("Group")
                      .child(_this.Global.groupName)
                      .update({
                          newUpdate: _this.newUpdate
                      });
                  this.itemRefs
                      .child("Group")
                      .child(_this.Global.groupName)
                      .child("checkedAttendance")
                      .child(_this.newUpdate)
                      .child("members").on("value", dataSnapshot => {
                        this.checkedMembers = 0;
                      dataSnapshot.forEach(child=>{
                        this.checkedMembers++;
                        FileSystem.writeFile();
                      });
                      console.log(this.checkedMembers);
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
                          latitude: location["coords"].latitude,
                          longitude: location["coords"].longitude,
                      });
                // get admin's location
                  navigator.geolocation.getCurrentPosition(
                  position => {

                  },
                  error => {
                    console.log(error);
                  },
                  { enableHighAccuracy: true,
                      timeout: 20000,
                      maximumAge: 0 }
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
          : <Text>Members have already checked: {this.checkedMembers}</Text>}

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
