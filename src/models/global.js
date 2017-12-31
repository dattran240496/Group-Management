import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";

@autobind
class Global {
    @observable accessToken;
    @observable modalType = false;
    @observable componentFooter = false;
    @observable groupName = "";
    @observable groupKey = "";
    @observable urlPushNoti = "https://exp.host/--/api/v2/push/send";
    @observable isFooter = false;
}
const global = new Global();
export default global;
