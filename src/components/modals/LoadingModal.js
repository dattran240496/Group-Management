import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Dimensions,
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class LoadingModal extends Component {
  static defaultProps = {
    onRefresh: function() {}
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {}
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../../images/loading/loadinganimation.gif")}
          style={{
            width: width,
            height: height
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff"
  }
});
