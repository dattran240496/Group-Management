import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Image,
  PickerIOS,
  Platform,
  Alert,
  NetInfo,
  TouchableOpacity,
  Animated,
    KeyboardAvoidingView
} from "react-native";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import { Actions } from "react-native-mobx";
import GroupList from "./group-list";
import MyGroup from "./my-group";
import CreateGroup from "./enter-group-name";
import Account from "./account";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import Modal from "react-native-modalbox";
import { __d } from "../helpers/index";
@autobind
@observer
export default class ModalBox extends Component {
  @observable component = null;
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
    this.User = this.props.User;
    this.FirebaseApi = this.props.Firebase;
  }
  _onOpen() {}
  _onClose() {}
  _onClosingState() {}
  componentWillMount() {}
  componentDidMount() {}
  openModal() {
    this.modal.open();
  }
  closeModal() {
    this.modal.close();
  }
  componentWillUpdate() {}
  render() {
    let component = null;
    switch (this.Global.modalGroupManagement) {
      case "groupList":
        component = (
          <GroupList
            closeModal={() => {
              this.Global.modalGroupManagement = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
      case "myGroup":
        component = (
          <MyGroup
            closeModal={() => {
              this.Global.modalGroupManagement = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
      case "createGroup":
        component = (
          <CreateGroup
            closeModal={() => {
              this.Global.modalGroupManagement = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
      case "account":
        component = (
          <Account
            closeModal={() => {
              this.Global.modalGroupManagement = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
    }
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
          //backgroundColor: "transparent"
        }}
        pointerEvents={this.Global.modalGroupManagement ? "auto" : "none"}
      >
        <Modal
          pointerEvents={this.Global.modalGroupManagement ? "auto" : "none"}
          isOpen={this.Global.modalGroupManagement ? true : false}
          style={[
            {
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent"
            }
          ]}
          ref={ref => (this.modal = ref)}
          swipeToClose={false}
          backdropPressToClose={false}
          position={"center"}
          onClosed={this._onClose}
          onOpened={this._onOpen}
          onClosingState={this._onClosingState}
        >
          {component}
        </Modal>
      </View>
    );
  }
}
