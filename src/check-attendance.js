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
export default class CheckAttendance extends Component {
  @observable name = null;
  @observable info = null;
  @observable isChecking = false;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      groupName: this.Global.groupName,
      messages: null
    };
  }
  componentWillMount() {
    this.setState({});
    this.name = this.Global.groupName;
    this.info = this.FirebaseApi.accountData[
      this.FirebaseApi.groupData[this.name]._createGroupBy
    ];
    this.getMembers();
    this.getMessage();
  }
  componentDidMount() {
    this.itemRefs
      .child("Group")
      .child(this.name)
      .child("checkedAttendance")
      .child("isChecking")
      .on("value", dataSnapshot => {
        dataSnapshot.forEach(child => {
          this.isChecking = child.val();
          this.isChecking === "true"
            ? this.info.email !== this.User.user.email
              ? (this.Global.modalType = "member-check-attendance")
              : null
            : (this.Global.modalType = false);
        });
      });
  }
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <View
          style={{
            flex: 0.7,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1,
            justifyContent: "center",
            paddingLeft: 10
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold"
            }}
          >
            Group: {this.state.groupName.toString().replace("%", ".")}
          </Text>
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 10
            }}
          >
            <Icon name="cog" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 2.5,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10
          }}
        >
          <Image
            source={{ uri: this.info.picture }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              resizeMode: "contain"
            }}
          />

          <View>
            <View style={{ paddingLeft: 20, flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 20,
                  width: 100
                }}
              >
                Name
              </Text>
              <Text
                style={{
                  fontSize: 20
                }}
              >
                :
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  paddingLeft: 5
                }}
              >
                {this.info.name}
              </Text>
            </View>
            <View style={{ paddingLeft: 20, flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 20,
                  width: 100
                }}
              >
                Position
              </Text>
              <Text
                style={{
                  fontSize: 20
                }}
              >
                :
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  paddingLeft: 5
                }}
              >
                Lecture
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 3,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1
          }}
        >
          <FlatList
            style={{
              padding: 5
            }}
            ref={ref => (this.postMessage = ref)}
            keyExtractor={(item, index) => index}
            data={this.state.messages}
            extraData={this.state}
            renderItem={({ item, index }) => this._renderMessages(item, index)}
          />
          <View
            style={{
              width: width,
              height: 10
            }}
          />
        </View>

        <View
          style={{
            flex: 5,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {this.info.email === this.User.user.email &&
            <TouchableOpacity
              onPress={() => {
                this.Global.modalType = "check-attendance";
              }}
              style={{
                width: 150,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1
              }}
            >
              <Text style={{ fontSize: 15 }}>Check Attendance</Text>
            </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => {
              Actions.members();
            }}
            style={{
              width: 150,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderColor: "#e1e1e1",
              borderWidth: 1,
              marginTop: 10
            }}
          >
            <Text style={{ fontSize: 15 }}>Members</Text>
          </TouchableOpacity>

          {this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={{
                width: 150,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1,
                marginTop: 10
              }}
              onPress={() => {
                Actions.postMessage();
              }}
            >
              <Text style={{ fontSize: 15 }}>Post Message</Text>
            </TouchableOpacity>}
          {this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={{
                width: 150,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1,
                marginTop: 10
              }}
              onPress={() => {
                Actions.createPoll();
              }}
            >
              <Text style={{ fontSize: 15 }}>Create Poll</Text>
            </TouchableOpacity>}
        </View>
      </View>
    );
  }
  getMembers() {
    let key = {};
    this.itemRefs
      .child("Group")
      .child(this.Global.groupName)
      .child("groupMember")
      .on("value", dataSnapshot => {
        this.FirebaseApi.members = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.members[child.key] = {
            email: child.child("email").val(),
            token: child.child("token").val()
          };
        });
      });

    // if members and messages got, turn off modal loading
    this.FirebaseApi.members &&
    this.state.messages &&
    this.Global.modalType === "loading"
      ? (this.Global.modalType = false)
      : null;
  }
  getMessage() {
    let arrMessage = [];
    this.itemRefs
      .child("Group")
      .child(this.Global.groupName)
      .child("postedMessages")
      .on("value", dataSnapshot => {
        this.state.messages = [];
        arrMessage = [];
        dataSnapshot.forEach(child => {
          let index = {
            message: child.child("message").val(),
            timeAtPost: child.child("timeAtPost").val(),
            key: child.key
          };
          // this.state.messages[child.key] = {
          //     messages: child.child("message").val(),
          //     timeAtPost: child.child("timeAtPost").val()
          // }
          child.child("options").val()
            ? (index["options"] = child.child("options").val())
            : null;
          arrMessage.push(index);
        });
        arrMessage.reverse();
        this.setState({
          messages: arrMessage
        });
      });
    //console.log(this.state.messages);
    // if members and messages got, turn off modal loading
    this.FirebaseApi.members &&
    this.state.messages &&
    this.Global.modalType === "loading"
      ? (this.Global.modalType = false)
      : null;
  }
  _renderMessages(item, index) {
    return (
      <View
        style={{
          width: width,
          height: 20,
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        {item.options
          ? <Icon
              name="flag"
              color="#e1e1e1"
              size={15}
              style={{
                justifyContent: "center",
                paddingRight: 5
              }}
            />
          : null}
        <TouchableOpacity
          onPress={() => {
            console.log(item);
            //if option is poll, action to vote, else  action to message
            item.options
              ? Actions.votePoll({
                 poll: item
                })
              : Actions.detailMessage({ detailMessage: item });
          }}
          style={{
            width: item.options ? width - 170 : width - 150,
            height: 20
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 13,
              color: item.options ? "red" : null
            }}
          >
            {item.message}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            width: 130,
            height: 20,
            fontSize: 13,
            paddingLeft: 5
          }}
        >
          {item.timeAtPost}
        </Text>
      </View>
    );
  }
}
