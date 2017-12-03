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
  FlatList
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "./components/helpers/index";
import { _ } from "lodash";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class MyGroup extends Component {
  @observable numberGroupMem = 0;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      myGroupName: "",
      myGroupList: this.FirebaseApi.myGroup
    };
  }
  componentWillMount() {
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff"
        }}
      >
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width - __d(30),
            height: __d(40),
            paddingLeft: __d(10),
            borderWidth: 1,
            borderColor: "#e1e1e1",
            fontSize: __d(13),
            fontStyle: this.state.myGroupName !== "" ? "normal" : "italic",
            borderRadius: __d(5),
            marginTop: __d(20),
            backgroundColor: "#fff"
          }}
          onChangeText={name => {
            this.setState({ myGroupName: name });
            this.filterGroupName(name);
          }}
        />
        <FlatList
          style={{
            borderTopWidth: 1,
            borderTopColor: "#e1e1e1",
            marginTop: __d(10)
          }}
          ref={ref => (this.flatListMyGroup = ref)}
          keyExtractor={(item, index) => index}
          data={this.state.myGroupList}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
      </View>
    );
  }

  _renderItem(item, index) {
    let name = item.groupName.replace("%", ".");
    let groupMem = "";
    this.itemRefs
      .child("Group")
      .child(item.groupKey)
      .child("groupMember")
      .on("value", dataSnapshot => {
        groupMem = dataSnapshot.val();
        index === this.FirebaseApi.myGroup.length - 1
          ? (this.Global.modalType = false)
          : null;
      });
    //console.log(Object.values(groupMem).length);
    groupMem = groupMem ? Object.values(groupMem).length : 0;
    return (
      <View key={"_key " + index} style={{}}>
        <TouchableOpacity
          onPress={() => {
            //this.state.groupName = Object.keys(item);
            this.Global.modalType = "loading";
            this.Global.groupKey = item.groupKey;
            Actions.checkAttendance();
          }}
          style={{
            width: width,
            height: __d(50),
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#e1e1e1",
            backgroundColor: "#fff",
            flexDirection: "row"
          }}
        >
          <View
            style={{
              width: __d(50),
              height: __d(50),
              backgroundColor: "#5DADE2",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: __d(36),
                height: __d(36),
                borderRadius: __d(18),
                borderWidth: __d(1),
                borderColor: "#fff",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: "#fff"
                }}
              >
                {groupMem}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: __d(15),
              flex: 1,
              paddingLeft: __d(10)
            }}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  filterGroupName(name) {
    let _this = this;
    let groupData = this.FirebaseApi.myGroup;
    groupData = _.filter(groupData, function(o) {
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.groupName.toString().toLowerCase());
    });
    this.setState({
      myGroupList: groupData
    });
  }
  getMyGroup() {
    // this.itemRefs
    //   .child("Account")
    //   .child(this.User.user.id)
    //   .child("MyGroup")
    //   .on("value", dataSnapshot => {
    //     this.FirebaseApi.myGroup = [];
    //     dataSnapshot.forEach(child => {
    //       this.FirebaseApi.myGroup.push({
    //         groupName: child.child("groupName").val(),
    //         groupKey: child.key
    //       });
    //     });
    //     !_.isEmpty(this.FirebaseApi.myGroup) &&
    //     //this.FirebaseApi.groupData &&
    //     //this.FirebaseApi.accountData &&
    //     this.Global.modalType === "loading"
    //       ? (
    //           this.setState({
    //             myGroupList: this.FirebaseApi.myGroup
    //           }),
    //           (this.Global.modalType = false)
    //         )
    //       : null;
    //   });
  }
}
