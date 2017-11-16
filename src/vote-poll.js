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
  ScrollView
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
export default class VotePoll extends Component {
  @observable info = null;
  @observable optionsPoll = [];
  constructor(props) {
    super(props);
    this.state = {
      poll: this.props.poll
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    this.info = this.FirebaseApi.accountData[
      this.FirebaseApi.groupData[this.Global.groupName]._createGroupBy
    ];
    this.getOptionsPoll();
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingLeft: 15
        }}
      >
        <Text
          style={{
            paddingTop: 15,
            fontSize: 13,
            fontStyle: "italic"
          }}
        >
          {this.state.poll.timeAtPost}
        </Text>
        <Text
          style={{
            paddingTop: 5,
            fontSize: 15
          }}
        >
          {this.state.poll.message}
        </Text>
        {
          <FlatList
            style={{
              paddingTop: 20
            }}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => this.renderOptions(item, index)}
            data={(this.optionsPoll)}
          />
        }
      </View>
    );
  }
  getOptionsPoll() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupName)
      .child("postedMessages")
      .child(this.state.poll.key)
      .child("options")
      .on("value", dataSnapshot => {
        let options = [];
        dataSnapshot.forEach(child => {
          options.push({
              option: child.child("option").val(),
              selectedMems: child.child("selectedMems").val()
          });
        });
        this.optionsPoll = options;
      });
    //console.log(this.state.messages);
    // if members and messages got, turn off modal loading
  }

  renderOptions(item, index) {
    let widthTxt = width / 1.5 - 45;
    let isChecked = false;
    let indexUser = -1;
    item.selectedMems ? (
        Object.values(item.selectedMems).map((v, i)=>{
            console.log(v);
            v === this.User.user.email ? (
                isChecked = true,
                    indexUser = i
            ) : null
        })
    ): null;
      return (
        <View
            key={index}
            style={{
                width: width,
                height: 35,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <View
                style={{
                    width: width / 1.2,
                    height: 35,
                    flexDirection: "row",
                    borderWidth: 1,
                    borderColor: "#e1e1e1",
                    borderRadius: 5,
                    alignItems: "center"
                }}
            >
                <View
                    style={{
                        width: 35,
                        height: 35,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#e1e1e1",
                        borderTopLeftRadius: 5,
                        borderBottomLeftRadius: 5
                    }}
                >
                    <TouchableOpacity
                        onPress={()=>{
                            let user;// = item.selectedMems || [];
                            user = (this.User.user.email);
                            isChecked ? (
                                console.log("remove"),
                                this.itemRefs
                                    .child("Group")
                                    .child(this.Global.groupName)
                                    .child("postedMessages")
                                    .child(this.state.poll.key)
                                    .child("options")
                                    .child(index)
                                    .child("selectedMems")
                                    .child(indexUser.toString()).remove()
                            ) : (
                                this.itemRefs
                                    .child("Group")
                                    .child(this.Global.groupName)
                                    .child("postedMessages")
                                    .child(this.state.poll.key)
                                    .child("options")
                                    .child(index)
                                    .child("selectedMems")
                                    .push(user)
                            )
                        }}
                        style={{
                            width: 15,
                            height: 15,
                            backgroundColor: "#fff",
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: "#e1e1e1",
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {
                            isChecked ? (
                                <Icon
                                    name="check"
                                    size={10}
                                    color="#85C1E9"
                                />
                            ) : null
                        }
                    </TouchableOpacity>
                </View>
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                        fontSize: 13,
                        paddingLeft: 5,
                        width: widthTxt
                    }}
                >
                    {item.option}
                </Text>
            </View>
            <View style={{
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems:'center',
                borderRadius: 15,
                backgroundColor: "#e1e1e1",
                borderColor: "#fff",
                borderWidth: 1,
                marginLeft: 5
            }}>
                <Text style={{
                    color: "#fff"
                }}>
                    {item.selectedMems ? Object.values(item.selectedMems).length : 0}
                </Text>
            </View>
        </View>
    );
  }
}
