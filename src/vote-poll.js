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
import { __d } from "./components/helpers/index";
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
            style={styles.option_view}
          >
            <Icon name="plus" color="#e1e1e1" size={__d(15)} />
            <TextInput
              placeholder="Add an option..."
              placeholderStyle={{ color: "#e1e1e1" }}
              style={styles.option_txt_input}
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
        style={styles.container}
      >
        <Text
          style={styles.timeAtPost_txt}
        >
          {this.state.poll.timeAtPost}
        </Text>
          <TextInput
              style={styles.txt_input_poll}
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
              style={styles.fl_view}
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
                style={styles.btn_submit_view}
              >
                <Text
                  style={styles.btn_submit_txt}
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
    let widthTxt = width / 1.5 - __d(45);
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
        style={styles.option_exist_view}
      >
        <View
          style={styles.option_exist_vote_view}
        >
          <View
            style={styles.option_exist_vote_check_view}
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
              style={styles.option_exist_vote_check_btn}
            >
              {isChecked
                ? <Icon name="check" size={__d(10)} color="#85C1E9" />
                : null}
            </TouchableOpacity>
          </View>
          <TextInput
            editable={this.info.email === this.User.user.email ? true : false}
            style={[styles.option_exist_vote_txt,{
                width: widthTxt
            }]}
            value={item.option}
            onChangeText={txt => {
              this.optionsPoll[index].option = txt;
              this.setState({});
            }}
          />
        </View>
        <View
          style={styles.option_exist_number_mem_view}
        >
          <Text
            style={styles.option_exist_number_mem_txt}
          >
            {item.selectedMems ? item.selectedMems.length : 0}
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
   container:{
       flex: 1,
       paddingLeft: __d(15)
   },
    timeAtPost_txt:{
        paddingTop: __d(15),
        fontSize: __d(13),
        fontStyle: "italic"
    },
    txt_input_poll:{
        width: width - __d(30),
        height: __d(120),
        padding: __d(10),
        borderRadius: __d(10),
        borderColor: "#e1e1e1",
        borderWidth: __d(1),
        marginTop: __d(10),
        fontSize: __d(13)
    },
    fl_view:{
        paddingTop: __d(20)
    },
    btn_submit_view:{
        width: __d(120),
        height: __d(40),
        backgroundColor: "#5DADE2",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: __d(5),
        marginTop: __d(10),
        marginLeft: (width - __d(120)) / 2
    },
    btn_submit_txt:{
        color: "#fff",
        fontSize: __d(13)
    },
    option_view:{
        width: width,
        height: __d(30),
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: __d(5)
    },
    option_txt_input:{
        width: width - __d(20),
        height: __d(30),
        fontSize: __d(15),
        //fontStyle: this.state.message !== "" ? "normal" : "italic",
        marginLeft: __d(5)
    },
    option_exist_view:{
        width: width,
        height: __d(35),
        marginTop: __d(5),
        flexDirection: "row",
        alignItems: "center"
    },
    option_exist_vote_view:{
        width: width / 1.2,
        height: __d(35),
        flexDirection: "row",
        borderWidth: __d(1),
        borderColor: "#e1e1e1",
        borderRadius: __d(5),
        alignItems: "center"
    },
    option_exist_vote_check_view:{
        width: __d(35),
        height: __d(35),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#e1e1e1",
        borderTopLeftRadius: __d(5),
        borderBottomLeftRadius: __d(5)
    },
    option_exist_vote_check_btn:{
        width: __d(15),
        height: __d(15),
        backgroundColor: "#fff",
        borderRadius: __d(3),
        borderWidth: __d(1),
        borderColor: "#e1e1e1",
        justifyContent: "center",
        alignItems: "center"
    },
    option_exist_vote_txt:{
        fontSize: __d(13),
        paddingLeft: __d(5),
    },
    option_exist_number_mem_view:{
        width: __d(30),
        height: __d(30),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: __d(15),
        backgroundColor: "#e1e1e1",
        borderColor: "#fff",
        borderWidth: __d(1),
        marginLeft: __d(5)
    },
    option_exist_number_mem_txt:{
        color: "#fff",
        fontSize: __d(13)
    }
});
