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
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "../helpers/index";
import Dash from "react-native-dash";
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
        <View key={i} style={styles.option_view}>
          <Icon name="plus" color="#5DADE2" size={__d(15)} />
          <TextInput
            placeholder="Add an option..."
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[
              styles.option_btn_view,
              {
                fontStyle: this.state.message !== "" ? "normal" : "italic"
              }
            ]}
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
      <KeyboardAvoidingView
          style={{
              justifyContent: "center",
              alignItems: "center"
          }}
          behavior="padding">
        <View
          style={{
            width: width,
            height: __d(40),
            //position: "absolute",
            //right: -__d(10),
            //top: -__d(20),
            alignItems: "flex-end",
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
              this.Global.componentFooter = false;
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
              width: width - __d(20),
              height: __d(50),
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row"
            }}
          >
            <Image
              source={require("./images/poll.png")}
              style={{
                width: __d(20),
                height: __d(20),
                resizeMode: "contain"
              }}
            />
            <Text
              style={{
                fontSize: __d(16),
                paddingLeft: __d(10)
              }}
            >
              CREATE POLL
            </Text>
          </View>
          <Dash
            dashGap={5}
            dashLength={7}
            dashThickness={1}
            style={{ width: width - __d(21), height: __d(1) }}
          />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Question?"
            placeholderStyle={{ color: "#e1e1e1" }}
            style={[
              styles.txt_input_poll,
              {
                fontStyle: this.state.message !== "" ? "normal" : "italic"
              }
            ]}
            onChangeText={message => {
              this.setState({
                message: message
              });
            }}
            value={this.state.message}
          />
          <View style={styles.scrll_poll_view}>
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

                let mometTimeAtPost = moment(timeAtPost, "YYYY-MM-DDhh:mm:ss");
                let formatTime = mometTimeAtPost.format("YYYY-MM-DDhh:mm:ss");
                this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("postedPoll")
                  .push()
                  .set({
                    message: this.state.message,
                    timeAtPost: formatTime,
                    voted: 1,
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
                Object.values(this.FirebaseApi.members).map((v, i) => {
                  console.log(v);
                  fetch(this.Global.urlPushNoti, {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      "accept-encoding": "gzip, deflate"
                    },
                    body: JSON.stringify({
                      to: v.token,
                      sound: "default",
                      body: this.state.message
                    })
                  })
                    .then(response => response.json())
                    .then(response => console.log(response))
                    .catch(e => console.log(e));
                });
                this.Global.componentFooter = false;
              } else {
                Alert.alert("Warning!", "Poll is not empty!");
              }
            }}
            style={styles.btn_update_view}
          >
            <Text style={styles.btn_update_txt}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: width - __d(20),
    height: __d(300),
    backgroundColor: "#fff",
    zIndex: 0
  },
  txt_input_poll: {
    width: width - __d(30),
    height: __d(30),
    fontSize: __d(13),
    borderColor: "#5DADE2",
    borderWidth: 2,
    marginTop: __d(15),
    paddingLeft: __d(10),
    paddingRight: __d(10)
  },
  scrll_poll_view: {
    width: width - __d(30),
    height: __d(150)
  },
  btn_update_view: {
    justifyContent: "center",
    alignItems: "center",
    width: __d(80),
    height: __d(30),
    marginTop: __d(20),
    borderRadius: __d(5),
    borderColor: "#fff",
    borderWidth: __d(1),
    backgroundColor: "#5DADE2"
  },
  btn_update_txt: {
    color: "#fff",
    fontSize: __d(15)
  },
  option_view: {
    width: width,
    height: __d(30),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: __d(5)
  },
  option_btn_view: {
    width: width - __d(20),
    height: __d(30),
    fontSize: __d(13),
    marginLeft: __d(5)
  }
});
