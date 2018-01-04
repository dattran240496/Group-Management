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
export default class Member extends Component {
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
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
            right: -__d(10),
            top: -__d(20),
            backgroundColor: "#fff",
              zIndex: 1
          }}
        >
          <Icon name="times" color="#5DADE2" size={15} />
        </TouchableOpacity>
          <View style={{
              flex: 1,
              zIndex: 0,
              alignItems: "center"
          }}>
              <Text style={{
                  fontSize: __d(15)
              }}>
                  Member
              </Text>
              <View style={{
                  flexDirection: "row",
                  marginTop: __d(5)
              }}>
                  <Image
                      source={require("./images/group.png")}
                      style={{
                          width: __d(15),
                          height: __d(15),
                          resizeMode: "center",
                      }}
                  />
                  <Text style={{
                      fontSize: __d(13),
                      paddingLeft: __d(5)
                  }}>
                      {Object.values(this.FirebaseApi.members).length}
                  </Text>

              </View>
              <TextInput
                  style={{
                      marginTop: __d(10),
                      width: width - __d(50),
                      height: __d(40),
                      borderColor: "#5DADE2",
                      borderWidth: __d(2),
                      paddingLeft: __d(5)
                  }}
                  value={this.Global.groupName}

              />

          </View>
          <View style={{
              flex: 1
          }}>
              <FlatList
                  ref={ref => (this.renderMems = ref)}
                  keyExtractor={(item, index) => index}
                  data={
                      Object.values(this.FirebaseApi.members)
                  }
                  extraData={this.state}
                  renderItem={({ item, index }) => this.renderMember(item, index)}
              />
          </View>
      </View>
    );
  }
  renderMember(item, index){
      return(
        <View style={{
            width: width - __d(20),
            height: __d(40),
            backgroundColor: "#e1e1e1"
        }}>

        </View>
      );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
    height: __d(300),
    backgroundColor: "#fff",
    alignItems: "center",
      paddingTop: __d(10)
  }
});
