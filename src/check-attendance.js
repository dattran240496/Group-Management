import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  TextInput
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
    this.state = {
      groupName: ""
    };
    this.User = this.props.User;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    this.User.user = this.props.user;
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this._modalBox.open();
            }}
            style={{
              width: 100,
              height: 50,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>New Group</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 10,
            justifyContent: "center",
            alignItems: "center",
            width: width
          }}
        >
          <TouchableOpacity
            style={{
              width: 100,
              height: 30,
              backgroundColor: "#e1e1e1",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 3
            }}
            onPress={() => {
              AsyncStorage.removeItem("@user:key");
              Actions.login({ type: "replace" });
            }}
          >
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Modal
          ref={ref => (this._modalBox = ref)}
          style={{
            width: 300,
            height: 150,
            backgroundColor: "#fff",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
          }}
          position={"center"}
          swipeToClose={false}
        >
          <TextInput
            placeholder="Group name..."
            placeholderStyle={{ color: "#e1e1e1" }}
            style={{
              width: 180,
              height: 30,
              paddingLeft: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#e1e1e1",
              fontSize: 12,
              fontStyle: this.state.groupName !== "" ? "normal" : "italic"
            }}
            onChangeText={txt => {
                this.setState({groupName: txt})
            }}
          />
          <TouchableOpacity
              onPress={()=>{
                  this.pushGroupName()
              }}
              style={{ marginLeft: 10 }}>
            <Icon name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  pushGroupName(){
      this.itemRefs.child("Account").child(this.User.user.id).push({
          createdGroup: this.state.groupName
      })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
