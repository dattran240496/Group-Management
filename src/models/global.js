import { observable, autorun } from "mobx";
import { autobind } from "core-decorators";
import moment from "moment";
import React, { Component } from "react";
import { Animated } from "react-native";
import { observer } from "mobx-react/native";
import { __d } from "../components/helpers/index";
@autobind
class Global {
    @observable accessToken;
    @observable modalType = false;
    @observable modalGroupManagement = false;
    @observable componentFooter = false;
    @observable groupName = "";
    @observable groupKey = "";
    @observable urlPushNoti = "https://exp.host/--/api/v2/push/send";
    @observable isFooter = false;
    @observable isShowButtonFooter = false;
    @observable month = [
        "NONE",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUNE",
        "JULY",
        "AUG",
        "SEPT",
        "OCT",
        "NOV",
        "DEC"
    ];
    @observable selectedMessage = null;
    @observable selectedPoll = null;
    @observable heightPopUp = __d(350);
}
const global = new Global();
export default global;
