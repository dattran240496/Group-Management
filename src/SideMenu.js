import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";

@autobind
@observer
export default class SideMenu extends Component {
  constructor(props) {
    super(props);
      this.User = this.props.User;
      this.state={}
  }
  componentWillMount() {
    console.log(this.User.user)
  }
  render() {
    return (
      <View style={styles.container}>
        {this.User.user &&
          <Image
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              resizeMode: "contain"
            }}
            source={{uri: this.User.user.picture}}
          />}
          {this.User.user && <Text style={{color: '#000', paddingTop:10}}>{this.User.user.email}</Text>}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
