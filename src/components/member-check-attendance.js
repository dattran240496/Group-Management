import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
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
import geolib from "geolib";
import { Constants, Location, Permissions } from 'expo';

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
  }
  componentWillMount(){
      this.itemRefs.child("Group").child(this.Global.groupName).on("value", dataSnapshot =>{
          dataSnapshot.forEach(child =>{
              if(child.key === "newUpdate"){
                  this.newUpdate = child.val();
              }
          })
      });
      this.itemRefs.child("Group").child(this.Global.groupName).child("checkedAttendance").on("value", dataSnapshot =>{
          dataSnapshot.forEach(child => {
              if (child.key === this.newUpdate){
                  this.admin = {
                      latitude: child.child("latitude").val(), longitude: child.child("longitude").val()
                  };
              }
          })
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
            onPress={()=>this.memberCheckedAttendance
            }
          style={{
            width: 150,
            height: 40,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: "#fff",
            borderColor: "#e1e1e1",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text>Attendant</Text>
        </TouchableOpacity>
          <TouchableOpacity
              onPress={()=>{
                  this.Global.modalType = false;
              }}
              style={{
                  width: 150,
                  height: 40,
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: "#fff",
                  borderColor: "#e1e1e1",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10
              }}
          >
              <Text>Close</Text>
          </TouchableOpacity>
      </View>
    );
  }
  async memberCheckedAttendance () {

      let location = await Location.getCurrentPositionAsync({});

      console.log(this.admin);
      console.log({latitude: location.coords.latitude, longitude: location.coords.longitude});
      console.log(geolib.getDistance(
          {latitude: location.coords.latitude, longitude: location.coords.longitude},
          this.admin));


  }
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }

        let location = await Location.getCurrentPositionAsync({});
        this.location = location;
        return location;

    };

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
