import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Platform
} from "react-native";
import Expo from "expo";
import { Actions, Router, Scene } from "react-native-mobx";
import { observable } from "mobx";
import { autobind } from "core-decorators";
import { observer } from "mobx-react/native";
import Drawer from "react-native-drawer";
import SideMenu from "./SideMenu";
import Intro from "./intro"
import Login from "./login";
import Loading from "./loading";
import GroupList from "./components/modal-group-management/group-list";
import Homepage from "./home-page";
import MyGroup from "./components/modal-group-management/my-group";
import EnterGroupName from "./components/modal-group-management/enter-group-name";
import CheckAttendance from "./check-attendance";
import PostMessage from "./components/components-footer/post-messages";
import DetailMessage from "./detail-message";
import CreatePoll from "./components/components-footer/create-poll";
import VotePoll from "./vote-poll";
import EditGroup from "./edit-group";
import Member from "./components/components-footer/members";
import Account from "./components/modal-group-management/account";
import ModalBox from "./components/modals/index";
import ComponentFooter from "./components/components-footer/index"
import ModalGroupManagement from "./components/modal-group-management/index"
import Footer from "./components/Footer/footer"
import User from "./models/user";
import Global from "./models/global";
import FirebaseApi from "./models/firebase";

@autobind
@observer
export default class App extends Component {
  @observable email = "";
  @observable token = null;
  @observable isLogin = false;
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      drawerDisabled: false
    };
    this.User = User;
    this.FirebaseApi = FirebaseApi;
    this.Global = Global;
  }
  componentDidMount() {}
  componentWillMount() {}
  closeDrawer = () => {
    this._drawer.close();
  };
  openDrawer = () => {
    this._drawer.open();
  };

  render() {
    return (
      <View
        // ref={ref => (this._drawer = ref)}
        // type="static"
        // content={<SideMenu User={this.User} closeDrawer={this.closeDrawer} />}
        // acceptDoubleTap
        // styles={{
        //   main: { shadowColor: "#000000", shadowOpacity: 0.8, shadowRadius: 15 }
        // }}
        // onOpen={() => {
        //   this.setState({ drawerOpen: true });
        // }}
        // onClose={() => {
        //   this.setState({ drawerOpen: false });
        // }}
        // captureGestures={"open"}
        // tweenDuration={100}
        // panThreshold={0.08}
        // disabled={this.state.drawerDisabled}
        // openDrawerOffset={0.2}
        // closedDrawerOffset={0}
        // panOpenMask={0.2}
        // tapToClose={true}
        // negotiatePan
        // tweenHandler={ratio => ({
        //   main: { opacity: (2 - ratio) / 2 }
        // })}
          style={{
              flex: 1
          }}
      >
        <Router
          sceneStyle={{
            paddingTop: 64
          }}
          backButtonIcon="angle-left"
          leftIconStyle={{
            fontSize: 32,
            color: "#fff",
            width: 53.33,
            height: 53.33,
            lineHeight: 53.33,
            paddingLeft: 15
          }}
          drawerMenuPress={() => {
            !this.state.drawerOpen && this.openDrawer();
            this.state.drawerOpen && this.closeDrawer();
          }}
          onSceneChange={props => {
            Actions.pop({ type: "refresh" });
          }}
          User={this.User}
          FirebaseApi={this.FirebaseApi}
          Global={this.Global}
        >
          <Scene
              key="intro"
              title=""
              component={Intro}
              hideNavBar={true}
              sceneStyle={{
                  paddingTop: 0
              }}
          />
          <Scene
            key="login"
            title=""
            component={Login}
            hideNavBar={true}
            sceneStyle={{
              paddingTop: 0
            }}
          />
          <Scene
            key="loading"
            title=""
            component={Loading}
            hideNavBar={true}
            sceneStyle={{
              paddingTop: 0
            }}
          />
          <Scene
            key="homePage"
            title="Homepage"
            schema="modal"
            direction="vertical"
            component={Homepage}
            hideNavBar={true}
            navigationBarStyle={{
              backgroundColor: "#fff"
            }}
            sceneStyle={{
              paddingTop: 0
            }}
          />
          <Scene
            key="groupList"
            title="Group List"
            component={GroupList}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="myGroup"
            title="My Group"
            component={MyGroup}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="enterGroupName"
            title="Enter Group Name"
            component={EnterGroupName}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            sceneStyle={{
              paddingTop: 0
            }}
            key="checkAttendance"
            title="Check Attendance"
            component={CheckAttendance}
            hideNavBar={true}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="members"
            title="Members"
            component={Member}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="postMessage"
            title="Post Message"
            component={PostMessage}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="detailMessage"
            title="Detail Message"
            component={DetailMessage}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="createPoll"
            title="Create Poll"
            component={CreatePoll}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="votePoll"
            title="Vote"
            component={VotePoll}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="editGroup"
            title=""
            component={EditGroup}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
          <Scene
            key="account"
            title="Account"
            component={Account}
            hideNavBar={false}
            navigationBarStyle={{
              backgroundColor: "#5DADE2"
            }}
            titleStyle={{
              color: "#fff"
            }}
          />
        </Router>
        <ModalBox
          Global={this.Global}
          Firebase={this.FirebaseApi}
          User={this.User}
        />
        <ComponentFooter
            Global={this.Global}
            Firebase={this.FirebaseApi}
            User={this.User}
        />
        <ModalGroupManagement
            Global={this.Global}
            Firebase={this.FirebaseApi}
            User={this.User}
        />
        <Footer
            Global={this.Global}
            User={this.User}
            Firebase={this.FirebaseApi}
        />
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
