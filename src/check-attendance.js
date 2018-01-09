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
  Image,
  TouchableHighlight,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Swipeout from "react-native-swipeout";
import Footer from "./components/components-footer/footer";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import Dash from "react-native-dash";
import { __d } from "./components/helpers/index";
import { _ } from "lodash";

const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class CheckAttendance extends Component {
  @observable name = null;
  @observable isChecking = false;
  @observable isEdit = false;
  @observable info = null;
  @observable indexSelected = -1;
  @observable indexSelectedOption = 1;
  @observable isAdmin = false;
  @observable messageSelected = null;
  @observable pollSelected = null;
  @observable messageEdit = null;
  @observable pollEdit = null;
    @observable arrOptions = [""];
    @observable poll = null;
    @observable messages = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      groupName: this.Global.groupName,
      messages: null,
      groupKey: "",
      poll: null
    };
  }
  componentWillMount() {
      this.Global.isFooter = true;
    this.getInfoAdminAndGroup();
    this.getMembers();
    this.getMessage();
    this.getPoll();
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("checkedAttendance")
      .child("isChecking")
      .on("value", dataSnapshot => {
        dataSnapshot.forEach(child => {
          this.isChecking = child.val();
          this.isChecking === "true"
            ? this.info && this.info.email !== this.User.user.email
              ? (this.Global.modalType = "member-check-attendance")
              : null
            : null;
        });
      });
    let isAdmin =
      this.info && this.info.email === this.User.user.email ? true : false;
    this.isAdmin = isAdmin;
  }
  componentDidMount() {
    this.info &&
    this.FirebaseApi.members &&
    this.state.messages &&
    this.Global.modalType === "loading"
      ? (this.Global.modalType = false)
      : null;
  }

  render() {
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding">
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.Global.isFooter = false;
            Actions.pop({ type: "refresh" });
            this.Global.modalGroupManagement = "myGroup";
          }}
          style={{
            marginTop: __d(15),
            marginLeft: __d(10)
          }}>
          <Icon name="arrow-left" size={__d(25)} color="#5DADE2"/>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            padding: __d(10)
          }}
        >
          <Image
            source={require("./images/check-attendance/avata.png")}
            style={{
              width: __d(55),
              height: __d(55),
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={this.info ? { uri: this.info.picture } : null}
              style={{
                width: __d(40),
                height: __d(40),
                resizeMode: "cover",
                borderRadius: __d(20),
                marginBottom: __d(10)
              }}
            />
          </Image>
          <View
            style={{
              width: width - __d(110),
              paddingLeft: __d(20)
            }}
          >
            <TextInput
              underlineColorAndroid="transparent"
              placeholder="Group name..."
              placeholderStyle={{ color: "#e1e1e1" }}
              style={[
                {
                  width: width - __d(110),
                  height: __d(20),
                  fontSize: __d(13)
                }
              ]}
              editable={this.isEdit}
              value={this.state.groupName}
              onChangeText={name => {
                this.setState({ groupName: name });
              }}
              onSubmitEditing={() => {
                this.isEditName = false;
                this.changeGroupName();
              }}
            />
            {!_.isEmpty(this.errors) &&
              <Text style={{ color: "red", fontSize: __d(13) }}>
                {this.errors}
              </Text>}
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                  onPress={()=>{
                      this.Global.modalType = "member";
                  }}
                  style={{
                  flexDirection: "row",
              }}>
                  <Image
                      source={require("./images/check-attendance/group.png")}
                      style={{
                          width: __d(20),
                          height: __d(20),
                          resizeMode: "contain"
                      }}
                  />
                  <Text
                      style={{
                          fontSize: __d(15),
                          paddingLeft: __d(5)
                      }}
                  >
                      {this.FirebaseApi.members
                          ? Object.values(this.FirebaseApi.members).length
                          : null}{" "}
                      members
                  </Text>
              </TouchableOpacity>
            </View>
          </View>
          {this.isAdmin
            ? <View
                style={{
                  width: __d(30),
                  alignItems: "flex-end"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.isEdit = true;
                  }}
                >
                  <Image
                    source={require("./images/check-attendance/pencil.png")}
                    style={{
                      width: __d(15),
                      height: __d(15),
                      resizeMode: "contain"
                    }}
                  />
                </TouchableOpacity>
              </View>
            : null}
        </View>
        <View style={[styles.list_mess_view]}>
          <View
            style={{
              width: width,
              height: __d(50),
              flexDirection: "row"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.indexSelectedOption = 1;
              }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: __d(3),
                borderBottomColor:
                  this.indexSelectedOption === 1 ? "#5DADE2" : "#e1e1e1"
              }}
            >
              <Image
                source={
                  this.indexSelectedOption === 1
                    ? require("./images/check-attendance/chat.png")
                    : require("./images/check-attendance/un-chat.png")
                }
                style={{
                  width: __d(40),
                  height: __d(40),
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.indexSelectedOption = 2;
              }}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: __d(3),
                borderBottomColor:
                  this.indexSelectedOption === 2 ? "#5DADE2" : "#e1e1e1"
              }}
            >
              <Image
                source={
                  this.indexSelectedOption === 2
                    ? require("./images/check-attendance/poll.png")
                    : require("./images/check-attendance/un-poll.png")
                }
                style={{
                  width: __d(40),
                  height: __d(40),
                  resizeMode: "contain"
                }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            style={{
              backgroundColor: "#e1e1e1",
            }}
            ref={ref => (this.renderMess = ref)}
            keyExtractor={(item, index) => index}
            data={
              this.indexSelectedOption === 1
                ? this.messages
                : this.poll
            }
            extraData={this.state}
            renderItem={({ item, index }) =>
              this.indexSelectedOption === 1
                ? this._renderMessages(item, index)
                : this._renderPoll(item, index)}
          />
          <View
            style={{
              height: 10,
              backgroundColor: "#e1e1e1"
            }}
          />
          <View
            style={{
              backgroundColor: "#e1e1e1",
                width: width,
                height: __d(120)
            }}
          >
              <Footer
                  style={{
                      width: __d(120),
                      height: __d(120),
                      backgroundColor: "red"
                  }}
                  Global={this.Global}
                  User={this.User}
                  Firebase={this.FirebaseApi}
              />
          </View>
        </View>
          <Modal
              style={[{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  width: width,
                  height: height
              }]}
              ref={ref => (this.modalDelete = ref)}
              swipeToClose={false}
              backdropPressToClose={false}
              position={"center"}>
              <View style={{
                  width: width - __d(20),
                  height: __d(120),
                  backgroundColor: "#fff"
              }}>
                  <View style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center"
                  }}>
                      <Text style={{
                          fontSize: __d(15)
                      }}>
                          Do you want to delete it?
                      </Text>
                  </View>
                  <View style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row"
                  }}>
                      <TouchableOpacity
                          onPress={()=>{
                              let child = this.itemRefs
                                  .child("Group")
                                  .child(this.Global.groupKey)
                                  .child("postedMessages")
                                  .child(this.messageSelected.key);
                              child.remove();
                              this.modalDelete.close();
                          }}
                          style={{
                              width: __d(80),
                              height: __d(30),
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "red"
                          }}>
                          <Text style={{
                              fontSize: __d(13),
                              color: "#fff"
                          }}>
                              Delete
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={()=>{
                              this.modalDelete.close();
                          }}
                          style={{
                              width: __d(80),
                              height: __d(30),
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#e1e1e1",
                              marginLeft: __d(15)
                          }}>
                          <Text style={{
                              fontSize: __d(13),
                              color: "#fff"
                          }}>
                              Cancel
                          </Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>
          <Modal
              style={[{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: 'transparent',
                  flex:1
              }]}
              ref={ref => (this.modalDeletePoll = ref)}
              swipeToClose={false}
              backdropPressToClose={false}
              position={"center"}>
              <View style={{
                  width: width - __d(20),
                  height: __d(120),
                  backgroundColor: "#fff"
              }}>
                  <View style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                  }}>
                      <Text style={{
                          fontSize: __d(15)
                      }}>
                          Do you want to delete it?
                      </Text>
                  </View>
                  <View style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row"
                  }}>
                      <TouchableOpacity
                          onPress={()=>{
                              let child = this.itemRefs
                                  .child("Group")
                                  .child(this.Global.groupKey)
                                  .child("postedPoll")
                                  .child(this.pollSelected.key);
                              child.remove();
                              this.modalDeletePoll.close();
                          }}
                          style={{
                              width: __d(80),
                              height: __d(30),
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "red"
                          }}>
                          <Text style={{
                              fontSize: __d(13),
                              color: "#fff"
                          }}>
                              Delete
                          </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={()=>{
                              this.modalDeletePoll.close();
                          }}
                          style={{
                              width: __d(80),
                              height: __d(30),
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#e1e1e1",
                              marginLeft: __d(15)
                          }}>
                          <Text style={{
                              fontSize: __d(13),
                              color: "#fff"
                          }}>
                              Cancel
                          </Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Modal>
      </View>
        </KeyboardAvoidingView>

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
        this.FirebaseApi.members &&
        this.state.messages &&
        this.Global.modalType === "loading"
          ? ((this.Global.modalType = false), this.setState({}))
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
    let _this = this;
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("groupMember")
      .on("value", dataSnapshot => {
        this.FirebaseApi.members = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.members[child.key] = {
            email: child.child("email").val(),
            token: _this.FirebaseApi.accountData[child.key].token,
            name: child.child("name").val(),
              key: child.key
          };
          this.info &&
          this.state.messages &&
          this.Global.modalType === "loading"
            ? ((this.Global.modalType = false), this.setState({}))
            : null;
        });
      });

    // if members and messages got, turn off modal loading
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
            key: child.key,
            title: child.child("title").val()
          };
          arrMessage.push(index);
        });
        arrMessage.reverse();

          this.messages = arrMessage

        this.info &&
        this.FirebaseApi.members &&
        this.Global.modalType === "loading"
          ? ((this.Global.modalType = false), this.setState({}))
          : null;
      });
    //console.log(this.state.messages);
    // if members and messages got, turn off modal loading
  }
  getPoll() {
    let arrMessage = [];
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("postedPoll")
      .on("value", dataSnapshot => {
        this.state.messages = [];
        arrMessage = [];
        dataSnapshot.forEach(child => {
          let index = {
            message: child.child("message").val(),
            timeAtPost: child.child("timeAtPost").val(),
              voted: child.child("voted").val(),
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
          this.poll = arrMessage;
        this.info &&
        this.FirebaseApi.members &&
        this.Global.modalType === "loading"
          ? ((this.Global.modalType = false), this.setState({}))
          : null;
      });
  }
  _renderMessages(item, index) {
    let momentTimeAtPost = moment(item.timeAtPost, "YYYY-MM-DD");
    let _this = this;
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "red",
        onPress: () => {
          let child = _this.itemRefs
            .child("Group")
            .child(this.Global.groupKey)
            .child("postedMessages")
            .child(item.key);
          child.remove();
        }
      }
    ];
    let messageView = [];
    let date = momentTimeAtPost.format("DD");
    let month = this.Global.month[momentTimeAtPost.format("M")];
    messageView.push(
      <View key={index} style={styles.child_mess_view}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            this.messageSelected = item;
            this.messageEdit = item;
            this.Global.selectedMessage = item;
            this.Global.modalType = "message";
          }}
          style={{
            width: width - __d(20),
            height: __d(70),
            backgroundColor: "#fff"
          }}
          onLongPress ={(e)=>{
              Platform.OS === "android" ? this.modalDelete.open() : null;
              this.messageSelected = item;
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: width - __d(20),
              height: __d(70),
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                height: __d(70),
                width: __d(70)
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderBottomColor: "#5DADE2",
                  borderBottomWidth: __d(1),
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: __d(15),
                    color: "#5DADE2"
                  }}
                >
                  {date}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: __d(15),
                    color: "#5DADE2"
                  }}
                >
                  {month}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: __d(5),
                height: __d(70),
                backgroundColor: "#e1e1e1"
              }}
            />
            <View
              style={{
                width: width - __d(95),
                height: __d(70),
                paddingLeft: __d(5)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: __d(18),
                    color: item.options ? "red" : null,
                    justifyContent: "center"
                  }}
                >
                  {item.title.toString().toUpperCase()}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: __d(13),
                    color: item.options ? "red" : null
                  }}
                >
                  {item.message}
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );

    return (
      <View style={{
          marginTop: __d(10)
      }}>
        {this.info.email === this.User.user.email
          ? <Swipeout
              right={swipeBtns}
              backgroundColor="transparent"
              autoClose={true}
            >
              {messageView}
            </Swipeout>
          : messageView}

      </View>
    );
  }
  _renderPoll(item, index) {
    let momentTimeAtPost = moment(item.timeAtPost, "YYYY-MM-DD");
    let _this = this;
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "red",
        onPress: () => {
          let child = _this.itemRefs
            .child("Group")
            .child(this.Global.groupKey)
            .child("postedPoll")
            .child(item.key);
          child.remove();
        }
      }
    ];
    let messageView = [];
    let date = momentTimeAtPost.format("DD");
    let month = this.Global.month[momentTimeAtPost.format("M")];
    let numberOptions = item.options ? item.options.length : 0;
    messageView.push(
      <View key={index} style={styles.child_mess_view}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
              this.Global.selectedPoll = item;
              this.Global.modalType = "poll";
          }}
          style={{
            width: width - __d(20),
            height: __d(70),
            backgroundColor: "#fff"
          }}
          onLongPress ={(e)=>{
              Platform.OS === "android" ? this.modalDeletePoll.open() : null;
              this.pollSelected = item;
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: width - __d(20),
              height: __d(70),
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                height: __d(70),
                width: __d(70)
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderBottomColor: "#5DADE2",
                  borderBottomWidth: __d(1),
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: __d(15),
                    color: "#5DADE2"
                  }}
                >
                  {date}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: __d(15),
                    color: "#5DADE2"
                  }}
                >
                  {month}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: __d(5),
                height: __d(70),
                backgroundColor: "#e1e1e1"
              }}
            />
            <View
              style={{
                width: width - __d(95),
                height: __d(70),
                paddingLeft: __d(5)
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: __d(18),
                    justifyContent: "center"
                  }}
                >
                  {item.message.toString().toUpperCase()}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "flex-end"
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: __d(13),
                    paddingRight: __d(10),
                    color: "#999"
                  }}
                >
                  {numberOptions} Answers
                </Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );

    return (
      <View style={{
          marginTop: __d(10)
      }}>
        {this.info.email === this.User.user.email
          ? <Swipeout
              right={swipeBtns}
              backgroundColor="transparent"
              autoClose={true}
            >
              {messageView}
            </Swipeout>
          : messageView}
      </View>
    );
  }
  validate(value) {
    let regx = new RegExp(/^[A-Za-z0-9.]+$/);
    return regx.test(value);
  }
  changeGroupName() {
    let isNameExisted = false;
    let members = Object.keys(this.FirebaseApi.members);
    if (this.validate(this.state.groupName)) {
      this.errors = {};
      let groupName = this.state.groupName.replace(".", "%");
      this.FirebaseApi.groupData.map((v, i) => {
        if (v.groupName === groupName) {
          isNameExisted = true;
          this.setState({
            groupName: this.Global.groupName
          });
          return (this.errors = "Group name existed!");
        }
      });
      if (!isNameExisted) {
        this.itemRefs.child("Group").child(this.Global.groupKey).update({
          groupName: this.state.groupName
        });
        members.map((v, i) => {
          this.itemRefs
            .child("Account")
            .child(v)
            .child("MyGroup")
            .child(this.Global.groupKey)
            .update({
              groupName: this.state.groupName
            });
        });
        //return Actions.pop({ type: "refresh" });
      }
    } else {
      this.setState({
        groupName: this.Global.groupName
      });
      return (this.errors = "Group names can not have special characters!");
    }
  }
  postMessage() {
      this.modal_mess.close();
      if (this.messageEdit){
        let timeAtPost = new Date(); // get time at post
        let month = (timeAtPost.getMonth() + 1).toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
        let day = timeAtPost.getDate().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
        let hours = timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
        let minutes = timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous
        // format time: dd/mm/yyyy - hh:mm
         let mometTimeAtPost = moment(timeAtPost, "YYYY-MM-DDhh:mm:ss");
        let formatTime = mometTimeAtPost.format("YYYY-MM-DDhh:mm:ss");
        this.itemRefs
            .child("Group")
            .child(this.Global.groupKey)
            .child("postedMessages")
            .child(this.messageEdit.key)
            .set({
                message: this.messageEdit.message,
                title: this.messageEdit.title,
                timeAtPost: formatTime
            });
    }

  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header_view: {
    width: width,
    height: __d(64),
    backgroundColor: "#5DADE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1
  },
  header_btn_back_view: {
    position: "absolute",
    width: 64,
    height: 64,
    justifyContent: "center",
    left: 0,
    top: 0,
    paddingLeft: __d(10),
    paddingTop: 10
  },
  header_txt: {
    color: "#fff",
    fontSize: __d(20),
    marginTop: __d(10)
  },
  header_btn_setting_view: {
    position: "absolute",
    right: __d(15),
    top: __d(27)
  },
  header_btn_setting_change_name_view: {
    width: __d(150),
    height: __d(75),
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    top: __d(20),
    right: __d(5),
    zIndex: 1,
    borderRadius: __d(5)
  },
  header_btn_setting_change_name_btn_view: {
    width: __d(150),
    height: __d(25),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: __d(1),
    borderBottomColor: "#e1e1e1"
  },
  admin_info_view: {
    flex: 2.5,
    zIndex: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: __d(10)
  },
  admin_info_bg_view: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //borderRadius: __d(15),
    padding: __d(10),
    flex: 1
  },
  admin_info_img: {
    width: __d(100),
    height: __d(100),
    borderRadius: __d(50),
    resizeMode: "contain"
  },
  admin_info: {
    flex: 1,
    paddingLeft: __d(10),
    alignItems: "center"
  },
  txt_name: {
    fontSize: __d(13),
    color: "#000"
  },
  admin_info_name: {
    fontSize: __d(25),
    color: "#fff",
    fontWeight: "500",
    backgroundColor: "transparent"
  },
  admin_info_email: {
    fontSize: __d(17),
    color: "#fff",
    paddingTop: __d(5),
    backgroundColor: "transparent"
  },
  list_mess_view: {
    flex: 6,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: __d(1),
    backgroundColor: "#FFF"
  },
  child_mess_view: {
    width: width,
    height: __d(70),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: __d(10)
  },
  child_mess_poll_icon: {
    justifyContent: "center",
    paddingRight: __d(5)
  },
  child_mess_time_at_post: {
    width: __d(130),
    height: __d(20),
    fontSize: __d(13),
    paddingLeft: __d(5),
    fontStyle: "italic"
  },
  func_view: {
    width: width,
    height: __d(50),
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 0,
    borderTopColor: "#e1e1e1",
    borderTopWidth: __d(1)
  },
  func_btn_view: {
    flex: 1,
    height: __d(50),
    justifyContent: "center",
    alignItems: "center",
    //borderRadius: __d(5),
    //borderLeftColor: "#e1e1e1",
    //borderLeftWidth: __d(1),
    //backgroundColor: "#5DADE2",
    zIndex: 1
  }
});
