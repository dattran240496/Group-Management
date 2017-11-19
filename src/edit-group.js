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
    FlatList
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import firebase from "./api/api";
import Modal from "react-native-modalbox";
import Icon from "react-native-vector-icons/FontAwesome";
const { width, height } = Dimensions.get("window");

@autobind
@observer
export default class MyGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
            typeEdit: props.typeEdit
        }
    }
    render(){
        return(
          <View style={{
              flex: 1
          }}>
              <Text>
                  {this.state.typeEdit}
              </Text>
          </View>
        );
    }
}