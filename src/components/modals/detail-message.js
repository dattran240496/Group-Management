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
  FlatList,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import { __d } from "../helpers/index";
import Modal from "react-native-modalbox";
import moment from "moment";
import Dash from "react-native-dash";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class DetailMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  @observable messageEdit = this.Global.selectedMessage;
  @observable info = null;
  componentWillMount() {
    let idAdmin = "";
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
      });
    this.info = this.FirebaseApi.accountData[idAdmin];
  }
  render() {
    let moment = this.messageEdit
      ? this.convertDate(this.messageEdit.timeAtPost)
      : null;
    let timeAtPost = moment
      ? moment.format("YYYY") +
        "/" +
        moment.format("MM") +
        "/" +
        moment.format("MM") +
        " - " +
        moment.format("hh") +
        ":" +
        moment.format("mm")
      : "";
    return (
      <KeyboardAvoidingView
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        behavior="padding"
      >
        <View
          style={{
            width: width,
            height: __d(40),
            //position: "absolute",
            //right: -__d(10),
            //top: -__d(20),
            alignItems: "flex-end",
            elevation: 1,
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              width: width - __d(20),
              height: __d(20)
            }}
          />
          <View
            style={{
              width: width,
              height: __d(20),
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: width - __d(20),
                height: __d(20),
                backgroundColor: "#fff"
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.Global.modalType = false;
            }}
            style={{
              width: __d(40),
              height: __d(40),
              borderRadius: __d(20),
              borderWidth: __d(1),
              borderColor: "#5DADE2",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              backgroundColor: "#fff",
              zIndex: 100,
              right: __d(0)
            }}
          >
            <Icon name="times" color="#5DADE2" size={15} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width - __d(20),
            height: __d(300),
            backgroundColor: "#fff"
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end"
              }}
            >
              <Text
                style={{
                  fontSize: __d(15)
                }}
              >
                {timeAtPost}
              </Text>
            </View>
            <View
              style={{
                flex: 1
              }}
            >
              <TextInput
                underlineColorAndroid="transparent"
                style={{
                  fontSize: __d(15),
                  width: width - __d(30),
                  height: __d(30),
                  textAlign: "center"
                }}
                editable={
                  this.info && this.info.email === this.User.user.email
                    ? true
                    : false
                }
                value={this.messageEdit ? this.messageEdit.title : null}
                onChangeText={title => {
                  this.messageEdit.title = title;
                }}
              />
            </View>
          </View>
          <Dash
            dashGap={5}
            dashLength={7}
            dashThickness={1}
            style={{ width: width - __d(21), height: __d(1) }}
          />
          <View
            style={{
              flex: 2,
              padding: __d(10)
            }}
          >
            <TextInput
              underlineColorAndroid="transparent"
              value={this.messageEdit ? this.messageEdit.message : null}
              style={{
                fontSize: __d(13),
                flex: 1,
                textAlignVertical: Platform.OS === "android" ? "top" : null,
                paddingTop: __d(10)
              }}
              onChangeText={title => {
                this.messageEdit.message = title;
              }}
              multiline={true}
              editable={
                this.info && this.info.email === this.User.user.email
                  ? true
                  : false
              }
            />
          </View>
          {this.info && this.info.email === this.User.user.email
            ? <TouchableOpacity
                onPress={() => {
                  this.postMessage();
                }}
                style={{
                  width: __d(80),
                  height: __d(30),
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: __d(5),
                  backgroundColor: "#5DADE2",
                  marginLeft: (width - __d(20)) / 2 - __d(40),
                  marginBottom: __d(5)
                }}
              >
                <Text
                  style={{
                    fontSize: __d(13),
                    color: "#fff"
                  }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            : null}
        </View>
      </KeyboardAvoidingView>
    );
  }
  convertDate(date) {
    return moment(date, "YYYY-MM-DDhh:mm:ss");
  }
  postMessage() {
    if (this.messageEdit) {
      let timeAtPost = new Date(); // get time at post
      let month =
        (timeAtPost.getMonth() + 1).toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
      let day = timeAtPost.getDate().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
      let hours = timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
      let minutes = timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
      // format time: dd/mm/yyyy - hh:mm
      let mometTimeAtPost = moment(timeAtPost, "YYYY-MM-DDhh:mm:ss");
      let formatTime = mometTimeAtPost.format("YYYY-MM-DDhh:mm:ss");
      this.itemRefs
        .child("Group")
        .child(this.Global.groupKey)
        .child("postedMessages")
        .child(this.messageEdit.key)
        .set({
          message: this.messageEdit.message,
          title: this.messageEdit.title,
          timeAtPost: formatTime
        });
    }
    this.Global.modalType = false;
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(350),
    backgroundColor: "#fff"
  },
  timeAtPost_txt: {
    fontSize: __d(13),
    fontStyle: "italic"
  },
  txt_input_mess: {
    width: width - __d(30),
    height: __d(120),
    padding: __d(10),
    borderRadius: __d(10),
    borderColor: "#e1e1e1",
    borderWidth: __d(1),
    marginTop: __d(10),
    fontSize: __d(13)
  },
  btn_update_view: {
    width: __d(120),
    height: __d(40),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    marginTop: __d(15),
    marginLeft: (width - __d(120)) / 2
  },
  btn_update_txt: {
    color: "#fff",
    fontSize: __d(13)
  }
});
