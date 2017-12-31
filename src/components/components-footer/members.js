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
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "../../api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { _ } from "lodash";
import { __d } from "../helpers/index";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class Members extends Component {
  @observable members = null;
  constructor(props) {
    super(props);
    this.User = this.props.User;
    this.Global = this.props.Global;
    this.FirebaseApi = this.props.FirebaseApi;
    this.itemRefs = firebase.database().ref("app_expo");
    this.state = {
      email: ""
    };
  }
  componentWillMount() {
    this.members = Object.values(this.FirebaseApi.members);
  }
  render() {
    console.log("member");
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Email..."
          placeholderStyle={{ color: "#e1e1e1" }}
          style={[
            styles.txt_input_view,
            {
              fontStyle: this.state.email !== "" ? "normal" : "italic"
            }
          ]}
          onChangeText={name => {
            this.setState({ email: name });
            this._filterEmail(name);
          }}
        />
        <Text style={styles.total_mem_txt}>
          Total members: {this.members.length}
        </Text>
        <FlatList
          style={styles.fl_mem_view}
          ref={ref => (this.flatListMem = ref)}
          keyExtractor={(item, index) => index}
          data={this.members}
          extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
        />
      </View>
    );
  }

  _filterEmail(name) {
    let groupData = Object.values(this.FirebaseApi.members);
    groupData = _.filter(groupData, function(o) {
      o = o.email;
      let regx = new RegExp(name.toLowerCase());
      return regx.test(o.toString().toLowerCase());
    });
    this.members = groupData;
  }

  _renderItem(item, index) {
    return (
      <View key={"_key " + item} style={{}}>
        <TouchableOpacity onPress={() => {}} style={styles.btn_mem_view}>
          <Text style={styles.btn_mem_email_txt}>
            {item.name} ({item.email.slice(0, item.email.indexOf("@"))})
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  txt_input_view: {
    width: width - __d(30),
    height: __d(40),
    paddingLeft: __d(10),
    borderWidth: __d(1),
    borderColor: "#e1e1e1",
    fontSize: __d(13),
    borderRadius: __d(5),
    marginTop: __d(20)
  },
  total_mem_txt: {
    padding: __d(10),
    alignItems: "flex-start",
    width: width
  },
  fl_mem_view: {
    borderTopWidth: __d(1),
    borderTopColor: "#e1e1e1",
    marginTop: __d(10)
  },
  btn_mem_view: {
    width: width,
    height: __d(50),
    justifyContent: "center",
    paddingLeft: __d(10),
    borderBottomWidth: __d(1),
    borderBottomColor: "#e1e1e1"
  },
  btn_mem_email_txt: {
    fontSize: __d(13)
  }
});
