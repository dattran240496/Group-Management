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
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import { __d } from "../helpers/index";
@autobind
@observer
export default class EditDistance extends Component {
  @observable isEditName = false;
  @observable oldDistance = 0;
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.User = this.props.User;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      newDistance: 0
    };
  }

  componentWillMount() {
    this.itemRefs
      .child("Group")
      .child(this.Global.groupKey)
      .child("distance")
      .on("value", data => {
        this.oldDistance = data.val();
      });
  }
  render() {
    return (
      <KeyboardAvoidingView
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
          <Text
            style={{
              fontSize: __d(13)
            }}
          >
            Old distance: {this.oldDistance}
          </Text>
          <TextInput
            placeholder="New distace..."
            placeholderStyle={{ color: "#e1e1e1" }}
            underlineColorAndroid="transparent"
            style={[
              styles.text_input_view,
              {
                fontStyle: this.state.newDistance !== 0 ? "normal" : "italic"
              }
            ]}
            onChangeText={txt => {
              this.setState({ newDistance: txt });
            }}
            value={
              this.state.newDistance !== 0
                ? this.state.newDistance.toString()
                : null
            }
          />
          <TouchableOpacity
            onPress={() => {
              this.updateDistance();
              this.Global.modalType = false;
            }}
            style={styles.btn_add_new_group}
          >
            <Text style={styles.btn_add_new_group_txt}>Update</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
  updateDistance() {
    this.itemRefs.child("Group").child(this.Global.groupKey).update({
      distance: this.state.newDistance
    });
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(150),
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: __d(10)
  },
  text_input_view: {
    width: width - __d(91),
    height: __d(38),
    paddingLeft: __d(10),
    fontSize: __d(15),
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#5DADE2",
    marginTop: __d(20)
  },
  btn_add_new_group: {
    width: __d(90),
    height: __d(30),
    borderRadius: __d(5),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5DADE2",
    marginTop: __d(15)
  },
  btn_add_new_group_txt: {
    color: "#fff",
    fontSize: __d(13),
    fontWeight: "bold"
  }
});
