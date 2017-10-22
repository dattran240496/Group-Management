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
const { width, height } = Dimensions.get("window");
import Modal from "react-native-modalbox";

@autobind
@observer
export default class ModalBox extends Component {
  @observable component = null;
  constructor(props) {
    super(props);
    this.Global = this.props.Global;
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
