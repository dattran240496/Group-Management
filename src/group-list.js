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
import { _ } from "lodash";
@autobind
@observer
export default class GroupList extends Component {
  @observable group = [];
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.state = {
      groupNameSearch: "",
      groupNameList: [],
      groupPass: "",
        groupSelectedToJoin: null
    };
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
      this.state.groupNameList = this.FirebaseApi.groupData;
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
            fontStyle: this.state.groupNameSearch !== "" ? "normal" : "italic"
          }}
          onChangeText={name => {
            this.setState({ groupNameSearch: name });
            this.filterGroupName(name);
          }}
        />
        <FlatList
          ref={ref => (this.flatList = ref)}
          keyExtractor={(item, index) => index}
          data={this.state.groupNameList}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
        <Modal
          ref={ref => (this._modalEnterPas = ref)}
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
            placeholder="Group pass..."
            placeholderStyle={{ color: "#e1e1e1" }}
            style={{
              marginTop: 5,
              width: 250,
              height: 40,
              paddingLeft: 10,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#e1e1e1",
              fontSize: 15,
              fontStyle: this.state.groupPass !== "" ? "normal" : "italic"
            }}
            onChangeText={txt => {
              this.setState({ groupPass: txt });
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.joinGroup();
            }}
            style={{
              marginTop: 15,
              width: 100,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#e1e1e1",
              borderWidth: 1
            }}
          >
            <Text>Join group</Text>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
  filterGroupName(name) {
    let _this = this;
    let groupData = this.FirebaseApi.groupData;
    groupData = _.filter(groupData, function(o) {
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.groupName.toString().toLowerCase());
    });
    this.setState({
      groupNameList: groupData
    });
  }

  _renderItem(item, index) {
    //console.log(Object.values(this.state.groupNameList));
    let name = item.groupName.replace("%", ".");
    return (
      <View key={"_key " + item} style={{}}>
        <TouchableOpacity
          onPress={() => {
            this._modalEnterPas.open();
            this.setState({
                groupSelectedToJoin: item
            })
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

  joinGroup() {
    let _id = this.User.user.id;
    let isJoined = false;
    this.FirebaseApi.myGroup.map((v, i)=>{
       v === this.state.groupSelectedToJoin.groupName ? isJoined = true : null
    });
    console.log(this.state.groupSelectedToJoin);
    _id === this.state.groupSelectedToJoin.createdGroupBy || isJoined // if user joined this group
      ? Alert.alert("Warning!", "You joined this group!")
      : this.state.groupPass === "" // if password is empty
        ? Alert.alert("Warning!", "Password is not empty!")
        : this.state.groupPass ===
        this.state.groupSelectedToJoin.groupPass // if password is true
          ? (
              this.itemRefs
                .child("Group")
                .child(this.state.groupSelectedToJoin.key)
                .child("groupMember")
                .child(_id)
                .update({
                  email: this.User.user.email
                }),
              this.itemRefs
                .child("Account")
                .child(this.User.user.id)
                .child("MyGroup")
                  .child(this.state.groupSelectedToJoin.key)
                .update({
                    groupName: this.state.groupSelectedToJoin.groupName
                }),
              this._modalEnterPas.close()
            )
          : Alert.alert("Warning!", "Invalid password!");
  }
}
