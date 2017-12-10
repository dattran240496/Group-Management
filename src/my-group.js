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
import Swipeout from "react-native-swipeout";
import { __d } from "./components/helpers/index";
import { _ } from "lodash";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class MyGroup extends Component {
  @observable numberGroupMem = 0;
  @observable info = null;
  @observable myGroupList = this.props.FirebaseApi.myGroup;
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
  render() {
    let myGroupData = this.myGroupList;
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={[
            styles.text_input_view,
            {
              fontStyle: this.state.myGroupName !== "" ? "normal" : "italic"
            }
          ]}
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
              data={myGroupData}
              extraData={this.state}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          : <View
              style={styles.noti_no_group_view}
            >
              <Text
                style={styles.noti_no_group_txt}
              >
                You have not joined the group!
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.FirebaseApi.groupData = null;
                  this.Global.modalType = "loading";
                  Actions.groupList();
                }}
                style={styles.btn_search_group_view}
              >
                <Text
                  style={styles.btn_search_group_txt}
                >
                  Search group
                </Text>
              </TouchableOpacity>
            </View>}
      </View>
    );
  }

  _renderItem(item, index) {
    let name = item.groupName.replace("%", ".");
    let groupMem = "";
    this.itemRefs
      .child("Group")
      .child(item.groupKey)
      .child("groupMember")
      .on("value", dataSnapshot => {
        groupMem = dataSnapshot.val();
        index === this.FirebaseApi.myGroup.length - 1
          ? (this.Global.modalType = false)
          : null;
      });
    groupMem = groupMem ? Object.values(groupMem).length : 0;
    let _this = this;
    return (
        <View key={"_key " + index} style={{}}>
          <TouchableOpacity
            onPress={() => {
              //this.state.groupName = Object.keys(item);
              this.Global.modalType = "loading";
              this.Global.groupKey = item.groupKey;
              Actions.checkAttendance();
            }}
            style={styles.fl_child_view}
          >
            <View style={styles.fl_child_mem_view}>
              <View style={styles.fl_child_mem_circle}>
                <Text style={styles.fl_child_mem_number}>
                  {groupMem}
                </Text>
              </View>
            </View>
            <Text style={styles.fl_child_mem_name}>
              {name}
            </Text>
          </TouchableOpacity>
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
            groupKey: child.key,
          });
        });
          this.myGroupList = this.FirebaseApi.myGroup
        this.FirebaseApi.myGroup && this.Global.modalType === "loading"
          ? (this.Global.modalType = false)
          : null;
      });
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  text_input_view: {
    width: width - __d(30),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    fontSize: __d(13),
    borderRadius: __d(5),
    marginTop: __d(20),
    backgroundColor: "#fff"
  },
  flat_list_view: {
    borderTopWidth: __d(1),
    borderTopColor: "#e1e1e1",
    marginTop: __d(10)
  },
  fl_child_view: {
    width: width,
    height: __d(50),
    alignItems: "center",
    borderBottomWidth: __d(1),
    borderBottomColor: "#e1e1e1",
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  fl_child_mem_view: {
    width: __d(50),
    height: __d(50),
    backgroundColor: "#5DADE2",
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
    color: "#fff",
    fontSize: __d(13)
  },
  fl_child_mem_name: {
    fontSize: __d(15),
    flex: 1,
    paddingLeft: __d(10)
  },
    noti_no_group_view:{
        paddingTop: __d(10),
        justifyContent: "center",
        alignItems: "center"
    },
    noti_no_group_txt:{
        fontSize: __d(18)
    },
    btn_search_group_view:{
        marginTop: __d(10),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#5DADE2",
        borderRadius: __d(5),
        width: __d(100),
        height: __d(40)
    },
    btn_search_group_txt:{
        fontSize: __d(13),
        color: "#fff"
    }
});
