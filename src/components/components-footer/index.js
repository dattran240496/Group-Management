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
    Text,
    StyleSheet
} from "react-native";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import { Actions } from "react-native-mobx";
import PostMessage from "./post-messages";
import CreatePoll from "./create-poll";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");
import Modal from "react-native-modalbox";
import { __d } from "../helpers/index";
@autobind
@observer
export default class ComponentFooter extends Component {
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
    let title = null;
    let component = null;
    switch (this.Global.componentFooter) {
      case "messages":
        title = "Message";
        component = (
          <PostMessage
            closeModal={() => {
              this.closeModal();
            }}
            Global={this.Global}
            User={this.User}
            FirebaseApi={this.FirebaseApi}
          />
        );

        break;
      case "poll":
        title = "Poll";
        component = (
          <CreatePoll
            closeModal={() => {
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
          height: height
        }}
        pointerEvents={this.Global.componentFooter ? "auto" : "none"}
      >
        <Modal
          pointerEvents={this.Global.componentFooter ? "auto" : "none"}
          isOpen={this.Global.componentFooter ? true : false}
          style={[
            {
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent"
            }
          ]}
          ref={ref => (this.componentFooter = ref)}
          swipeToClose={false}
          backdropPressToClose={false}
          position={"center"}
          onClosed={this._onClose}
          onOpened={this._onOpen}
          onClosingState={this._onClosingState}
        >
            {
              this.Global.componentFooter !== false ?(
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
                          right: -__d(0),
                          top:(height - __d(300)) / 2 - __d(20),
                          backgroundColor: "#fff",
                          zIndex: 1
                      }}
                  >
                    <Icon name="times" color="#5DADE2" size={15} />
                  </TouchableOpacity>
              ) : null
            }
          {component}
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header_btn_back_view: {
    position: "absolute",
    width: __d(64),
    height: __d(64),
    justifyContent: "center",
    left: 0,
    top: 0,
    paddingLeft: __d(10),
    paddingTop: __d(10)
  }
});
