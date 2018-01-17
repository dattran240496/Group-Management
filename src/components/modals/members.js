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
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { _ } from "lodash";
import Swipeout from "react-native-swipeout";
import { __d } from "../helpers/index";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class Member extends Component {
  @observable members = null;
  @observable info = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      email: ""
    };
  }
  componentWillMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        this.info = this.FirebaseApi.accountData[dataSnapshot.val()];
      });
    this.members = Object.values(this.FirebaseApi.members);
  }
  render() {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: width,
            height: __d(40),
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
              this.Global.modalType = false;
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
          <View
            style={{
              flex: 1,
              zIndex: 0,
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: __d(15)
              }}
            >
              Member
            </Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: __d(5)
              }}
            >
              <Image
                source={require("./images/group.png")}
                style={{
                  width: __d(15),
                  height: __d(15),
                  resizeMode: "center"
                }}
              />
              <Text
                style={{
                  fontSize: __d(13),
                  paddingLeft: __d(5)
                }}
              >
                {Object.values(this.FirebaseApi.members).length}
              </Text>
            </View>
            <TextInput
              underlineColorAndroid="transparent"
              style={{
                marginTop: __d(10),
                width: width - __d(50),
                height: __d(40),
                borderColor: "#5DADE2",
                borderWidth: 2,
                paddingLeft: __d(5)
              }}
              value={this.Global.groupName}
              editable={false}
            />
          </View>
          <View
            style={{
              flex: 2
            }}
          >
            <FlatList
              style={styles.fl_mem_view}
              ref={ref => (this.flatListMem = ref)}
              keyExtractor={(item, index) => index}
              data={this.members}
              extraData={this.state}
              renderItem={({ item, index }) => this._renderItem(item, index)}
            />
          </View>
        </View>
      </View>
    );
  }

  _filterEmail(name) {
    let groupData = Object.values(this.FirebaseApi.members);
    groupData = _.filter(groupData, function(o) {
      o = o.email;
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.toString().toLowerCase());
    });
    this.members = groupData;
  }

  _renderItem(item, index) {
    let _this = this;
    let swipeBtns = [
      {
        text: "Delete",
        backgroundColor: "red",
        underlayColor: "red",
        onPress: () => {
          let childMemOnGroup = this.itemRefs
            .child("Group")
            .child(this.Global.groupKey)
            .child("groupMember")
            .child(item.key);
          childMemOnGroup.remove();
          // delete member on poll
          this.itemRefs
            .child("Group")
            .child(this.Global.groupKey)
            .child("postedPoll")
            .on("value", dataSnapshot => {
              dataSnapshot.forEach(child => {
                _this.itemRefs
                  .child("Group")
                  .child(_this.Global.groupKey)
                  .child("postedPoll")
                  .child(child.key)
                  .child("options")
                  .on("value", dataPoll => {
                    dataPoll.forEach(poll => {
                      _this.itemRefs
                        .child("Group")
                        .child(_this.Global.groupKey)
                        .child("postedPoll")
                        .child(child.key)
                        .child("options")
                        .child(poll.key)
                        .child("selectedMems")
                        .on("value", dataMem => {
                          dataMem.forEach(mem => {
                            if (mem.val() === item.email) {
                              let memDelete = _this.itemRefs
                                .child("Group")
                                .child(_this.Global.groupKey)
                                .child("postedPoll")
                                .child(child.key)
                                .child("options")
                                .child(poll.key)
                                .child("selectedMems")
                                .child(mem.key);
                              memDelete.remove();
                            }
                          });
                        });
                    });
                  });
              });
            });
          let deleteGroupOnMem = this.itemRefs
            .child("Account")
            .child(item.key)
            .child("MyGroup")
            .child(this.Global.groupKey);
          deleteGroupOnMem.remove();
        }
      }
    ];
    let mem = this.FirebaseApi.accountData[item.key];
    let members = (
      <View key={"_key " + item} style={{}}>
        <TouchableOpacity onPress={() => {}} style={styles.btn_mem_view}>
          <Image
            source={require("./images/avata.png")}
            style={{
              width: __d(40),
              height: __d(40),
              resizeMode: "contain",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={mem ? { uri: mem.picture } : null}
              style={{
                width: __d(30),
                height: __d(30),
                resizeMode: "cover",
                borderRadius: __d(15),
                marginBottom: __d(7)
              }}
            />
          </Image>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.btn_mem_email_txt}
          >
            {item.name} ({item.email.slice(0, item.email.indexOf("@"))})
          </Text>
        </TouchableOpacity>
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
              {members}
            </Swipeout>
          : members}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(350),
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: __d(10)
  },
  txt_input_view: {
    width: width - __d(30),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    fontSize: __d(13),
    borderRadius: __d(5),
    marginTop: __d(20)
  },
  total_mem_txt: {
    padding: __d(10),
    alignItems: "flex-start",
    width: width
  },
  fl_mem_view: {
    borderTopWidth: __d(1),
    borderTopColor: "#e1e1e1",
    marginTop: __d(10),
    flex: 2
  },
  btn_mem_view: {
    width: width - __d(20),
    height: __d(50),
    alignItems: "center",
    paddingLeft: __d(10),
    borderBottomWidth: __d(1),
    borderBottomColor: "#e1e1e1",
    flexDirection: "row",
    backgroundColor: "#e1e1e1"
  },
  btn_mem_email_txt: {
    fontSize: __d(13),
    paddingLeft: __d(15),
    width: width - __d(75)
  }
});
