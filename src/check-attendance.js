import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  TextInput,
  Alert
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
      groupName: "",
      groupPass: ""
    };
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
      console.log(this.getGroupName());
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
              width: 120,
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

          <TouchableOpacity
            onPress={() => {
                Actions.groupList();
            }}
            style={{
              marginTop: 10,
              width: 120,
              height: 50,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>Find Group</Text>
          </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    Actions.myGroup();
                }}
                style={{
                    marginTop: 10,
                    width: 120,
                    height: 50,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "#e1e1e1",
                    borderWidth: 1
                }}
            >
                <Text>My Group</Text>
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
            alignItems: "center"
            //flexDirection: "row"
          }}
          position={"center"}
          swipeToClose={false}
          coverScreen={true}
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
              this.setState({ groupName: txt });
            }}
          />
          <TextInput
            placeholder="Group pass..."
            placeholderStyle={{ color: "#e1e1e1" }}
            style={{
              marginTop: 5,
              width: 180,
              height: 30,
              paddingLeft: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#e1e1e1",
              fontSize: 12,
              fontStyle: this.state.groupPass !== "" ? "normal" : "italic"
            }}
            onChangeText={txt => {
              this.setState({ groupPass: txt });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.pushGroupName();
              this._modalBox.close();
            }}
            style={{ marginTop: 5 }}
          >
            <Icon name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  pushGroupName() {
    this.FirebaseApi.groupData.map((v, i) => {
      if (v._key === this.state.groupName) {
        Alert.alert("Warning!", "Group name existed!");
        return this._modalBox.close();
      }
    });
    this.itemRefs.child("Group").child(this.state.groupName).update({
      createdGroupBy: this.User.user.id,
      groupPass: this.state.groupPass
    });
    this.itemRefs.child("Account")
  }
  getGroupName() {
    let group = [];
    let key = {};
    this.itemRefs.child("Group").on("value", dataSnapshot => {
        this.FirebaseApi.groupData = [];
      dataSnapshot.forEach(child => {
        key = {};
        key[child.key] = {
          _createGroupBy: child.child("createdGroupBy").val(),
          _groupPass: child.child("groupPass").val()
        };
          this.FirebaseApi.groupData.push(key);
      });
    });

    return this.FirebaseApi.groupData;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
