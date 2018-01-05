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
const { width, height } = Dimensions.get("window");
import { __d } from "../helpers/index";
@autobind
@observer
export default class Account extends Component {
  @observable isEditName = false;
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.User = this.props.User;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      username: this.User.user.name
    };
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity
              onPress={() => {
                  this.Global.modalGroupManagement = false;
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
        {this.User.user &&
          <Image
            style={{
              width: width - __d(20),
              height: __d(150),
              justifyContent: "center",
              alignItems: "center",
                zIndex: 0
            }}
            source={{ uri: this.User.user.picture }}
            blurRadius={5}
          >
            <Image
              style={styles.user_ava}
              source={{ uri: this.User.user.picture }}
            />
            <Text style={styles.user_name}>
              {this.User.user.name}
            </Text>
          </Image>}
        <View
          style={{
            width: width - __d(20),
            height: __d(45),
            justifyContent: "center",
            backgroundColor: "#e1e1e1",
            paddingLeft: __d(10)
          }}
        >
          <Text
            style={{
              fontSize: __d(14),
              fontWeight: "bold"
            }}
          >
            Personal Information
          </Text>
        </View>
        <View
          style={{
            width: width - __d(20),
            height: __d(45),
            alignItems: "center",
            paddingLeft: __d(15),
            flexDirection: "row",
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: __d(1)
          }}
        >
          <Text
            style={{
              fontSize: __d(13),
              width: __d(80)
            }}
          >
            Name
          </Text>
          <TextInput

            ref={ref => (this.txtInput = ref)}
            underlineColorAndroid="transparent"
            style={{
              fontSize: __d(13),
              width: width - __d(150)
            }}
            onChangeText={username => {
              this.setState({ username: username });
            }}
            value={this.state.username}
            editable={this.isEditName}
            autoFocus={this.isEditName}
            autoCapitalize="none"
            onSubmitEditing={()=>{
              this.isEditName = false;
              this.state.username !== this.User.user.name ?
                  this.itemRefs.child("Account").child(this.User.user.id).child("infoAccount").update({
                      name: this.state.username
                  })
                  : null
            }}
          />
          <TouchableOpacity
            onPress={() => {
              this.isEditName = true;
              this.txtInput.focus();
              this.setState({});
            }}
            style={{
              justifyContent: "center"
            }}
          >
            <Icon name="pencil" color="#5DADE2" size={__d(15)} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: width - __d(20),
            height: __d(45),
            alignItems: "center",
            paddingLeft: __d(15),
            flexDirection: "row",
            borderBottomColor: "#e1e1e1",
            borderBottomWidth: __d(1)
          }}
        >
          <Text
            style={{
              fontSize: __d(13),
              width: __d(80)
            }}
          >
            Email
          </Text>
          <Text
            style={{
              fontSize: __d(13),
              width: width - __d(150)
            }}
          >
            {this.User.user.email}
          </Text>
        </View>
        <View style={styles.sign_out_view}>
          <TouchableOpacity
            style={styles.sign_out_btn_view}
            onPress={() => {
              this.FirebaseApi.groupData = null;
              this.FirebaseApi.accountData = null;
              this.FirebaseApi.myGroup = null;
              AsyncStorage.removeItem("@user:key");

              this.itemRefs.child("Account").child(this.User.user.id).update({
                token: ""
              });
              this.Global.modalType = false;
              this.Global.modalGroupManagement = false;
              Actions.login({ type: "replace" });
            }}
          >
            <Icon name="sign-out" color="#fff" size={__d(20)} />
            <Text style={styles.sign_out_btn_txt}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    width: width - __d(20),
      height: __d(350),
    backgroundColor: "#fff",
    alignItems: "center"
  },
  user_ava: {
    width: __d(100),
    height: __d(100),
    borderRadius: __d(50),
    resizeMode: "cover"
  },
  user_name: {
    color: "#fff",
    paddingTop: __d(10),
    backgroundColor: "transparent",
    fontSize: __d(18),
    fontWeight: "bold"
  },
  sign_out_view: {
    position: "absolute",
    bottom: __d(15),
    justifyContent: "center",
    alignItems: "center",
    width: width,
    flexDirection: "row"
  },
  sign_out_btn_view: {
    width: __d(120),
    height: __d(35),
    backgroundColor: "#5DADE2",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  sign_out_btn_txt: {
    fontSize: __d(13),
    color: "#fff",
    paddingLeft: __d(5)
  }
});
