"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var firebase_1 = require("../tools/firebase");
var utilities_1 = require("../tools/utilities");
var firebase_2 = require("firebase");
var NewChatDialog = (function (_super) {
    __extends(NewChatDialog, _super);
    function NewChatDialog(props) {
        var _this = _super.call(this, props) || this;
        _this.chat = {
            topic: "New Chat",
            lastMessage: " ",
            users: {},
            timestamp: null
        };
        _this.newChat = function () {
            return new firebase_2.Promise(function (res, rej) {
                var dialog = document.querySelector('dialog');
                firebase_1.default.db.ref("users").once("value").then(function (snap) {
                    var users = snap.val();
                    delete users[firebase_1.default.user().uid];
                    _this.setState({ users: users });
                    dialog.showModal();
                });
                dialog.querySelector('.close').addEventListener('click', function () {
                    dialog.close();
                });
                _this.resolve = res;
                _this.reject = rej;
            });
        };
        _this.addUserToNewChat = function (e) {
            var uid = e.target.id;
            _this.chat["users"][uid] = uid;
        };
        _this.createChat = function () {
            _this.chat["users"][firebase_1.default.user().uid] = firebase_1.default.user().uid;
            _this.chat["timestamp"] = new Date().getTime();
            var newChat = firebase_1.default.db.ref("rooms").push(_this.chat);
            for (var i in _this.chat["users"]) {
                var user = _this.chat["users"][i];
                firebase_1.default.db.ref("users/" + user + "/rooms/" + newChat.key).set(_this.chat["timestamp"]);
            }
            var dialog = document.querySelector('dialog');
            dialog.close();
            _this.resolve();
        };
        _this.state = {
            users: {}
        };
        return _this;
    }
    NewChatDialog.prototype.render = function () {
        var _this = this;
        var users;
        if (this.state.users != null && Object.keys(this.state.users).length > 0) {
            users = utilities_1.toArray(this.state.users).map(function (user) {
                return (<li className="mdl-list__item" key={user.uid}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons  mdl-list__item-avatar">person</i>
                            {user.email}
                        </span>
                        <span className="mdl-list__item-secondary-action">
                          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={user.uid}>
                            <input type="checkbox" id={user.uid} className="mdl-checkbox__input" onChange={_this.addUserToNewChat}/>
                          </label>
                        </span>
                    </li>);
            });
        }
        return (<dialog className="mdl-dialog">
                <h4 className="mdl-dialog__title">Create new chat:</h4>
                <div className="mdl-dialog__content">
                    <h5>Select User:</h5>
                    <ul className="demo-list-control mdl-list">
                        {users}
                    </ul>
                </div>
                <div className="mdl-dialog__actions">
                    <button type="button" className="mdl-button" onClick={this.createChat}>Create Chat</button>
                    <button type="button" className="mdl-button close">Cancel</button>
                </div>
            </dialog>);
    };
    return NewChatDialog;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NewChatDialog;
