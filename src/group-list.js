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
export default class CheckAttendance extends Component {
  constructor(props) {
    super(props);
    this.FirebaseApi = this.props.FirebaseApi;
    this.state = {
      txtName: ""
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 10
        }}
      >
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width - 30,
            height: 40,
            paddingLeft: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.txtName !== "" ? "normal" : "italic"
          }}
          onChangeText={txt => {
            this.setState({ txtName: txt });
          }}
        />
        <FlatList
          ref={ref => (this.flatList = ref)}
          keyExtractor={(item, index) => index}
          data={this.FirebaseApi.groupData}
          extraData={this.state}
          renderItem={({ item }) => this._renderItem(item)}
        />
      </View>
    );
  }
  _renderItem(item) {
    __DEV__ && console.log(item);
    return (
      <View key={"_key " + item} style={{}}>
        <TouchableOpacity
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
            {item._key}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
