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
      <View style={styles.container}>
        <View style={styles.header_view}>
          <TouchableOpacity
            onPress={() => {
              Actions.pop({ type: "refresh" });
            }}
            style={styles.header_btn_back_view}
          >
            <Icon name="angle-left" size={__d(32)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header_txt}>
            {this.Global.groupName.toString().replace("%", ".")}
          </Text>
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={styles.header_btn_setting_view}
              onPress={() => {
                this.isEdit = !this.isEdit;
              }}
            >
              {this.isEdit
                ? <View style={styles.header_btn_setting_change_name_view}>
                    <TouchableOpacity
                      onPress={() => {
                        this.isEdit = false;
                        Actions.editGroup({
                          title: "Change group name",
                          typeEdit: "name"
                        });
                      }}
                      style={styles.header_btn_setting_change_name_btn_view}
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
                      style={styles.header_btn_setting_change_pass_btn_view}
                    >
                      <Text>Change password</Text>
                    </TouchableOpacity>
                  </View>
                : null}
              <Icon name="cog" size={__d(20)} color="#fff" />
            </TouchableOpacity>}
        </View>

        <View style={styles.admin_info_view}>
          <View style={styles.admin_info_bg_view}>
            <Image
              source={this.info ? { uri: this.info.picture } : null}
              style={styles.admin_info_img}
            />

            <View style={styles.admin_info}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.txt_name}>Name</Text>
                <Text style={styles.txt_name}>:</Text>
                <Text style={styles.admin_info_name}>
                  {this.info ? this.info.name : ""}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.txt_name,
                    {
                      width: __d(50)
                    }
                  ]}
                >
                  Email
                </Text>
                <Text style={styles.txt_name}>:</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.admin_info_email}
                >
                  {this.info ? this.info.email : ""}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.list_mess_view}>
          <FlatList
            style={{
              padding: __d(5)
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

        <View style={[styles.func_view,{
          paddingTop: this.info && this.info.email === this.User.user.email ? __d(10) : null,
          alignItems: this.info && this.info.email !== this.User.user.email ? "center" : null,
        }]}>
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              onPress={() => {
                this.Global.modalType = "check-attendance";
              }}
              style={styles.func_btn_view}
            >
              <Icon name="check-circle-o" color="#fff" size={__d(40)} />
            </TouchableOpacity>}

          <TouchableOpacity
            onPress={() => {
              Actions.members();
            }}
            style={[
              styles.func_btn_view,
              {
                marginLeft: __d(10)
              }
            ]}
          >
            <Icon name="users" color="#fff" size={__d(40)} />
          </TouchableOpacity>

          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={[
                styles.func_btn_view,
                {
                  marginTop: __d(10)
                }
              ]}
              onPress={() => {
                Actions.postMessage();
              }}
            >
              <Icon name="commenting-o" color="#fff" size={__d(40)} />
            </TouchableOpacity>}
          {this.info &&
            this.info.email === this.User.user.email &&
            <TouchableOpacity
              style={[
                styles.func_btn_view,
                {
                  marginLeft: __d(10),
                  marginTop: __d(10)
                }
              ]}
              onPress={() => {
                Actions.createPoll();
              }}
            >
              <Icon name="flag" color="#fff" size={__d(40)} />
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
            child.child("isPoll").val()
                ? (index["isPoll"] = child.child("isPoll").val())
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
      <View style={styles.child_mess_view}>
        {item.isPoll
          ? <Icon
              name="flag"
              color="#e1e1e1"
              size={__d(15)}
              style={styles.child_mess_poll_icon}
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
            width: item.options ? width - __d(170) : width - __d(150),
            height: __d(20)
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
        </TouchableOpacity>
        <Text style={styles.child_mess_time_at_post}>
          {item.timeAtPost}
        </Text>
      </View>
    );
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
    left: __d(15),
    top: __d(20),
    position: "absolute"
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
    height: __d(50),
    position: "absolute",
    backgroundColor: "#fff",
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    top: __d(20),
    right: __d(5),
    zIndex: 1
  },
  header_btn_setting_change_name_btn_view: {
    width: __d(150),
    height: __d(25),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: __d(1),
    borderBottomColor: "#e1e1e1"
  },
  header_btn_setting_change_pass_btn_view: {
    width: __d(150),
    height: __d(25),
    justifyContent: "center",
    alignItems: "center"
  },
  admin_info_view: {
    flex: 2.5,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: __d(1),
    padding: __d(10),
    zIndex: 0,
    borderTopColor: "#e1e1e1",
    borderTopWidth: __d(1),
    justifyContent: "center"
  },
  admin_info_bg_view: {
    backgroundColor: "#5DADE2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: __d(15),
    padding: __d(10)
  },
  admin_info_img: {
    width: __d(100),
    height: __d(100),
    borderRadius: __d(50),
    resizeMode: "contain"
  },
  admin_info: {
    flex: 1,
    paddingLeft: __d(10)
  },
  txt_name: {
    fontSize: __d(13),
    width: __d(50),
    color: "#fff"
  },
  admin_info_name: {
    fontSize: __d(15),
    paddingLeft: __d(5),
    color: "#FFF"
  },
  admin_info_email: {
    fontSize: __d(15),
    marginLeft: __d(5),
    color: "#fff",
    flex: 1
  },
  list_mess_view: {
    flex: __d(5),
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: __d(1),
    backgroundColor: "#FFF"
  },
  child_mess_view: {
    width: width,
    height: __d(20),
    justifyContent: "center",
    flexDirection: "row"
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
    height: __d(190),
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  func_btn_view: {
    width: __d(150),
    height: __d(80),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    borderColor: "#e1e1e1",
    borderWidth: __d(1),
    backgroundColor: "#5DADE2"
  }
});
