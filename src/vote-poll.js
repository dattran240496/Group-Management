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
import { _ } from "lodash";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class VotePoll extends Component {
  @observable info = null;
  @observable arrOptions = [""];
  @observable optionsPoll = [];
  @observable isChangePoll = false;
  constructor(props) {
    super(props);
    this.state = {
      poll: this.props.poll,
      numberOptions: 1,
      arrOptions: [""]
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  componentWillMount() {
    let idAdmin = "";
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
      });
    this.info = this.FirebaseApi.accountData[idAdmin];
    this.getOptionsPoll();
  }
  render() {
    let arrOptions = [];
    if (this.info.email === this.User.user.email) {
      for (let i = 1; i <= this.state.numberOptions; i++) {
        arrOptions.push(
          <View
            key={i}
            style={{
              width: width,
              height: 30,
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 5
            }}
          >
            <Icon name="plus" color="#e1e1e1" size={15} />
            <TextInput
              placeholder="Add an option..."
              placeholderStyle={{ color: "#e1e1e1" }}
              style={{
                width: width - 20,
                height: 30,
                fontSize: 15,
                //fontStyle: this.state.message !== "" ? "normal" : "italic",
                marginLeft: 5
              }}
              onChangeText={txtOption => {
                let arr = this.arrOptions;
                arr[i - 1] = txtOption;
                this.arrOptions = arr;
              }}
              value={this.arrOptions[i - 1]}
              numberOfLines={1}
              ellipsizeMode="tail"
              onFocus={() => {
                console.log(i === this.state.numberOptions);
                if (i === this.state.numberOptions) {
                  let numbers = i;
                  numbers++;
                  this.setState({
                    numberOptions: numbers
                  });
                  this.arrOptions.push("");
                }
              }}
            />
          </View>
        );
      }
    }
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
          <TextInput
              style={{
                  width: width - 30,
                  height: 120,
                  padding: 10,
                  borderRadius: 10,
                  borderColor: "#e1e1e1",
                  borderWidth: 1,
                  marginTop: 10,
                  fontSize: 13
              }}
              editable={this.info.email === this.User.user.email ? true : false}
              multiline={true}
              value={this.state.poll.message}
              onChangeText={txt => {
                  let mess = this.state.poll;
                  mess.message = txt;
                  this.setState({
                      poll: mess
                  });
                  this.isChangePoll = true;
              }}
          />
        <ScrollView>
          {!_.isEmpty(this.optionsPoll) &&
            <FlatList
              style={{
                paddingTop: 20
              }}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => this.renderOptions(item, index)}
              data={this.optionsPoll}
            />}
          {this.info.email === this.User.user.email ? arrOptions : null}
          {this.info.email === this.User.user.email
            ? <TouchableOpacity
                onPress={() => {
                  // for (let i = this.arrOptions.length - 1; i >= 0; i--) {
                  //   if (this.arrOptions[i] === "") {
                  //     this.arrOptions.splice(i, 1);
                  //   }
                  // }
                  this.arrOptions.map((v, i) => {
                    let selected = [];
                    selected.push(this.User.user.email);
                    this.optionsPoll.push({
                      option: v,
                      selectedMems: selected
                    });
                  });
                  for (let i = this.optionsPoll.length - 1; i >= 0; i--) {
                    if (this.optionsPoll[i].option === "") {
                      this.optionsPoll.splice(i, 1);
                    }
                  }
                  this.itemRefs
                    .child("Group")
                    .child(this.Global.groupKey)
                    .child("postedMessages")
                    .child(this.state.poll.key)
                    .update({
                      options: this.optionsPoll
                    });
                  if (this.isChangePoll){
                      let timeAtPost = new Date(); // get time at post
                      let hours =
                          timeAtPost.getHours().toString().length === 1 ? "0" : ""; // if hour < 10 => add "0" previous
                      let minutes =
                          timeAtPost.getMinutes().toString().length === 1 ? "0" : ""; // if minute < 10 => add "0" previous

                      // format time: dd/mm/yyyy - hh:mm
                      let formatTime =
                          timeAtPost.getDate() +
                          "/" +
                          (timeAtPost.getMonth() + 1) +
                          "/" +
                          timeAtPost.getFullYear() +
                          " - " +
                          hours +
                          timeAtPost.getHours() +
                          ":" +
                          minutes +
                          timeAtPost.getMinutes();
                      let mess = this.state.poll;
                      mess.timeAtPost = formatTime;
                      this.setState({
                          poll: mess
                      });
                      this.itemRefs
                          .child("Group")
                          .child(this.Global.groupKey)
                          .child("postedMessages")
                          .child(this.state.poll.key)
                          .update({
                              message: this.state.poll.message,
                              timeAtPost: formatTime,
                          });
                      this.isChangePoll = false;
                  }

                  this.arrOptions = [""];
                  this.setState({
                    numberOptions: 1
                  });

                }}
                style={{
                  width: 120,
                  height: 40,
                  backgroundColor: "#5DADE2",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginTop: 10,
                  marginLeft: (width - 120) / 2
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 13
                  }}
                >
                  Submit options
                </Text>
              </TouchableOpacity>
            : null}
        </ScrollView>
      </View>
    );
  }
  getOptionsPoll() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
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
    item.selectedMems
      ? item.selectedMems.map((v, i) => {
          v === this.User.user.email
            ? ((isChecked = true), (indexUser = i))
            : null;
        })
      : null;
    let arrayComponentOption = [];
    return (
      <View
        key={index}
        style={{
          width: width,
          height: 35,
          marginTop: 5,
          flexDirection: "row",
          alignItems: "center"
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
              onPress={() => {
                let user = item.selectedMems || [];
                user.push(this.User.user.email);
                isChecked
                  ? this.itemRefs
                      .child("Group")
                      .child(this.Global.groupKey)
                      .child("postedMessages")
                      .child(this.state.poll.key)
                      .child("options")
                      .child(index)
                      .child("selectedMems")
                      .child(indexUser.toString())
                      .remove()
                  : this.itemRefs
                      .child("Group")
                      .child(this.Global.groupKey)
                      .child("postedMessages")
                      .child(this.state.poll.key)
                      .child("options")
                      .child(index)
                      .update({
                        selectedMems: user
                      });
              }}
              style={{
                width: 15,
                height: 15,
                backgroundColor: "#fff",
                borderRadius: 3,
                borderWidth: 1,
                borderColor: "#e1e1e1",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {isChecked
                ? <Icon name="check" size={10} color="#85C1E9" />
                : null}
            </TouchableOpacity>
          </View>
          <TextInput
            editable={this.info.email === this.User.user.email ? true : false}
            style={{
              fontSize: 13,
              paddingLeft: 5,
              width: widthTxt
            }}
            value={item.option}
            onChangeText={txt => {
              this.optionsPoll[index].option = txt;
              this.setState({});
            }}
          />
        </View>
        <View
          style={{
            width: 30,
            height: 30,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 15,
            backgroundColor: "#e1e1e1",
            borderColor: "#fff",
            borderWidth: 1,
            marginLeft: 5
          }}
        >
          <Text
            style={{
              color: "#fff"
            }}
          >
            {item.selectedMems ? item.selectedMems.length : 0}
          </Text>
        </View>
      </View>
    );
  }
}
