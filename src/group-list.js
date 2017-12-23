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
import { __d } from "./components/helpers/index";
@autobind
@observer
export default class GroupList extends Component {
  @observable group = [];
  @observable groupFilter = [];
  @observable groupNameList = [];
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
    let dataGroupList = this.groupNameList;
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Group name..."
          placeholderStyle={{ color: "#e1e1e1" }}
          underlineColorAndroid="transparent"
          style={[
            styles.txtInput_search,
            {
              fontStyle: this.state.groupNameSearch !== "" ? "normal" : "italic"
            }
          ]}
          onChangeText={name => {
            this.setState({ groupNameSearch: name });
            this.filterGroupName(name);
          }}
        />
        {!_.isEmpty(this.groupNameList)
          ? <FlatList
              style={styles.fl_view}
              ref={ref => (this.flatList = ref)}
              keyExtractor={(item, index) => index}
              data={dataGroupList}
              extraData={this.state}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          : <Text style={styles.txt_no_group}>No group you can join!</Text>}
        <Modal
          ref={ref => (this._modalEnterPas = ref)}
          style={styles.modal_view}
          position={"center"}
          swipeToClose={false}
          coverScreen={true}
        >
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
          />
          <TouchableOpacity
            onPress={() => {
              this.joinGroup();
            }}
            style={styles.btn_join_view}
          >
            <Text style={styles.btn_join_txt}>Join group</Text>
          </TouchableOpacity>
        </Modal>
      </View>
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
    let name = item.groupName.replace("%", ".");
    let numberOfGroup = item.groupMember
      ? Object.values(item.groupMember).length
      : 0;
    return (
      <View key={"_key " + index} style={{}}>
        <TouchableOpacity
          onPress={() => {
            this._modalEnterPas.open();
            this.setState({
              groupSelectedToJoin: item
            });
          }}
          style={styles.btn_group_view}
        >
          <View style={styles.btn_mem_number_view}>
            <View style={styles.btn_mem_number_circle_view}>
              <Text style={styles.btn_mem_number_circle_txt}>
                {numberOfGroup}
              </Text>
            </View>
          </View>
          <Text style={styles.btn_group_txt}>
            {name}
          </Text>
        </TouchableOpacity>
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
      ? Alert.alert("Warning!", "You joined this group!")
      : this.state.groupPass === "" // if password is empty
        ? Alert.alert("Warning!", "Password is not empty!")
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
              Actions.checkAttendance()
            )
          : Alert.alert("Warning!", "Invalid password!");
  }

  filterGroupData() {
    let _this = this;
    let groupData = this.FirebaseApi.groupData;
    this.FirebaseApi.myGroup.map((v, i) => {
      groupData = _.filter(groupData, function(o) {
        return o.groupName !== v.groupName;
      });
    });
    (this.groupFilter = groupData), (this.groupNameList = groupData);
    this.Global.modalType = false;
  }

  getGroupWithoutJoined() {
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

          this.FirebaseApi.groupData !== null ? this.filterGroupData() : null;
        });
      });
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff"
  },
  txtInput_search: {
    width: width - __d(30),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: 1,
    borderColor: "#e1e1e1",
    fontSize: __d(13),
    borderRadius: __d(5),
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
    fontSize: __d(18)
  },
  modal_view: {
    width: __d(300),
    height: __d(150),
    backgroundColor: "#fff",
    borderRadius: __d(8),
    justifyContent: "center",
    alignItems: "center"
    //flexDirection: "row"
  },
  txt_input_pass: {
    marginTop: __d(5),
    width: __d(250),
    height: __d(40),
    paddingLeft: __d(10),
    borderRadius: __d(5),
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    fontSize: __d(13)
  },
  btn_join_view: {
    marginTop: __d(15),
    width: __d(250),
    height: __d(40),
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
    width: width,
    height: __d(50),
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    backgroundColor: "#fff",
    flexDirection: "row"
  },
  btn_mem_number_view: {
    width: __d(50),
    height: __d(50),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center"
  },
  btn_mem_number_circle_view: {
    width: __d(36),
    height: __d(36),
    borderRadius: __d(18),
    borderWidth: __d(1),
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  btn_mem_number_circle_txt: {
    color: "#fff"
  },
  btn_group_txt: {
    fontSize: __d(15),
    flex: 1,
    paddingLeft: __d(10)
  }
});
