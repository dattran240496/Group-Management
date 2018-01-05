import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
    Alert,
    Image,
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
const { width, height } = Dimensions.get("window");
import firebase from "../../api/api";
import moment from "moment";
let geolib = require("geolib");
import { Constants, Location, Permissions, MapView } from "expo";

const DISTANCE = 50; // max distance to check attendance
@autobind
@observer
export default class MemberCheckAttendanceModal extends Component {
  @observable location = null;
  @observable admin = null;
  @observable newUpdate = null;
    @observable isChecking = false;
    @observable checkedMembers = [];
  constructor(props) {
    super(props);
    this.itemRefs = firebase.database().ref("app_expo");
    this.Global = this.props.Global;
    this.User = this.props.User;
      this.FirebaseApi = this.props.FirebaseApi;
  }
  componentWillMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .on("value", dataSnapshot => {
        dataSnapshot.forEach(child => {
          if (child.key === "newUpdate") {
            this.newUpdate = child.val();
              this.newUpdate ? this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("checkedAttendance")
                  .child(this.newUpdate)
                  .child("members")
                  .on("value", dataSnapshot => {
                      this.checkedMembers = [];
                      dataSnapshot.forEach(child => {
                          this.checkedMembers.push({
                              key: child.key,
                              email: child.child("email").val(),
                              latitude: child.child("latitude").val(),
                              longitude: child.child("longitude").val(),
                              isChecked: child.child("isChecked").val(),
                              name: child.child("name").val()
                          });
                      });
                      this.setState({})
                  }) : null;
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
    console.log(this.checkedMembers.length);
    let isChecked = false;
    this.checkedMembers.map((v, i)=>{
      if (v.email === this.User.user.email){
        if (v.isChecked === true){
          isChecked = true;
        }
      }
    });
    return (
      <View style={styles.container}>
        <TouchableOpacity
            onPress={() => {
                this.Global.modalType = false;
            }}
            style={styles.btn_close_view}
        >
          <Icon name="times" color="#5DADE2" size={__d(15)} />
        </TouchableOpacity>
        <View style={{
            width: width - __d(20),
            height: __d(80),
            justifyContent: "center",
            alignItems: "center"
        }}>
          <View style={{
              flexDirection: "row",
          }}>
            <Image
                source={require("./images/checked.png")}
                style={{
                    width: __d(20),
                    height: __d(20),
                    resizeMode: "contain",
                }}
            />
            <Text style={{
                paddingLeft: __d(5),
                fontSize: __d(20)
            }}>
              CHECK ATTENDANCE
            </Text>
          </View>
          <Text
              style={[
                  styles.btn_check_attendence_txt,
                  {
                      color: "#000",
                      paddingTop: __d(5)
                  }
              ]}
          >
              {this.checkedMembers.length} members checked
          </Text>
        </View>
        <FlatList
            style={styles.modal_checkmem_fl_view}
            keyExtractor={(item, index) => index}
            data={this.checkedMembers}
            extraData={this.state}
            renderItem={({ item, index }) =>
                this.renderCheckedMems(item, index)}
        />
          {this.checkedMembers.length > 0
              ? <TouchableOpacity
                  onPress={() => {
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
                      this.modalViewMap.open();
                  }}
                  style={styles.btn_done_view}
              >
                <Text style={styles.btn_check_attendence_txt}>View Map</Text>
              </TouchableOpacity>
              : null}
        <TouchableOpacity
          onPress={() => {
            this._getLocationAsync();
          }}
          style={[styles.btn_attendance_view,{
            backgroundColor: isChecked ? "#e1e1e1" : "#5DADE2"
          }]}
          disabled={isChecked}
        >
          <Text style={{
            fontSize: __d(13),
              color: "#fff"
          }}>
              {isChecked ? "Checked" : "Check"}
          </Text>
        </TouchableOpacity>
        <Modal
            ref={ref => {
                this.modalViewMap = ref;
            }}
            swipeToClose={false}
            backdropPressToClose={false}
            style={styles.modal_view}
            position={"top"}
        >
          <TouchableOpacity
              onPress={() => {
                  this.modalViewMap.close();
              }}
              style={styles.btn_close_view}
          >
            <Icon name="times" color="#5DADE2" size={__d(15)} />
          </TouchableOpacity>
            {this.admin
                ? <MapView
                    style={{
                        width: width - __d(10),
                        height: height - __d(150),
                        zIndex: 0
                    }}
                    region={{
                        latitude: this.admin ? this.admin.latitude : 10.8665654,
                        longitude: this.admin ? this.admin.longitude : 106.7977861,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    }}
                >
                    {this.checkedMembers.map((v, i) => {
                        let latlng = {
                            latitude: v.latitude,
                            longitude: v.longitude
                        };
                        return (
                            <MapView.Marker
                                key={i}
                                coordinate={latlng}
                                title={v.email}
                            />
                        );
                    })}
                </MapView>
                : null}
        </Modal>
      </View>
    );
  }
    renderCheckedMems(item, index) {
        let mem = this.FirebaseApi.accountData[item.key];
        return (
            <View
                style={{
                    width: width - __d(20),
                    height: __d(60),
                    paddingLeft: __d(10),
                    alignItems: "center",
                    flexDirection: "row",
                    backgroundColor: "#e1e1e1"
                }}
            >
              <Image
                  source={require("./images/avata.png")}
                  style={{
                      width: __d(40),
                      height: __d(40),
                      resizeMode: "contain",
                      justifyContent: "center",
                      alignItems: "center"
                  }}
              >
                <Image
                    source={mem ? { uri: mem.picture } : null}
                    style={{
                        width: __d(30),
                        height: __d(30),
                        resizeMode: "contain",
                        borderRadius: __d(15),
                        marginBottom: __d(7)
                    }}
                />
              </Image>
              <Text
                  style={{
                      fontSize: __d(13),
                      paddingLeft: __d(15)
                  }}
              >
                  {item.name} ({item.email.slice(0, item.email.indexOf("@"))})
              </Text>
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
    if (distance < DISTANCE) {
      this.itemRefs
        .child("Group")
        .child(this.Global.groupKey)
        .child("checkedAttendance")
        .child(this.newUpdate)
        .child("members")
        .child(this.User.user.id)
        .update({
          email: this.User.user.email,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
            isChecked: true,
            name: this.User.user.name
        });
    }else{
      Alert.alert("Warning!", "You can not check attendance!")
    }
  }
  memberCheckedAttendance() {
    this._getLocationAsync();
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(350),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: __d(10)
  },
  btn_attendance_view: {
    width: __d(80),
    height: __d(30),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
      marginBottom: __d(5),
      borderRadius: __d(5)
  },
    btn_close_view: {
        position: "absolute",
        top: -__d(20),
        right: -__d(10),
        width: __d(40),
        height: __d(40),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: __d(20),
        backgroundColor: "#fff",
        borderWidth: __d(1),
        borderColor: "#5DADE2",
        zIndex: 1
    },
    modal_view: {
        alignItems: "center",
        width: width - __d(10),
        height: height - __d(150),
        marginTop: -__d(50),
        zIndex: 0
    },
    modal_checkmem_header_txt: {
        fontSize: __d(20),
        fontWeight: "bold"
    },
    modal_checkmem_fl_view: {
        marginTop: __d(10),
        height: __d(100)
    },
    modal_checkmem_btn_view: {
        justifyContent: "center",
        alignItems: "center",
        width: __d(150),
        height: __d(50),
        marginTop: __d(20),
        borderRadius: __d(5),
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        backgroundColor: "#5DADE2"
    },
    modal_checkmem_btn_txt: {
        fontSize: __d(13),
        color: "#fff"
    },
    btn_check_attendence_txt: {
        fontSize: __d(13),
        color: "#fff"
    },
    btn_done_view: {
        width: __d(80),
        height: __d(35),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: __d(5),
        backgroundColor: "#5DADE2",
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        marginBottom: __d(5)
    },
});
