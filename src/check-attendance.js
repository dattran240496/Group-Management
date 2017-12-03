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
import { __d } from "./components/helpers/index";
@autobind
@observer
export default class CheckAttendance extends Component {
  @observable name = null;
  @observable isChecking = false;
  @observable isEdit = false;
  @observable info = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      groupName: this.Global.groupName,
      messages: null,
      groupKey: ""
    };
  }
  componentWillMount() {
    this.getInfoAdminAndGroup();
    this.getMembers();
    this.getMessage();
  }
  componentDidMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
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
          flex: 1,
          backgroundColor: "#fff"
        }}
      >
        <View
          style={{
            width: width,
            height: 64,
            backgroundColor: "#5DADE2",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Actions.pop({ type: "refresh" });
            }}
            style={{
              left: 15,
              top: 20,
              position: "absolute"
            }}
          >
            <Icon name="angle-left" size={32} color="#fff" />
          </TouchableOpacity>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              marginTop: 10
            }}
          >
            {this.Global.groupName.toString().replace("%", ".")}
          </Text>
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 15,
                top: 27
              }}
              onPress={() => {
                this.isEdit = !this.isEdit;
              }}
            >
              {this.isEdit
                ? <View
                    style={{
                      width: 150,
                      height: 50,
                      position: "absolute",
                      backgroundColor: "#fff",
                      borderWidth: 1,
                      borderColor: "#e1e1e1",
                      top: 20,
                      right: 5,
                      zIndex: 1
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.isEdit = false;
                        Actions.editGroup({
                          title: "Change group name",
                          typeEdit: "name"
                        });
                      }}
                      style={{
                        width: 150,
                        height: 25,
                        justifyContent: "center",
                        alignItems: "center",
                        borderBottomWidth: 1,
                        borderBottomColor: "#e1e1e1"
                      }}
                    >
                      <Text>Change group name</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        this.isEdit = false;
                        Actions.editGroup({
                          title: "Change password",
                          typeEdit: "password"
                        });
                      }}
                      style={{
                        width: 150,
                        height: 25,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text>Change password</Text>
                    </TouchableOpacity>
                  </View>
                : null}
              <Icon name="cog" size={20} color="#fff" />
            </TouchableOpacity>}
        </View>

        <View
          style={{
            flex: 2.5,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1,
            padding: 10,
            zIndex: 0,
            borderTopColor: "#e1e1e1",
            borderTopWidth: 1,
            justifyContent: "center"
          }}
        >
          <View
            style={{
              backgroundColor: "#5DADE2",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 15,
              padding: 10
            }}
          >
            <Image
              source={this.info ? { uri: this.info.picture } : null}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                resizeMode: "contain"
              }}
            />

            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 13,
                    width: 50,
                    color: "#fff"
                  }}
                >
                  Name
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#fff"
                  }}
                >
                  :
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    paddingLeft: 5,
                    color: "#FFF"
                  }}
                >
                  {this.info ? this.info.name : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 13,
                    width: 50,
                    color: "#fff"
                  }}
                >
                  Email
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#fff"
                  }}
                >
                  :
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 15,
                    marginLeft: 5,
                    color: "#fff",
                    flex: 1
                  }}
                >
                  {this.info ? this.info.email : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            flex: 5,
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: 1,
            backgroundColor: "#FFF"
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
              height: 10
            }}
          />
        </View>

        <View
          style={{
            width: width,
            height: 190,
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "center",
              alignItems: "center"
          }}
        >
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              onPress={() => {
                this.Global.modalType = "check-attendance";
              }}
              style={{
                width: 150,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1,
                backgroundColor: "#5DADE2"
              }}
            >
              <Icon name="check-circle-o" color="#fff" size={40} />
              {/*<Text style={{ fontSize: 15, color: "#fff", paddingTop: 5 }}>*/}
              {/*Check Attendance*/}
              {/*</Text>*/}
            </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => {
              Actions.members();
            }}
            style={{
              width: 150,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderColor: "#e1e1e1",
              borderWidth: 1,
              backgroundColor: "#5DADE2",
              marginLeft: 10
            }}
          >
            <Icon name="users" color="#fff" size={40} />
            {/*<Text style={{ fontSize: 15, color: "#fff" }}>Members</Text>*/}
          </TouchableOpacity>

          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={{
                width: 150,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1,
                backgroundColor: "#5DADE2",
                marginTop: 10
              }}
              onPress={() => {
                Actions.postMessage();
              }}
            >
              <Icon name="commenting-o" color="#fff" size={40} />
              {/*<Text*/}
              {/*style={{*/}
              {/*fontSize: 15,*/}
              {/*color: "#fff"*/}
              {/*}}*/}
              {/*>*/}
              {/*Post Message*/}
              {/*</Text>*/}
            </TouchableOpacity>}
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={{
                width: 150,
                height: 80,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
                borderColor: "#e1e1e1",
                borderWidth: 1,
                backgroundColor: "#5DADE2",
                marginLeft: 10,
                marginTop: 10
              }}
              onPress={() => {
                Actions.createPoll();
              }}
            >
              <Icon name="flag" color="#fff" size={40} />
              {/*<Text style={{ fontSize: 15, color: "#fff" }}>Create Poll</Text>*/}
            </TouchableOpacity>}
        </View>
      </View>
    );
  }
  getInfoAdminAndGroup() {
    let _this = this;
    let idAdmin = "";
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
        this.info = _this.FirebaseApi.accountData[dataSnapshot.val()];
        this.info && this.Global.modalType === "loading"
          ? (this.Global.modalType = false)
          : null;
      });

    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("groupName")
      .on("value", dataSnapshot => {
        this.Global.groupName = dataSnapshot.val();
      });
  }
  getMembers() {
    let key = {};
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
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
      .child(this.Global.groupKey)
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
            paddingLeft: 5,
            fontStyle: "italic"
          }}
        >
          {item.timeAtPost}
        </Text>
      </View>
    );
  }
}
