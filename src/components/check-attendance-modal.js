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
import { __d } from "./helpers/index";
import Modal from "react-native-modalbox";
import firebase from "../api/api";
import moment from "moment";
import { Constants, Location, Permissions, FileSystem, MapView } from "expo";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class CheckAttendanceModal extends Component {
  @observable location = null;
  @observable isChecking = false;
  @observable checkedMembers = [];
  @observable newUpdate = null;
  @observable coordMembers = [];
  @observable admin = null;
  constructor(props) {
    super(props);
    this.itemRefs = firebase.database().ref("app_expo");
    this.Global = this.props.Global;
    this.state = {
      region: {
        latitude: 10.8665654,
        longitude: 106.7977861,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }
    };
  }

  componentWillMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("checkedAttendance")
      .child("isChecking")
      .on("value", dataSnapshot => {
        this.isChecking = dataSnapshot.child("value").val();
      });
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("newUpdate")
      .on("value", dataSnapshot => {
        this.newUpdate = dataSnapshot.val();
      });
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("checkedAttendance")
      .child(this.newUpdate)
      .child("members")
      .on("value", dataSnapshot => {
        this.checkedMembers = [];
        dataSnapshot.forEach(child => {
          this.checkedMembers.push({
            id: child.key,
            email: child.child("email").val(),
            latitude: child.child("latitude").val(),
            longitude: child.child("longitude").val()
          });
        });
      });
  }
  render() {
    console.log(this.isChecking);
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
        {this.isChecking === "false"
          ? <TouchableOpacity
              onPress={() => {
                this.checkAttendance();
              }}
              style={styles.btn_check_attendence_view}
            >
              <Text style={styles.btn_check_attendence_txt}>
                Check attendance
              </Text>
            </TouchableOpacity>
          : <Text
              style={[
                styles.btn_check_attendence_txt,
                {
                  color: "#000"
                }
              ]}
            >
              Members have already checked: {this.checkedMembers.length}
            </Text>}
        {this.checkedMembers.length > 0
          ? <TouchableOpacity
              onPress={() => {
                this.modalCheckedMems.open();
              }}
              style={styles.btn_done_view}
            >
              <Text style={styles.btn_check_attendence_txt}>
                Checked Members
              </Text>
            </TouchableOpacity>
          : null}
        <TouchableOpacity
          onPress={() => {
            this.isChecking = false;
            this.Global.modalType = false;
            this.itemRefs
              .child("Group")
              .child(this.Global.groupKey)
              .child("checkedAttendance")
              .child("isChecking")
              .update({
                value: "false"
              });
            //Expo.FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "test.txt", "Test");
          }}
          style={styles.btn_done_view}
        >
          <Text style={styles.btn_check_attendence_txt}>Done</Text>
        </TouchableOpacity>
        <Modal
          ref={ref => {
            this.modalCheckedMems = ref;
          }}
          swipeToClose={false}
          backdropPressToClose={false}
          style={[
            styles.modal_view,
            {
              paddingTop: __d(10),
              paddingBottom: __d(10)
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              this.modalCheckedMems.close();
            }}
            style={styles.btn_close_view}
          >
            <Icon name="times" color="#5DADE2" size={__d(15)} />
          </TouchableOpacity>
          <Text style={styles.modal_checkmem_header_txt}>Checked Members</Text>
          {this.checkedMembers
            ? <View
                style={{
                  alignItems: "center"
                }}
              >
                <FlatList
                  style={styles.modal_checkmem_fl_view}
                  keyExtractor={(item, index) => index}
                  data={this.checkedMembers}
                  extraData={this.state}
                  renderItem={({ item, index }) =>
                    this.renderCheckedMems(item, index)}
                />
                <TouchableOpacity
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
                  style={styles.modal_checkmem_btn_view}
                >
                  <Text style={styles.modal_checkmem_btn_txt}>View on Map</Text>
                </TouchableOpacity>
              </View>
            : <Text style={{ fontSize: __d(13) }}>No one!</Text>}
        </Modal>
        <Modal
          ref={ref => {
            this.modalViewMap = ref;
          }}
          swipeToClose={false}
          backdropPressToClose={false}
          style={styles.modal_view}
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
                  height: height - __d(150)
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
    return (
      <View
        style={{
          width: width - __d(10),
          height: __d(40),
          paddingLeft: __d(10),
          justifyContent: "center",
          borderTopWidth: __d(1),
          borderTopColor: "#e1e1e1",
          borderBottomWidth: __d(1),
          borderBottomColor: "#e1e1e1"
        }}
      >
        <Text
          style={{
            fontSize: __d(13)
          }}
        >
          {item.email}
        </Text>
      </View>
    );
  }
  async checkAttendance() {
    let _this = this;
    this.checkedMembers = [];
    // get current time
    let timeDate = new Date();

    // convert to moment
    let timeMoment = moment(timeDate, "YYYY-MM-DDhh:mm:ss");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    _this.isChecking = true;
    // this.admin = location;
    // let region = this.state.region;
    // this.admin
    //   ? (region.latitude = this.admin["coords"].latitude)
    //   : null;
    // this.admin
    //   ? (region.longitude = this.admin["coords"].longitude)
    //   : null;
    // this.setState({
    //   region: region
    // });
    //update time
    _this.newUpdate = timeMoment.format("YYYY-MM-DDhh:mm:ss").toString();
    _this.itemRefs.child("Group").child(this.Global.groupKey).update({
      newUpdate: _this.newUpdate
    });

    // update isChecking
    _this.itemRefs
      .child("Group")
      .child(_this.Global.groupKey)
      .child("checkedAttendance")
      .child("isChecking")
      .update({
        value: "true"
      });
    // update admin's location to members compare with it
    _this.itemRefs
      .child("Group")
      .child(_this.Global.groupKey)
      .child("checkedAttendance")
      .child(timeMoment.format("YYYY-MM-DDhh:mm:ss"))
      .update({
        latitude: location["coords"].latitude,
        longitude: location["coords"].longitude
      });
    // get admin's location
    navigator.geolocation.getCurrentPosition(
      position => {},
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
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
  btn_close_view: {
    position: "absolute",
    top: __d(-30),
    right: 0,
    width: __d(50),
    height: __d(25),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    backgroundColor: "#fff"
  },
  btn_check_attendence_view: {
    width: __d(150),
    height: __d(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    backgroundColor: "#5DADE2",
    borderColor: "#fff",
    borderWidth: __d(1)
  },
  btn_check_attendence_txt: {
    fontSize: __d(13),
    color: "#fff"
  },
  btn_done_view: {
    width: __d(150),
    height: __d(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    backgroundColor: "#5DADE2",
    borderColor: "#e1e1e1",
    borderWidth: __d(1),
    marginTop: __d(10)
  },
  modal_view: {
    width: width - __d(10),
    height: height - __d(150),
    position: "absolute",
    top: -__d(250) / 2,
    alignItems: "center"
  },
  modal_checkmem_header_txt: {
    fontSize: __d(20),
    fontWeight: "bold"
  },
  modal_checkmem_fl_view: {
    marginTop: __d(10),
    maxHeight: height - __d(280)
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
  }
});
