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
  Animated
} from "react-native";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import { Actions } from "react-native-mobx";
import LoadingModal from "./LoadingModal";
import CheckAttendanceModal from "./check-attendance-modal";
import MemberCheckAttendanceModal from "./member-check-attendance";
import Message  from "./detail-message";
import Poll from "./vote-poll";
import Member from "./members"
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
import { __d } from "../helpers/index";
const { width, height } = Dimensions.get("window");

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
    switch (this.Global.modalType) {
      case "loading":
        component = (
          <LoadingModal
            closeModal={() => {
              this.Global.modalType = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
          />
        );

        break;
      case "check-attendance":
        component = (
          <CheckAttendanceModal
            closeModal={() => {
              this.Global.modalType = false;
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
        case "member-check-attendance":
            component = (
                <MemberCheckAttendanceModal
                    closeModal={() => {
                        this.Global.modalType = false;
                        this.closeModal();
                    }}
                    Global={this.Global}
                    User={this.User}
                    FirebaseApi={this.FirebaseApi}
                />
            );

            break;
        case "message":
            component = (
                <Message
                    closeModal={() => {
                        this.Global.modalType = false;
                        this.closeModal();
                    }}
                    Global={this.Global}
                    User={this.User}
                    FirebaseApi={this.FirebaseApi}
                />
            );

            break;
        case "poll":
            component = (
                <Poll
                    closeModal={() => {
                        this.Global.modalType = false;
                        this.closeModal();
                    }}
                    Global={this.Global}
                    User={this.User}
                    FirebaseApi={this.FirebaseApi}
                />
            );
            break;
        case "member":
            component = (
                <Member
                    closeModal={() => {
                        this.Global.modalType = false;
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
        pointerEvents={
          this.Global.modalType ? "auto" : "none"
        }
      >
        <Modal
          pointerEvents={this.Global.modalType ? "auto" : "none"}
          isOpen={this.Global.modalType ? true : false}
          style={[{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
              backgroundColor: 'transparent'
          }, this.Global.modalType === "loading" ? {width: width, height: height} : null]}
          ref={ref => (this.modal = ref)}
          swipeToClose={false}
          backdropPressToClose={false}
          position={"center"}
          onClosed={this._onClose}
          onOpened={this._onOpen}
          onClosingState={this._onClosingState}
        >
            {
                this.Global.modalType !== false && this.Global.modalType !== "loading" ? (
                    <TouchableOpacity
                        onPress={() => {
                            this.Global.modalType = false;
                        }}
                        style={{
                            position: "absolute",
                            top: (height - __d(350)) / 2 - __d(20),
                            right: __d(0),
                            width: __d(40),
                            height: __d(40),
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: __d(20),
                            backgroundColor: "#fff",
                            borderWidth: __d(1),
                            borderColor: "#5DADE2",
                            zIndex: 1
                        }}
                    >
                        <Icon name="times" color="#5DADE2" size={__d(15)} />
                    </TouchableOpacity>
                ) : null
            }
          {component}
        </Modal>
      </View>
    );
  }
}
