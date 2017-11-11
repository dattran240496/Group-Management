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
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class DetailMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.detailMessage
    };
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
            padding: 10
        }}
      >
          <Text style={{
              fontSize: 13,
              fontStyle: 'italic'
          }}>
              {this.state.message.timeAtPost}
          </Text>
          <Text style={{
              fontSize: 15,
          }}>
              {this.state.message.message}
          </Text>
      </View>
    );
  }
}
