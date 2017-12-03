import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";
import {Permissions, Notifications} from 'expo'
import firebase from "firebase"
@autobind
class GroupList {
    @observable groupDataList;
}
const groupList = new GroupList();
export default groupList;
