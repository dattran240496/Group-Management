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
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { _ } from "lodash";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class Members extends Component {
  @observable members = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      email: ""
    };
  }
  componentWillMount() {
    this.members = Object.values(this.FirebaseApi.members);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TextInput
          placeholder="Email..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width,
            height: 50,
            paddingLeft: 10,
            borderWidth: 1,
            borderColor: "#e1e1e1",
            fontSize: 15,
            fontStyle: this.state.email !== "" ? "normal" : "italic"
          }}
          onChangeText={name => {
            this.setState({ email: name });
            this._filterEmail(name);
          }}
        />
        <Text
          style={{
            padding: 10
          }}
        >
          Total members: {this.members.length}
        </Text>
        <FlatList
          ref={ref => (this.flatListMem = ref)}
          keyExtractor={(item, index) => index}
          data={this.members}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
      </View>
    );
  }

  _filterEmail(name) {
    let groupData = Object.values(this.FirebaseApi.members);
    groupData = _.filter(groupData, function(o) {
      o = o.email;
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.toString().toLowerCase());
    });
    this.members = groupData;
  }

  _renderItem(item, index) {
    return (
      <View key={"_key " + item} style={{}}>
        <TouchableOpacity
          onPress={() => {}}
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
            {item.email}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
