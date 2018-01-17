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
  KeyboardAvoidingView
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import { _ } from "lodash";
import { __d } from "../helpers/index";
@autobind
@observer
export default class GroupList extends Component {
  @observable group = [];
  @observable groupFilter = [];
  @observable groupNameList = [];
  @observable info = null;
  @observable errors = {};
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.Global = this.props.Global;
    this.state = {
      groupNameSearch: "",
      groupNameList: [],
      groupPass: "",
      groupSelectedToJoin: null,
      groupFilter: []
    };
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    this.getGroupWithoutJoined();
  }
  componentDidMount() {}
  render() {
    let dataGroupList =
      this.state.groupNameSearch !== "" ? this.groupNameList : [];
    let heightModal = _.isEmpty(dataGroupList) ? __d(350) : __d(350);
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
        <View
          style={[
            styles.container,
            {
              height: __d(350),
              zIndex: -100
            }
          ]}
        >
          <Image
            source={require("./images/find-group/Popup-Search.png")}
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
            You can find group with ID or{"\n"}name of group
          </Text>
          <TextInput
            placeholder="ID or Name of group"
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[
              styles.txtInput_search,
              {
                textAlign:
                  this.state.groupNameSearch === "" ? "center" : "left",
                fontStyle:
                  this.state.groupNameSearch !== "" ? "normal" : "italic"
              }
            ]}
            value={this.state.groupNameSearch}
            onChangeText={name => {
              this.setState({ groupNameSearch: name });
              this.filterGroupName(name);
            }}
          />
          {!_.isEmpty(dataGroupList)
            ? <FlatList
                style={[
                  styles.fl_view,
                  {
                    height: heightModal
                  }
                ]}
                ref={ref => (this.flatList = ref)}
                keyExtractor={(item, index) => index}
                data={dataGroupList}
                extraData={this.state}
                renderItem={({ item, index }) => this._renderItem(item, index)}
              />
            : this.state.groupNameSearch !== ""
              ? <Text style={styles.txt_no_group}>No group you can join!</Text>
              : null}
          <TouchableOpacity
            style={{
              width: __d(100),
              height: __d(30),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#5DADE2",
              borderRadius: __d(5),
              marginBottom: __d(5),
              marginTop: _.isEmpty(dataGroupList)
                ? this.state.groupNameSearch === "" ? __d(20) : __d(5)
                : __d(5)
            }}
          >
            {_.isEmpty(dataGroupList)
              ? <Text
                  style={{
                    color: "#fff",
                    fontSize: __d(16),
                    fontWeight: "bold"
                  }}
                >
                  Search
                </Text>
              : <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      groupNameSearch: ""
                    });
                  }}
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <Icon name="arrow-left" size={__d(16)} color="#fff" />
                  <Text
                    style={{
                      fontSize: __d(16),
                      color: "#fff",
                      fontWeight: "bold",
                      paddingLeft: __d(5)
                    }}
                  >
                    Back
                  </Text>
                </TouchableOpacity>}
          </TouchableOpacity>
          <KeyboardAvoidingView behavior="padding">
              <Modal
                  ref={ref => (this._modalEnterPas = ref)}
                  style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: 'transparent'
                  }}
                  position={"center"}
                  swipeToClose={false}
                  coverScreen={true}
              >
                  <View
                      style={{
                          width: width,
                          alignItems: "center",
                          backgroundColor: "transparent"
                      }}
                  >
                      <View
                          style={{
                              width: __d(300),
                              height: __d(20)
                          }}
                      />
                      <View
                          style={{
                              width: __d(300),
                              height: __d(20),
                              backgroundColor: "#fff"
                          }}
                      />

                      <TouchableOpacity
                          onPress={() => {
                              this._modalEnterPas.close();
                              this.errors["password"] = null;
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
                              right: __d(20)
                          }}
                      >
                          <Icon name="times" color="#5DADE2" size={15} />
                      </TouchableOpacity>
                  </View>
                  <View style={styles.modal_view}>
                      <Image
                          source={require("./images/find-group/password.png")}
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
                          Your group password
                      </Text>
                      <TextInput
                          underlineColorAndroid="transparent"
                          secureTextEntry={true}
                          placeholder="Group pass..."
                          placeholderStyle={{
                              color: "#e1e1e1"
                          }}
                          style={[
                              styles.txt_input_pass,
                              {
                                  fontStyle: this.state.groupPass !== "" ? "normal" : "italic"
                              }
                          ]}
                          onChangeText={txt => {
                              this.setState({ groupPass: txt });
                          }}
                          value={this.state.groupPass}
                      />
                      {!_.isEmpty(this.errors["password"]) &&
                      <Text style={styles.error_txt}>
                          {this.errors["password"]}
                      </Text>}
                      <TouchableOpacity
                          onPress={() => {
                              this.joinGroup();
                          }}
                          style={styles.btn_join_view}
                      >
                          <Text style={styles.btn_join_txt}>OK</Text>
                      </TouchableOpacity>
                  </View>
              </Modal>
          </KeyboardAvoidingView>
        </View>
      </KeyboardAvoidingView>
    );
  }
  filterGroupName(name) {
    let _this = this;
    let groupData = this.groupFilter;
    groupData = _.filter(groupData, function(o) {
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.groupName.toString().toLowerCase());
    });
    this.groupNameList = groupData;
  }
  _renderItem(item, index) {
    let _this = this;
    let idAdmin = "";
    let info = null;
    let isJoined = false;
    this.itemRefs
      .child("Group")
      .child(item.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
        info = _this.FirebaseApi.accountData[dataSnapshot.val()];
      });
    let name = item.groupName.replace("%", ".");
    let numberOfGroup = item.groupMember
      ? Object.values(item.groupMember).length
      : 0;
    this.FirebaseApi.myGroup.map((v, i) => {
      if (v.groupName === item.groupName) {
        isJoined = true;
        return;
      }
    });
    return (
      <View key={"_key " + index} style={{}}>
        <View style={styles.btn_group_view}>
          <View style={styles.btn_mem_number_view}>
            <Image
              source={require("./images/find-group/avata.png")}
              style={styles.btn_mem_number_circle_txt}
            >
              <Image
                source={{ uri: info.picture }}
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
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.btn_group_txt}
          >
            {name}
          </Text>
          <TouchableOpacity
            disabled={isJoined}
            onPress={() => {
              this._modalEnterPas.open();
              this.setState({
                groupSelectedToJoin: item
              });
            }}
            style={{
              width: isJoined ? __d(80) : __d(50),
              height: __d(30),
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isJoined ? "#999" : "#5DADE2",
              borderRadius: __d(5),
              marginRight: __d(5)
            }}
          >
            {isJoined
              ? <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <Icon name="check" size={__d(15)} color="#fff" />
                  <Text
                    style={{
                      fontSize: __d(13),
                      color: "#fff"
                    }}
                  >
                    Joined
                  </Text>
                </View>
              : <Text
                  style={{
                    fontSize: __d(13),
                    fontWeight: "bold",
                    color: "#fff"
                  }}
                >
                  Join
                </Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  joinGroup() {
    let _id = this.User.user.id;
    let isJoined = false;
    this.FirebaseApi.myGroup.map((v, i) => {
      v === this.state.groupSelectedToJoin.groupName ? (isJoined = true) : null;
    });
    _id === this.state.groupSelectedToJoin.createdGroupBy || isJoined // if user joined this group
      ? (Alert.alert("Warning!", "You joined this group!"), this.setState({}))
      : this.state.groupPass === "" // if password is empty
        ? (
            (this.errors["password"] = "Password is not empty!"),
            this.setState({})
          )
        : this.state.groupPass === this.state.groupSelectedToJoin.groupPass // if password is true
          ? (
              this.itemRefs
                .child("Group")
                .child(this.state.groupSelectedToJoin.groupKey)
                .child("groupMember")
                .child(_id)
                .update({
                  email: this.User.user.email,
                  name: this.User.user.name
                }),
              this.itemRefs
                .child("Account")
                .child(this.User.user.id)
                .child("MyGroup")
                .child(this.state.groupSelectedToJoin.groupKey)
                .update({
                  groupName: this.state.groupSelectedToJoin.groupName
                }),
              this._modalEnterPas.close(),
              (this.Global.modalType = "loading"),
              (this.Global.groupKey = this.state.groupSelectedToJoin.groupKey),
              (this.Global.modalGroupManagement = false),
              Actions.checkAttendance()
            )
          : (
              (this.errors["password"] = "Invalid password!"),
              this.setState({})
            );
  }

  filterGroupData() {
    let _this = this;
    let groupData = this.FirebaseApi.groupData;
    (this.groupFilter = groupData), (this.groupNameList = groupData);
    this.Global.modalType = false;
  }

  getGroupWithoutJoined() {
    this.itemRefs.child("Group").on("value", dataSnapshot => {
      this.FirebaseApi.groupData = [];
      dataSnapshot.forEach(child => {
        this.FirebaseApi.groupData.push({
          createdGroupBy: child.child("createdGroupBy").val(),
          groupPass: child.child("groupPass").val(),
          groupName: child.child("groupName").val(),
          groupKey: child.key,
          groupMember: child.child("groupMember").val()
        });
      });
    });
    this.filterGroupData();
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: __d(10)
  },
  txtInput_search: {
    width: width - __d(40),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: 1,
    borderColor: "#5DADE2",
    fontSize: __d(13),
    marginTop: __d(20),
    backgroundColor: "#fff"
  },
  fl_view: {
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    marginTop: __d(10)
  },
  txt_no_group: {
    marginTop: __d(10),
    //color: '#fff',
    fontSize: __d(18),
    color: "red"
  },
  modal_view: {
    width: __d(300),
    height: __d(250),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
    //flexDirection: "row",
  },
  txt_input_pass: {
    marginTop: __d(10),
    width: __d(250),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: 1,
    borderColor: "#5DADE2",
    fontSize: __d(13)
  },
  btn_join_view: {
    marginTop: __d(15),
    width: __d(50),
    height: __d(30),
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#e1e1e1",
    borderWidth: __d(1),
    backgroundColor: "#5DADE2",
    borderRadius: __d(5)
  },
  btn_join_txt: {
    color: "#fff",
    fontSize: __d(15)
  },
  btn_group_view: {
    width: width - __d(20),
    height: __d(50),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    backgroundColor: "#e1e1e1",
    flexDirection: "row"
  },
  btn_mem_number_view: {
    width: __d(60),
    height: __d(50),
    justifyContent: "center",
    alignItems: "flex-end"
  },
  btn_mem_number_circle_view: {
    width: __d(36),
    height: __d(36),
    justifyContent: "center",
    alignItems: "center"
  },
  btn_mem_number_circle_txt: {
    width: __d(45),
    height: __d(45),
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center"
  },
  btn_group_txt: {
    fontSize: __d(15),
    flex: 1,
    paddingLeft: __d(10)
  },
  error_txt: {
    color: "red",
    marginTop: __d(5)
  }
});
