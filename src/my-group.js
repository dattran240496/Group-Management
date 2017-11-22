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
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class MyGroup extends Component {
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    //this.getMyGroup();
    this.state = {
      myGroupName: "",
      myGroupList: this.FirebaseApi.myGroup
    };
  }
  componentWillMount() {
      this.setState({});
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 50,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.groupName !== "" ? "normal" : "italic"
          }}
          onChangeText={name => {}}
        />
        <FlatList
          ref={ref => (this.flatListMyGroup = ref)}
          keyExtractor={(item, index) => index}
          data={this.FirebaseApi.myGroup}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
      </View>
    );
  }

  _renderItem(item, index) {
    let name = item.groupName.replace("%", ".");
    return (
      <View key={"_key " + index} style={{}}>
        <TouchableOpacity
          onPress={() => {
            //this.state.groupName = Object.keys(item);
            this.Global.modalType = "loading";
            this.Global.groupKey = item.groupKey,
            Actions.checkAttendance();
          }}
          style={{
            width: width,
            height: 50,
            justifyContent: "center",
            paddingLeft: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#e1e1e1"
          }}
        >
          <Text
            style={{
              fontSize: 15
            }}
          >
            {name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
