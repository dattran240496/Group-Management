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
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import Swipeout from "react-native-swipeout";
import { __d } from "../helpers/index";
import { _ } from "lodash";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class MyGroup extends Component {
  @observable numberGroupMem = 0;
  @observable info = null;
  @observable myGroupList = this.props.FirebaseApi.myGroup;
  @observable selectedGroup = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      myGroupName: "",
      myGroupList: this.FirebaseApi.myGroup
    };
  }
  componentWillMount() {
    this.getMyGroup();
  }
  componentDidMount() {}
  render() {
    let myGroupData = this.myGroupList;
    return (
      <KeyboardAvoidingView
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
        behavior="padding"
      >
        <View
          style={{
            width: width,
            height: __d(40),
            //position: "absolute",
            //right: -__d(10),
            //top: -__d(20),
            alignItems: "flex-end",
            elevation: 1,
            backgroundColor: "transparent"
          }}
        >
          <View
            style={{
              width: width - __d(20),
              height: __d(20)
            }}
          />
          <View
            style={{
              width: width,
              height: __d(20),
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: width - __d(20),
                height: __d(20),
                backgroundColor: "#fff"
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.Global.modalGroupManagement = false;
            }}
            style={{
              width: __d(40),
              height: __d(40),
              borderRadius: __d(20),
              borderWidth: __d(1),
              borderColor: "#5DADE2",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              backgroundColor: "#fff",
              zIndex: 100,
              right: __d(0)
            }}
          >
            <Icon name="times" color="#5DADE2" size={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <Image
            source={require("./images/my-group/Popup-MyGroup.png")}
            style={{
              width: __d(70),
              height: __d(70),
              resizeMode: "contain"
            }}
          />
          <Text
            style={{
              fontSize: __d(15),
              textAlign: "center",
              paddingTop: __d(5)
            }}
          >
            Your speciality and happiness{"\n"}groups
          </Text>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Group name..."
            placeholderStyle={{ color: "#e1e1e1" }}
            style={[
              styles.text_input_view,
              {
                textAlign: this.state.myGroupName === "" ? "center" : "left",
                fontStyle: this.state.myGroupName !== "" ? "normal" : "italic"
              }
            ]}
            value={this.state.myGroupName}
            onChangeText={name => {
              this.setState({ myGroupName: name });
              this.filterGroupName(name);
            }}
          />
          {!_.isEmpty(this.myGroupList)
            ? <FlatList
                style={styles.flat_list_view}
                ref={ref => (this.flatListMyGroup = ref)}
                keyExtractor={(item, index) => index}
                data={this.myGroupList}
                extraData={this.state}
                renderItem={({ item, index }) => this._renderItem(item, index)}
              />
            : <View style={styles.noti_no_group_view}>
                <Text style={styles.noti_no_group_txt}>
                  You have not joined the group!
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.FirebaseApi.groupData = null;
                    this.Global.modalGroupManagement = "groupList";
                  }}
                  style={styles.btn_search_group_view}
                >
                  <Text style={styles.btn_search_group_txt}>Search group</Text>
                </TouchableOpacity>
              </View>}
        </View>
        <Modal
          style={[
            {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              flex: 1
            }
          ]}
          ref={ref => (this.modalDeleteGroup = ref)}
          swipeToClose={false}
          backdropPressToClose={false}
          position={"center"}
        >
          <View
            style={{
              width: width - __d(20),
              height: __d(120),
              backgroundColor: "#fff"
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: __d(15)
                }}
              >
                Do you want to delete it?
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  let info = null;
                  this.itemRefs
                    .child("Group")
                    .child(this.selectedGroup.groupKey)
                    .child("createdGroupBy")
                    .on("value", dataSnapshot => {
                      info = this.FirebaseApi.accountData[dataSnapshot.val()];
                    });
                  let isAdmin =
                    info && info.email === this.User.user.email ? true : false;
                  this.deleteGroup(isAdmin, this.selectedGroup.groupKey);
                  this.modalDeleteGroup.close();
                }}
                style={{
                  width: __d(80),
                  height: __d(30),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "red"
                }}
              >
                <Text
                  style={{
                    fontSize: __d(13),
                    color: "#fff"
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.modalDeleteGroup.close();
                }}
                style={{
                  width: __d(80),
                  height: __d(30),
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#e1e1e1",
                  marginLeft: __d(15)
                }}
              >
                <Text
                  style={{
                    fontSize: __d(13),
                    color: "#fff"
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }

  _renderItem(item, index) {
    let _this = this;
    let name = item.groupName.replace("%", ".");
    let groupMem = "";
    let info = null;
    this.itemRefs
      .child("Group")
      .child(item.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        info = this.FirebaseApi.accountData[dataSnapshot.val()];
      });
    let isAdmin = info && info.email === this.User.user.email ? true : false;
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "transparent",
        onPress: () => {
          this.deleteGroup(isAdmin, item.groupKey);
        }
      }
    ];

    return (
      <View key={"_key " + index} style={{}}>
        <Swipeout
          right={swipeBtns}
          autoClose={true}
          backgroundColor="transparent"
        >
          <TouchableOpacity
            onPress={() => {
              //this.state.groupName = Object.keys(item);
              this.Global.groupKey = item.groupKey;
              this.Global.groupName = item.groupName;
              this.FirebaseApi.members = null;
              this.Global.modalType = "loading";
              this.Global.isFooter = true;
              this.Global.isShowButtonFooter = false;
              this.Global.modalGroupManagement = false;
              Actions.checkAttendance();
            }}
            style={styles.fl_child_view}
            onLongPress={e => {
              Platform.OS === "android" ? this.modalDeleteGroup.open() : null;
              this.selectedGroup = item;
            }}
          >
            <View style={styles.fl_child_mem_view}>
              <Image
                source={require("./images/find-group/avata.png")}
                style={styles.fl_child_mem_number}
              >
                <Image
                  source={info ? { uri: info.picture } : null}
                  style={{
                    width: __d(35),
                    height: __d(35),
                    resizeMode: "cover",
                    borderRadius: __d(20),
                    marginBottom: __d(8)
                  }}
                />
              </Image>
            </View>
            <Text style={styles.fl_child_mem_name}>
              {name}
            </Text>
          </TouchableOpacity>
        </Swipeout>
      </View>
    );
  }
  filterGroupName(name) {
    let _this = this;
    let groupData = this.FirebaseApi.myGroup;
    groupData = _.filter(groupData, function(o) {
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.groupName.toString().toLowerCase());
    });
    this.setState({
      myGroupList: groupData
    });
  }
  getMyGroup() {
    this.itemRefs
      .child("Account")
      .child(this.User.user.id)
      .child("MyGroup")
      .on("value", dataSnapshot => {
        this.FirebaseApi.myGroup = [];
        dataSnapshot.forEach(child => {
          this.FirebaseApi.myGroup.push({
            groupName: child.child("groupName").val(),
            groupKey: child.key
          });
        });
        this.myGroupList = this.FirebaseApi.myGroup;
        this.FirebaseApi.myGroup && this.Global.modalType === "loading"
          ? (this.Global.modalType = false)
          : null;
      });
  }

  deleteGroup(isAdmin, key) {
    if (!isAdmin) {
      let deleteInMygroup = this.itemRefs
        .child("Account")
        .child(this.User.user.id)
        .child("MyGroup")
        .child(key);
      deleteInMygroup.remove();
      let deleteInGroup = this.itemRefs
        .child("Group")
        .child(key)
        .child("groupMember")
        .child(this.User.user.id);
      deleteInGroup.remove();
    } else {
      let groupMem = [];
      this.itemRefs
        .child("Group")
        .child(key)
        .child("groupMember")
        .on("value", dataSnapshot => {
          groupMem = dataSnapshot.val();
        });
      Object.keys(groupMem).map((v, i) => {
        let childMyGroup = this.itemRefs
          .child("Account")
          .child(v)
          .child("MyGroup")
          .child(key);
        childMyGroup.remove();
      });
      let deleteGroup = this.itemRefs.child("Group").child(key);
      deleteGroup.remove();
    }
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    width: width - __d(20),
    height: __d(350),
    paddingTop: __d(10)
  },
  text_input_view: {
    width: width - __d(70),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: 1,
    borderColor: "#5DADE2",
    fontSize: __d(13),
    marginTop: __d(20),
    backgroundColor: "#fff"
  },
  flat_list_view: {
    borderTopWidth: __d(1),
    borderTopColor: "#f2f2f2",
    marginTop: __d(10),
    flex: 1,
    backgroundColor: "#e1e1e1"
  },
  fl_child_view: {
    width: width - __d(20),
    height: __d(50),
    alignItems: "center",
    borderBottomWidth: __d(1),
    borderBottomColor: "#fff",
    backgroundColor: "#e1e1e1",
    flexDirection: "row"
  },
  fl_child_mem_view: {
    width: __d(60),
    height: __d(50),
    justifyContent: "center",
    alignItems: "center"
  },
  fl_child_mem_circle: {
    width: __d(36),
    height: __d(36),
    borderRadius: __d(18),
    borderWidth: __d(1),
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  fl_child_mem_number: {
    width: __d(45),
    height: __d(45),
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center"
  },
  fl_child_mem_name: {
    fontSize: __d(15),
    flex: 1,
    paddingLeft: __d(10)
  },
  noti_no_group_view: {
    paddingTop: __d(10),
    justifyContent: "center",
    alignItems: "center"
  },
  noti_no_group_txt: {
    fontSize: __d(18)
  },
  btn_search_group_view: {
    marginTop: __d(10),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5DADE2",
    borderRadius: __d(5),
    width: __d(100),
    height: __d(40)
  },
  btn_search_group_txt: {
    fontSize: __d(13),
    color: "#fff"
  }
});
