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
  TouchableHighlight
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Swipeout from "react-native-swipeout";
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
  @observable indexSelected = -1;
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
    let isAdmin =
      this.info && this.info.email === this.User.user.email ? true : false;
    return (
      <View style={styles.container}>
        <View style={styles.header_view}>
          <TouchableOpacity
            onPress={() => {
              this.state.messages = null;
              this.FirebaseApi.members = null;
              this.info = null;
              this.Global.isFooter = false;
              Actions.pop({ type: "refresh" });
            }}
            style={styles.header_btn_back_view}
          >
            <Icon name="angle-left" size={__d(35)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.header_txt}>
            {this.Global.groupName.toString().replace("%", ".")}
          </Text>
          <TouchableOpacity
            style={styles.header_btn_setting_view}
            onPress={() => {
              this.isEdit = !this.isEdit;
            }}
          >
            {this.isEdit
              ? <View
                  style={[
                    styles.header_btn_setting_change_name_view,
                    {
                      height: isAdmin ? __d(75) : __d(25)
                    }
                  ]}
                >
                  {isAdmin
                    ? <TouchableOpacity
                        onPress={() => {
                          this.isEdit = false;
                          Actions.editGroup({
                            title: "Change group name",
                            typeEdit: "name"
                          });
                        }}
                        style={[
                          styles.header_btn_setting_change_name_btn_view,
                          {}
                        ]}
                      >
                        <Text>Change group name</Text>
                      </TouchableOpacity>
                    : null}
                  {isAdmin
                    ? <TouchableOpacity
                        onPress={() => {
                          this.isEdit = false;
                          Actions.editGroup({
                            title: "Change password",
                            typeEdit: "password"
                          });
                        }}
                        style={styles.header_btn_setting_change_name_btn_view}
                      >
                        <Text>Change password</Text>
                      </TouchableOpacity>
                    : null}
                  <TouchableOpacity
                    onPress={() => {
                      Actions.pop();
                      if (!isAdmin) {
                        let deleteInMygroup = this.itemRefs
                          .child("Account")
                          .child(this.User.user.id)
                          .child("MyGroup")
                          .child(this.Global.groupKey);
                        deleteInMygroup.remove();
                        let deleteInGroup = this.itemRefs
                          .child("Group")
                          .child(this.Global.groupKey)
                          .child("groupMember")
                          .child(this.User.user.id);
                        deleteInGroup.remove();
                      } else {
                        let groupMem = [];
                        this.itemRefs
                          .child("Group")
                          .child(this.Global.groupKey)
                          .child("groupMember")
                          .on("value", dataSnapshot => {
                            groupMem = dataSnapshot.val();
                          });
                        Object.keys(groupMem).map((v, i) => {
                          let childMyGroup = this.itemRefs
                            .child("Account")
                            .child(v)
                            .child("MyGroup")
                            .child(this.Global.groupKey);
                          childMyGroup.remove();
                        });
                        let deleteGroup = this.itemRefs
                          .child("Group")
                          .child(this.Global.groupKey);
                        deleteGroup.remove();
                        this.Global.groupKey = "";
                        this.Global.groupName = "";
                      }
                    }}
                    style={[
                      styles.header_btn_setting_change_name_btn_view,
                      {
                        borderBottomWidth: 0
                      }
                    ]}
                  >
                    <Text>
                      {isAdmin ? "Delete group" : "Leave group"}
                    </Text>
                  </TouchableOpacity>
                </View>
              : null}
            <Icon name="cog" size={__d(20)} color="#fff" />
          </TouchableOpacity>
        </View>

        <Image
          blurRadius={5}
          source={this.info ? { uri: this.info.picture } : null}
          style={styles.admin_info_view}
        >
          <Image
            source={this.info ? { uri: this.info.picture } : null}
            style={styles.admin_info_img}
          />

          <View style={styles.admin_info}>
              <Text style={styles.admin_info_name}>
                {this.info ? this.info.name.toString().toUpperCase() : ""}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.admin_info_email}
              >
                {this.info ? this.info.email : ""}
              </Text>
          </View>
        </Image>

        <View style={styles.list_mess_view}>
          <FlatList
            style={{}}
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
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("groupMember")
      .on("value", dataSnapshot => {
        this.FirebaseApi.members = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.members[child.key] = {
            email: child.child("email").val(),
            token: child.child("token").val(),
            name: child.child("name").val()
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
        this.info &&
        this.FirebaseApi.members &&
        this.Global.modalType === "loading"
          ? ((this.Global.modalType = false), this.setState({}))
          : null;
      });
    //console.log(this.state.messages);
    // if members and messages got, turn off modal loading
  }
  _renderMessages(item, index) {
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
    messageView.push(
      <View key={index} style={styles.child_mess_view}>
        {item.isPoll
          ? <Icon
              name="flag"
              color="#e1e1e1"
              size={__d(15)}
              style={styles.child_mess_poll_icon}
            />
          : null}
        <TouchableHighlight
          underlayColor="transparent"
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
        </TouchableHighlight>
        <Text style={styles.child_mess_time_at_post}>
          {item.timeAtPost}
        </Text>
      </View>
    );

    return (
      <View>
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
    backgroundColor: "transparent",
  },
  admin_info_email: {
    fontSize: __d(17),
    color: "#fff",
    paddingTop: __d(5),
    backgroundColor: "transparent"
  },
  list_mess_view: {
    flex: __d(5),
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: __d(1),
    backgroundColor: "#FFF"
  },
  child_mess_view: {
    width: width,
    height: __d(50),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: __d(10),
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1
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
