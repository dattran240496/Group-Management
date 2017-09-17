import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";

@autobind
@observer
export default class CheckAttendance extends Component {
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.User.user = this.props.user;
    console.log(this.User.user);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>CheckAttendance</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
