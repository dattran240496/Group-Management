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
export default class CreatePoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      numbersOption: 3,
      arrOptions: ["", "", ""]
    };
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
  }
  render() {
    let arrayComponentOption = [];
    for (let i = 1; i <= this.state.numbersOption; i++) {
      arrayComponentOption.push(
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
              fontStyle: this.state.message !== "" ? "normal" : "italic",
              marginLeft: 5
            }}
            onChangeText={txtOption => {
              let arr = this.state.arrOptions;
              arr[i - 1] = txtOption;
              this.setState({
                arrOptions: arr
              });
            }}
            value={this.state.arrOptions[i - 1]}
            numberOfLines={1}
            ellipsizeMode="tail"
            onFocus={() => {
              if (i === this.state.numbersOption) {
                let numbers = this.state.numbersOption;
                numbers++;
                let arr = this.state.arrOptions;
                arr.push("");
                this.setState({
                  numbersOption: numbers,
                  arrOptions: arr
                });
              }
            }}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <TextInput
          placeholder="Ask something..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={{
            width: width - 30,
            height: 100,
            padding: 10,
            fontSize: 15,
            borderColor: "#e1e1e1",
            borderWidth: 1,
            fontStyle: this.state.message !== "" ? "normal" : "italic",
              marginTop: 15,
              borderRadius: 5
          }}
          onChangeText={message => {
            this.setState({
              message: message
            });
          }}
          value={this.state.message}
          multiline={true}
        />
        <View
          style={{
            width: width - 30,
            height: 150
          }}
        >
          <ScrollView>
            {arrayComponentOption}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={() => {
            if (this.state.message !== "") {
              for (let i = this.state.arrOptions.length - 1; i >= 0; i--) {
                if (this.state.arrOptions[i] === "") {
                  this.state.arrOptions.splice(i, 1);
                }
              }
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
              this.itemRefs
                .child("Group")
                .child(this.Global.groupKey)
                .child("postedMessages")
                .push()
                .set({
                  message: this.state.message,
                  timeAtPost: formatTime,
                    isPoll: "true",
                  options:
                    this.state.arrOptions.length !== 0
                      ? this.state.arrOptions.map((v, i) => {
                          let selected = [];
                          selected.push(this.User.user.email);
                          return {
                            option: v,
                              selectedMems: selected
                          };
                        })
                      : "null"
                });
              Actions.pop({type: "refresh"});
            } else {
              Alert.alert("Warning!", "Poll is not empty!");
            }
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 150,
            height: 50,
            marginTop: 20,
            borderRadius: 5,
            borderColor: "#fff",
            borderWidth: 1,
              backgroundColor: "#5DADE2"
          }}
        >
          <Text style={{
              color: "#fff",
              fontSize:  15
          }}>Create Poll</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
