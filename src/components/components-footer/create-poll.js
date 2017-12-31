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
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "../helpers/index";
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
          style={styles.option_view}
        >
          <Icon name="plus" color="#e1e1e1" size={__d(15)} />
          <TextInput
            placeholder="Add an option..."
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[styles.option_btn_view, {
                fontStyle: this.state.message !== "" ? "normal" : "italic",
            }]}
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
        style={styles.container}
      >
        <TextInput
          placeholder="Ask something..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={[styles.txt_input_poll, {
              fontStyle: this.state.message !== "" ? "normal" : "italic",
          }]}
          onChangeText={message => {
            this.setState({
              message: message
            });
          }}
          value={this.state.message}
          multiline={true}
        />
        <View
          style={styles.scrll_poll_view}
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
                this.Global.componentFooter = false;
            } else {
              Alert.alert("Warning!", "Poll is not empty!");
            }
          }}
          style={styles.btn_update_view}
        >
          <Text style={styles.btn_update_txt}>Create Poll</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
   container:  {
       flex: 1,
       alignItems: "center"
   },
    txt_input_poll:{
        width: width - __d(30),
        height: __d(100),
        padding: __d(10),
        fontSize: __d(15),
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        marginTop: __d(15),
        borderRadius: __d(5)
    },
    scrll_poll_view:{
        width: width - __d(30),
        height: __d(150)
    },
    btn_update_view:{
        justifyContent: "center",
        alignItems: "center",
        width: __d(150),
        height: __d(50),
        marginTop: __d(20),
        borderRadius: __d(5),
        borderColor: "#fff",
        borderWidth: __d(1),
        backgroundColor: "#5DADE2"
    },
    btn_update_txt:{
        color: "#fff",
        fontSize:  __d(15)
    },
    option_view:{
        width: width,
        height: __d(30),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: __d(5)
    },
    option_btn_view:{
        width: width - __d(20),
        height: __d(30),
        fontSize: __d(13),
        marginLeft: __d(5),
    }

});
