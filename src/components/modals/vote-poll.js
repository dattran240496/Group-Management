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
import moment from "moment";
import Dash from "react-native-dash";
import Icon from "react-native-vector-icons/FontAwesome";
import { _ } from "lodash";
import { __d } from "../helpers/index";
const { width, height } = Dimensions.get("window");
@autobind
@observer
export default class VotePoll extends Component {
  @observable info = null;
  @observable arrOptions = [""];
  @observable optionsPoll = [];
  @observable isChangePoll = false;
  @observable voted = 0;
    @observable poll = null;
    @observable numberOptions = 1;
    @observable arrOptions = [""];
        constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      poll: this.Global.selectedPoll,
      numberOptions: 1,
      arrOptions: [""]
    };
    this.poll = this.Global.selectedPoll;

  }
  componentWillMount() {
    this.getOptionsPoll();
    let idAdmin = "";
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("createdGroupBy")
      .on("value", dataSnapshot => {
        idAdmin = dataSnapshot.val();
      });
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("postedPoll")
      .child(this.state.poll.key)
      .child("voted")
      .on("value", child => {
        this.voted = child.val();
      });
    this.info = this.FirebaseApi.accountData[idAdmin];
  }
  render() {
    let arrOptions = [];
    if (this.info.email === this.User.user.email) {
      for (let i = 1; i <= this.state.numberOptions; i++) {
        arrOptions.push(
          <View key={i} style={styles.option_view}>
            <Icon name="plus" color="#e1e1e1" size={__d(15)} />
            <TextInput
              placeholder="Add an option..."
              placeholderStyle={{ color: "#e1e1e1" }}
              style={styles.option_txt_input}
              onChangeText={txtOption => {
                let arr = this.arrOptions;
                arr[i - 1] = txtOption;
                this.arrOptions[i - 1] = txtOption;
              }}
              value={this.arrOptions[i - 1]}
              numberOfLines={1}
              ellipsizeMode="tail"
              onFocus={() => {
                if (i === this.state.numberOptions) {
                  let numbers = i;
                  numbers++;
                    this.numberOptions = numbers;
                  this.arrOptions.push("");
                }
              }}
            />
          </View>
        );
      }
    }
    let moment = this.state.poll
      ? this.convertDate(this.state.poll.timeAtPost)
      : null;
    let timeAtPost = moment
      ? moment.format("YYYY") +
        "/" +
        moment.format("MM") +
        "/" +
        moment.format("MM") +
        " - " +
        moment.format("hh") +
        ":" +
        moment.format("mm")
      : "";
    return (
      <View style={styles.container}>
        <Text style={styles.timeAtPost_txt}>
          {timeAtPost}
        </Text>
        <TextInput
            underlineColorAndroid="transparent"
          style={styles.txt_input_poll}
          editable={
            this.info && this.info.email === this.User.user.email ? true : false
          }
          value={this.state.poll.message}
          onChangeText={txt => {
            let mess = this.state.poll;
            mess.message = txt;
              this.poll = mess
            this.isChangePoll = true;
          }}
        />
        <Text
          style={[
            styles.timeAtPost_txt,
            {
              fontStyle: "italic",
              marginBottom: __d(5),
              paddingTop: 0
            }
          ]}
        >
          {this.voted} voted
        </Text>
        <Dash
          dashGap={5}
          dashLength={7}
          dashThickness={1}
          style={{ width: width - __d(21), height: __d(1) }}
        />
        <ScrollView
          style={{
            height: __d(160),
            width: width - __d(20)
          }}
        >
          {!_.isEmpty(this.optionsPoll) &&
            <FlatList
              style={styles.fl_view}
              keyExtractor={(item, index) => index}
              renderItem={({ item, index }) => this.renderOptions(item, index)}
              data={this.optionsPoll}
            />}
          {this.info.email === this.User.user.email ? arrOptions : null}
        </ScrollView>
        {this.info.email === this.User.user.email
          ? <TouchableOpacity
              onPress={() => {
                this.updatePoll();
              }}
              style={styles.btn_submit_view}
            >
              <Text style={styles.btn_submit_txt}>Send</Text>
            </TouchableOpacity>
          : null}
      </View>
    );
  }
  getOptionsPoll() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("postedPoll")
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
    let widthTxt = width - __d(110);
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
      <View key={index} style={styles.option_exist_view}>
        <View style={styles.option_exist_vote_view}>
          <View style={styles.option_exist_vote_check_view}>
            <TouchableOpacity
              onPress={() => {
                let count = 0;
                let user = item.selectedMems || [];
                user.push(this.User.user.email);
                this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("postedPoll")
                  .child(this.state.poll.key)
                  .child("options")
                  .on("value", dataSnapshot => {
                    dataSnapshot.forEach(child => {
                      let selected = child.child("selectedMems").val();
                      if (selected) {
                        for (let i = 0; i < selected.length; i++) {
                          if (selected[i] === this.User.user.email) {
                            count++;
                          }
                        }
                      }
                    });
                  });
                let voted = 0;
                this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("postedPoll")
                  .child(this.state.poll.key)
                  .child("voted")
                  .on("value", child => {
                    voted = child.val();
                  });

                if (count === 0) {
                  voted++;
                }
                if (count === 1 && isChecked) {
                  voted--;
                }
                console.log("vote");
                console.log(voted);
                this.itemRefs
                  .child("Group")
                  .child(this.Global.groupKey)
                  .child("postedPoll")
                  .child(this.state.poll.key)
                  .update({
                    voted: voted
                  });
                isChecked
                  ? this.itemRefs
                      .child("Group")
                      .child(this.Global.groupKey)
                      .child("postedPoll")
                      .child(this.state.poll.key)
                      .child("options")
                      .child(index)
                      .child("selectedMems")
                      .child(indexUser.toString())
                      .remove()
                  : this.itemRefs
                      .child("Group")
                      .child(this.Global.groupKey)
                      .child("postedPoll")
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
          <View
            style={{
              backgroundColor: index % 2 === 0 ? "#deebf6" : "#fff",
              width: widthTxt + __d(30),
              flexDirection: "row"
            }}
          >
            <TextInput
                underlineColorAndroid="transparent"
              editable={this.info.email === this.User.user.email ? true : false}
              style={[
                styles.option_exist_vote_txt,
                {
                  width: widthTxt
                }
              ]}
              value={item.option}
              onChangeText={txt => {
                this.optionsPoll[index].option = txt;
              }}
            />
            <View style={styles.option_exist_number_mem_view}>
              <Text style={styles.option_exist_number_mem_txt}>
                {item.selectedMems ? item.selectedMems.length : 0}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  convertDate(date) {
    return moment(date, "YYYY-MM-DDhh:mm:ss");
  }
  updatePoll() {
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
      .child("postedPoll")
      .child(this.state.poll.key)
      .update({
        options: this.optionsPoll
      });
    if (this.isChangePoll) {
      let timeAtPost = new Date(); // get time at post

      let mometTimeAtPost = moment(timeAtPost, "YYYY-MM-DDhh:mm:ss");
      let formatTime = mometTimeAtPost.format("YYYY-MM-DDhh:mm:ss");
      let mess = this.state.poll;
      mess.timeAtPost = formatTime;
        this.poll = mess;
      Object.values(this.FirebaseApi.members).map((v, i) => {
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
            body: this.state.poll.message
          })
        })
          .then(response => response.json())
          .then(response => console.log(response))
          .catch(e => console.log(e));
      });
      this.itemRefs
        .child("Group")
        .child(this.Global.groupKey)
        .child("postedPoll")
        .child(this.state.poll.key)
        .update({
          message: this.state.poll.message,
          timeAtPost: formatTime
        });
      this.isChangePoll = false;
    }

    this.arrOptions = [""];
      this.numberOptions = 1
  }
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: __d(15),
    width: width - __d(20),
    height: __d(350),
    backgroundColor: "#fff",
    alignItems: "center"
  },
  timeAtPost_txt: {
    paddingTop: __d(15),
    fontSize: __d(13)
  },
  txt_input_poll: {
    width: width - __d(50),
    height: __d(50),
    padding: __d(10),
    fontSize: __d(13),
    textAlign: "center"
  },
  fl_view: {
    paddingTop: __d(20)
  },
  btn_submit_view: {
    width: __d(80),
    height: __d(30),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: __d(5),
    marginTop: __d(10)
  },
  btn_submit_txt: {
    color: "#fff",
    fontSize: __d(13)
  },
  option_view: {
    width: width,
    height: __d(30),
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: __d(5)
  },
  option_txt_input: {
    width: width - __d(20),
    height: __d(30),
    fontSize: __d(15),
    //fontStyle: this.state.message !== "" ? "normal" : "italic",
    marginLeft: __d(5)
  },
  option_exist_view: {
    width: width - __d(20),
    height: __d(35),
    marginTop: __d(5),
    flexDirection: "row",
    alignItems: "center"
  },
  option_exist_vote_view: {
    width: width - __d(50),
    height: __d(35),
    flexDirection: "row",
    alignItems: "center"
  },
  option_exist_vote_check_view: {
    width: __d(35),
    height: __d(35),
    justifyContent: "center",
    alignItems: "center"
  },
  option_exist_vote_check_btn: {
    width: __d(20),
    height: __d(20),
    backgroundColor: "#fff",
    borderRadius: __d(10),
    borderWidth: __d(1),
    borderColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center"
  },
  option_exist_vote_txt: {
    fontSize: __d(13),
    paddingLeft: __d(5)
  },
  option_exist_number_mem_view: {
    width: __d(30),
    height: __d(30),
    justifyContent: "center",
    alignItems: "center"
  },
  option_exist_number_mem_txt: {
    color: "#000",
    fontSize: __d(13)
  }
});
