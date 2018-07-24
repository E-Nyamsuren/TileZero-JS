/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// Background music by https://www.bensound.com under FREE Creative Commons License.
///

var AssetPackage;
(function (AssetPackage) {
    /// <summary>
    /// Values that represent log severity.
    /// <br/>
    ///      See
    /// <a href="https://msdn.microsoft.com/en-us/library/office/ff604025(v=office.14).aspx">Trace
    /// and Event Log Severity Levels</a>
    /// </summary>
    var Severity;
    (function (Severity) {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        Severity[Severity["Critical"] = 1] = "Critical";
        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        Severity[Severity["Error"] = 2] = "Error";
        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        Severity[Severity["Warning"] = 4] = "Warning";
        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        Severity[Severity["Information"] = 8] = "Information";
        /// <summary>
        /// An enum constant representing the verbose option.
        /// </summary>
        Severity[Severity["Verbose"] = 16] = "Verbose";
    })(Severity = AssetPackage.Severity || (AssetPackage.Severity = {}));
    var LogLevel;
    (function (LogLevel) {
        /// <summary>
        /// An enum constant representing the critical option.
        /// </summary>
        LogLevel[LogLevel["Critical"] = 1] = "Critical";
        /// <summary>
        /// An enum constant representing the error option.
        /// </summary>
        LogLevel[LogLevel["Error"] = 3] = "Error";
        /// <summary>
        /// An enum constant representing the warning option.
        /// </summary>
        LogLevel[LogLevel["Warn"] = 7] = "Warn";
        /// <summary>
        /// An enum constant representing the information option.
        /// </summary>
        LogLevel[LogLevel["Info"] = 15] = "Info";
        /// <summary>
        /// An enum constant representing all option.
        /// </summary>
        LogLevel[LogLevel["All"] = 31] = "All";
    })(LogLevel = AssetPackage.LogLevel || (AssetPackage.LogLevel = {}));
})(AssetPackage || (AssetPackage = {}));
/// <reference path="IBridge.ts"/>
/// <reference path="ISettings.ts"/>
/// <summary>
/// A Message Broadcast package.
/// </summary>
var MessagesPackage;
(function (MessagesPackage) {
    /*
     * todo error checks on nil/undefined objects (as func in subscribers[len].func(message, parameters) ?).
     * todo add sender in broadcast (or is parameters enough)?
     * todo add some more bookkeeping (like list messages).
     * todo use the hash table from AssetManager instead (so rewrite this code)?
     *
     * done strongly typed all parameters and return types.
     */
    /// <summary>
    /// A static Broastcast Messages class.
    /// </summary>
    var Messages = /** @class */ (function () {
        function Messages() {
        }
        /// <summary>
        /// Defines a new Message.
        /// </summary>
        ///
        /// <param name="message"> The message. </param>
        ///
        /// <returns>
        /// true if newly defined, false if already defined.
        /// </returns>
        Messages.define = function (message) {
            if (!this.messages[message]) {
                this.messages[message] = [];
                return true;
            }
            return false;
        };
        Messages.broadcaster = function (message, subscribers, parameters) {
            //var subscribers = this.messages[message];
            var len = subscribers ? subscribers.length : 0;
            for (var subscriber in subscribers) {
                var tmp = subscribers[subscriber];
                if (tmp.func) {
                    tmp.func(message, parameters);
                }
                //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
                // 
                //if (subscriber.func) {
                //    subscriber.func(message, parameters);
                //}
            }
        };
        /// <summary>
        /// Broadcast a message.
        /// </summary>
        ///
        /// <param name="message">    The message to broadcast. </param>
        /// <param name="parameters"> The (optional) arguments. </param>
        ///
        /// <returns>
        /// true if the message exists else false.
        /// </returns>
        Messages.broadcast = function (message, parameters) {
            if (!this.messages[message]) {
                return false;
            }
            setTimeout(this.broadcaster, 0, message, this.messages[message], parameters);
            //{
            //    broadcaster(
            //    var subscribers = this.messages[message];
            //    var len: number = subscribers ? subscribers.length : 0;
            //    for (var subscriber in subscribers) {
            //        var tmp: any = subscriber;
            //        if (tmp.func) {
            //            tmp.func(message, parameters);
            //        }
            //        //! This code fails to compile in the latest TypeScript version ('func' not found on type string).
            //        // 
            //        //if (subscriber.func) {
            //        //    subscriber.func(message, parameters);
            //        //}
            //    }
            //}, 0, message, this.messages[message]);
            return true;
        };
        /// <summary>
        /// Subscribe to a broadcast.
        /// </summary>
        ///
        /// <remarks>
        /// if the message does not exist yet it's created on-the-fly.
        /// </remarks>
        ///
        /// <param name="message">  The message. </param>
        /// <param name="callback"> The callback function. </param>
        ///
        /// <returns>
        /// the broadcast subscription id.
        /// </returns>
        Messages.subscribe = function (message, callback) {
            if (!this.messages[message]) {
                this.messages[message] = [];
            }
            /// <summary>
            /// Identifier for the subscription.
            /// </summary>
            var subscriptionId = (++this.idGenerator).toString();
            this.messages[message].push({
                token: subscriptionId,
                func: callback
            });
            return subscriptionId;
        };
        /// <summary>
        /// Unsubscribes the given broadcast subscription id.
        /// </summary>
        ///
        /// <param name="subscriptionId"> The broadcast subscription id. </param>
        ///
        /// <returns>
        /// true if unsubscribed else false.
        /// </returns>
        Messages.unsubscribe = function (subscriptionId) {
            for (var m in this.messages) {
                if (this.messages[m]) {
                    for (var i = 0, j = this.messages[m].length; i < j; i++) {
                        if (this.messages[m][i].token === subscriptionId) {
                            this.messages[m].splice(i, 1);
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        /// <summary>
        /// The messages is a dictionary of lists (a list of subscribers per broadcast message).
        /// </summary>
        Messages.messages = {};
        /// <summary>
        /// The subscription ID generator.
        /// </summary>
        Messages.idGenerator = -1;
        return Messages;
    }());
    MessagesPackage.Messages = Messages;
})(MessagesPackage || (MessagesPackage = {}));
/// <summary>
/// A Dictionary class.
/// </summary>
var AssetManagerPackage;
(function (AssetManagerPackage) {
    /// <summary>
    /// A simple Dictionary.
    /// </summary>
    var Dictionary = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the Dictionary class.
        /// </summary>
        function Dictionary() {
            this.keys_ = new Array();
            // Nothing
        }
        /// <summary>
        /// Adds key.
        /// </summary>
        ///
        /// <param name="key">   The key. </param>
        /// <param name="value"> The value. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.add = function (key, value) {
            this[key] = value;
            this.keys_.push(key);
        };
        /// <summary>
        /// Removes the given key.
        /// </summary>
        ///
        /// <param name="key"> The key to remove. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.remove = function (key) {
            var index = this.keys_.indexOf(key, 0);
            this.keys_.splice(index, 1);
            delete this[key];
        };
        Object.defineProperty(Dictionary.prototype, "keys", {
            /// <summary>
            /// Gets the keys.
            /// </summary>
            ///
            /// <returns>
            /// A string[].
            /// </returns>
            get: function () {
                var arr = new Array();
                for (var key in this.keys_) {
                    arr.push(this.keys_[key]);
                }
                return arr;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "values", {
            /// <summary>
            /// Gets the values.
            /// </summary>
            ///
            /// <returns>
            /// An any[].
            /// </returns>
            get: function () {
                var arr = new Array();
                for (var key in this.keys_) {
                    arr.push(this[key]);
                }
                return arr;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Contains key.
        /// </summary>
        ///
        /// <param name="key"> The key. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        Dictionary.prototype.containsKey = function (key) {
            return (typeof this[key] === "undefined") ? false : true;
        };
        return Dictionary;
    }());
    AssetManagerPackage.Dictionary = Dictionary;
})(AssetManagerPackage || (AssetManagerPackage = {}));
/// <reference path='Dictionary.ts' />
var AssetPackage;
(function (AssetPackage) {
    var Version = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        function Version(major, minor, build, revision, maturity) {
            /// <summary>
            /// The private major.
            /// </summary>
            this.Major = "0";
            /// <summary>
            /// The private minor.
            /// </summary>
            this.Minor = "0";
            /// <summary>
            /// The private build.
            /// </summary>
            this.Build = "0";
            /// <summary>
            /// The private revision.
            /// </summary>
            this.Revision = "0";
            /// <summary>
            /// The public maturity.
            /// </summary>
            this.Maturity = "";
            /// <summary>
            /// The public dependencies.
            /// </summary>
            this.Dependencies = [];
            this.Major = major;
            this.Minor = minor;
            this.Build = build;
            this.Revision = revision;
            this.Maturity = maturity;
            this.Dependencies = [];
            // this.Dependencies.push(new Dependency("Logger", "1.2.3", "*"));
            // Output of JSON.stringify(this)
            // {
            //        "Major":"1",
            //        "Minor":"0",
            //        "Revision":"15"
            //        "Build":"22",
            //        "Revision":"15"
            //        "Maturity":"Alpha"
            //        "Dependencies":[
            //          {"Class":"Logger","minVersion":"1.2.3","maxVersion":"*"}
            //          ]
            // }
            // console.log(JSON.stringify(this));
        }
        return Version;
    }());
    AssetPackage.Version = Version;
    /// <summary>
    /// A dependency.
    /// </summary>
    var Dependency = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the version class.
        /// </summary>
        ///
        /// <param name="Class">      The class. </param>
        /// <param name="minVersion"> The minimum version. </param>
        /// <param name="maxVersion"> The maximum version. </param>
        function Dependency(Class, minVersion, maxVersion) {
            /// <summary>
            /// The public class.
            /// </summary>
            this.Class = "";
            /// <summary>
            /// The public minimum version.
            /// </summary>
            this.minVersion = "";
            /// <summary>
            /// The public maximum version.
            /// </summary>
            this.maxVersion = "";
            this.Class = Class;
            this.minVersion = minVersion;
            this.maxVersion = maxVersion;
        }
        Object.defineProperty(Dependency.prototype, "versionRange", {
            /// <summary>
            /// Version range.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var minV = this.isEmpty(this.minVersion) ? "0.0" : this.minVersion;
                var maxV = this.isEmpty(this.maxVersion) ? "*" : this.maxVersion;
                return minV + "-" + maxV;
            },
            enumerable: true,
            configurable: true
        });
        ;
        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        Dependency.prototype.isEmpty = function (str) {
            return (!str || 0 === str.length);
        };
        return Dependency;
    }());
    AssetPackage.Dependency = Dependency;
})(AssetPackage || (AssetPackage = {}));
/// <reference path='IAsset.ts' />
/// <reference path='IBridge.ts' />
/// <reference path='Messages.ts' />
/// <reference path='Dictionary.ts' />
/// <reference path='Version.ts' />
/// <summary>
/// An asset manager package.
/// 
/// Note this package has to be setup to 
/// 1) combine code into a single js file,   
/// 2) redirect output the the proof-of concept project  
/// 3) generated declaration files.  
/// </summary>
var AssetManagerPackage;
(function (AssetManagerPackage) {
    var Dictionary = AssetManagerPackage.Dictionary;
    /// <summary>
    /// Export the AssetManager.
    /// </summary>
    var AssetManager = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the AssetManager class.
        /// </summary>
        function AssetManager() {
            /// <summary>
            /// User to generate uniqueId's for registered assets.
            /// </summary>
            this.idGenerator = 0;
            /// <summary>
            /// The assets dictionary (id = object).
            /// </summary>
            this.assets = new Dictionary();
            if (AssetManager._instance) {
                throw new Error("Error: Instantiation failed: Use AssetManager.getInstance() instead of new.");
            }
            AssetManager._instance = this;
        }
        Object.defineProperty(AssetManager, "Instance", {
            /// <summary>
            /// Gets the singleton instance.
            /// </summary>
            ///
            /// <returns>
            /// An AssetManager.
            /// </returns>
            get: function () {
                if (AssetManager._instance === null) {
                    AssetManager._instance = new AssetManager();
                }
                return AssetManager._instance;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Registers the asset instance.
        /// </summary>
        ///
        /// <param name="asset"> The asset. </param>
        /// <param name="claz">  The claz. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        AssetManager.prototype.registerAssetInstance = function (asset, claz) {
            var keys = this.assets.keys;
            for (var i = 0; i < keys.length; i++) {
                if (this.assets[keys[i]] === asset) {
                    return keys[i];
                }
            }
            var Id = claz + "_" + (this.idGenerator++).toString(); //assets.length
            this.assets.add(Id, asset);
            return Id;
        };
        /// <summary>
        /// Returns the exact match.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// The found asset by identifier.
        /// </returns>
        AssetManager.prototype.findAssetById = function (id) {
            return this.assets[id];
        };
        /// <summary>
        /// Returns the first match.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found asset by class.
        /// </returns>
        AssetManager.prototype.findAssetByClass = function (claz) {
            var keys = this.assets.keys;
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    return this.assets[keys[i]];
                }
            }
            return null;
        };
        /// <summary>
        /// Searches for the first assets by class.
        /// </summary>
        ///
        /// <param name="claz"> The claz. </param>
        ///
        /// <returns>
        /// The found assets by class.
        /// </returns>
        AssetManager.prototype.findAssetsByClass = function (claz) {
            var keys = this.assets.keys;
            var results = [];
            for (var i = 0; i < keys.length; i++) {
                if (keys[i].indexOf(claz + "_") == 0) {
                    results.push(this.assets[keys[i]]);
                }
            }
            return results;
        };
        Object.defineProperty(AssetManager.prototype, "Bridge", {
            /// <summary>
            /// Gets the bridge.
            /// </summary>
            ///
            /// <returns>
            /// A get.
            /// </returns>
            get: function () {
                return this._bridge;
            },
            /// <summary>
            /// Bridges the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._bridge = val;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Pads String Left or Right with spaces.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        AssetManager.prototype.pad = function (str, pad, padLeft) {
            return this.padc(str, pad, ' ', padLeft);
        };
        /// <summary>
        /// Pads String Left or Right with a character.
        /// </summary>
        ///
        /// <param name="str">     The string to pad. </param>
        /// <param name="pad">     The padding length. </param>
        /// <param name="padwith"> The padding character. </param>
        /// <param name="padLeft"> true to pad left. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        AssetManager.prototype.padc = function (str, pad, padwith, padLeft) {
            var padding = Array(pad).join(padwith);
            if (typeof str === 'undefined')
                return padding;
            if (padLeft) {
                return (padding + str).slice(-padding.length);
            }
            else {
                return (str + padding).substring(0, padding.length);
            }
        };
        Object.defineProperty(AssetManager.prototype, "VersionAndDependenciesReport", {
            /// <summary>
            /// Version and dependencies report.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var col1w = 40;
                var col2w = 32;
                var report = "";
                report += this.pad("Asset", col1w, false);
                report += "Depends on";
                report += "\r\n";
                report += this.padc("", col1w - 1, "-", false);
                report += "+";
                report += this.padc("", col2w, "-", false);
                report += "\r\n";
                var keys = this.assets.keys;
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var asset = this.assets[key];
                    report += this.pad(asset.Class + " v" + asset.Version, col1w - 1, false);
                    var cnt = 0;
                    for (var j = 0; j < asset.Dependencies.length; j++) {
                        var dependency = asset.Dependencies[j];
                        //! Better version matches (see Microsoft).
                        // 
                        //! https://msdn.microsoft.com/en-us/library/system.version(v=vs.110).aspx
                        //
                        //! dependency.value has min-max format (inclusive) like:
                        // 
                        //? v1.2.3-*        (v1.2.3 or higher)
                        //? v0.0-*          (all versions)
                        //? v1.2.3-v2.2     (v1.2.3 or higher less than or equal to v2.1)
                        //
                        var vrange = dependency.versionRange.split('-');
                        var low;
                        var hi;
                        switch (vrange.length) {
                            case 1:
                                low = vrange[0].split('.');
                                hi = low;
                                break;
                            case 2:
                                low = vrange[0].split('.');
                                if (vrange[1] === "*") {
                                    hi = "255.255".split('.');
                                }
                                else {
                                    hi = vrange[1].split('.');
                                }
                                break;
                            default:
                                break;
                        }
                        var found = false;
                        if (low != null) {
                            var foundAssets = this.findAssetsByClass(dependency.Class);
                            for (var dep in foundAssets) {
                                var asset = foundAssets[dep];
                                var av = asset.Version.split('.');
                                var loOk = true;
                                for (var i = 0; i < low.length; i++) {
                                    if (av.length < i + 1) {
                                        break;
                                    }
                                    if (low[i] == "*") {
                                        break;
                                    }
                                    else if (av[i] < low[i]) {
                                        loOk = false;
                                        break;
                                    }
                                }
                                var hiOk = true;
                                for (var i = 0; i < hi.length; i++) {
                                    if (av.length < i + 1) {
                                        break;
                                    }
                                    if (hi[i] == "*") {
                                        break;
                                    }
                                    else if (av[i] > hi[i]) {
                                        hiOk = false;
                                        break;
                                    }
                                }
                                found = loOk && hiOk;
                            }
                            report += "|" + dependency.Class + " v" + dependency.versionRange + " [" + (found ? "resolved" : "missing") + "]";
                            report += "\r\n";
                        }
                        else {
                            report += "error";
                            report += "\r\n";
                        }
                        if (j < asset.Dependencies.length - 1) {
                            report += this.pad("", col1w - 1, false);
                        }
                        cnt++;
                    }
                    if (cnt == 0) {
                        report += "|No dependencies";
                        report += "\r\n";
                    }
                }
                report += this.padc("", col1w - 1, "-", false);
                report += "+";
                report += this.padc("", col2w, "-", false);
                report += "\r\n";
                return report;
            },
            enumerable: true,
            configurable: true
        });
        AssetManager._instance = null;
        return AssetManager;
    }());
    AssetManagerPackage.AssetManager = AssetManager;
})(AssetManagerPackage || (AssetManagerPackage = {}));
/// <reference path="AssetManager.ts"/>
/// <reference path="IAsset.ts"/>
/// <reference path="IBridge.ts"/>
/// <reference path="IDataStorage.ts"/>
/// <reference path="IDefaultSettings.ts"/>
/// <reference path="ILog.ts"/>
/// <reference path="Version.ts"/>
///
var AssetPackage;
(function (AssetPackage) {
    var AssetManager = AssetManagerPackage.AssetManager;
    /// <summary>
    /// Export the Asset.
    /// </summary>
    var BaseAsset = /** @class */ (function () {
        /// <summary>
        /// Initializes a new instance of the Asset class.
        /// Sets the ClassName property/
        /// </summary>
        function BaseAsset() {
            /// <summary>
            /// Information describing the protected version.
            /// </summary>
            /// 
            /// <remarks>
            /// Commas after the last member and \r\n are not allowed.
            /// </remarks>
            this.versionInfo = '{' +
                '  "Major":"1", ' +
                '  "Minor":"2", ' +
                '  "Build":"3" ' +
                '}';
            /// <summary>
            /// Manager for asset.
            /// 
            /// Note: should be protected (ie. only visible in derived assets).
            /// </summary>
            this.assetManager = AssetManager.Instance;
            this._sId = "";
            this._sClass = "";
            var funcNameRegex = /function (.{1,})\(/;
            var code = (this).constructor.toString();
            var results = (funcNameRegex).exec(code);
            this._sClass = (results && results.length > 1) ? results[1] : "";
            this.setId(this.assetManager.registerAssetInstance(this, this.Class));
        }
        Object.defineProperty(BaseAsset.prototype, "Class", {
            /// <summary>
            /// Gets the class.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                return this._sClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Id", {
            /// <summary>
            /// Gets the identifier.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                return this._sId;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets an identifier.
        /// </summary>
        ///
        /// <param name="id"> The identifier. </param>
        ///
        /// <returns>
        /// .
        /// </returns>
        BaseAsset.prototype.setId = function (id) {
            if (this._sId.length == 0) {
                this._sId = id;
            }
        };
        Object.defineProperty(BaseAsset.prototype, "Version", {
            /// <summary>
            /// Gets the version.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                return _version.Major + "." + _version.Minor + "." + _version.Build +
                    (this.isEmpty(_version.Revision) ? "" : "." + _version.Revision);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Maturity", {
            /// <summary>
            /// Gets the maturity.
            /// </summary>
            ///
            /// <returns>
            /// A string.
            /// </returns>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                return _version.Maturity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Dependencies", {
            /// <summary>
            /// The dependencies.
            /// </summary>
            get: function () {
                var _version = JSON.parse(this.versionInfo);
                // Fixup for missing versionRange property/method in Dependency by re-creating them properly.
                if (_version.Dependencies) {
                    for (var j = 0; j < _version.Dependencies.length; j++) {
                        var _dep = _version.Dependencies[j];
                        _version.Dependencies[j] = new AssetPackage.Dependency(_dep.Class, _dep.minVersion, _dep.maxVersion);
                    }
                    return _version.Dependencies;
                }
                else {
                    return [];
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Bridge", {
            /// <summary>
            /// Gets the bridge.
            /// </summary>
            ///
            /// <returns>
            /// A get.
            /// </returns>
            get: function () {
                return this._bridge;
            },
            /// <summary>
            /// Bridges the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._bridge = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "Settings", {
            /// <summary>
            /// Gets the settings.
            /// </summary>
            ///
            /// <returns>
            /// The ISettings.
            /// </returns>
            get: function () {
                return this._settings;
            },
            /// <summary>
            /// Settings the given value.
            /// </summary>
            ///
            /// <param name="val"> The value. </param>
            ///
            /// <returns>
            /// A set.
            /// </returns>
            set: function (val) {
                this._settings = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAsset.prototype, "hasSettings", {
            /// <summary>
            /// Query if this object has settings.
            /// </summary>
            ///
            /// <returns>
            /// true if settings, false if not.
            /// </returns>
            get: function () {
                return this.Settings != null;
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Loads default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.LoadDefaultSettings = function () {
            var ds = this.getInterfaceMethod("LoadDefaultSettings");
            if (ds && this.hasSettings && ds.HasDefaultSettings(this.Class, this.Id)) {
                var Json = ds.LoadDefaultSettings(this.Class, this.Id);
                this.Settings = JSON.parse(Json);
                return true;
            }
            return false;
        };
        /// <summary>
        /// Loads the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.LoadSettings = function (filename) {
            var ds = this.getInterfaceMethod("Load");
            if (ds) {
                // TODO TEST CODE
                // this.Settings = JSON.parse("[1, 2, 3, 4]");
                // ds.Save(filename, JSON.stringify(this.Settings));
                var json = ds.Load(filename);
                this.Settings = JSON.parse(json);
                return true;
            }
            return false;
        };
        /// <summary>
        /// Saves the default settings.
        /// </summary>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.SaveDefaultSettings = function (force) {
            var ds = this.getInterfaceMethod("SaveDefaultSettings");
            if (ds && this.hasSettings && (force || !ds.HasDefaultSettings(this.Class, this.Id))) {
                ds.SaveDefaultSettings(this.Class, this.Id, JSON.stringify(this.Settings));
                return true;
            }
            return false;
        };
        /// <summary>
        /// Saves the settings.
        /// </summary>
        ///
        /// <param name="filename"> Filename of the file. </param>
        ///
        /// <returns>
        /// true if it succeeds, false if it fails.
        /// </returns>
        BaseAsset.prototype.SaveSettings = function (filename) {
            var ds = this.getInterfaceMethod("Save");
            if (ds) {
                ds.Save(filename, JSON.stringify(this.Settings));
                return true;
            }
            return false;
        };
        /// <summary>
        /// Settings from JSON.
        /// </summary>
        ///
        /// <param name="json"> The JSON. </param>
        ///
        /// <returns>
        /// The ISettings.
        /// </returns>
        BaseAsset.prototype.SettingsFromJson = function (json) {
            // TODO Test
            // 
            return JSON.parse(json);
        };
        /// <summary>
        /// Settings to JSON.
        /// </summary>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        BaseAsset.prototype.SettingsToJson = function () {
            // TODO Test
            // 
            return JSON.stringify(this.Settings);
        };
        /// <summary>
        /// Logs.
        /// </summary>
        ///
        /// <param name="severity"> The severity. </param>
        /// <param name="format">   Describes the format to use. </param>
        /// <param name="args">     A variable-length parameters list containing
        ///                         arguments. </param>
        BaseAsset.prototype.Log = function (severity, format) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var ds = this.getInterfaceMethod("Log");
            if (ds != null) {
                var result = format;
                for (var i = 0; i < args.length; i++) {
                    result = result.replace("{" + i + "}", args[i]);
                }
                //this.Log(severity, result);
                ds.Log(severity, result);
            }
        };
        ///// <summary>
        ///// Logs.
        ///// </summary>
        /////
        ///// <param name="severity"> The severity. </param>
        ///// <param name="msg">      The message. </param>
        //public Log(severity: Severity, msg: string): void {
        //    var ds: ILog = this.getInterfaceMethod("Log");
        //    if (ds != null) {
        //        ds.Log(severity, msg);
        //    }
        //}
        /// <summary>
        /// Gets the methods.
        /// </summary>
        ///
        /// <param name="obj"> The object. </param>
        ///
        /// <returns>
        /// An array of any.
        /// </returns>
        BaseAsset.prototype.getMethods = function (obj) {
            var methods = [];
            // console.log("Methods:");
            for (var m in obj) {
                if (typeof obj[m] == "function") {
                    // console.log(m);
                    methods.push(m);
                }
            }
            return methods;
        };
        /// <summary>
        /// Gets interface method.
        /// </summary>
        ///
        /// <param name="methodName"> Name of the method. </param>
        ///
        /// <returns>
        /// The interface method.
        /// </returns>
        BaseAsset.prototype.getInterfaceMethod = function (methodName) {
            //var methods: any[] = this.getMethods(new T());
            if (this.Bridge != null) {
                // Check if method is present on Asset Bridge!
                // 
                var methods = this.getMethods(this.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof this.Bridge." + methodName) === 'function')) {
                        return this.Bridge;
                    }
                }
            }
            else if (AssetManager.Instance.Bridge != null) {
                // Check if method is present on AssetManager Bridge!
                // 
                var methods = this.getMethods(AssetManager.Instance.Bridge);
                for (var m in methods) {
                    // console.log(methods[m]);
                    if (methods[m] == methodName &&
                        (eval("typeof AssetManager.Instance.Bridge." + methodName) === 'function')) {
                        return AssetManager.Instance.Bridge;
                    }
                }
            }
            return null;
        };
        /// <summary>
        /// Query if 'str' is empty.
        /// </summary>
        ///
        /// <param name="str"> The string. </param>
        ///
        /// <returns>
        /// true if empty, false if not.
        /// </returns>
        BaseAsset.prototype.isEmpty = function (str) {
            return (!str || 0 === str.length);
        };
        return BaseAsset;
    }());
    AssetPackage.BaseAsset = BaseAsset;
})(AssetPackage || (AssetPackage = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
var Misc;
(function (Misc) {
    //////////////////////////////////////////////////////////////////////////////////////
    ////// START: const fields
    Misc.DATE_FORMAT = "yyyy-MM-ddThh:mm:ss";
    Misc.MIN_K_FCT = 0.0075;
    Misc.INITIAL_K_FCT = 0.0375; // [SC] FIDE range for K 40 for new players until 30 completed games, or as long as their rating remains under 2300; K = 20, for players with a rating always under 2400; K = 10, for players with any published rating of at least 2400 and at least 30 games played in previous events. Thereafter it remains permanently at 10.
    Misc.INITIAL_RATING = 0.01;
    Misc.INITIAL_UNCERTAINTY = 1.0;
    Misc.DEFAULT_TIME_LIMIT = 90000; // [SC] in milliseconds
    Misc.DEFAULT_DATETIME = "2015-07-22T11:56:17";
    Misc.UNASSIGNED_TYPE = "UNASSIGNED"; // [SC] any adapter should have a Type unique among adapters oof TwoA
    Misc.ERROR_CODE = -9999;
    Misc.DISTR_LOWER_LIMIT = 0.001; // [SC] lower limit of any probability value
    Misc.DISTR_UPPER_LIMIT = 0.999; // [SC] upper limit of any probability value
    ////// END: const fields
    //////////////////////////////////////////////////////////////////////////////////////
    function IsNullOrEmpty(p_string) {
        if (typeof p_string !== 'undefined' && p_string) {
            return false;
        }
        else {
            return true;
        }
    }
    Misc.IsNullOrEmpty = IsNullOrEmpty;
    // [SC] returns a random integer between [p_min, p_max]
    function GetRandomInt(p_min, p_max) {
        //return p_min + Math.round(Math.random() * (p_max - p_min));
        return Math.floor(Math.random() * (p_max - p_min + 1) + p_min);
    }
    Misc.GetRandomInt = GetRandomInt;
    function DaysElapsed(p_pastDateStr) {
        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = new Date().getTime();
        var date2_ms = Date.parse(p_pastDateStr);
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms);
        // Convert back to days and return
        return Math.round(difference_ms / ONE_DAY);
    }
    Misc.DaysElapsed = DaysElapsed;
    function GetDateStr() {
        return new Date().toJSON().slice(0, 19);
    }
    Misc.GetDateStr = GetDateStr;
    function GetNormal(p_mean, p_stdev) {
        var y2;
        var use_last = false;
        var y1;
        if (use_last) {
            y1 = y2;
            use_last = false;
        }
        else {
            var x1 = void 0, x2 = void 0, w = void 0;
            do {
                x1 = 2.0 * Math.random() - 1.0;
                x2 = 2.0 * Math.random() - 1.0;
                w = x1 * x1 + x2 * x2;
            } while (w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w)) / w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
        }
        var retval = p_mean + p_stdev * y1;
        if (retval > 0) {
            return retval;
        }
        return -retval;
    }
    Misc.GetNormal = GetNormal;
    function GetNormalOneSide(p_mean, p_stdev, p_left) {
        var value = GetNormal(p_mean, p_stdev);
        if (p_left && value > p_mean) {
            value = p_mean - (value - p_mean);
        }
        else if (!p_left && value < p_mean) {
            value = p_mean + (p_mean - value);
        }
        return value;
    }
    Misc.GetNormalOneSide = GetNormalOneSide;
})(Misc || (Misc = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../RageAssetManager/ILog.ts"/>
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
///
/// <reference path="Misc.ts"/>
///
var TwoANS;
(function (TwoANS) {
    var BaseAdapter = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        function BaseAdapter() {
        }
        Object.defineProperty(BaseAdapter, "Type", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// Gets the type of the adapter; It needs to be overriden by inheriting classes
            /// </summary>
            get: function () {
                return Misc.UNASSIGNED_TYPE;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseAdapter, "Description", {
            /// <summary>
            /// Description of this adapter. It needs to be overriden by inheriting classes
            /// </summary>
            get: function () {
                return Misc.UNASSIGNED_TYPE;
            },
            enumerable: true,
            configurable: true
        });
        BaseAdapter.prototype.InitSettings = function (p_asset) {
            this.asset = p_asset; // [ASSET]
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: misc methods
        /// <summary>
        /// Logs a message using assets's Log method
        /// </summary>
        /// 
        /// <param name="severity"> Message type</param>
        /// <param name="msg">      A message to be logged</param>
        BaseAdapter.prototype.log = function (severity, msg) {
            if (typeof this.asset !== 'undefined' && this.asset !== null) {
                this.asset.Log(severity, msg);
            }
        };
        return BaseAdapter;
    }());
    TwoANS.BaseAdapter = BaseAdapter;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
///     Wim van der Vegt 
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="Misc.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /// <summary>
    /// The Player node
    /// </summary>
    var PlayerNode = /** @class */ (function () {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        function PlayerNode(p_adaptID, p_gameID, p_playerID) {
            this.rating = Misc.INITIAL_RATING;
            this.playCount = 0;
            this.kFct = Misc.INITIAL_K_FCT;
            this.uncertainty = Misc.INITIAL_UNCERTAINTY;
            this.lastPlayed = Misc.GetDateStr();
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.PlayerID = p_playerID;
        }
        Object.defineProperty(PlayerNode.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "PlayerID", {
            /// <summary>
            /// Identifier for the Player node.
            /// </summary>
            get: function () {
                return this.playerID;
            },
            set: function (p_playerID) {
                if (!Misc.IsNullOrEmpty(p_playerID)) {
                    this.playerID = p_playerID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "Rating", {
            /// <summary>
            /// Player rating
            /// </summary
            get: function () {
                return this.rating;
            },
            set: function (p_rating) {
                this.rating = p_rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "PlayCount", {
            /// <summary>
            /// Number of times the player played any scenario.
            /// </summary>
            get: function () {
                return this.playCount;
            },
            set: function (p_playCount) {
                if (p_playCount >= 0) {
                    this.playCount = p_playCount;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "KFactor", {
            /// <summary>
            /// Player's K factor.
            /// </summary>
            get: function () {
                return this.kFct;
            },
            set: function (p_kFct) {
                if (p_kFct > 0) {
                    this.kFct = p_kFct;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "Uncertainty", {
            /// <summary>
            /// Uncertainty in player's rating.
            /// </summary>
            get: function () {
                return this.uncertainty;
            },
            set: function (p_uncertainty) {
                if (p_uncertainty >= 0 && p_uncertainty <= 1) {
                    this.uncertainty = p_uncertainty;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerNode.prototype, "LastPlayed", {
            /// <summary>
            /// Last time the player played.
            /// </summary>
            get: function () {
                return this.lastPlayed;
            },
            set: function (p_lastPlayed) {
                if (!Misc.IsNullOrEmpty(p_lastPlayed)) {
                    this.lastPlayed = p_lastPlayed;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of PlayerNode</returns>
        PlayerNode.prototype.ShallowClone = function () {
            var newPlayerNode = new PlayerNode(this.AdaptationID, this.GameID, this.PlayerID);
            newPlayerNode.Rating = this.Rating;
            newPlayerNode.PlayCount = this.PlayCount;
            newPlayerNode.KFactor = this.KFactor;
            newPlayerNode.Uncertainty = this.Uncertainty;
            newPlayerNode.LastPlayed = this.LastPlayed;
            return newPlayerNode;
        };
        return PlayerNode;
    }());
    TwoANS.PlayerNode = PlayerNode;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
///     Wim van der Vegt 
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="Misc.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /// <summary>
    /// The Scenario node
    /// </summary>
    var ScenarioNode = /** @class */ (function () {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        function ScenarioNode(p_adaptID, p_gameID, p_scenarioID) {
            this.rating = Misc.INITIAL_RATING;
            this.playCount = 0;
            this.kFct = Misc.INITIAL_K_FCT;
            this.uncertainty = Misc.INITIAL_UNCERTAINTY;
            this.lastPlayed = Misc.GetDateStr();
            this.timeLimit = Misc.DEFAULT_TIME_LIMIT;
            this.AdaptationID = p_adaptID;
            this.GameID = p_gameID;
            this.ScenarioID = p_scenarioID;
        }
        Object.defineProperty(ScenarioNode.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "ScenarioID", {
            /// <summary>
            /// Identifier for the Scenario node.
            /// </summary>
            get: function () {
                return this.scenarioID;
            },
            set: function (p_scenarioID) {
                if (!Misc.IsNullOrEmpty(p_scenarioID)) {
                    this.scenarioID = p_scenarioID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "Rating", {
            /// <summary>
            /// Scenario rating
            /// </summary>
            get: function () {
                return this.rating;
            },
            set: function (p_rating) {
                this.rating = p_rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "PlayCount", {
            /// <summary>
            /// Number of times the scenario was played.
            /// </summary>
            get: function () {
                return this.playCount;
            },
            set: function (p_playCount) {
                if (p_playCount >= 0) {
                    this.playCount = p_playCount;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "KFactor", {
            /// <summary>
            /// Scenario's K factor.
            /// </summary>
            get: function () {
                return this.kFct;
            },
            set: function (p_kFct) {
                if (p_kFct > 0) {
                    this.kFct = p_kFct;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "Uncertainty", {
            /// <summary>
            /// Uncertainty in scenario's rating.
            /// </summary>
            get: function () {
                return this.uncertainty;
            },
            set: function (p_uncertainty) {
                if (p_uncertainty >= 0 && p_uncertainty <= 1) {
                    this.uncertainty = p_uncertainty;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "LastPlayed", {
            /// <summary>
            /// Last time the scenario played.
            /// </summary>
            get: function () {
                return this.lastPlayed;
            },
            set: function (p_lastPlayed) {
                if (!Misc.IsNullOrEmpty(p_lastPlayed)) {
                    this.lastPlayed = p_lastPlayed;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScenarioNode.prototype, "TimeLimit", {
            /// <summary>
            /// Time limit for completing the scenario.
            /// </summary>
            get: function () {
                return this.timeLimit;
            },
            set: function (p_timeLimit) {
                if (p_timeLimit > 0) {
                    this.timeLimit = p_timeLimit;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Makes a shallow clone of this instance.
        /// </summary>
        /// <returns>New instance of ScenarioNode</returns>
        ScenarioNode.prototype.ShallowClone = function () {
            var newScenarioNode = new ScenarioNode(this.AdaptationID, this.GameID, this.ScenarioID);
            newScenarioNode.Rating = this.Rating;
            newScenarioNode.PlayCount = this.PlayCount;
            newScenarioNode.KFactor = this.KFactor;
            newScenarioNode.Uncertainty = this.Uncertainty;
            newScenarioNode.LastPlayed = this.LastPlayed;
            newScenarioNode.TimeLimit = this.TimeLimit;
            return newScenarioNode;
        };
        return ScenarioNode;
    }());
    TwoANS.ScenarioNode = ScenarioNode;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
///     Wim van der Vegt 
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="Misc.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /// <summary>
    /// A TwoA gameplay.
    /// </summary>
    var Gameplay = /** @class */ (function () {
        /// <summary>
        /// Constructor.
        /// </summary>
        function Gameplay() {
        }
        Object.defineProperty(Gameplay.prototype, "AdaptationID", {
            /// <summary>
            /// Identifier for the Adaptation node.
            /// </summary>
            get: function () {
                return this.adaptID;
            },
            set: function (p_adaptID) {
                if (!Misc.IsNullOrEmpty(p_adaptID)) {
                    this.adaptID = p_adaptID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "GameID", {
            /// <summary>
            /// Identifier for the Game node.
            /// </summary>
            get: function () {
                return this.gameID;
            },
            set: function (p_gameID) {
                if (!Misc.IsNullOrEmpty(p_gameID)) {
                    this.gameID = p_gameID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "PlayerID", {
            /// <summary>
            /// Identifier for the player.
            /// </summary>
            get: function () {
                return this.playerID;
            },
            set: function (p_playerID) {
                if (!Misc.IsNullOrEmpty(p_playerID)) {
                    this.playerID = p_playerID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "ScenarioID", {
            /// <summary>
            /// Identifier for the scenario.
            /// </summary>
            get: function () {
                return this.scenarioID;
            },
            set: function (p_scenarioID) {
                if (!Misc.IsNullOrEmpty(p_scenarioID)) {
                    this.scenarioID = p_scenarioID;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "Timestamp", {
            /// <summary>
            /// The timestamp.
            /// </summary>
            get: function () {
                return this.timestamp;
            },
            set: function (p_timestamp) {
                if (!Misc.IsNullOrEmpty(p_timestamp)) {
                    this.timestamp = p_timestamp;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "RT", {
            /// <summary>
            /// The RT.
            /// </summary>
            get: function () {
                return this.rt;
            },
            set: function (p_rt) {
                this.rt = p_rt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "Accuracy", {
            /// <summary>
            /// The accuracy.
            /// </summary>
            get: function () {
                return this.accuracy;
            },
            set: function (p_accuracy) {
                this.accuracy = p_accuracy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "PlayerRating", {
            /// <summary>
            /// The player rating.
            /// </summary>
            get: function () {
                return this.playerRating;
            },
            set: function (p_playerRating) {
                this.playerRating = p_playerRating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Gameplay.prototype, "ScenarioRating", {
            /// <summary>
            /// The scenario rating.
            /// </summary>
            get: function () {
                return this.scenarioRating;
            },
            set: function (p_scenarioRating) {
                this.scenarioRating = p_scenarioRating;
            },
            enumerable: true,
            configurable: true
        });
        return Gameplay;
    }());
    TwoANS.Gameplay = Gameplay;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="Misc.ts"/>
/// <reference path="BaseAdapter.ts"/>
/// <reference path="TwoA.ts"/>
/// <reference path="PlayerNode.ts"/>
/// <reference path="ScenarioNode.ts"/>
///
var TwoANS;
(function (TwoANS) {
    var Severity = AssetPackage.Severity;
    /*import BaseAdapter = TwoANS.BaseAdapter;
    import TwoA = TwoANS.TwoA;
    import PlayerNode = TwoANS.PlayerNode;
    import ScenarioNode = TwoANS.ScenarioNode;*/
    var DifficultyAdapterElo = /** @class */ (function (_super) {
        __extends(DifficultyAdapterElo, _super);
        ////// END: const, fields, and properties for calculating expected score
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initializes a new instance of the DifficultyAdapter class.
        /// </summary>
        function DifficultyAdapterElo() {
            var _this = _super.call(this) || this;
            _this.targetDistrMean = DifficultyAdapterElo.TARGET_DISTR_MEAN;
            _this.targetDistrSD = DifficultyAdapterElo.TARGET_DISTR_SD;
            _this.targetLowerLimit = DifficultyAdapterElo.TARGET_LOWER_LIMIT;
            _this.targetUpperLimit = DifficultyAdapterElo.TARGET_UPPER_LIMIT;
            _this.fiSDMultiplier = DifficultyAdapterElo.FI_SD_MULTIPLIER;
            _this.maxDelay = DifficultyAdapterElo.DEF_MAX_DELAY; // [SC] set to DEF_MAX_DELAY in the constructor
            _this.maxPlay = DifficultyAdapterElo.DEF_MAX_PLAY; // [SC] set to DEF_MAX_PLAY in the constructor
            _this.kConst = DifficultyAdapterElo.DEF_K; // [SC] set to DEF_K in the constructor
            _this.kUp = DifficultyAdapterElo.DEF_K_UP; // [SC] set to DEF_K_UP in the constructor
            _this.kDown = DifficultyAdapterElo.DEF_K_DOWN; // [SC] set to DEF_K_DOWN in the constructor
            _this.playerCalLength = DifficultyAdapterElo.DEF_PLAYER_CAL_LENGTH;
            _this.scenarioCalLength = DifficultyAdapterElo.DEF_SCENARIO_CAL_LENGTH;
            _this.playerCalK = DifficultyAdapterElo.DEF_PLAYER_CAL_K;
            _this.scenarioCalK = DifficultyAdapterElo.DEF_SCENARIO_CAL_K;
            _this.expectScoreMagnifier = DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER; // [SC] value of the expected score magnifier used in calculations
            _this.magnifierStepSize = DifficultyAdapterElo.MAGNIFIER_STEP_SIZE; // [SC] value of the magnifieer step size used in calculations
            return _this;
        }
        Object.defineProperty(DifficultyAdapterElo, "Type", {
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties for the adapter type
            /// <summary>
            /// Gets the type of the adapter
            /// </summary>
            get: function () {
                return "SkillDifficultyElo";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo, "Description", {
            /// <summary>
            /// Description of this adapter
            /// </summary>
            get: function () {
                return "Adapts game difficulty to player skill. Skill ratings are evaluated for individual players. "
                    + "Requires player accuracy (value within [0, 1]) observations. Uses the Elo equation for expected score estimation.";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "Type", {
            get: function () {
                return DifficultyAdapterElo.Type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "Description", {
            get: function () {
                return DifficultyAdapterElo.Description;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetDistrMean", {
            /// <summary>
            /// Getter for target distribution mean. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrMean;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetDistrSD", {
            /// <summary>
            /// Getter for target distribution standard deviation. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrSD;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetLowerLimit", {
            /// <summary>
            /// Getter for target distribution lower limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetLowerLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "TargetUpperLimit", {
            /// <summary>
            /// Getter for target distribution upper limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetUpperLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapterElo.prototype, "FiSDMultiplier", {
            /// <summary>
            /// Getter/setter for a weight used to calculate distribution means for a fuzzy selection algorithm.
            /// </summary>
            get: function () {
                return this.fiSDMultiplier;
            },
            set: function (p_fiSDMultiplier) {
                if (p_fiSDMultiplier <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.FiSDMultiplier: The standard deviation multiplier '"
                        + p_fiSDMultiplier + "' is less than or equal to 0.");
                }
                else {
                    this.fiSDMultiplier = p_fiSDMultiplier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets FiSDMultiplier to a default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultFiSDMultiplier = function () {
            this.FiSDMultiplier = DifficultyAdapterElo.FI_SD_MULTIPLIER;
        };
        /// <summary>
        /// Sets target distribution parameters to their default values.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultTargetDistribution = function () {
            this.setTargetDistribution(DifficultyAdapterElo.TARGET_DISTR_MEAN, DifficultyAdapterElo.TARGET_DISTR_SD, DifficultyAdapterElo.TARGET_LOWER_LIMIT, DifficultyAdapterElo.TARGET_UPPER_LIMIT);
        };
        // [TEST]
        /// <summary>
        /// Sets target distribution parameters to custom values.
        /// </summary>
        /// 
        /// <param name="tDistrMean">   Dstribution mean</param>
        /// <param name="tDistrSD">     Distribution standard deviation</param>
        /// <param name="tLowerLimit">  Distribution lower limit</param>
        /// <param name="tUpperLimit">  Distribution upper limit</param>
        DifficultyAdapterElo.prototype.setTargetDistribution = function (p_tDistrMean, p_tDistrSD, p_tLowerLimit, p_tUpperLimit) {
            var validValuesFlag = true;
            // [SD] setting distribution mean
            if (p_tDistrMean <= 0 || p_tDistrMean >= 1) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The target distribution mean '"
                    + p_tDistrMean + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution SD
            if (p_tDistrSD <= 0 || p_tDistrSD >= 1) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The target distribution standard deviation '"
                    + p_tDistrSD + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution lower limit
            if (p_tLowerLimit < 0 || p_tLowerLimit > 1) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tLowerLimit >= p_tDistrMean) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is bigger than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            // [SC] setting distribution upper limit
            if (p_tUpperLimit < 0 || p_tUpperLimit > 1) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tUpperLimit <= p_tDistrMean) {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is less than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            if (validValuesFlag) {
                this.targetDistrMean = p_tDistrMean;
                this.targetDistrSD = p_tDistrSD;
                this.targetLowerLimit = p_tLowerLimit;
                this.targetUpperLimit = p_tUpperLimit;
            }
            else {
                this.log(Severity.Warning, "In DifficultyAdapterElo.setTargetDistribution: Invalid value combination is found.");
            }
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MaxDelay", {
            /// <summary>
            /// Gets or sets the maximum delay.
            /// </summary>
            get: function () {
                return this.maxDelay;
            },
            set: function (p_maxDelay) {
                if (p_maxDelay <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.MaxDelay: The maximum number of delay days '" + p_maxDelay + "' should be higher than 0.");
                }
                else {
                    this.maxDelay = p_maxDelay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxDelay to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMaxDelay = function () {
            this.MaxDelay = DifficultyAdapterElo.DEF_MAX_DELAY;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MaxPlay", {
            /// <summary>
            /// Gets or sets the maximum play.
            /// </summary>
            get: function () {
                return this.maxPlay;
            },
            set: function (p_maxPlay) {
                if (p_maxPlay <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.MaxPlay: The maximum administration parameter '"
                        + p_maxPlay + "' should be higher than 0.");
                }
                else {
                    this.maxPlay = p_maxPlay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxPlay to its default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMaxPlay = function () {
            this.MaxPlay = DifficultyAdapterElo.DEF_MAX_PLAY;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KConst", {
            /// <summary>
            /// Getter/setter for the K constant.
            /// </summary>
            get: function () {
                return this.kConst;
            },
            set: function (p_kConst) {
                if (p_kConst <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.KConst: K constant '"
                        + p_kConst + "' cannot be a negative number or 0.");
                }
                else {
                    this.kConst = p_kConst;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets K constant to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKConst = function () {
            this.KConst = DifficultyAdapterElo.DEF_K;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KUp", {
            /// <summary>
            /// Getter/setter for the upward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kUp;
            },
            set: function (p_kUp) {
                if (p_kUp < 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.KUp: The upward uncertianty weight '"
                        + p_kUp + "' cannot be a negative number.");
                }
                else {
                    this.kUp = p_kUp;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the upward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKUp = function () {
            this.KUp = DifficultyAdapterElo.DEF_K_UP;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "KDown", {
            /// <summary>
            /// Getter/setter for the downward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kDown;
            },
            set: function (p_kDown) {
                if (p_kDown < 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.KDown: The downward uncertainty weight '"
                        + p_kDown + "' cannot be a negative number.");
                }
                else {
                    this.kDown = p_kDown;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the downward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultKDown = function () {
            this.KDown = DifficultyAdapterElo.DEF_K_DOWN;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "PlayerCalLength", {
            /// <summary>
            /// Gets or sets the player's calibration length.
            /// </summary>
            get: function () {
                return this.playerCalLength;
            },
            set: function (p_playerCalLength) {
                if (p_playerCalLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.PlayerCalLength: The calibration length '" + p_playerCalLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.playerCalLength = p_playerCalLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets player calibration length to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultPlayerCalLength = function () {
            this.PlayerCalLength = DifficultyAdapterElo.DEF_PLAYER_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "ScenarioCalLength", {
            /// <summary>
            /// Gets or sets the scenario's calibration length.
            /// </summary>
            get: function () {
                return this.scenarioCalLength;
            },
            set: function (p_scenarioCalLength) {
                if (p_scenarioCalLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.ScenarioCalLength: The calibration length '" + p_scenarioCalLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.scenarioCalLength = p_scenarioCalLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario calibration length to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultScenarioCalLength = function () {
            this.ScenarioCalLength = DifficultyAdapterElo.DEF_SCENARIO_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "CalLength", {
            /// <summary>
            /// Sets the scenario and player calibration length to the same value
            /// </summary>
            set: function (p_calLength) {
                if (p_calLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.CalLength: The calibration length '" + p_calLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.PlayerCalLength = p_calLength;
                    this.ScenarioCalLength = p_calLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario and player calibration lengths to its default values.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultCalLength = function () {
            this.PlayerCalLength = DifficultyAdapterElo.DEF_PLAYER_CAL_LENGTH;
            this.ScenarioCalLength = DifficultyAdapterElo.DEF_SCENARIO_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "PlayerCalK", {
            /// <summary>
            /// Gets or sets the player calibration K factor.
            /// </summary>
            get: function () {
                return this.playerCalK;
            },
            set: function (p_playerCalK) {
                if (p_playerCalK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.PlayerCalK: The calibration K factor '" + p_playerCalK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.playerCalK = p_playerCalK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets player calibration K factor to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultPlayerCalK = function () {
            this.PlayerCalK = DifficultyAdapterElo.DEF_PLAYER_CAL_K;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "ScenarioCalK", {
            /// <summary>
            /// Gets or sets the scenario calibration K factor.
            /// </summary>
            get: function () {
                return this.scenarioCalK;
            },
            set: function (p_scenarioCalK) {
                if (p_scenarioCalK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.ScenarioCalK: The calibration K factor '" + p_scenarioCalK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.scenarioCalK = p_scenarioCalK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario calibration K factor to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultScenarioCalK = function () {
            this.ScenarioCalK = DifficultyAdapterElo.DEF_SCENARIO_CAL_K;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "CalK", {
            /// <summary>
            /// Sets the player and scenario calibration K factors to the same value.
            /// </summary>
            set: function (p_calK) {
                if (p_calK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.CalK: The calibration K factor '" + p_calK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.PlayerCalK = p_calK;
                    this.ScenarioCalK = p_calK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario and player calibration K factors to its default values.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultCalK = function () {
            this.PlayerCalK = DifficultyAdapterElo.DEF_PLAYER_CAL_K;
            this.ScenarioCalK = DifficultyAdapterElo.DEF_SCENARIO_CAL_K;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "ExpectScoreMagnifier", {
            /// <summary>
            /// Getter/setter for the expected score magnifier
            /// </summary>
            get: function () {
                return this.expectScoreMagnifier;
            },
            set: function (p_expectScoreMagnifier) {
                if (p_expectScoreMagnifier < 0) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.ExpectScoreMagnifier: The expected score magnifier '"
                        + p_expectScoreMagnifier + "' should be equal to or higher than 0.");
                }
                else {
                    this.expectScoreMagnifier = p_expectScoreMagnifier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the expected score magnifier to its default value
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultExpectScoreMagnifier = function () {
            this.ExpectScoreMagnifier = DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER;
        };
        Object.defineProperty(DifficultyAdapterElo.prototype, "MagnifierStepSize", {
            /// <summary>
            /// Getter/setter for the magnifier step size
            /// </summary>
            get: function () {
                return this.magnifierStepSize;
            },
            set: function (p_magnifierStepSize) {
                if (p_magnifierStepSize < 1) {
                    this.log(Severity.Warning, "In DifficultyAdapterElo.MagnifierStepSize: The magnifier step size '"
                        + p_magnifierStepSize + "' should be equal to or higher than 1.");
                }
                else {
                    this.magnifierStepSize = p_magnifierStepSize;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the magnifier step size to its default value.
        /// </summary>
        DifficultyAdapterElo.prototype.setDefaultMagnifierStepSize = function () {
            this.MagnifierStepSize = DifficultyAdapterElo.MAGNIFIER_STEP_SIZE;
        };
        DifficultyAdapterElo.prototype.InitSettings = function (p_asset) {
            _super.prototype.InitSettings.call(this, p_asset); // [ASSET]
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: funtion for updating ratings
        /// <summary>
        /// Updates the ratings.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_scenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_rt">                       This param is ignored. </param>
        /// <param name="p_correctAnswer">            Player's accuracy. </param>
        /// <param name="p_updateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_customPlayerKfct">         If non-0 value is provided then it is used as a weight to scale change in player's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <param name="p_customScenarioKfct">       If non-0 value is provided then it is used as a weight to scale change in scenario's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        DifficultyAdapterElo.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customPlayerKfct, p_customScenarioKfct) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Unable to update ratings. Asset instance is not detected.");
                return false;
            }
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Null player node.");
                return false;
            }
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.log(Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Null scenario node.");
                return false;
            }
            if (!this.validateCorrectAnswer(p_correctAnswer)) {
                this.log(Severity.Error, "In DifficultyAdapterElo.UpdateRatings: Unable to update ratings. Invalid accuracy detected.");
                return false;
            }
            // [SC] getting player data
            var playerRating = p_playerNode.Rating;
            var playerPlayCount = p_playerNode.PlayCount;
            var playerUncertainty = p_playerNode.Uncertainty;
            var playerLastPlayed = p_playerNode.LastPlayed;
            // [SC] getting scenario data
            var scenarioRating = p_scenarioNode.Rating;
            var scenarioPlayCount = p_scenarioNode.PlayCount;
            var scenarioUncertainty = p_scenarioNode.Uncertainty;
            var scenarioLastPlayed = p_scenarioNode.LastPlayed;
            // [SC] getting current datetime
            var currDateTime = Misc.GetDateStr();
            // [SC] parsing player data
            var playerLastPlayedDays = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > this.MaxDelay) {
                playerLastPlayedDays = this.MaxDelay;
            }
            // [SC] parsing scenario data
            var scenarioLastPlayedDays = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > this.MaxDelay) {
                scenarioLastPlayedDays = this.MaxDelay;
            }
            // [SC] calculating expected scores
            var expectScore = this.calcExpectedScore(playerRating, scenarioRating);
            // [SC] calculating player and scenario uncertainties
            var playerNewUncertainty = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            var scenarioNewUncertainty = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);
            var playerNewKFct;
            var scenarioNewKFct;
            if (p_customPlayerKfct > 0) {
                playerNewKFct = p_customPlayerKfct;
            }
            else {
                // [SC] calculating player K factors
                playerNewKFct = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty, playerPlayCount);
            }
            if (p_customScenarioKfct > 0) {
                scenarioNewKFct = p_customScenarioKfct;
            }
            else {
                // [SC] calculating scenario K factor
                scenarioNewKFct = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty, scenarioPlayCount);
            }
            // [SC] calculating player and scenario ratings
            var playerNewRating = this.calcTheta(playerRating, playerNewKFct, p_correctAnswer, expectScore);
            var scenarioNewRating = this.calcBeta(scenarioRating, scenarioNewKFct, p_correctAnswer, expectScore);
            // [SC] updating player and scenario play counts
            var playerNewPlayCount = playerPlayCount + 1;
            var scenarioNewPlayCount = scenarioPlayCount + 1;
            // [SC] storing updated player data
            p_playerNode.Rating = playerNewRating;
            p_playerNode.PlayCount = playerNewPlayCount;
            p_playerNode.KFactor = playerNewKFct;
            p_playerNode.Uncertainty = playerNewUncertainty;
            p_playerNode.LastPlayed = currDateTime;
            // [SC] storing updated scenario data
            if (p_updateScenarioRating) {
                p_scenarioNode.Rating = scenarioNewRating;
                p_scenarioNode.PlayCount = scenarioNewPlayCount;
                p_scenarioNode.KFactor = scenarioNewKFct;
                p_scenarioNode.Uncertainty = scenarioNewUncertainty;
                p_scenarioNode.LastPlayed = currDateTime;
            }
            // [SC] creating game log
            this.asset.CreateNewRecord(this.Type, p_playerNode.GameID, p_playerNode.PlayerID, p_scenarioNode.ScenarioID, 0, p_correctAnswer, playerNewRating, scenarioNewRating, currDateTime);
            return true;
        };
        ////// END: funtion for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating matching scenario
        /// <summary>
        /// Calculates expected beta for target scenario. Returns ScenarioNode object of a scenario with beta closest to the target beta.
        /// If two more scenarios match then scenario that was least played is chosen.  
        /// </summary>
        ///
        /// <param name="p_playerNode">       Player node containing player parameters. </param>
        /// <param name="p_scenarioList">     A list of scenarios from which the target scenario is chosen. </param>
        ///
        /// <returns>
        /// ScenarioNode instance.
        /// </returns>
        DifficultyAdapterElo.prototype.TargetScenario = function (p_playerNode, p_scenarioList) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(Severity.Error, "In DifficultyAdapterElo.TargetScenario: Unable to recommend a scenario. Asset instance is not detected.");
                return null;
            }
            // [TODO] should check for valid adaptation IDs in the player and scenarios?
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(Severity.Error, "In DifficultyAdapterElo.TargetScenario: Null player node. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.log(Severity.Error, "In DifficultyAdapterElo.TargetScenario: Null or empty scenario node list. Returning null.");
                return null;
            }
            // [SC] calculate min and max possible ratings for candidate scenarios
            var ratingFI = this.calcTargetBetas(p_playerNode.Rating); // [SC][2016.12.14] fuzzy interval for rating
            // [SC] info for the scenarios within the core rating range and with the lowest play count
            var coreScenarios = new Array();
            var coreMinPlayCount = 0;
            // [SC] info for the scenarios within the support rating range and with the lowest play count
            var supportScenarios = new Array();
            var supportMinPlayCount = 0;
            // [SC] info for the closest scenarios outside of the fuzzy interval and the lowest play count
            var outScenarios = new Array();
            var outMinPlayCount = 0;
            var outMinDistance = 0;
            // [SC] iterate through the list of all scenarios
            for (var _i = 0, p_scenarioList_1 = p_scenarioList; _i < p_scenarioList_1.length; _i++) {
                var scenario = p_scenarioList_1[_i];
                var scenarioRating = scenario.Rating;
                var scenarioPlayCount = scenario.PlayCount;
                // [SC] the scenario rating is within the core rating range
                if (scenarioRating >= ratingFI[1] && scenarioRating <= ratingFI[2]) {
                    if (coreScenarios.length === 0 || scenarioPlayCount < coreMinPlayCount) {
                        coreScenarios.length = 0;
                        coreScenarios.push(scenario);
                        coreMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount === coreMinPlayCount) {
                        coreScenarios.push(scenario);
                    }
                }
                else if (scenarioRating >= ratingFI[0] && scenarioRating <= ratingFI[3]) {
                    if (supportScenarios.length === 0 || scenarioPlayCount < supportMinPlayCount) {
                        supportScenarios.length = 0;
                        supportScenarios.push(scenario);
                        supportMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount == supportMinPlayCount) {
                        supportScenarios.push(scenario);
                    }
                }
                else {
                    var distance = Math.min(Math.abs(scenarioRating - ratingFI[1]), Math.abs(scenarioRating - ratingFI[2]));
                    if (outScenarios.length === 0 || distance < outMinDistance) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinDistance = distance;
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount < outMinPlayCount) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount === outMinPlayCount) {
                        outScenarios.push(scenario);
                    }
                }
            }
            if (coreScenarios.length > 0) {
                return coreScenarios[Misc.GetRandomInt(0, coreScenarios.length - 1)];
            }
            else if (supportScenarios.length > 0) {
                return supportScenarios[Misc.GetRandomInt(0, supportScenarios.length - 1)];
            }
            return outScenarios[Misc.GetRandomInt(0, outScenarios.length - 1)];
        };
        /// <summary>
        /// Calculates a fuzzy interval for a target beta.
        /// </summary>
        ///
        /// <param name="p_theta"> The theta. </param>
        ///
        /// <returns>
        /// A four-element array of ratings (in an ascending order) representing lower and upper bounds of the support and core
        /// </returns>
        DifficultyAdapterElo.prototype.calcTargetBetas = function (p_theta) {
            // [SC] mean of one-sided normal distribution from which to derive the lower bound of the support in a fuzzy interval
            var lower_distr_mean = this.TargetDistrMean - (this.FiSDMultiplier * this.TargetDistrSD);
            if (lower_distr_mean < Misc.DISTR_LOWER_LIMIT) {
                lower_distr_mean = Misc.DISTR_LOWER_LIMIT;
            }
            // [SC] mean of one-sided normal distribution from which to derive the upper bound of the support in a fuzzy interval
            var upper_distr_mean = this.TargetDistrMean + (this.FiSDMultiplier * this.TargetDistrSD);
            if (upper_distr_mean > Misc.DISTR_UPPER_LIMIT) {
                upper_distr_mean = Misc.DISTR_UPPER_LIMIT;
            }
            // [SC] the array stores four probabilities (in an ascending order) that represent lower and upper bounds of the support and core 
            var randNums = new Array(4);
            // [SC] calculating two probabilities as the lower and upper bounds of the core in a fuzzy interval
            var rndNum;
            for (var index = 1; index < 3; index++) {
                while (true) {
                    rndNum = Misc.GetNormal(this.TargetDistrMean, this.TargetDistrSD);
                    if (rndNum > this.TargetLowerLimit || rndNum < this.TargetUpperLimit) {
                        if (rndNum < Misc.DISTR_LOWER_LIMIT) {
                            rndNum = Misc.DISTR_LOWER_LIMIT;
                        }
                        else if (rndNum > Misc.DISTR_UPPER_LIMIT) {
                            rndNum = Misc.DISTR_UPPER_LIMIT;
                        }
                        break;
                    }
                }
                randNums[index] = rndNum;
            }
            // [SC] sorting lower and upper bounds of the core in an ascending order
            if (randNums[1] > randNums[2]) {
                var temp = randNums[1];
                randNums[1] = randNums[2];
                randNums[2] = temp;
            }
            // [SC] calculating probability that is the lower bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(lower_distr_mean, this.TargetDistrSD, true);
                if (rndNum < randNums[1]) {
                    if (rndNum < Misc.DISTR_LOWER_LIMIT) {
                        rndNum = Misc.DISTR_LOWER_LIMIT;
                    }
                    break;
                }
            }
            randNums[0] = rndNum;
            // [SC] calculating probability that is the upper bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(upper_distr_mean, this.TargetDistrSD, false);
                if (rndNum > randNums[2]) {
                    if (rndNum > Misc.DISTR_UPPER_LIMIT) {
                        rndNum = Misc.DISTR_UPPER_LIMIT;
                    }
                    break;
                }
            }
            randNums[3] = rndNum;
            // [SC] tralsating probability bounds of a fuzzy interval into a beta values
            var lowerLimitBeta = p_theta + Math.log((1.0 - randNums[3]) / randNums[3]);
            var minBeta = p_theta + Math.log((1.0 - randNums[2]) / randNums[2]); // [SC][2016.10.07] a modified version of the equation from the original data; better suits the data
            var maxBeta = p_theta + Math.log((1.0 - randNums[1]) / randNums[1]);
            var upperLimitBeta = p_theta + Math.log((1.0 - randNums[0]) / randNums[0]);
            return new Array(lowerLimitBeta, minBeta, maxBeta, upperLimitBeta);
        };
        /// <summary>
        /// Returns target difficulty rating given a skill rating.
        /// </summary>
        /// <param name="p_theta">Skill rating.</param>
        /// <returns>Difficulty rating.</returns>
        DifficultyAdapterElo.prototype.TargetDifficultyRating = function (p_theta) {
            return p_theta + Math.log((1.0 - this.TargetDistrMean) / this.TargetDistrMean);
        };
        ////// END: functions for calculating matching scenario
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating expected
        /// <summary>
        /// Calculates expected score given player's skill rating and item's
        /// difficulty rating. Uses the original formula from the Elo rating system.
        /// </summary>
        ///
        /// <param name="p_playerTheta">     player's skill rating. </param>
        /// <param name="p_itemBeta">        item's difficulty rating. </param>
        ///
        /// <returns>
        /// expected score as a double.
        /// </returns>
        DifficultyAdapterElo.prototype.calcExpectedScore = function (p_playerTheta, p_itemBeta) {
            var expFctr = Math.pow(this.ExpectScoreMagnifier, (p_itemBeta - p_playerTheta) / this.MagnifierStepSize);
            return 1.0 / (1.0 + expFctr);
        };
        ////// END: functions for calculating expected
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating rating uncertainties
        /// <summary>
        /// Calculates a new uncertainty for the theta rating.
        /// </summary>
        ///
        /// <param name="currThetaU">       current uncertainty value for theta
        ///                                 rating. </param>
        /// <param name="currDelayCount">   the current number of consecutive days
        ///                                 the player has not played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for theta rating.
        /// </returns>
        DifficultyAdapterElo.prototype.calcThetaUncertainty = function (p_currThetaU, p_currDelayCount) {
            var newThetaU = p_currThetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            }
            else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        };
        /// <summary>
        /// Calculates a new uncertainty for the beta rating.
        /// </summary>
        ///
        /// <param name="p_currBetaU">        current uncertainty value for the beta
        ///                                 rating. </param>
        /// <param name="p_currDelayCount">   the current number of consecutive days
        ///                                 the item has not beein played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for the beta rating.
        /// </returns>
        DifficultyAdapterElo.prototype.calcBetaUncertainty = function (p_currBetaU, p_currDelayCount) {
            var newBetaU = p_currBetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            }
            else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        };
        ////// END: functions for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating k factors
        /// <summary>
        /// Calculates a new K factor for theta rating
        /// </summary>
        ///
        /// <param name="p_currThetaU">   current uncertainty for the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// <param name="p_playerPlayCount">      a number of past games played by the player</param>
        /// 
        /// <returns>a double value of a new K factor for the theta rating</returns>
        DifficultyAdapterElo.prototype.calcThetaKFctr = function (p_currThetaU, p_currBetaU, p_playerPlayCount) {
            // [SC] calculate K based on uncertainty
            var playerK = this.KConst * (1.0 + (this.KUp * p_currThetaU) - (this.KDown * p_currBetaU));
            // [SC] check if the player is in calibration phase
            if (this.PlayerCalLength > p_playerPlayCount) {
                playerK += this.PlayerCalK;
            }
            return playerK;
        };
        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// 
        /// <param name="p_currThetaU">   current uncertainty fot the theta rating</param>
        /// <param name="p_currBetaU">    current uncertainty for the beta rating</param>
        /// <param name="p_scenarioPlayCount">    a number of past games played with this scenario</param>
        /// 
        /// <returns>a double value of a new K factor for the beta rating</returns>
        DifficultyAdapterElo.prototype.calcBetaKFctr = function (p_currThetaU, p_currBetaU, p_scenarioPlayCount) {
            // [SC] calculate K based on uncertainty
            var scenarioK = this.KConst * (1.0 + (this.KUp * p_currBetaU) - (this.KDown * p_currThetaU));
            // [SC] check if the scenario is in calibration phase
            if (this.ScenarioCalLength > p_scenarioPlayCount) {
                scenarioK += this.ScenarioCalK;
            }
            return scenarioK;
        };
        ////// END: functions for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating theta and beta ratings
        /// <summary>
        /// Calculates a new theta rating.
        /// </summary>
        ///
        /// <param name="p_currTheta">   current theta rating. </param>
        /// <param name="p_thetaKFctr">  K factor for the theta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for the new theta rating.
        /// </returns>
        DifficultyAdapterElo.prototype.calcTheta = function (p_currTheta, p_thetaKFctr, p_actualScore, p_expectScore) {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        };
        /// <summary>
        /// Calculates a new beta rating.
        /// </summary>
        ///
        /// <param name="p_currBeta">    current beta rating. </param>
        /// <param name="p_betaKFctr">   K factor for the beta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for new beta rating.
        /// </returns>
        DifficultyAdapterElo.prototype.calcBeta = function (p_currBeta, p_betaKFctr, p_actualScore, p_expectScore) {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        };
        ////// END: functions for calculating theta and beta ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: tester functions
        /// <summary>
        /// Tests the validity of the value representing correctness of player's answer.
        /// </summary>
        /// 
        /// <param name="correctAnswer"> Player's answer. </param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapterElo.prototype.validateCorrectAnswer = function (p_correctAnswer) {
            if (p_correctAnswer < 0 || p_correctAnswer > 1) {
                this.log(Severity.Error, "In DifficultyAdapterElo.validateCorrectAnswer: Accuracy should be within interval [0, 1]."
                    + " Current value is '" + p_correctAnswer + "'.");
                return false;
            }
            return true;
        };
        ////// END: properties for the adapter type
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating target betas
        DifficultyAdapterElo.TARGET_DISTR_MEAN = 0.75; // [SC] default value for 'targetDistrMean' field
        DifficultyAdapterElo.TARGET_DISTR_SD = 0.1; // [SC] default value for 'targetDistrSD' field
        DifficultyAdapterElo.TARGET_LOWER_LIMIT = 0.50; // [SC] default value for 'targetLowerLimit' field
        DifficultyAdapterElo.TARGET_UPPER_LIMIT = 1.0; // [SC] default value for 'targetUpperLimit' field
        DifficultyAdapterElo.FI_SD_MULTIPLIER = 1.0; // [SC] multipler for SD used to calculate the means of normal distributions used to decide on lower and upper bounds of the supports in a fuzzy interval
        ////// END: const, fields, and properties for calculating target betas
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating rating uncertainties
        DifficultyAdapterElo.DEF_MAX_DELAY = 30; // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        DifficultyAdapterElo.DEF_MAX_PLAY = 40; // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings
        ////// END: const, fields, and properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating k factors
        DifficultyAdapterElo.DEF_K = 0.0075; // [SC] The default value for the K constant when there is no uncertainty
        DifficultyAdapterElo.DEF_K_UP = 4.0; // [SC] the default value for the upward uncertainty weight
        DifficultyAdapterElo.DEF_K_DOWN = 0.5; // [SC] The default value for the downward uncertainty weight
        ////// END: const, fields, and properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for the calibration phase
        // [SC] The default value for the length (number of gameplays) of player's calibration
        DifficultyAdapterElo.DEF_PLAYER_CAL_LENGTH = 30;
        // [SC] The default value for the length (number of gameplays) of scenario's calibration
        DifficultyAdapterElo.DEF_SCENARIO_CAL_LENGTH = 30;
        // [SC] The default K factor for player's calibration
        DifficultyAdapterElo.DEF_PLAYER_CAL_K = 0.1;
        // [SC] The default K factor for scenario's calibration
        DifficultyAdapterElo.DEF_SCENARIO_CAL_K = 0.1;
        ////// END: const, fields, and properties for the calibration phase
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating expected score
        DifficultyAdapterElo.EXPECT_SCORE_MAGNIFIER = 10; // [SC] The default value for the expected score magnifier 
        DifficultyAdapterElo.MAGNIFIER_STEP_SIZE = 2.302573; // [SC] The default value for the magnifier step size in ELO is 400; changed to match CAP difficulty rating scale
        return DifficultyAdapterElo;
    }(TwoANS.BaseAdapter));
    TwoANS.DifficultyAdapterElo = DifficultyAdapterElo;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../RageAssetManager/BaseAsset.ts"/>
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="Misc.ts"/>
/// <reference path="PlayerNode.ts"/>
/// <reference path="ScenarioNode.ts"/>
/// <reference path="Gameplay.ts"/>
/// <reference path="DifficultyAdapterElo.ts"/>
/// <reference path="DifficultyAdapter.ts"/>
///
var TwoANS;
(function (TwoANS) {
    var BaseAsset = AssetPackage.BaseAsset;
    var Severity = AssetPackage.Severity;
    /*import PlayerNode = TwoANS.PlayerNode;
    import ScenarioNode = TwoANS.ScenarioNode;
    import Gameplay = TwoANS.Gameplay;
    import DifficultyAdapterElo = TwoANS.DifficultyAdapterElo;
    import DifficultyAdapter = TwoANS.DifficultyAdapter;*/
    /// <summary>
    /// Export the TwoA asset
    /// </summary>
    var TwoA = /** @class */ (function (_super) {
        __extends(TwoA, _super);
        ////// END: fields
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initialize the instance of the TwoA asset
        /// <summary>
        function TwoA() {
            var _this = _super.call(this) || this;
            _this.InitSettings();
            return _this;
        }
        /// <summary>
        /// Initialises the settings.
        /// </summary>
        TwoA.prototype.InitSettings = function () {
            // [SC] list of available players
            this.players = new Array();
            // [SC] list of available scenarios
            this.scenarios = new Array();
            // [SC] list of gameplays
            this.gameplays = new Array();
            // [SC] create the TwoA adapter
            this.adapter = new TwoANS.DifficultyAdapter();
            this.adapter.InitSettings(this);
            // [SC] create the TwoA-Elo adapter
            this.adapterElo = new TwoANS.DifficultyAdapterElo();
            this.adapterElo.InitSettings(this);
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Misc methods
        /// <summary>
        /// Returns a 2D array with descriptions of available adapters.
        /// The first column contains adapter IDs.
        /// The second column contains adapter descriptions.
        /// </summary>
        /// 
        /// <returns>2D array of strings</returns>
        TwoA.prototype.AvailableAdapters = function () {
            var descr = [
                [this.adapter.Type, this.adapter.Description],
                [this.adapterElo.Type, this.adapterElo.Description]
            ];
            return descr;
        };
        ////// END: Misc methods
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target scenario retrievals
        /// <summary>
        /// Get the Target scenario ID from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// A string.
        /// </returns>
        TwoA.prototype.TargetScenarioID = function (p_playerNode) {
            var scenarioNode = this.TargetScenario(p_playerNode);
            if (typeof scenarioNode === 'undefined' || scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenarioID: Unable to recommend a scenario ID. Returning null.");
                return null;
            }
            return scenarioNode.ScenarioID;
        };
        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        ///
        /// <param name="p_playerNode"> Player node. </param>
        ///
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        TwoA.prototype.TargetScenario = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }
            // [SC] get available scenario nodes
            var scenarioList = this.AllScenarios(p_playerNode.AdaptationID, p_playerNode.GameID);
            if (typeof scenarioList === 'undefined' || scenarioList === null || scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }
            return this.TargetScenarioCustom(p_playerNode, scenarioList);
        };
        /// <summary>
        /// Get the Target scenario from the adapter.
        /// </summary>
        /// <param name="p_playerNode">       Player node. </param>
        /// <param name="p_scenarioList">     List of scenario nodes from which to recommend. </param>
        /// <returns>
        /// ScenarioNode of the recommended scenario.
        /// </returns>
        TwoA.prototype.TargetScenarioCustom = function (p_playerNode, p_scenarioList) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Null player node object. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unable to retrieve scenario node list. Returning null.");
                return null;
            }
            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.TargetScenario(p_playerNode, p_scenarioList);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.TargetScenario(p_playerNode, p_scenarioList);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetScenario: Unknown adapter " + p_playerNode.AdaptationID + ". Returning null.");
                return null;
            }
        };
        ////// END: Methods for target scenario retrievals
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target difficulty rating retrieval
        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID.</param>
        /// <param name="p_playerRating">     Player's skill rating.</param>
        /// <returns>Difficulty rating</returns>
        TwoA.prototype.TargetDifficultyRatingCustom = function (p_adaptID, p_playerRating) {
            if (Misc.IsNullOrEmpty(p_adaptID)) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.TargetDifficultyRating(p_playerRating);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.TargetDifficultyRating(p_playerRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Unknown adapter '" + p_adaptID + "'. Returning 0.");
                return 0;
            }
        };
        /// <summary>
        /// Returns target difficulty rating given a player's skill rating.
        /// </summary>
        /// <param name="p_playerNode">Player's node</param>
        /// <returns>Difficulty rating</returns>
        TwoA.prototype.TargetDifficultyRating = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.TargetDifficultyRating: Null player node object. Returning 0.");
                return 0;
            }
            return this.TargetDifficultyRatingCustom(p_playerNode.AdaptationID, p_playerNode.Rating);
        };
        ////// END: Methods for target difficulty rating retrieval
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for updating ratings
        /// <summary>
        /// Updates the ratings based on player's performance in a scenario.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_scenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_rt">                       Player's response time. </param>
        /// <param name="p_correctAnswer">            Player's accuracy. </param>
        /// <param name="p_updateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_customKfct">               If non-0 value is provided then it is used as a weight to scale changes in player's and scenario's ratings. Otherwise, adapter calculates its own K factors. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        TwoA.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Player node is null. No update is done.");
                return false;
            }
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Scenario node is null. No update is done.");
                return false;
            }
            if (p_playerNode.AdaptationID !== p_scenarioNode.AdaptationID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent adaptation IDs in player and scenario nodes. No update is done.");
                return false;
            }
            if (p_playerNode.GameID !== p_scenarioNode.GameID) {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Inconsistent game IDs in player and scenario nodes. No update is done.");
                return false;
            }
            if (p_playerNode.AdaptationID === this.adapter.Type) {
                return this.adapter.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else if (p_playerNode.AdaptationID === this.adapterElo.Type) {
                return this.adapterElo.UpdateRatings(p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customKfct, p_customKfct);
            }
            else {
                this.Log(Severity.Error, "In TwoA.UpdateRatings: Unknown adapter '" + p_playerNode.AdaptationID + "'. No update is done.");
                return false;
            }
        };
        /// <summary>
        /// Creates new record to the game log.
        /// </summary>
        ///
        /// <param name="p_adaptID">          Identifier for the adapt. </param>
        /// <param name="p_gameID">           Identifier for the game. </param>
        /// <param name="p_playerID">         Identifier for the player. </param>
        /// <param name="p_scenarioID">       Identifier for the scenario. </param>
        /// <param name="p_rt">               The right. </param>
        /// <param name="p_accuracy">         The correct answer. </param>
        /// <param name="p_playerRating">     The player new rating. </param>
        /// <param name="p_scenarioRating">   The scenario new rating. </param>
        /// <param name="p_timestamp">        The current date time. </param>
        TwoA.prototype.CreateNewRecord = function (p_adaptID, p_gameID, p_playerID, p_scenarioID, p_rt, p_accuracy, p_playerRating, p_scenarioRating, p_timestamp) {
            var newGameplay = new TwoANS.Gameplay();
            newGameplay.AdaptationID = p_adaptID;
            newGameplay.GameID = p_gameID;
            newGameplay.PlayerID = p_playerID;
            newGameplay.ScenarioID = p_scenarioID;
            newGameplay.Timestamp = p_timestamp;
            newGameplay.RT = p_rt;
            newGameplay.Accuracy = p_accuracy;
            newGameplay.PlayerRating = p_playerRating;
            newGameplay.ScenarioRating = p_scenarioRating;
            this.gameplays.push(newGameplay);
        };
        ////// END: Methods for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for calculating scores
        /// <summary>
        /// Calculates a normalized score based on player's performance defined by response time and accuracy.
        /// </summary>
        /// 
        /// <param name="p_correctAnswer">    1 if player provided correct answer and 0 otherwise</param>
        /// <param name="p_responseTime">     Players response time in milliseconds</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// 
        /// <returns>A score within range (-1, 1)</returns>
        TwoA.prototype.CalculateScore = function (p_correctAnswer, p_responseTime, p_itemMaxDuration) {
            /* SCORE MATRIX
             *              ----------------------------------------------
             *              | Low response  | High response | Time limit |
             *              | time          | time          | reached    |
             * -------------|---------------|---------------|------------|
             * Response = 1 | High positive | Low positive  |     0      |
             *              | score         | score         |            |
             * -------------|---------------|---------------|------------|
             * Response = 0 | High negative | Low negative  |     0      |
             *              | score         | score         |            |
             * ----------------------------------------------------------*/
            return this.adapter.calcActualScore(p_correctAnswer, p_responseTime, p_itemMaxDuration);
        };
        /// <summary>
        /// Calculates player's expected score based on player's skill rating and scenarios difficulty rating.
        /// </summary>
        /// <param name="p_adaptID">          Adaptation ID</param>
        /// <param name="p_playerRating">     Player's skill rating</param>
        /// <param name="p_scenarioRating">   Scenario's difficulty rating</param>
        /// <param name="p_itemMaxDuration">  Max allowed time in millisecond given to player to solve the problem.</param>
        /// <returns>Expected score or error code.</returns>
        TwoA.prototype.CalculateExpectedScore = function (p_adaptID, p_playerRating, p_scenarioRating, p_itemMaxDuration) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.calcExpectedScore(p_playerRating, p_scenarioRating, p_itemMaxDuration);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.calcExpectedScore(p_playerRating, p_scenarioRating);
            }
            else {
                this.Log(Severity.Error, "In TwoA.CalculateExpectedScore: Unknown adapter '" + p_adaptID
                    + "'. No update is done. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        ////// END: Methods for calculating scores
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for setting adapter parameters
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for target distribution
        /// <summary>
        /// Returns the mean, sd, lower and upper limits of target distribution as an array.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        /// <returns>An array with four elements.</returns>
        TwoA.prototype.GetTargetDistribution = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return new Array(this.adapter.TargetDistrMean, this.adapter.TargetDistrSD, this.adapter.TargetLowerLimit, this.adapter.TargetUpperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return new Array(this.adapterElo.TargetDistrMean, this.adapterElo.TargetDistrSD, this.adapterElo.TargetLowerLimit, this.adapterElo.TargetUpperLimit);
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning null.");
                return null;
            }
        };
        /// <summary>
        /// Sets the target distribution parameters to custom value.
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_mean">         Distribution mean.</param>
        /// <param name="p_sd">           Distribution standard deviation.</param>
        /// <param name="p_lowerLimit">   Distribution lower limit.</param>
        /// <param name="p_upperLimit">   Distribution upper limit.</param>
        TwoA.prototype.SetTargetDistribution = function (p_adaptID, p_mean, p_sd, p_lowerLimit, p_upperLimit) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setTargetDistribution(p_mean, p_sd, p_lowerLimit, p_upperLimit);
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the target distribution parameters to default values.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        TwoA.prototype.SetDefaultTargetDistribution = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultTargetDistribution();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultTargetDistribution();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultTargetDistribution' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for target distribution
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for fuzzy intervals
        /// <summary>
        /// Gets the fuzzy interval SD multiplier.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID></param>
        /// <returns>Multiplier value, or 0 if the adapter is not found.</returns>
        TwoA.prototype.GetFiSDMultiplier = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.FiSDMultiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.FiSDMultiplier;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized. Returning error code '"
                    + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Sets the fuzzy interval SD multiplier
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID.</param>
        /// <param name="p_multiplier">   The value of the multiplier.</param>
        TwoA.prototype.SetFiSDMultiplier = function (p_adaptID, p_multiplier) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.FiSDMultiplier = p_multiplier;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.FiSDMultiplier = p_multiplier;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the fuzzy interval SD multiplier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        TwoA.prototype.SetDefaultFiSDMultiplier = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultFiSDMultiplier();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultFiSDMultiplier();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultFiSDMultiplier' method: adapter ID '"
                    + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for fuzzy intervals
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for uncertainty parameters
        /// <summary>
        /// Gets the maximum delay for the uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID"> Adapter ID.</param>
        /// <returns>The number of days as double value, or 0 if adapter is not found</returns>
        TwoA.prototype.GetMaxDelay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxDelay;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetMaxDelay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Sets the maximum delay for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID.</param>
        /// <param name="p_maxDelay"> Maximum delay in days.</param>
        TwoA.prototype.SetMaxDelay = function (p_adaptID, p_maxDelay) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxDelay = p_maxDelay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxDelay = p_maxDelay;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the maximum delay for uncertainty calculation to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID.</param>
        TwoA.prototype.SetDefaultMaxDelay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxDelay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxDelay();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultMaxDelay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>The number of play counts as double value.</returns>
        TwoA.prototype.GetMaxPlay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.MaxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MaxPlay;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetMaxPlay' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the maximum play count for uncertainty calculation.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_maxPlay">  Max play count</param>
        TwoA.prototype.SetMaxPlay = function (p_adaptID, p_maxPlay) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.MaxPlay = p_maxPlay;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MaxPlay = p_maxPlay;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the maximum play count to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultMaxPlay = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultMaxPlay();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMaxPlay();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultMaxPlay' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for uncertainty parameters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for K factor
        /// <summary>
        /// Get the K constant
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K constant as double value</returns>
        TwoA.prototype.GetKConst = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KConst;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetKConst' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the K constant value
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kConst">   The value of the K constant</param>
        TwoA.prototype.SetKConst = function (p_adaptID, p_kConst) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KConst = p_kConst;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KConst = p_kConst;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the K constant to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKConst = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKConst();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKConst();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultKConst' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Upward uncertainty weight as double value</returns>
        TwoA.prototype.GetKUp = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KUp;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetKUp' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the value for the upward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kUp">      Weight value</param>
        TwoA.prototype.SetKUp = function (p_adaptID, p_kUp) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KUp = p_kUp;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KUp = p_kUp;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the upward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKUp = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKUp();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKUp();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultKUp' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Weight value as double number</returns>
        TwoA.prototype.GetKDown = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.KDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.KDown;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetKDown' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the value of the downward uncertainty weight.
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_kDown">    Weight value</param>
        TwoA.prototype.SetKDown = function (p_adaptID, p_kDown) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.KDown = p_kDown;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.KDown = p_kDown;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the downward uncertainty weight to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultKDown = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultKDown();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultKDown();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultKDown' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for K factor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for the calibration params
        /// <summary>
        /// Get the player calibration length
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Calibration length as int</returns>
        TwoA.prototype.GetPlayerCalLength = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.PlayerCalLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.PlayerCalLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the player calibration length
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        TwoA.prototype.SetPlayerCalLength = function (p_adaptID, p_calLength) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.PlayerCalLength = p_calLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.PlayerCalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the default calibration length for a player
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultPlayerCalLength = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultPlayerCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultPlayerCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultPlayerCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the scenario calibration length
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Calibration length as int</returns>
        TwoA.prototype.GetScenarioCalLength = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.ScenarioCalLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ScenarioCalLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the scenario calibration length
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        TwoA.prototype.SetScenarioCalLength = function (p_adaptID, p_calLength) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.ScenarioCalLength = p_calLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ScenarioCalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the default calibration length for a scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultScenarioCalLength = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultScenarioCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultScenarioCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultScenarioCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the scenario and player calibration lengths to the same value
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        /// <param name="p_calLength">    The value of the calibration length</param>
        TwoA.prototype.SetCalLength = function (p_adaptID, p_calLength) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.CalLength = p_calLength;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.CalLength = p_calLength;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets scenario and player calibration lengths to its default values.
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultCalLength = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultCalLength();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultCalLength();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultCalLength' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the player calibration K factor
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K factor as double</returns>
        TwoA.prototype.GetPlayerCalK = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.PlayerCalK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.PlayerCalK;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the player calibration K factor
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        TwoA.prototype.SetPlayerCalK = function (p_adaptID, p_calK) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.PlayerCalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.PlayerCalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the default calibration K factor for a player
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultPlayerCalK = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultPlayerCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultPlayerCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultPlayerCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the scenario calibration K factor
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>K factor as double</returns>
        TwoA.prototype.GetScenarioCalK = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                return this.adapter.ScenarioCalK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ScenarioCalK;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.GetScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the scenario calibration K factor
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        TwoA.prototype.SetScenarioCalK = function (p_adaptID, p_calK) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.ScenarioCalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ScenarioCalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the default calibration K factor for a scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultScenarioCalK = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultScenarioCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultScenarioCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultScenarioCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the player and scenario calibration K factors
        /// </summary>
        /// <param name="p_adaptID">  Adapter ID</param>
        /// <param name="p_calK">     The value of the calibration K factor</param>
        TwoA.prototype.SetCalK = function (p_adaptID, p_calK) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.CalK = p_calK;
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.CalK = p_calK;
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Set the default calibration K factor for player and scenario
        /// </summary>
        /// <param name="p_adaptID">      Adapter ID</param>
        TwoA.prototype.SetDefaultCalK = function (p_adaptID) {
            if (p_adaptID === this.adapter.Type) {
                this.adapter.setDefaultCalK();
            }
            else if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultCalK();
            }
            else {
                this.Log(AssetPackage.Severity.Error, "In 'TwoA.SetDefaultCalK' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for the calibration params
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for Elo-based expected score params
        /// <summary>
        /// Get the value of the expected score magnifier
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier as double value</returns>
        TwoA.prototype.GetExpectScoreMagnifier = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.ExpectScoreMagnifier;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetExpectScoreMagnifier' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the value of the expected score magnifier.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_expectScoreMagnifier"> The value for the magnifier</param>
        TwoA.prototype.SetExpectScoreMagnifier = function (p_adaptID, p_expectScoreMagnifier) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.ExpectScoreMagnifier = p_expectScoreMagnifier;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the expected score magnifier to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultExpectScoreMagnifier = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultExpectScoreMagnifier();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultExpectScoreMagnifier' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Get the value of the magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        /// <returns>Magnifier step size as double value</returns>
        TwoA.prototype.GetMagnifierStepSize = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                return this.adapterElo.MagnifierStepSize;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.GetMagnifierStepSize' method: adapter ID '" + p_adaptID
                    + "' is not recognized. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
        };
        /// <summary>
        /// Set the value of teh magnifier step size.
        /// </summary>
        /// <param name="p_adaptID">              Adapter ID</param>
        /// <param name="p_magnifierStepSize">    The value of the magnifier step size</param>
        TwoA.prototype.SetMagnifierStepSize = function (p_adaptID, p_magnifierStepSize) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.MagnifierStepSize = p_magnifierStepSize;
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        /// <summary>
        /// Sets the magnifier step size to its default value.
        /// </summary>
        /// <param name="p_adaptID">Adapter ID</param>
        TwoA.prototype.SetDefaultMagnifierStepSize = function (p_adaptID) {
            if (p_adaptID === this.adapterElo.Type) {
                this.adapterElo.setDefaultMagnifierStepSize();
            }
            else {
                this.Log(Severity.Error, "In 'TwoA.SetDefaultMagnifierStepSize' method: adapter ID '" + p_adaptID + "' is not recognized.");
            }
        };
        ////// END: Methods for Elo-based expected score params
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for setting adapter parameters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for player data
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param getters
        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        TwoA.prototype.GetPlayerRating = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to get Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Rating;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        TwoA.prototype.GetPlayerPlayCount = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to get PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.PlayCount;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        TwoA.prototype.GetPlayerKFactor = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to get KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.KFactor;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        TwoA.prototype.GetPlayerUncertainty = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to get Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.Uncertainty;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a player.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching player is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// 
        /// <returns>
        /// LastPlayed as string DateTime object.
        /// </returns>
        TwoA.prototype.GetPlayerLastPlayed = function (p_adaptID, p_gameID, p_playerID) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to get LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'.");
                throw new ReferenceError(); // [TODO]
            }
            else {
                return player.LastPlayed;
            }
        };
        ////// END: Player param getters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Player param setters
        /// <summary>
        /// Set a Rating value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerRating = function (p_adaptID, p_gameID, p_playerID, p_rating) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set Rating for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            player.Rating = p_rating;
            return true;
        };
        /// <summary>
        /// Set a PlayCount value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerPlayCount = function (p_adaptID, p_gameID, p_playerID, p_playCount) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }
            player.PlayCount = p_playCount;
            return true;
        };
        /// <summary>
        /// Set a KFactor value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerKFactor = function (p_adaptID, p_gameID, p_playerID, p_kFactor) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }
            player.KFactor = p_kFactor;
            return true;
        };
        /// <summary>
        /// Set an Uncertainty value for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerUncertainty = function (p_adaptID, p_gameID, p_playerID, p_uncertainty) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }
            player.Uncertainty = p_uncertainty;
            return true;
        };
        /// <summary>
        /// Set a LastPlayed datetime for a player.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_playerID">     Identifier for the player. </param>
        /// <param name="p_lastPlayed">   The DateTime object for LastPlayed datetime. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetPlayerLastPlayed = function (p_adaptID, p_gameID, p_playerID, p_lastPlayed) {
            var player = this.Player(p_adaptID, p_gameID, p_playerID, true);
            if (typeof player === 'undefined' || player === null) {
                this.Log(Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Player not found.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for player '" + p_playerID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null date object.");
                return false;
            }
            player.LastPlayed = p_lastPlayed;
            return true;
        };
        ////// END: Player param setters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode adders
        /// <summary>
        /// Add a new player node.
        /// </summary>
        /// <param name="p_playerNode">New player node.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayerNode = function (p_playerNode) {
            if (Misc.IsNullOrEmpty(p_playerNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Adaptation ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Game ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.PlayerID)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player ID is null or empty string.");
                return false;
            }
            if (this.Player(p_playerNode.AdaptationID, p_playerNode.GameID, p_playerNode.PlayerID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Player '" + p_playerNode.PlayerID
                    + "' in game '" + p_playerNode.GameID + "' with adaptation '" + p_playerNode.AdaptationID + "' already exists.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playerNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid play count.");
                return false;
            }
            if (!this.IsValidKFactor(p_playerNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid K factor.");
                return false;
            }
            if (!this.IsValidUncertainty(p_playerNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Invalid uncertainty.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_playerNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddPlayer: Cannot add player. Null or empty string for last played date.");
                return false;
            }
            this.players.push(p_playerNode);
            return true;
        };
        /// <summary>
        /// Add a new player node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <param name="p_rating">Player's skill rating.</param>
        /// <param name="p_playCount">The number of past games played by the player.</param>
        /// <param name="p_kFactor">Player's K factor.</param>
        /// <param name="p_uncertainty">Player's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the player played the last game. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayer = function (p_adaptID, p_gameID, p_playerID, p_rating, p_playCount, p_kFactor, p_uncertainty, p_lastPlayed) {
            var newPlayerNode = new TwoANS.PlayerNode(p_adaptID, p_gameID, p_playerID);
            newPlayerNode.Rating = p_rating;
            newPlayerNode.PlayCount = p_playCount;
            newPlayerNode.KFactor = p_kFactor;
            newPlayerNode.Uncertainty = p_uncertainty;
            newPlayerNode.LastPlayed = p_lastPlayed;
            if (this.AddPlayerNode(newPlayerNode)) {
                return newPlayerNode;
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Add a new player node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_playerID">Player ID.</param>
        /// <returns>True if new player node was added and false otherwise.</returns>
        TwoA.prototype.AddPlayerDefault = function (p_adaptID, p_gameID, p_playerID) {
            return this.AddPlayer(p_adaptID, p_gameID, p_playerID, Misc.INITIAL_RATING, 0, Misc.INITIAL_K_FCT, Misc.INITIAL_UNCERTAINTY, Misc.DEFAULT_DATETIME);
        };
        ////// END: PlayerNode adders
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode getter
        /// <summary>
        /// Get a PlayerNode with a given player ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">  Identifier for the adapt. </param>
        /// <param name="p_gameID">   Identifier for the game. </param>
        /// <param name="p_playerID"> Identifier for the player. </param>
        ///
        /// <returns>
        /// PlayerNode object, or null if no ID match is found.
        /// </returns>
        TwoA.prototype.Player = function (p_adaptID, p_gameID, p_playerID, p_showWarning) {
            if (p_showWarning === void 0) { p_showWarning = true; }
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_playerID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error, "In TwoA.Player method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID && player.PlayerID === p_playerID) {
                    return player;
                }
            }
            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Player method: Player not found. Returning null.");
            }
            return null;
        };
        /// <summary>
        /// Gets a list of all player nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID"> Identifier for the adapt. </param>
        /// <param name="p_gameID">  Identifier for the game. </param>
        ///
        /// <returns>
        /// List of PlayerNode instances.
        /// </returns>
        TwoA.prototype.AllPlayers = function (p_adaptID, p_gameID) {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error, "In TwoA.AllPlayers method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }
            var matchingPlayers = new Array();
            for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
                var player = _a[_i];
                if (player.AdaptationID === p_adaptID && player.GameID === p_gameID) {
                    matchingPlayers.push(player);
                }
            }
            if (matchingPlayers.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllPlayers method: Unable to retrieve players for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }
            return matchingPlayers.sort(function (playerOne, playerTwo) {
                if (playerOne.Rating < playerTwo.Rating) {
                    return -1;
                }
                else if (playerOne.Rating > playerTwo.Rating) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        ////// END: PlayerNode getter
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: PlayerNode removers
        /// [TODO] rather inefficient
        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_playerID">Player ID</param>
        /// <returns>True if the player was removed, and false otherwise.</returns>
        TwoA.prototype.RemovePlayer = function (p_adaptID, p_gameID, p_playerID) {
            return this.RemovePlayerNode(this.Player(p_adaptID, p_gameID, p_playerID, true));
        };
        /// <summary>
        /// Removes a specified player.
        /// </summary>
        /// <param name="playerNode">PlayerNode instance to remove.</param>
        /// <returns>True if player was removed, and false otherwise.</returns>
        TwoA.prototype.RemovePlayerNode = function (p_playerNode) {
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode parameter is null.");
                return false;
            }
            var index = this.players.indexOf(p_playerNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemovePlayer: Cannot remove player. The playerNode was not found.");
                return false;
            }
            this.players.splice(index, 1);
            return true;
        };
        ////// END: PlayerNode removers
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for player data
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for scenario data
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param getters
        // [2016.11.14]
        /// <summary>
        /// Get a value of Rating for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Rating as double value.
        /// </returns>
        TwoA.prototype.GetScenarioRating = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Rating;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of PlayCount for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// PlayCount as double value.
        /// </returns>
        TwoA.prototype.GetScenarioPlayCount = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.PlayCount;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of KFactor for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// KFactor as double value.
        /// </returns>
        TwoA.prototype.GetScenarioKFactor = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.KFactor;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of Uncertainty for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// Uncertainty as double value.
        /// </returns>
        TwoA.prototype.GetScenarioUncertainty = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.Uncertainty;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of LastPlayed for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// LastPlayed as DateTime object.
        /// </returns>
        TwoA.prototype.GetScenarioLastPlayed = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.LastPlayed;
            }
        };
        // [2016.11.14]
        /// <summary>
        /// Get a value of TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <exception cref="NullReferenceException">    Thrown when matching scenario is not found 
        ///                                              and null is returned. </exception>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// 
        /// <returns>
        /// TimeLimit as double value.
        /// </returns>
        TwoA.prototype.GetScenarioTimeLimit = function (p_adaptID, p_gameID, p_scenarioID) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to get TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'."); // [TODO]
                throw new ReferenceError(); // [TODO]
            }
            else {
                return scenario.TimeLimit;
            }
        };
        ////// END: Scenario param getters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Scenario param setters
        /// <summary>
        /// Set a Rating value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_rating">       The value of Rating. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioRating = function (p_adaptID, p_gameID, p_scenarioID, p_rating) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Rating for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            scenario.Rating = p_rating;
            return true;
        };
        /// <summary>
        /// Set a PlayCount value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_playCount">    The value of PlayCount. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioPlayCount = function (p_adaptID, p_gameID, p_scenarioID, p_playCount) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidPlayCount(p_playCount)) {
                this.Log(Severity.Error, "Unable to set PlayCount for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid play count.");
                return false;
            }
            scenario.PlayCount = p_playCount;
            return true;
        };
        /// <summary>
        /// Set a KFactor value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_kFactor">      The value of KFactor. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioKFactor = function (p_adaptID, p_gameID, p_scenarioID, p_kFactor) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidKFactor(p_kFactor)) {
                this.Log(Severity.Error, "Unable to set KFactor for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid K factor.");
                return false;
            }
            scenario.KFactor = p_kFactor;
            return true;
        };
        /// <summary>
        /// Set an Uncertainty value for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_uncertainty">  The value of Uncertainty. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioUncertainty = function (p_adaptID, p_gameID, p_scenarioID, p_uncertainty) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidUncertainty(p_uncertainty)) {
                this.Log(Severity.Error, "Unable to set Uncertainty for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid uncertainty.");
                return false;
            }
            scenario.Uncertainty = p_uncertainty;
            return true;
        };
        /// <summary>
        /// Set a LastPlayed datetime for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_lastPlayed">   String value of the date and time of the last play. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioLastPlayed = function (p_adaptID, p_gameID, p_scenarioID, p_lastPlayed) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_lastPlayed)) {
                this.Log(Severity.Error, "Unable to set LastPlayed for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Null or empty date and time string.");
                return false;
            }
            scenario.LastPlayed = p_lastPlayed;
            return true;
        };
        /// <summary>
        /// Set a TimeLimit for a scenario.
        /// </summary>
        /// 
        /// <param name="p_adaptID">      Identifier for the adapt. </param>
        /// <param name="p_gameID">       Identifier for the game. </param>
        /// <param name="p_scenarioID">   Identifier for the scenario. </param>
        /// <param name="p_timeLimit">    The value of TimeLimit. </param>
        /// 
        /// <returns>
        /// True if value was changed, false otherwise.
        /// </returns>
        TwoA.prototype.SetScenarioTimeLimit = function (p_adaptID, p_gameID, p_scenarioID, p_timeLimit) {
            var scenario = this.Scenario(p_adaptID, p_gameID, p_scenarioID, true);
            if (typeof scenario === 'undefined' || scenario === null) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. The scenario not found.");
                return false;
            }
            if (!this.IsValidTimeLimit(p_timeLimit)) {
                this.Log(Severity.Error, "Unable to set TimeLimit for scenario '" + p_scenarioID
                    + "' for adaptation '" + p_adaptID + "' in game '" + p_gameID + "'. Invalid time limit.");
                return false;
            }
            scenario.TimeLimit = p_timeLimit;
            return true;
        };
        ////// END: Scenario param setters
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode adders
        /// <summary>
        /// Add a new scenario node.
        /// </summary>
        /// <param name="p_scenarioNode">New scenario node.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenarioNode = function (p_scenarioNode) {
            if (Misc.IsNullOrEmpty(p_scenarioNode.AdaptationID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Adaptation ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.GameID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Game ID is null or empty string.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.ScenarioID)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario ID is null or empty string.");
                return false;
            }
            if (this.Scenario(p_scenarioNode.AdaptationID, p_scenarioNode.GameID, p_scenarioNode.ScenarioID, false) !== null) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Scenario '" + p_scenarioNode.ScenarioID
                    + "' in game '" + p_scenarioNode.GameID + "' with adaptation '" + p_scenarioNode.AdaptationID + "' already exists.");
                return false;
            }
            if (!this.IsValidPlayCount(p_scenarioNode.PlayCount)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid play count.");
                return false;
            }
            if (!this.IsValidKFactor(p_scenarioNode.KFactor)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid K factor.");
                return false;
            }
            if (!this.IsValidUncertainty(p_scenarioNode.Uncertainty)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid uncertainty.");
                return false;
            }
            if (Misc.IsNullOrEmpty(p_scenarioNode.LastPlayed)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Null or empty string for last played date.");
                return false;
            }
            if (!this.IsValidTimeLimit(p_scenarioNode.TimeLimit)) {
                this.Log(Severity.Error, "In TwoA.AddScenario: Cannot add scenario. Invalid time limit.");
                return false;
            }
            this.scenarios.push(p_scenarioNode);
            return true;
        };
        /// <summary>
        /// Add a new scenario node with custom parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <param name="p_rating">Scenario's difficulty rating.</param>
        /// <param name="p_playCount">The number of time the scenario was played to calculate the difficulty rating.</param>
        /// <param name="p_kFactor">Scenario's K factor.</param>
        /// <param name="p_uncertainty">Scenario's uncertainty.</param>
        /// <param name="p_lastPlayed">The datetime the scenario was last played. Should have 'yyyy-MM-ddThh:mm:ss' format.</param>
        /// <param name="p_timeLimit">Time limit to complete the scenario (in milliseconds).</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenario = function (p_adaptID, p_gameID, p_scenarioID, p_rating, p_playCount, p_kFactor, p_uncertainty, p_lastPlayed, p_timeLimit) {
            var newScenarioNode = new TwoANS.ScenarioNode(p_adaptID, p_gameID, p_scenarioID);
            newScenarioNode.Rating = p_rating;
            newScenarioNode.PlayCount = p_playCount;
            newScenarioNode.KFactor = p_kFactor;
            newScenarioNode.Uncertainty = p_uncertainty;
            newScenarioNode.LastPlayed = p_lastPlayed;
            newScenarioNode.TimeLimit = p_timeLimit;
            if (this.AddScenarioNode(newScenarioNode)) {
                return newScenarioNode;
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Add a new scenario node with default parameters.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID.</param>
        /// <param name="p_gameID">Game ID.</param>
        /// <param name="p_scenarioID">Scenario ID.</param>
        /// <returns>True if new scenario node was added and false otherwise.</returns>
        TwoA.prototype.AddScenarioDefault = function (p_adaptID, p_gameID, p_scenarioID) {
            return this.AddScenario(p_adaptID, p_gameID, p_scenarioID, Misc.INITIAL_RATING, 0, Misc.INITIAL_K_FCT, Misc.INITIAL_UNCERTAINTY, Misc.DEFAULT_DATETIME, Misc.DEFAULT_TIME_LIMIT);
        };
        ////// END: ScenarioNode adders
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode getter
        /// <summary>
        /// Get a ScenarioNode with a given scenario ID.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        /// <param name="p_scenarioID"> Identifier for the scenario. </param>
        ///
        /// <returns>
        /// ScenarioNode object, or null if no ID match is found.
        /// </returns>
        TwoA.prototype.Scenario = function (p_adaptID, p_gameID, p_scenarioID, p_showWarning) {
            if (p_showWarning === void 0) { p_showWarning = true; }
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID) || Misc.IsNullOrEmpty(p_scenarioID)) {
                if (p_showWarning) {
                    this.Log(Severity.Error, "In TwoA.Scenario method: one or more parameters are null. Expected string values. Returning null.");
                }
                return null;
            }
            for (var _i = 0, _a = this.scenarios; _i < _a.length; _i++) {
                var scenario = _a[_i];
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID && scenario.ScenarioID === p_scenarioID) {
                    return scenario;
                }
            }
            if (p_showWarning) {
                this.Log(Severity.Error, "In TwoA.Scenario method: Scenario not found. Returning null.");
            }
            return null;
        };
        /// <summary>
        /// Gets a list of all scenario nodes.
        /// </summary>
        ///
        /// <param name="p_adaptID">    Identifier for the adapt. </param>
        /// <param name="p_gameID">     Identifier for the game. </param>
        ///
        /// <returns>
        /// all scenarios.
        /// </returns>
        TwoA.prototype.AllScenarios = function (p_adaptID, p_gameID) {
            if (Misc.IsNullOrEmpty(p_adaptID) || Misc.IsNullOrEmpty(p_gameID)) {
                this.Log(Severity.Error, "In AllScenarios method: one or more parameters are null. Expected string values. Returning null.");
                return null;
            }
            var matchingScenarios = new Array();
            for (var _i = 0, _a = this.scenarios; _i < _a.length; _i++) {
                var scenario = _a[_i];
                if (scenario.AdaptationID === p_adaptID && scenario.GameID === p_gameID) {
                    matchingScenarios.push(scenario);
                }
            }
            if (matchingScenarios.length === 0) {
                this.Log(Severity.Error, "In TwoA.AllScenarios method: Unable to retrieve scenarios for game '"
                    + p_gameID + "' with adaptation '" + p_adaptID + "'. No matching scenarios.");
                return null;
            }
            return matchingScenarios.sort(function (scenarioOne, scenarioTwo) {
                if (scenarioOne.Rating < scenarioTwo.Rating) {
                    return -1;
                }
                else if (scenarioOne.Rating > scenarioTwo.Rating) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        ////// END: ScenarioNode getter
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: ScenarioNode removers
        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_adaptID">Adaptation ID</param>
        /// <param name="p_gameID">Game ID</param>
        /// <param name="p_scenarioID">Scenario ID</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        TwoA.prototype.RemoveScenario = function (p_adaptID, p_gameID, p_scenarioID) {
            return this.RemoveScenarioNode(this.Scenario(p_adaptID, p_gameID, p_scenarioID, true));
        };
        /// <summary>
        /// Removes a specified scenario.
        /// </summary>
        /// <param name="p_scenarioNode">ScenarioNode instance to remove.</param>
        /// <returns>True if scenario was removed, and false otherwise.</returns>
        TwoA.prototype.RemoveScenarioNode = function (p_scenarioNode) {
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode parameter is null.");
                return false;
            }
            var index = this.scenarios.indexOf(p_scenarioNode, 0);
            if (index < 0) {
                this.Log(Severity.Error, "In TwoA.RemoveScenario: Cannot remove scenario. The scenarioNode was not found.");
                return false;
            }
            this.scenarios.splice(index, 1);
            return true;
        };
        ////// END: ScenarioNode removers
        //////////////////////////////////////////////////////////////////////////////////////
        ////// END: methods for scenario data
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods for value validity checks
        /// <summary>
        /// Returns true if play count value is valid.
        /// </summary>
        /// <param name="p_playCount">Play count value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidPlayCount = function (p_playCount) {
            if (p_playCount < 0) {
                this.Log(Severity.Information, "Play count should be equal to or higher than 0.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if K factor value is valid.
        /// </summary>
        /// <param name="p_kFactor">K factor value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidKFactor = function (p_kFactor) {
            if (p_kFactor <= 0) {
                this.Log(Severity.Information, "K factor should be equal to or higher than '" + Misc.MIN_K_FCT + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if uncertainty value is valid.
        /// </summary>
        /// <param name="p_uncertainty">Uncertainty value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidUncertainty = function (p_uncertainty) {
            if (p_uncertainty < 0 || p_uncertainty > 1) {
                this.Log(Severity.Information, "The uncertainty should be within [0, 1].");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Returns true if time limit value is valid.
        /// </summary>
        /// <param name="p_timeLimit">Time limit value</param>
        /// <returns>bool</returns>
        TwoA.prototype.IsValidTimeLimit = function (p_timeLimit) {
            if (p_timeLimit <= 0) {
                this.Log(Severity.Error, "Time limit should be higher than 0.");
                return false;
            }
            return true;
        };
        return TwoA;
    }(BaseAsset));
    TwoANS.TwoA = TwoA;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../RageAssetManager/ILog.ts"/>
///
/// <reference path="Misc.ts"/>
/// <reference path="BaseAdapter.ts"/>
/// <reference path="TwoA.ts"/>
/// <reference path="PlayerNode.ts"/>
/// <reference path="ScenarioNode.ts"/>
///
var TwoANS;
(function (TwoANS) {
    var Severity = AssetPackage.Severity;
    /*import BaseAdapter = TwoANS.BaseAdapter;
    import TwoA = TwoANS.TwoA;
    import PlayerNode = TwoANS.PlayerNode;
    import ScenarioNode = TwoANS.ScenarioNode;*/
    var DifficultyAdapter = /** @class */ (function (_super) {
        __extends(DifficultyAdapter, _super);
        ////// END: const, fields, and properties for the calibration phase
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initializes a new instance of the DifficultyAdapter class.
        /// </summary>
        function DifficultyAdapter() {
            var _this = _super.call(this) || this;
            _this.targetDistrMean = DifficultyAdapter.TARGET_DISTR_MEAN;
            _this.targetDistrSD = DifficultyAdapter.TARGET_DISTR_SD;
            _this.targetLowerLimit = DifficultyAdapter.TARGET_LOWER_LIMIT;
            _this.targetUpperLimit = DifficultyAdapter.TARGET_UPPER_LIMIT;
            _this.fiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;
            _this.maxDelay = DifficultyAdapter.DEF_MAX_DELAY; // [SC] set to DEF_MAX_DELAY in the constructor
            _this.maxPlay = DifficultyAdapter.DEF_MAX_PLAY; // [SC] set to DEF_MAX_PLAY in the constructor
            _this.kConst = DifficultyAdapter.DEF_K; // [SC] set to DEF_K in the constructor
            _this.kUp = DifficultyAdapter.DEF_K_UP; // [SC] set to DEF_K_UP in the constructor
            _this.kDown = DifficultyAdapter.DEF_K_DOWN; // [SC] set to DEF_K_DOWN in the constructor
            _this.playerCalLength = DifficultyAdapter.DEF_PLAYER_CAL_LENGTH;
            _this.scenarioCalLength = DifficultyAdapter.DEF_SCENARIO_CAL_LENGTH;
            _this.playerCalK = DifficultyAdapter.DEF_PLAYER_CAL_K;
            _this.scenarioCalK = DifficultyAdapter.DEF_SCENARIO_CAL_K;
            return _this;
        }
        Object.defineProperty(DifficultyAdapter, "Type", {
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties for the adapter type
            /// <summary>
            /// Gets the type of the adapter
            /// </summary>
            get: function () {
                return "Game difficulty - Player skill";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter, "Description", {
            /// <summary>
            /// Description of this adapter
            /// </summary>
            get: function () {
                return "Adapts game difficulty to player skill. Skill ratings are evaluated for individual players. "
                    + "Requires player accuracy (0 or 1) and response time. Uses a modified version of the CAP algorithm.";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "Type", {
            get: function () {
                return DifficultyAdapter.Type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "Description", {
            get: function () {
                return DifficultyAdapter.Description;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetDistrMean", {
            /// <summary>
            /// Getter for target distribution mean. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrMean;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetDistrSD", {
            /// <summary>
            /// Getter for target distribution standard deviation. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetDistrSD;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetLowerLimit", {
            /// <summary>
            /// Getter for target distribution lower limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetLowerLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "TargetUpperLimit", {
            /// <summary>
            /// Getter for target distribution upper limit. See 'setTargetDistribution' method for setting a value.
            /// </summary>
            get: function () {
                return this.targetUpperLimit;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DifficultyAdapter.prototype, "FiSDMultiplier", {
            /// <summary>
            /// Getter/setter for a weight used to calculate distribution means for a fuzzy selection algorithm.
            /// </summary>
            get: function () {
                return this.fiSDMultiplier;
            },
            set: function (p_fiSDMultiplier) {
                if (p_fiSDMultiplier <= 0) {
                    this.log(Severity.Warning, "In FiSDMultiplier: The standard deviation multiplier '"
                        + p_fiSDMultiplier + "' is less than or equal to 0.");
                }
                else {
                    this.fiSDMultiplier = p_fiSDMultiplier;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets FiSDMultiplier to a default value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultFiSDMultiplier = function () {
            this.FiSDMultiplier = DifficultyAdapter.FI_SD_MULTIPLIER;
        };
        /// <summary>
        /// Sets target distribution parameters to their default values.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultTargetDistribution = function () {
            this.setTargetDistribution(DifficultyAdapter.TARGET_DISTR_MEAN, DifficultyAdapter.TARGET_DISTR_SD, DifficultyAdapter.TARGET_LOWER_LIMIT, DifficultyAdapter.TARGET_UPPER_LIMIT);
        };
        /// <summary>
        /// Sets target distribution parameters to custom values.
        /// </summary>
        /// 
        /// <param name="p_tDistrMean">   Dstribution mean</param>
        /// <param name="p_tDistrSD">     Distribution standard deviation</param>
        /// <param name="p_tLowerLimit">  Distribution lower limit</param>
        /// <param name="p_tUpperLimit">  Distribution upper limit</param>
        DifficultyAdapter.prototype.setTargetDistribution = function (p_tDistrMean, p_tDistrSD, p_tLowerLimit, p_tUpperLimit) {
            var validValuesFlag = true;
            // [SD] setting distribution mean
            if (p_tDistrMean <= 0 || p_tDistrMean >= 1) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The target distribution mean '"
                    + p_tDistrMean + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution SD
            if (p_tDistrSD <= 0 || p_tDistrSD >= 1) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The target distribution standard deviation '"
                    + p_tDistrSD + "' is not within the open interval (0, 1).");
                validValuesFlag = false;
            }
            // [SC] setting distribution lower limit
            if (p_tLowerLimit < 0 || p_tLowerLimit > 1) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '"
                    + p_tLowerLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tLowerLimit >= p_tDistrMean) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The lower limit of distribution '" + p_tLowerLimit
                    + "' is bigger than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            // [SC] setting distribution upper limit
            if (p_tUpperLimit < 0 || p_tUpperLimit > 1) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '"
                    + p_tUpperLimit + "' is not within the closed interval [0, 1].");
                validValuesFlag = false;
            }
            if (p_tUpperLimit <= p_tDistrMean) {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: The upper limit of distribution '" + p_tUpperLimit
                    + "' is less than or equal to the mean of the distribution '" + p_tDistrMean + "'.");
                validValuesFlag = false;
            }
            if (validValuesFlag) {
                this.targetDistrMean = p_tDistrMean;
                this.targetDistrSD = p_tDistrSD;
                this.targetLowerLimit = p_tLowerLimit;
                this.targetUpperLimit = p_tUpperLimit;
            }
            else {
                this.log(Severity.Warning, "In DifficultyAdapter.setTargetDistribution: Invalid value combination is found.");
            }
        };
        Object.defineProperty(DifficultyAdapter.prototype, "MaxDelay", {
            /// <summary>
            /// Gets or sets the maximum delay.
            /// </summary>
            get: function () {
                return this.maxDelay;
            },
            set: function (p_maxDelay) {
                if (p_maxDelay <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapter.MaxDelay: The maximum number of delay days '"
                        + p_maxDelay + "' should be higher than 0.");
                }
                else {
                    this.maxDelay = p_maxDelay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxDelay to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultMaxDelay = function () {
            this.MaxDelay = DifficultyAdapter.DEF_MAX_DELAY;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "MaxPlay", {
            /// <summary>
            /// Gets or sets the maximum play.
            /// </summary>
            get: function () {
                return this.maxPlay;
            },
            set: function (p_maxPlay) {
                if (p_maxPlay <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapter.MaxPlay: The maximum administration parameter '"
                        + p_maxPlay + "' should be higher than 0.");
                }
                else {
                    this.maxPlay = p_maxPlay;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets MaxPlay to its default value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultMaxPlay = function () {
            this.MaxPlay = DifficultyAdapter.DEF_MAX_PLAY;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KConst", {
            /// <summary>
            /// Getter/setter for the K constant.
            /// </summary>
            get: function () {
                return this.kConst;
            },
            set: function (p_kConst) {
                if (p_kConst <= 0) {
                    this.log(Severity.Warning, "In DifficultyAdapter.KConst: K constant '"
                        + p_kConst + "' cannot be 0 or a negative number.");
                }
                else {
                    this.kConst = p_kConst;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the K constant to its deafult value
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKConst = function () {
            this.KConst = DifficultyAdapter.DEF_K;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KUp", {
            /// <summary>
            /// Getter/setter for the upward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kUp;
            },
            set: function (p_kUp) {
                if (p_kUp < 0) {
                    this.log(Severity.Warning, "In DifficultyAdapter.KUp: The upward uncertianty weight '"
                        + p_kUp + "' cannot be a negative number.");
                }
                else {
                    this.kUp = p_kUp;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the upward uncertainty weight to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKUp = function () {
            this.KUp = DifficultyAdapter.DEF_K_UP;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "KDown", {
            /// <summary>
            /// Getter/setter for the downward uncertainty weight.
            /// </summary>
            get: function () {
                return this.kDown;
            },
            set: function (p_kDown) {
                if (p_kDown < 0) {
                    this.log(Severity.Warning, "In DifficultyAdapter.KDown: The downward uncertainty weight '"
                        + p_kDown + "' cannot be a negative number.");
                }
                else {
                    this.kDown = p_kDown;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets the downward uncetrtainty weight to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultKDown = function () {
            this.KDown = DifficultyAdapter.DEF_K_DOWN;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "PlayerCalLength", {
            /// <summary>
            /// Gets or sets the player's calibration length.
            /// </summary>
            get: function () {
                return this.playerCalLength;
            },
            set: function (p_playerCalLength) {
                if (p_playerCalLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.PlayerCalLength: The calibration length '" + p_playerCalLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.playerCalLength = p_playerCalLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets player calibration length to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultPlayerCalLength = function () {
            this.PlayerCalLength = DifficultyAdapter.DEF_PLAYER_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "ScenarioCalLength", {
            /// <summary>
            /// Gets or sets the scenario's calibration length.
            /// </summary>
            get: function () {
                return this.scenarioCalLength;
            },
            set: function (p_scenarioCalLength) {
                if (p_scenarioCalLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.ScenarioCalLength: The calibration length '" + p_scenarioCalLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.scenarioCalLength = p_scenarioCalLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario calibration length to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultScenarioCalLength = function () {
            this.ScenarioCalLength = DifficultyAdapter.DEF_SCENARIO_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "CalLength", {
            /// <summary>
            /// Sets the scenario and player calibration length to the same value
            /// </summary>
            set: function (p_calLength) {
                if (p_calLength < 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.CalLength: The calibration length '" + p_calLength + "' should be equal to or higher than 0.");
                }
                else {
                    this.playerCalLength = p_calLength;
                    this.scenarioCalLength = p_calLength;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario and player calibration lengths to its default values.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultCalLength = function () {
            this.PlayerCalLength = DifficultyAdapter.DEF_PLAYER_CAL_LENGTH;
            this.ScenarioCalLength = DifficultyAdapter.DEF_SCENARIO_CAL_LENGTH;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "PlayerCalK", {
            /// <summary>
            /// Gets or sets the player calibration K factor.
            /// </summary>
            get: function () {
                return this.playerCalK;
            },
            set: function (p_playerCalK) {
                if (p_playerCalK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.PlayerCalK: The calibration K factor '" + p_playerCalK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.playerCalK = p_playerCalK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets player calibration K factor to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultPlayerCalK = function () {
            this.PlayerCalK = DifficultyAdapter.DEF_PLAYER_CAL_K;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "ScenarioCalK", {
            /// <summary>
            /// Gets or sets the scenario calibration K factor.
            /// </summary>
            get: function () {
                return this.scenarioCalK;
            },
            set: function (p_scenarioCalK) {
                if (p_scenarioCalK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.ScenarioCalK: The calibration K factor '" + p_scenarioCalK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.scenarioCalK = p_scenarioCalK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario calibration K factor to its default value.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultScenarioCalK = function () {
            this.ScenarioCalK = DifficultyAdapter.DEF_SCENARIO_CAL_K;
        };
        Object.defineProperty(DifficultyAdapter.prototype, "CalK", {
            /// <summary>
            /// Sets the player and scenario calibration K factors to the same value.
            /// </summary>
            set: function (p_calK) {
                if (p_calK <= 0) {
                    this.log(AssetPackage.Severity.Warning, "In DifficultyAdapter.CalK: The calibration K factor '" + p_calK + "' cannot be 0 or a negative number.");
                }
                else {
                    this.playerCalK = p_calK;
                    this.scenarioCalK = p_calK;
                }
            },
            enumerable: true,
            configurable: true
        });
        /// <summary>
        /// Sets scenario and player calibration K factors to its default values.
        /// </summary>
        DifficultyAdapter.prototype.setDefaultCalK = function () {
            this.PlayerCalK = DifficultyAdapter.DEF_PLAYER_CAL_K;
            this.ScenarioCalK = DifficultyAdapter.DEF_SCENARIO_CAL_K;
        };
        DifficultyAdapter.prototype.InitSettings = function (p_asset) {
            _super.prototype.InitSettings.call(this, p_asset); // [ASSET]
        };
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: funtion for updating ratings
        /// <summary>
        /// Updates the ratings.
        /// </summary>
        /// <param name="p_playerNode">               Player node to be updated. </param>
        /// <param name="p_pscenarioNode">             Scenario node to be updated. </param>
        /// <param name="p_prt">                       Player's response time. </param>
        /// <param name="p_pcorrectAnswer">            Player's accuracy. </param>
        /// <param name="p_pupdateScenarioRating">     Set to false to avoid updating scenario node. </param>
        /// <param name="p_pcustomPlayerKfct">         If non-0 value is provided then it is used as a weight to scale change in player's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <param name="p_pcustomScenarioKfct">       If non-0 value is provided then it is used as a weight to scale change in scenario's rating. Otherwise, adapter calculates its own K factor. </param>
        /// <returns>True if updates are successfull, and false otherwise.</returns>
        DifficultyAdapter.prototype.UpdateRatings = function (p_playerNode, p_scenarioNode, p_rt, p_correctAnswer, p_updateScenarioRating, p_customPlayerKfct, p_customScenarioKfct) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(Severity.Error, "In DifficultyAdapter.UpdateRatings: Unable to update ratings. Asset instance is not detected.");
                return false;
            }
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(Severity.Error, "In DifficultyAdapter.UpdateRatings: Null player node.");
                return false;
            }
            if (typeof p_scenarioNode === 'undefined' || p_scenarioNode === null) {
                this.log(Severity.Error, "In DifficultyAdapter.UpdateRatings: Null scenario node.");
                return false;
            }
            if (!(this.validateCorrectAnswer(p_correctAnswer) && this.validateResponseTime(p_rt))) {
                this.log(Severity.Error, "In DifficultyAdapter.UpdateRatings: Unable to update ratings. Invalid response time and/or accuracy detected.");
                return false;
            }
            // [TODO] should check for valid adaptation IDs in the player and scenarios?
            // [SC] getting player data
            var playerRating = p_playerNode.Rating;
            var playerPlayCount = p_playerNode.PlayCount;
            var playerUncertainty = p_playerNode.Uncertainty;
            var playerLastPlayed = p_playerNode.LastPlayed;
            // [SC] getting scenario data
            var scenarioRating = p_scenarioNode.Rating;
            var scenarioPlayCount = p_scenarioNode.PlayCount;
            var scenarioUncertainty = p_scenarioNode.Uncertainty;
            var scenarioTimeLimit = p_scenarioNode.TimeLimit;
            var scenarioLastPlayed = p_scenarioNode.LastPlayed;
            // [SC] current datetime
            var currDateTime = Misc.GetDateStr();
            // [SC] parsing player data
            var playerLastPlayedDays = Misc.DaysElapsed(playerLastPlayed);
            if (playerLastPlayedDays > this.MaxDelay) {
                playerLastPlayedDays = this.MaxDelay;
            }
            // [SC] parsing scenario data
            var scenarioLastPlayedDays = Misc.DaysElapsed(scenarioLastPlayed);
            if (scenarioLastPlayedDays > this.MaxDelay) {
                scenarioLastPlayedDays = this.MaxDelay;
            }
            // [SC] calculating actual and expected scores
            var actualScore = this.calcActualScore(p_correctAnswer, p_rt, scenarioTimeLimit);
            var expectScore = this.calcExpectedScore(playerRating, scenarioRating, scenarioTimeLimit);
            // [SC] calculating player and scenario uncertainties
            var playerNewUncertainty = this.calcThetaUncertainty(playerUncertainty, playerLastPlayedDays);
            var scenarioNewUncertainty = this.calcBetaUncertainty(scenarioUncertainty, scenarioLastPlayedDays);
            var playerNewKFct;
            var scenarioNewKFct;
            if (p_customPlayerKfct > 0) {
                playerNewKFct = p_customPlayerKfct;
            }
            else {
                // [SC] calculating player K factors
                playerNewKFct = this.calcThetaKFctr(playerNewUncertainty, scenarioNewUncertainty, playerPlayCount);
            }
            if (p_customScenarioKfct > 0) {
                scenarioNewKFct = p_customScenarioKfct;
            }
            else {
                // [SC] calculating scenario K factor
                scenarioNewKFct = this.calcBetaKFctr(playerNewUncertainty, scenarioNewUncertainty, scenarioPlayCount);
            }
            // [SC] calculating player and scenario ratings
            var playerNewRating = this.calcTheta(playerRating, playerNewKFct, actualScore, expectScore);
            var scenarioNewRating = this.calcBeta(scenarioRating, scenarioNewKFct, actualScore, expectScore);
            // [SC] updating player and scenario play counts
            var playerNewPlayCount = playerPlayCount + 1.0;
            var scenarioNewPlayCount = scenarioPlayCount + 1.0;
            // [SC] storing updated player data
            p_playerNode.Rating = playerNewRating;
            p_playerNode.PlayCount = playerNewPlayCount;
            p_playerNode.KFactor = playerNewKFct;
            p_playerNode.Uncertainty = playerNewUncertainty;
            p_playerNode.LastPlayed = currDateTime;
            // [SC] storing updated scenario data
            if (p_updateScenarioRating) {
                p_scenarioNode.Rating = scenarioNewRating;
                p_scenarioNode.PlayCount = scenarioNewPlayCount;
                p_scenarioNode.KFactor = scenarioNewKFct;
                p_scenarioNode.Uncertainty = scenarioNewUncertainty;
                p_scenarioNode.LastPlayed = currDateTime;
            }
            // [SC] creating game log
            this.asset.CreateNewRecord(this.Type, p_playerNode.GameID, p_playerNode.PlayerID, p_scenarioNode.ScenarioID, p_rt, p_correctAnswer, playerNewRating, scenarioNewRating, currDateTime);
            return true;
        };
        ////// END: function for updating ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating matching scenario
        /// <summary>
        /// Calculates expected beta for target scenario. Returns ScenarioNode object of a scenario with beta closest to the target beta.
        /// If two more scenarios match then scenario that was least played is chosen.  
        /// </summary>
        ///
        /// <param name="p_playerNode">       Player node containing player parameters. </param>
        /// <param name="p_scenarioList">     A list of scenarios from which the target scenario is chosen. </param>
        ///
        /// <returns>
        /// ScenarioNode instance.
        /// </returns>
        DifficultyAdapter.prototype.TargetScenario = function (p_playerNode, p_scenarioList) {
            if (typeof this.asset === 'undefined' || this.asset === null) {
                this.log(Severity.Error, "In DifficultyAdapter.TargetScenario: Unable to recommend a scenario. Asset instance is not detected.");
                return null;
            }
            // [TODO] should check for valid adaptation IDs in the player and scenarios?
            if (typeof p_playerNode === 'undefined' || p_playerNode === null) {
                this.log(Severity.Error, "In DifficultyAdapter.TargetScenario: Null player node. Returning null.");
                return null;
            }
            if (typeof p_scenarioList === 'undefined' || p_scenarioList === null || p_scenarioList.length === 0) {
                this.log(Severity.Error, "In DifficultyAdapter.TargetScenario: Null or empty scenario node list. Returning null.");
                return null;
            }
            // [SC] calculate min and max possible ratings for candidate scenarios
            var ratingFI = this.calcTargetBetas(p_playerNode.Rating); // [SC][2016.12.14] fuzzy interval for rating
            // [SC] info for the scenarios within the core rating range and with the lowest play count
            var coreScenarios = new Array();
            var coreMinPlayCount = 0;
            // [SC] info for the scenarios within the support rating range and with the lowest play count
            var supportScenarios = new Array();
            var supportMinPlayCount = 0;
            // [SC] info for the closest scenarios outside of the fuzzy interval and the lowest play count
            var outScenarios = new Array();
            var outMinPlayCount = 0;
            var outMinDistance = 0;
            // [SC] iterate through the list of all scenarios
            for (var _i = 0, p_scenarioList_2 = p_scenarioList; _i < p_scenarioList_2.length; _i++) {
                var scenario = p_scenarioList_2[_i];
                var scenarioRating = scenario.Rating;
                var scenarioPlayCount = scenario.PlayCount;
                // [SC] the scenario rating is within the core rating range
                if (scenarioRating >= ratingFI[1] && scenarioRating <= ratingFI[2]) {
                    if (coreScenarios.length === 0 || scenarioPlayCount < coreMinPlayCount) {
                        coreScenarios.length = 0;
                        coreScenarios.push(scenario);
                        coreMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount === coreMinPlayCount) {
                        coreScenarios.push(scenario);
                    }
                }
                else if (scenarioRating >= ratingFI[0] && scenarioRating <= ratingFI[3]) {
                    if (supportScenarios.length === 0 || scenarioPlayCount < supportMinPlayCount) {
                        supportScenarios.length = 0;
                        supportScenarios.push(scenario);
                        supportMinPlayCount = scenarioPlayCount;
                    }
                    else if (scenarioPlayCount === supportMinPlayCount) {
                        supportScenarios.push(scenario);
                    }
                }
                else {
                    var distance = Math.min(Math.abs(scenarioRating - ratingFI[1]), Math.abs(scenarioRating - ratingFI[2]));
                    if (outScenarios.length === 0 || distance < outMinDistance) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinDistance = distance;
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount < outMinPlayCount) {
                        outScenarios.length = 0;
                        outScenarios.push(scenario);
                        outMinPlayCount = scenarioPlayCount;
                    }
                    else if (distance === outMinDistance && scenarioPlayCount === outMinPlayCount) {
                        outScenarios.push(scenario);
                    }
                }
            }
            if (coreScenarios.length > 0) {
                return coreScenarios[Misc.GetRandomInt(0, coreScenarios.length - 1)];
            }
            else if (supportScenarios.length > 0) {
                return supportScenarios[Misc.GetRandomInt(0, supportScenarios.length - 1)];
            }
            return outScenarios[Misc.GetRandomInt(0, outScenarios.length - 1)];
        };
        /// <summary>
        /// Calculates a fuzzy interval for a target beta.
        /// </summary>
        ///
        /// <param name="p_theta"> The theta. </param>
        ///
        /// <returns>
        /// A four-element array of ratings (in an ascending order) representing lower and upper bounds of the support and core
        /// </returns>
        DifficultyAdapter.prototype.calcTargetBetas = function (p_theta) {
            // [SC] mean of one-sided normal distribution from which to derive the lower bound of the support in a fuzzy interval
            var lower_distr_mean = this.TargetDistrMean - (this.FiSDMultiplier * this.TargetDistrSD);
            if (lower_distr_mean < Misc.DISTR_LOWER_LIMIT) {
                lower_distr_mean = Misc.DISTR_LOWER_LIMIT;
            }
            // [SC] mean of one-sided normal distribution from which to derive the upper bound of the support in a fuzzy interval
            var upper_distr_mean = this.TargetDistrMean + (this.FiSDMultiplier * this.TargetDistrSD);
            if (upper_distr_mean > Misc.DISTR_UPPER_LIMIT) {
                upper_distr_mean = Misc.DISTR_UPPER_LIMIT;
            }
            // [SC] the array stores four probabilities (in an ascending order) that represent lower and upper bounds of the support and core 
            var randNums = new Array(4);
            // [SC] calculating two probabilities as the lower and upper bounds of the core in a fuzzy interval
            var rndNum;
            for (var index = 1; index < 3; index++) {
                while (true) {
                    rndNum = Misc.GetNormal(this.TargetDistrMean, this.TargetDistrSD);
                    if (rndNum > this.TargetLowerLimit || rndNum < this.TargetUpperLimit) {
                        if (rndNum < Misc.DISTR_LOWER_LIMIT) {
                            rndNum = Misc.DISTR_LOWER_LIMIT;
                        }
                        else if (rndNum > Misc.DISTR_UPPER_LIMIT) {
                            rndNum = Misc.DISTR_UPPER_LIMIT;
                        }
                        break;
                    }
                }
                randNums[index] = rndNum;
            }
            // [SC] sorting lower and upper bounds of the core in an ascending order
            if (randNums[1] > randNums[2]) {
                var temp = randNums[1];
                randNums[1] = randNums[2];
                randNums[2] = temp;
            }
            // [SC] calculating probability that is the lower bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(lower_distr_mean, this.TargetDistrSD, true);
                if (rndNum < randNums[1]) {
                    if (rndNum < Misc.DISTR_LOWER_LIMIT) {
                        rndNum = Misc.DISTR_LOWER_LIMIT;
                    }
                    break;
                }
            }
            randNums[0] = rndNum;
            // [SC] calculating probability that is the upper bound of the support in a fuzzy interval
            while (true) {
                rndNum = Misc.GetNormalOneSide(upper_distr_mean, this.TargetDistrSD, false);
                if (rndNum > randNums[2]) {
                    if (rndNum > Misc.DISTR_UPPER_LIMIT) {
                        rndNum = Misc.DISTR_UPPER_LIMIT;
                    }
                    break;
                }
            }
            randNums[3] = rndNum;
            // [SC] tralsating probability bounds of a fuzzy interval into a beta values
            var lowerLimitBeta = p_theta + Math.log((1.0 - randNums[3]) / randNums[3]);
            var minBeta = p_theta + Math.log((1.0 - randNums[2]) / randNums[2]); // [SC][2016.10.07] a modified version of the equation from the original data; better suits the data
            var maxBeta = p_theta + Math.log((1.0 - randNums[1]) / randNums[1]);
            var upperLimitBeta = p_theta + Math.log((1.0 - randNums[0]) / randNums[0]);
            return new Array(lowerLimitBeta, minBeta, maxBeta, upperLimitBeta);
        };
        /// <summary>
        /// Returns target difficulty rating given a skill rating.
        /// </summary>
        /// <param name="p_theta">Skill rating.</param>
        /// <returns>Difficulty rating.</returns>
        DifficultyAdapter.prototype.TargetDifficultyRating = function (p_theta) {
            return p_theta + Math.log((1.0 - this.TargetDistrMean) / this.TargetDistrMean);
        };
        ////// END: functions for calculating matching scenario
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating expected and actual scores
        /// <summary>
        /// Calculates actual score given success/failure outcome and response time.
        /// </summary>
        ///
        /// <param name="p_correctAnswer">   should be either 0, for failure,
        ///                                         or 1 for success. </param>
        /// <param name="p_responseTime">    a response time in milliseconds. </param>validateResponseTime
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// actual score as a double.
        /// </returns>
        DifficultyAdapter.prototype.calcActualScore = function (p_correctAnswer, p_responseTime, p_itemMaxDuration) {
            if (!(this.validateCorrectAnswer(p_correctAnswer)
                && this.validateResponseTime(p_responseTime)
                && this.validateItemMaxDuration(p_itemMaxDuration))) {
                this.log(Severity.Error, "In DifficultyAdapter.calcActualScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
            // [SC][2017.01.03]
            if (p_responseTime > p_itemMaxDuration) {
                p_responseTime = p_itemMaxDuration;
                this.log(Severity.Warning, "In DifficultyAdapter.calcActualScore: Response time '" + p_responseTime
                    + "' exceeds the item's max time duration '" + p_itemMaxDuration
                    + "'. Setting the response time to item's max duration.");
            }
            var discrParam = this.getDiscriminationParam(p_itemMaxDuration);
            return (((2.0 * p_correctAnswer) - 1.0) * ((discrParam * p_itemMaxDuration) - (discrParam * p_responseTime)));
        };
        /// <summary>
        /// Calculates expected score given player's skill rating and item's
        /// difficulty rating.
        /// </summary>
        ///
        /// <param name="p_playerTheta">     player's skill rating. </param>
        /// <param name="p_itemBeta">        item's difficulty rating. </param>
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer. </param>
        ///
        /// <returns>
        /// expected score as a double.
        /// </returns>
        DifficultyAdapter.prototype.calcExpectedScore = function (p_playerTheta, p_itemBeta, p_itemMaxDuration) {
            if (!this.validateItemMaxDuration(p_itemMaxDuration)) {
                this.log(Severity.Error, "In DifficultyAdapter.calcExpectedScore: Cannot calculate score."
                    + " Invalid parameter detected. Returning error code '" + Misc.ERROR_CODE + "'.");
                return Misc.ERROR_CODE;
            }
            var weight = this.getDiscriminationParam(p_itemMaxDuration) * p_itemMaxDuration;
            var ratingDifference = p_playerTheta - p_itemBeta; // [SC][2016.01.07]
            if (ratingDifference === 0) {
                ratingDifference = 0.001;
            }
            var expFctr = Math.exp(2.0 * weight * ratingDifference); // [SC][2016.01.07]
            return (weight * ((expFctr + 1.0) / (expFctr - 1.0))) - (1.0 / ratingDifference); // [SC][2016.01.07]
        };
        /// <summary>
        /// Calculates discrimination parameter a_i necessary to calculate expected
        /// and actual scores.
        /// </summary>
        ///
        /// <param name="p_itemMaxDuration">  maximum duration of time given to a
        ///                                 player to provide an answer; should be
        ///                                 player. </param>
        ///
        /// <returns>
        /// discrimination parameter a_i as double number.
        /// </returns>
        DifficultyAdapter.prototype.getDiscriminationParam = function (p_itemMaxDuration) {
            return 1.0 / p_itemMaxDuration;
        };
        ////// END: functions for calculating expected and actual scores
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating rating uncertainties
        /// <summary>
        /// Calculates a new uncertainty for the theta rating.
        /// </summary>
        ///
        /// <param name="p_currThetaU">       current uncertainty value for theta
        ///                                 rating. </param>
        /// <param name="p_currDelayCount">   the current number of consecutive days
        ///                                 the player has not played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for theta rating.
        /// </returns>
        DifficultyAdapter.prototype.calcThetaUncertainty = function (p_currThetaU, p_currDelayCount) {
            var newThetaU = p_currThetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newThetaU < 0) {
                newThetaU = 0.0;
            }
            else if (newThetaU > 1) {
                newThetaU = 1.0;
            }
            return newThetaU;
        };
        /// <summary>
        /// Calculates a new uncertainty for the beta rating.
        /// </summary>
        ///
        /// <param name="p_currBetaU">        current uncertainty value for the beta
        ///                                 rating. </param>
        /// <param name="p_currDelayCount">   the current number of consecutive days
        ///                                 the item has not beein played. </param>
        ///
        /// <returns>
        /// a new uncertainty value for the beta rating.
        /// </returns>
        DifficultyAdapter.prototype.calcBetaUncertainty = function (p_currBetaU, p_currDelayCount) {
            var newBetaU = p_currBetaU - (1.0 / this.MaxPlay) + (p_currDelayCount / this.MaxDelay);
            if (newBetaU < 0) {
                newBetaU = 0.0;
            }
            else if (newBetaU > 1) {
                newBetaU = 1.0;
            }
            return newBetaU;
        };
        ////// END: functions for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating k factors
        /// <summary>
        /// Calculates a new K factor for theta rating
        /// </summary>
        ///
        /// <param name="p_currThetaU">         current uncertainty for the theta rating</param>
        /// <param name="p_currBetaU">          current uncertainty for the beta rating</param>
        /// <param name="p_playerPlayCount">    a number of past games played by the player</param>
        /// 
        /// <returns>a double value of a new K factor for the theta rating</returns>
        DifficultyAdapter.prototype.calcThetaKFctr = function (p_currThetaU, p_currBetaU, p_playerPlayCount) {
            // [SC] calculate K based on uncertainty
            var playerK = this.KConst * (1.0 + (this.KUp * p_currThetaU) - (this.KDown * p_currBetaU));
            // [SC] check if the player is in calibration phase
            if (this.PlayerCalLength > p_playerPlayCount) {
                playerK += this.PlayerCalK;
            }
            return playerK;
        };
        /// <summary>
        /// Calculates a new K factor for the beta rating
        /// </summary>
        /// 
        /// <param name="p_currThetaU">             current uncertainty fot the theta rating</param>
        /// <param name="p_currBetaU">              current uncertainty for the beta rating</param>
        /// <param name="p_scenarioPlayCount">      a number of past games played with this scenario</param>
        /// 
        /// <returns>a double value of a new K factor for the beta rating</returns>
        DifficultyAdapter.prototype.calcBetaKFctr = function (p_currThetaU, p_currBetaU, p_scenarioPlayCount) {
            // [SC] calculate K based on uncertainty
            var scenarioK = this.KConst * (1.0 + (this.KUp * p_currBetaU) - (this.KDown * p_currThetaU));
            // [SC] check if the scenario is in calibration phase
            if (this.ScenarioCalLength > p_scenarioPlayCount) {
                scenarioK += this.ScenarioCalK;
            }
            return scenarioK;
        };
        ////// END: functions for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: functions for calculating theta and beta ratings
        /// <summary>
        /// Calculates a new theta rating.
        /// </summary>
        ///
        /// <param name="p_currTheta">   current theta rating. </param>
        /// <param name="p_thetaKFctr">  K factor for the theta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for the new theta rating.
        /// </returns>
        DifficultyAdapter.prototype.calcTheta = function (p_currTheta, p_thetaKFctr, p_actualScore, p_expectScore) {
            return p_currTheta + (p_thetaKFctr * (p_actualScore - p_expectScore));
        };
        /// <summary>
        /// Calculates a new beta rating.
        /// </summary>
        ///
        /// <param name="p_currBeta">    current beta rating. </param>
        /// <param name="p_betaKFctr">   K factor for the beta rating. </param>
        /// <param name="p_actualScore"> actual performance score. </param>
        /// <param name="p_expectScore"> expected performance score. </param>
        ///
        /// <returns>
        /// a double value for new beta rating.
        /// </returns>
        DifficultyAdapter.prototype.calcBeta = function (p_currBeta, p_betaKFctr, p_actualScore, p_expectScore) {
            return p_currBeta + (p_betaKFctr * (p_expectScore - p_actualScore));
        };
        ////// END: functions for calculating theta and beta ratings
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: tester functions
        /// <summary>
        /// Tests the validity of the value representing correctness of player's answer.
        /// </summary>
        /// 
        /// <param name="p_correctAnswer"> Player's answer. </param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapter.prototype.validateCorrectAnswer = function (p_correctAnswer) {
            if (p_correctAnswer !== 0 && p_correctAnswer !== 1) {
                this.log(Severity.Error, "In DifficultyAdapter.validateCorrectAnswer: Accuracy should be either 0 or 1. "
                    + "Current value is '" + p_correctAnswer + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Tests the validity of the value representing the response time.
        /// </summary>
        /// 
        /// <param name="p_responseTime">Response time in milliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapter.prototype.validateResponseTime = function (p_responseTime) {
            if (p_responseTime <= 0) {
                this.log(Severity.Error, "In DifficultyAdapter.validateResponseTime: Response time cannot be 0 or negative. "
                    + "Current value is '" + p_responseTime + "'.");
                return false;
            }
            return true;
        };
        /// <summary>
        /// Tests the validity of the value representing the max amount of time to respond.
        /// </summary>
        /// 
        /// <param name="p_itemMaxDuration">Time duration in mulliseconds</param>
        /// 
        /// <returns>True if the value is valid</returns>
        DifficultyAdapter.prototype.validateItemMaxDuration = function (p_itemMaxDuration) {
            if (p_itemMaxDuration <= 0) {
                this.log(Severity.Error, "In DifficultyAdapter.validateItemMaxDuration: Max playable duration cannot be 0 or negative. "
                    + "Current value is '" + p_itemMaxDuration + "'.");
                return false;
            }
            return true;
        };
        ////// END: properties for the adapter type
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating target betas
        DifficultyAdapter.TARGET_DISTR_MEAN = 0.75; // [SC] default value for 'targetDistrMean' field
        DifficultyAdapter.TARGET_DISTR_SD = 0.1; // [SC] default value for 'targetDistrSD' field
        DifficultyAdapter.TARGET_LOWER_LIMIT = 0.50; // [SC] default value for 'targetLowerLimit' field
        DifficultyAdapter.TARGET_UPPER_LIMIT = 1.0; // [SC] default value for 'targetUpperLimit' field
        DifficultyAdapter.FI_SD_MULTIPLIER = 1.0; // [SC] multipler for SD used to calculate the means of normal distributions used to decide on lower and upper bounds of the supports in a fuzzy interval
        ////// END: const, fields, and properties for calculating target betas
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating rating uncertainties
        DifficultyAdapter.DEF_MAX_DELAY = 30; // [SC] The default value for the max number of days after which player's or item's undertainty reaches the maximum
        DifficultyAdapter.DEF_MAX_PLAY = 40; // [SC] The default value for the max number of administrations that should result in minimum uncertaint in item's or player's ratings
        ////// END: const, fields, and properties for calculating rating uncertainties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for calculating k factors
        DifficultyAdapter.DEF_K = 0.0075; // [SC] The default value for the K constant when there is no uncertainty
        DifficultyAdapter.DEF_K_UP = 4.0; // [SC] the default value for the upward uncertainty weight
        DifficultyAdapter.DEF_K_DOWN = 0.5; // [SC] The default value for the downward uncertainty weight
        ////// END: properties for calculating k factors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: const, fields, and properties for the calibration phase
        // [SC] The default value for the length (number of gameplays) of player's calibration
        DifficultyAdapter.DEF_PLAYER_CAL_LENGTH = 30;
        // [SC] The default value for the length (number of gameplays) of scenario's calibration
        DifficultyAdapter.DEF_SCENARIO_CAL_LENGTH = 30;
        // [SC] The default K factor for player's calibration
        DifficultyAdapter.DEF_PLAYER_CAL_K = 0.1;
        // [SC] The default K factor for scenario's calibration
        DifficultyAdapter.DEF_SCENARIO_CAL_K = 0.1;
        return DifficultyAdapter;
    }(TwoANS.BaseAdapter));
    TwoANS.DifficultyAdapter = DifficultyAdapter;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../Misc.ts"/>
///
/// <reference path="KSGenerator.ts"/>
///
var TwoANS;
(function (TwoANS) {
    //import KSGenerator = TwoANS.KSGenerator;
    /// <summary>
    /// Represents a category of problems of the same structure and difficulty
    /// </summary>
    var PCategory = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Initializes a new instance of the TwoA.KS.PCategory class.
        /// </summary>
        /// 
        /// <param name="id">       A unique identifier for the problem category. </param>
        /// <param name="rating">   Rating of the problem category. </param>
        function PCategory(p_id, p_rating) {
            if (typeof p_rating === 'undefined' || p_rating === null) {
                p_rating = TwoANS.KSGenerator.UNASSIGNED_RATING;
            }
            this.Id = p_id;
            this.Rating = p_rating;
        }
        Object.defineProperty(PCategory.prototype, "Id", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// A unique identifier for the problem category.
            /// </summary>
            get: function () {
                return this.id;
            },
            set: function (p_id) {
                this.id = p_id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PCategory.prototype, "Rating", {
            /// <summary>
            /// Rating of the problem category.
            /// </summary>
            get: function () {
                return this.rating;
            },
            set: function (p_rating) {
                this.rating = p_rating;
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods
        /// <summary>
        /// Returns true if the Id property was assigned a valid value.
        /// </summary>
        /// 
        /// <returns> boolean value </returns>
        PCategory.prototype.hasId = function () {
            return !Misc.IsNullOrEmpty(this.Id);
        };
        /// <summary>
        /// Returns true if the Rating property was assigned a numerical value.
        /// </summary>
        /// 
        /// <returns> boolean value </returns>
        PCategory.prototype.hasRating = function () {
            return this.Rating !== TwoANS.KSGenerator.UNASSIGNED_RATING;
        };
        /// <summary>
        /// an implementation of isSameId overloads
        /// </summary>
        PCategory.prototype.isSameId = function (x) {
            if (typeof x === "string") {
                return this.Id === x;
            }
            else if (x instanceof PCategory) {
                return this.Id === x.Id;
            }
            else {
                return false;
            }
        };
        return PCategory;
    }());
    TwoANS.PCategory = PCategory;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="PCategory.ts"/>
/// <reference path="KSGenerator.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /*import PCategory = TwoANS.PCategory;
    import KSGenerator = TwoANS.KSGenerator;*/
    /// <summary>
    /// Represents a rank in a rank order
    /// </summary>
    var Rank = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Constructor
        /// </summary>
        /// 
        /// <param name="p_rankIndex">    Rank index</param>
        /// <param name="p_categories">   List of categories assigned to this rank</param>
        function Rank(p_rankIndex, p_categories) {
            if (typeof p_rankIndex === 'undefined' || p_rankIndex === null) {
                p_rankIndex = TwoANS.KSGenerator.UNASSIGNED_RANK;
            }
            if (typeof p_categories === 'undefined' || p_categories === null) {
                p_categories = new Array();
            }
            this.categories = p_categories;
            this.RankIndex = p_rankIndex;
        }
        Object.defineProperty(Rank.prototype, "RankIndex", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// Getter/setter for rankIndex field.
            /// </summary>
            get: function () {
                return this.rankIndex;
            },
            set: function (p_rankIndex) {
                if (p_rankIndex === TwoANS.KSGenerator.UNASSIGNED_RANK || p_rankIndex > 0) {
                    this.rankIndex = p_rankIndex;
                }
                else {
                    throw new RangeError("Rank should be a non-zero positive value.");
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods
        /// <summary>
        /// Returns the number of categories in the rank.
        /// </summary>
        /// 
        /// <returns>Number of categories</returns>
        Rank.prototype.getCategoryCount = function () {
            return this.categories.length;
        };
        /// <summary>
        /// Adds the specified category into the rank.
        /// </summary>
        /// 
        /// <param name="p_category">PCategory object to add to the rank</param>
        Rank.prototype.addCategory = function (p_category) {
            this.categories.push(p_category);
        };
        /// <summary>
        /// implementation of removeCategory overloads.
        /// </summary>
        Rank.prototype.removeCategory = function (x) {
            var index = -1;
            if (typeof x === "string") {
                for (var tempIndex = 0; tempIndex < this.categories.length; tempIndex++) {
                    if (this.categories[tempIndex].isSameId(x)) {
                        index = tempIndex;
                        break;
                    }
                }
            }
            else if (x instanceof TwoANS.PCategory) {
                index = this.categories.indexOf(x, 0);
            }
            else {
                return false; // [TODO] unknown type log
            }
            if (index < 0) {
                return false;
            }
            this.categories.splice(index, 1);
            return true;
        };
        /// <summary>
        /// Removes the category at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if a category was removed successfully.</returns>
        Rank.prototype.removeCategoryAt = function (p_index) {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                this.categories.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Get category at specified index.
        /// </summary>
        /// 
        /// <param name="p_index">index indicating category position</param>
        /// 
        /// <returns></returns>
        Rank.prototype.getCategoryAt = function (p_index) {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                return this.categories[p_index];
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Returns the list of all categories in the rank.
        /// </summary>
        /// 
        /// <returns>List of categories</returns>
        Rank.prototype.getCategories = function () {
            return this.categories;
        };
        /// <summary>
        /// Retrieve category with specified ID.
        /// </summary>
        /// 
        /// <param name="p_id">Category ID</param>
        /// 
        /// <returns>PCategory object</returns>
        Rank.prototype.getCategory = function (p_id) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.isSameId(p_id)) {
                    return category;
                }
            }
            return null;
        };
        /// <summary>
        /// A function that finds all unique subsets categories in the rank.
        /// </summary>
        /// 
        /// <returns>List of lists of categories</returns>
        Rank.prototype.getSubsets = function () {
            var subsets = [];
            var baseList = new Array();
            this.getSubsetsRecursive(baseList, this.categories, subsets);
            return subsets;
        };
        /// <summary>
        /// A recursive function that finds all unique subsets (2^|List|) from a given sourceList.
        /// </summary>
        /// 
        /// <param name="p_baseList">     Initially an empty list.</param>
        /// <param name="p_sourceList">   Initially a list of all items to divided into subsets.</param>
        /// <param name="p_subsets">      Contains all identified subsets.</param>
        Rank.prototype.getSubsetsRecursive = function (p_baseList, p_sourceList, p_subsets) {
            for (var index = 0; index < p_sourceList.length; index++) {
                var newBaseList = new Array();
                for (var _i = 0, p_baseList_1 = p_baseList; _i < p_baseList_1.length; _i++) {
                    var category = p_baseList_1[_i];
                    newBaseList.push(category);
                }
                newBaseList.push(p_sourceList[index]);
                p_subsets.push(newBaseList);
                if (index + 1 < p_sourceList.length) {
                    var newSourceList = new Array();
                    for (var indexTwo = index + 1; indexTwo < p_sourceList.length; indexTwo++) {
                        newSourceList.push(p_sourceList[indexTwo]);
                    }
                    this.getSubsetsRecursive(newBaseList, newSourceList, p_subsets);
                }
            }
        };
        return Rank;
    }());
    TwoANS.Rank = Rank;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="Rank.ts"/>
/// <reference path="KSGenerator.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /*import Rank = TwoANS.Rank;
    import KSGenerator = TwoANS.KSGenerator;*/
    /// <summary>
    /// Represents a rank order from which a knowledge structure can be constructed
    /// </summary>
    var RankOrder = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructors
        /// <summary>
        /// Constructor
        /// </summary>
        /// 
        /// <param name="p_threshold">threshold used to construct this rank order</param>
        function RankOrder(p_threshold) {
            if (typeof p_threshold === 'undefined' || p_threshold === null) {
                p_threshold = TwoANS.KSGenerator.UNASSIGNED_THRESHOLD;
            }
            this.ranks = new Array();
            this.Threshold = p_threshold;
        }
        Object.defineProperty(RankOrder.prototype, "Threshold", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// Getter/setter for the threshold field.
            /// </summary>
            get: function () {
                return this.threshold;
            },
            set: function (p_threshold) {
                if (TwoANS.KSGenerator.validThreshold(p_threshold)) {
                    this.threshold = p_threshold;
                }
                else {
                    throw new RangeError("Cannot set Threshold value in RankOrder. The value is invalid.");
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: methods
        /// <summary>
        /// Returns true if threshold was explicitly set to a value.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        RankOrder.prototype.hasThreshold = function () {
            return this.Threshold !== TwoANS.KSGenerator.UNASSIGNED_THRESHOLD;
        };
        /// <summary>
        /// Returns the number of ranks in the rank order.
        /// </summary>
        /// 
        /// <returns>interger value</returns>
        RankOrder.prototype.getRankCount = function () {
            return this.ranks.length;
        };
        /// <summary>
        /// Adds a new rank to the rank order.
        /// </summary>
        /// 
        /// <param name="p_rank">     Rank object to be added to the rank order.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was added.</param>
        RankOrder.prototype.addRank = function (p_rank, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            this.ranks.push(p_rank);
            if (p_sortFlag) {
                this.sortAscending();
            }
        };
        /// <summary>
        /// Remove a given rank object from the rank order.
        /// </summary>
        /// 
        /// <param name="p_rank">     Rank object to be removed.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was removed.</param>
        /// 
        /// <returns>True if Rank object was removed successfully.</returns>
        RankOrder.prototype.removeRank = function (p_rank, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            var index = this.ranks.indexOf(p_rank, 0);
            if (index < 0) {
                return false;
            }
            this.ranks.splice(index, 1);
            if (p_sortFlag) {
                this.sortAscending();
            }
            return true;
        };
        /// <summary>
        /// Removes a rank with a specified list index. Note that rank's list index is not necessarily same as the rank's index in rank order.
        /// </summary>
        /// 
        /// <param name="p_index">    List index of a rank to be removed.</param>
        /// <param name="p_sortFlag"> If set to true then ranks are sorted by indices in a ascending order after the new rank was removed.</param>
        /// 
        /// <returns>True if a rank was successfully removed.</returns>
        RankOrder.prototype.removeRankAt = function (p_index, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            if (this.getRankCount() > p_index && p_index >= 0) {
                this.ranks.splice(p_index, 1);
                if (p_sortFlag) {
                    this.sortAscending();
                }
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Retrieve Rank object at specified position in a list (list index).
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>Rank object, or null if index is out of range.</returns>
        RankOrder.prototype.getRankAt = function (p_index) {
            if (this.getRankCount() > p_index && p_index >= 0) {
                return this.ranks[p_index];
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Retrieve the list of all ranks in the rank order.
        /// </summary>
        /// 
        /// <returns>List of all rank objects.</returns>
        RankOrder.prototype.getRanks = function () {
            return this.ranks;
        };
        /// <summary>
        /// Sorts ranks by rank indices in an ascending order.
        /// </summary>
        RankOrder.prototype.sortAscending = function () {
            this.ranks.sort(function (rankOne, rankTwo) {
                if (rankOne.RankIndex < rankTwo.RankIndex) {
                    return -1;
                }
                else if (rankOne.RankIndex > rankTwo.RankIndex) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        return RankOrder;
    }());
    TwoANS.RankOrder = RankOrder;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../Misc.ts"/>
///
/// <reference path="PCategory.ts"/>
/// <reference path="KSGenerator.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /*import KSGenerator = TwoANS.KSGenerator;
    import PCategory = TwoANS.PCategory;*/
    /// <summary>
    /// Represents a knowledge state
    /// </summary>
    var KState = /** @class */ (function () {
        ////// END: properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Private constructor
        /// </summary>
        /// 
        /// <param name="p_id">           A unique ID for the state</param>
        /// <param name="p_stateType">    Type of the state</param>
        /// <param name="p_categories">   A list of ategories that comprise the state</param>
        function KState(p_id, p_stateType, p_categories) {
            if (typeof p_stateType === 'undefined' || p_stateType === null) {
                p_stateType = TwoANS.KSGenerator.CORE_STATE;
            }
            if (typeof p_categories === 'undefined' || p_categories === null) {
                p_categories = new Array();
            }
            this.categories = p_categories;
            this.prevStates = new Array();
            this.nextStates = new Array();
            this.Id = p_id;
            this.StateType = p_stateType;
        }
        Object.defineProperty(KState.prototype, "Id", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: properties
            /// <summary>
            /// ID for the state
            /// </summary>
            get: function () {
                return this.id;
            },
            set: function (p_id) {
                this.id = p_id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KState.prototype, "StateType", {
            /// <summary>
            /// Getter/setter for the stateType field
            /// </summary>
            get: function () {
                return this.stateType;
            },
            set: function (p_stateType) {
                if (!(p_stateType === TwoANS.KSGenerator.ROOT_STATE
                    || p_stateType === TwoANS.KSGenerator.CORE_STATE
                    || p_stateType === TwoANS.KSGenerator.EXPANDED_STATE)) {
                    throw new TypeError("Invalid state type.");
                }
                else {
                    this.stateType = p_stateType;
                    if (p_stateType === TwoANS.KSGenerator.ROOT_STATE) {
                        // [SC] clearing both arrays
                        this.prevStates.splice(0, this.prevStates.length); // [SC] root state cannot have prerequisite states
                        this.nextStates.splice(0, this.nextStates.length); // [SC] root state is always an empty state
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for id
        /// <summary>
        /// Returns true if the Id property was assigned a valid value.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        KState.prototype.hasId = function () {
            return !Misc.IsNullOrEmpty(this.Id);
        };
        /// <summary>
        /// implementation of isSameId overloads.
        /// </summary>
        KState.prototype.isSameId = function (x) {
            if (typeof x === "string") {
                return this.Id === x;
            }
            else if (x instanceof KState) {
                return this.Id === x.Id;
            }
            else {
                return false;
            }
        };
        ////// END: Methods for id
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for previous states
        /// <summary>
        /// Returns the number of prerequisite states.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        KState.prototype.getPrevStateCount = function () {
            return this.prevStates.length;
        };
        /// <summary>
        /// Adds a specified prerequisite state.
        /// </summary>
        /// 
        /// <param name="p_prevState">The state to be added to the list of prerequisite states</param>
        KState.prototype.addPrevState = function (p_prevState) {
            if (this.StateType !== TwoANS.KSGenerator.ROOT_STATE) {
                this.prevStates.push(p_prevState);
            }
        };
        /// <summary>
        /// Removes the specified prerequisite state.
        /// </summary>
        /// 
        /// <param name="p_prevState">A state to be removed from the list of prerequisite states</param>
        /// 
        /// <returns>True if the state was removed successfully.</returns>
        KState.prototype.removePrevState = function (p_prevState) {
            var index = this.prevStates.indexOf(p_prevState, 0);
            if (index < 0) {
                return false;
            }
            this.prevStates.splice(index, 1);
            return true;
        };
        /// <summary>
        /// Removes the prerequisite state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        KState.prototype.removePrevStateAt = function (p_index) {
            if (this.getPrevStateCount() > p_index && p_index >= 0) {
                this.prevStates.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Retrieve the list of all prerequisite states.
        /// </summary>
        /// 
        /// <returns>A list of KState objects</returns>
        KState.prototype.getPrevStates = function () {
            return this.prevStates;
        };
        /// <summary>
        /// Retrieves a prerequisite state at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        KState.prototype.getPrevStateAt = function (p_index) {
            if (this.getPrevStateCount() > p_index && p_index >= 0) {
                return this.prevStates[p_index];
            }
            else {
                return null;
            }
        };
        ////// END: Methods for previous states
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for next states
        /// <summary>
        /// Returns the number of succeeding states.
        /// </summary>
        /// 
        /// <returns>integer</returns>
        KState.prototype.getNextStateCount = function () {
            return this.nextStates.length;
        };
        /// <summary>
        /// Adds a specified state to the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_nextState">State to be added to the list of succeeding states</param>
        KState.prototype.addNextState = function (p_nextState) {
            this.nextStates.push(p_nextState);
        };
        /// <summary>
        /// Removes the specified state from the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_nextState">State to remove</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        KState.prototype.removeNextState = function (p_nextState) {
            var index = this.nextStates.indexOf(p_nextState, 0);
            if (index < 0) {
                return false;
            }
            this.nextStates.splice(index, 1);
            return true;
        };
        /// <summary>
        /// Removes a state at specified index in the list of succeeding states.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        KState.prototype.removeNextStateAt = function (p_index) {
            if (this.getNextStateCount() > p_index && p_index >= 0) {
                this.nextStates.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Retrieve the list of all states succeding this state.
        /// </summary>
        /// 
        /// <returns>A list of KState objects</returns>
        KState.prototype.getNextStates = function () {
            return this.nextStates;
        };
        /// <summary>
        /// Retrieve a succeeding state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        KState.prototype.getNextStateAt = function (p_index) {
            if (this.getNextStateCount() > p_index && p_index >= 0) {
                return this.nextStates[p_index];
            }
            else {
                return null;
            }
        };
        ////// END: Methods for next states
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for categories
        /// <summary>
        /// Get the number of categories in the knowledge state.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        KState.prototype.getCategoryCount = function () {
            return this.categories.length;
        };
        /// <summary>
        /// Add a new category to the knowledge state.
        /// </summary>
        /// 
        /// <param name="p_newCategory">PCategory objectt</param>
        /// 
        /// <returns>true if category was added; false if a category with the same ID already exists in the list</returns>
        KState.prototype.addCategory = function (p_newCategory) {
            // [SC] a root state is always an empty state
            if (this.StateType === TwoANS.KSGenerator.ROOT_STATE) {
                return false;
            }
            // [SC] verifying if a category with the same ID already exists
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.isSameId(p_newCategory)) {
                    return false;
                }
            }
            this.categories.push(p_newCategory);
            return true;
        };
        /// <summary>
        /// Implementation of removeCategory overloads.
        /// </summary>
        KState.prototype.removeCategory = function (x) {
            var index = -1;
            if (typeof x === "string") {
                for (var tempIndex = 0; tempIndex < this.categories.length; tempIndex++) {
                    if (this.categories[tempIndex].isSameId(x)) {
                        index = tempIndex;
                        break;
                    }
                }
            }
            else if (x instanceof TwoANS.PCategory) {
                index = this.categories.indexOf(x, 0);
            }
            else {
                return false; // [TODO] unknown type log
            }
            if (index < 0) {
                return false; // [TODO] log
            }
            this.categories.splice(index, 1);
            return true;
        };
        /// <summary>
        /// Remove category by its list index.
        /// </summary>
        /// 
        /// <param name="p_index">index in a list</param>
        /// 
        /// <returns>true if a category was removed</returns>
        KState.prototype.removeCategoryAt = function (p_index) {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                this.categories.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Get the list of all categories in the knowledge state.
        /// </summary>
        /// 
        /// <returns>List of PCategory objects</returns>
        KState.prototype.getCategories = function () {
            return this.categories;
        };
        /// <summary>
        /// Get a category by its list index.
        /// </summary>
        /// 
        /// <param name="p_index">index in a list</param>
        /// 
        /// <returns>PCategory object, or null if index is out of range</returns>
        KState.prototype.getCategoryAt = function (p_index) {
            if (this.getCategoryCount() > p_index && p_index >= 0) {
                return this.categories[p_index];
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Get a category by it ID.
        /// </summary>
        /// 
        /// <param name="p_id">category ID</param>
        /// 
        /// <returns>PCategory object or null</returns>
        KState.prototype.getCategory = function (p_id) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (category.isSameId(p_id)) {
                    return category;
                }
            }
            return null;
        };
        ////// END: Methods for categories
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Other methods
        /// <summary>
        /// Returns a string representation of this state.
        /// </summary>
        /// 
        /// <returns>string</returns>
        KState.prototype.ToString = function () {
            var name = "(";
            var sepFlag = false;
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var cat = _a[_i];
                if (sepFlag) {
                    name += ",";
                }
                else {
                    sepFlag = true;
                }
                name += cat.Id;
            }
            return name + ")";
        };
        /// <summary>
        /// Returns true if the state is subset of a state specified as parameter
        /// </summary>
        /// 
        /// <param name="p_state">KState object</param>
        /// 
        /// <returns>boolean</returns>
        KState.prototype.isSubsetOf = function (p_state) {
            for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
                var category = _a[_i];
                if (p_state.getCategory(category.Id) === null) {
                    return false;
                }
            }
            return true;
        };
        return KState;
    }());
    TwoANS.KState = KState;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="KSGenerator.ts"/>
/// <reference path="KState.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /*import KSGenerator = TwoANS.KSGenerator;
    import KState = TwoANS.KState;*/
    /// <summary>
    /// Represents a rank in a knowledge structure
    /// </summary>
    var KSRank = /** @class */ (function () {
        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constructor
        /// <summary>
        /// Constructor.
        /// </summary>
        /// 
        /// <param name="p_rankIndex">    Rank index</param>
        /// <param name="p_states">       List of states of this rank</param>
        function KSRank(p_rankIndex, p_states) {
            if (typeof p_rankIndex === 'undefined' || p_rankIndex === null) {
                p_rankIndex = TwoANS.KSGenerator.UNASSIGNED_RANK;
            }
            if (typeof p_states === 'undefined' || p_states === null) {
                p_states = new Array();
            }
            this.states = p_states;
            this.RankIndex = p_rankIndex;
        }
        Object.defineProperty(KSRank.prototype, "RankIndex", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Properties
            /// <summary>
            /// Getter/setter for the index of the rank in the knowledge structure.
            /// </summary>
            get: function () {
                return this.rankIndex;
            },
            set: function (p_rankIndex) {
                if (p_rankIndex === TwoANS.KSGenerator.UNASSIGNED_RANK || p_rankIndex >= 0) {
                    this.rankIndex = p_rankIndex;
                    if (p_rankIndex === 0) {
                        this.states.splice(0, this.states.length);
                        var rootState = new TwoANS.KState(null, TwoANS.KSGenerator.ROOT_STATE, null);
                        rootState.Id = TwoANS.KSGenerator.getStateID(p_rankIndex, 1);
                        this.states.push(rootState);
                    }
                }
                else {
                    throw new RangeError("Rank should be a non-zero positive value.");
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods
        /// <summary>
        /// Returns the number of states in the rank.
        /// </summary>
        /// 
        /// <returns>state count</returns>
        KSRank.prototype.getStateCount = function () {
            return this.states.length;
        };
        /// <summary>
        /// Add a specified to this rank.
        /// </summary>
        /// 
        /// <param name="p_state">KState object to add to the rank</param>
        /// 
        /// <returns>True if the state was added successfully</returns>
        KSRank.prototype.addState = function (p_state) {
            if (this.RankIndex === 0) {
                return false;
            }
            if (this.RankIndex !== p_state.getCategoryCount()) {
                return false;
            }
            // [SC] verify that the same state does not already exist; verification is done at PCategory reference level
            for (var _i = 0, _a = this.states; _i < _a.length; _i++) {
                var stateOne = _a[_i];
                var subsetFlag = true;
                if (p_state.getCategoryCount() === stateOne.getCategoryCount()) {
                    for (var _b = 0, _c = p_state.getCategories(); _b < _c.length; _b++) {
                        var category = _c[_b];
                        if (stateOne.getCategory(category.Id) === null) {
                            subsetFlag = false;
                            break;
                        }
                    }
                    if (subsetFlag) {
                        return false;
                    }
                }
            }
            this.states.push(p_state);
            return true;
        };
        /// <summary>
        /// Removes the specified state from this rank.
        /// </summary>
        /// 
        /// <param name="p_state">KState object to remove</param>
        /// 
        /// <returns>True if the state was removed successfully</returns>
        KSRank.prototype.removeState = function (p_state) {
            var index = this.states.indexOf(p_state, 0);
            if (index < 0) {
                return false; // [TODO] log
            }
            this.states.splice(index, 1);
            return true;
        };
        /// <summary>
        /// Removes a state at the specified index of the list.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>True if a state was removed successfully</returns>
        KSRank.prototype.removeStateAt = function (p_index) {
            if (this.RankIndex === 0) {
                return false;
            }
            if (this.getStateCount() > p_index && p_index >= 0) {
                this.states.splice(p_index, 1);
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Retrieve state at the specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KState object, or null if index is out of range</returns>
        KSRank.prototype.getStateAt = function (p_index) {
            if (this.getStateCount() > p_index && p_index >= 0) {
                return this.states[p_index];
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Retrieve the list of all states
        /// </summary>
        /// 
        /// <returns>List of KState objects</returns>
        KSRank.prototype.getStates = function () {
            return this.states;
        };
        return KSRank;
    }());
    TwoANS.KSRank = KSRank;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="RankOrder.ts"/>
/// <reference path="KSRank.ts"/>
///
var TwoANS;
(function (TwoANS) {
    /*import RankOrder = TwoANS.RankOrder;
    import KSRank = TwoANS.KSRank;*/
    /// <summary>
    /// Represents a knowledge structure
    /// </summary>
    var KStructure = /** @class */ (function () {
        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructor
        /// <summary>
        /// Constructor initializes an empty list of knowledge structure ranks.
        /// </summary>
        /// 
        /// <param name="p_rankOrder">RankOrder object that is used to construct the knowledge structure</param>
        function KStructure(p_rankOrder) {
            this.rankOrder = p_rankOrder;
            this.ranks = new Array();
        }
        Object.defineProperty(KStructure.prototype, "rankOrder", {
            ////// END: Fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Properties
            /// <summary>
            /// A rank order from which the knowledge structure is constructed.
            /// </summary>
            get: function () {
                return this.rankorder;
            },
            set: function (p_rankorder) {
                this.rankorder = p_rankorder;
            },
            enumerable: true,
            configurable: true
        });
        ////// END: Constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods
        /// <summary>
        /// Returns true if there is a rankOrder with at least one rank.
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        KStructure.prototype.hasRankOrder = function () {
            return !(typeof this.rankOrder === 'undefined' || this.rankOrder === null || this.rankOrder.getRankCount() === 0);
        };
        /// <summary>
        /// Returns true if the knowledge structure has at least one rank
        /// </summary>
        /// 
        /// <returns>boolean</returns>
        KStructure.prototype.hasRanks = function () {
            return !(typeof this.ranks === 'undefined' || this.ranks === null || this.getRankCount() === 0);
        };
        /// <summary>
        /// Returns the number of ranks in the knowledge structure.
        /// </summary>
        /// 
        /// <returns>number of ranks</returns>
        KStructure.prototype.getRankCount = function () {
            return this.ranks.length;
        };
        /// <summary>
        /// Adds a specified rank into the knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_rank">     KSRank object to add into the knowledge structure</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is added.</param>
        KStructure.prototype.addRank = function (p_rank, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            this.ranks.push(p_rank);
            if (p_sortFlag) {
                this.sortAscending();
            }
        };
        /// <summary>
        /// Removes the specified rank from the knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_rank">     KSRank object to be removed from the knowledge structure.</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is removed</param>
        /// 
        /// <returns>True if the rank was removed successfully.</returns>
        KStructure.prototype.removeRank = function (p_rank, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            var index = this.ranks.indexOf(p_rank, 0);
            if (index < 0) {
                return false;
            }
            this.ranks.splice(index, 1);
            if (p_sortFlag) {
                this.sortAscending();
            }
            return true;
        };
        /// <summary>
        /// Removes a rank at the specified list index. Note that rank's list index is not necessarily same as the rank's index in a knowledge structure.
        /// </summary>
        /// 
        /// <param name="p_index">    List index of a rank to be removed.</param>
        /// <param name="p_sortFlag"> If true, ranks are sorted by ascending order of rank indices after the new rank is removed.</param>
        /// 
        /// <returns>True if the rank was removed successfully</returns>
        KStructure.prototype.removeRankAt = function (p_index, p_sortFlag) {
            if (p_sortFlag === void 0) { p_sortFlag = true; }
            if (this.getRankCount() > p_index && p_index >= 0) {
                this.ranks.splice(p_index, 1);
                if (p_sortFlag) {
                    this.sortAscending();
                }
                return true;
            }
            else {
                return false;
            }
        };
        /// <summary>
        /// Retrieve KSRank object at specified list index.
        /// </summary>
        /// 
        /// <param name="p_index">List index</param>
        /// 
        /// <returns>KSRank object, or null if index is out of range.</returns>
        KStructure.prototype.getRankAt = function (p_index) {
            if (this.getRankCount() > p_index && p_index >= 0) {
                return this.ranks[p_index];
            }
            else {
                return null;
            }
        };
        /// <summary>
        /// Returns the list of all ranks in the knowledge structure.
        /// </summary>
        /// 
        /// <returns>List of KSRank objects</returns>
        KStructure.prototype.getRanks = function () {
            return this.ranks;
        };
        /// <summary>
        /// Sorts ranks in the knowledge structure by ascending order of rank indices.
        /// </summary>
        KStructure.prototype.sortAscending = function () {
            this.ranks.sort(function (rankOne, rankTwo) {
                if (rankOne.RankIndex < rankTwo.RankIndex) {
                    return -1;
                }
                else if (rankOne.RankIndex > rankTwo.RankIndex) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        return KStructure;
    }());
    TwoANS.KStructure = KStructure;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../../RageAssetManager/ILog.ts"/>
///
/// <reference path="RankOrder.ts"/>
/// <reference path="Rank.ts"/>
/// <reference path="PCategory.ts"/>
/// <reference path="KStructure.ts"/>
/// <reference path="KState.ts"/>
/// <reference path="KSRank.ts"/>
///
/// <reference path="../TwoA.ts"/>
/// 
var TwoANS;
(function (TwoANS) {
    var Severity = AssetPackage.Severity;
    /// <summary>
    /// The main class for generating a knowledge structure from diifficulty ratings.
    /// </summary>
    var KSGenerator = /** @class */ (function () {
        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructors
        /// <summary>
        /// Initializes a new instance of the TwoA.KSGenerator class with a custom threshold.
        /// </summary>
        /// 
        /// <param name="p_asset">        The asset. </param>
        /// <param name="p_threshold">    A custom threshold value. </param>
        function KSGenerator(p_asset, p_threshold) {
            if (typeof p_threshold === 'undefined' || p_threshold === null) {
                p_threshold = KSGenerator.DEFAULT_THRESHOLD;
            }
            this.asset = p_asset;
            this.Threshold = p_threshold;
            this.SameProbability = KSGenerator.DEFAULT_SAME_PROBABILITY;
        }
        Object.defineProperty(KSGenerator.prototype, "Threshold", {
            ////// END: Fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Properties
            /// <summary>
            /// getter/setter for threshold variable
            /// </summary>
            get: function () {
                return this.threshold;
            },
            set: function (p_threshold) {
                if (KSGenerator.validThreshold(p_threshold)) {
                    this.threshold = p_threshold;
                }
                else {
                    throw new RangeError("Threshold value should have range [" + KSGenerator.MIN_THRESHOLD + ", " + KSGenerator.MAX_THRESHOLD + ").");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KSGenerator.prototype, "SameProbability", {
            /// <summary>
            /// Getter/Setter for sameProbability variable.
            /// It is strongly advised not to change it from the default value. The setter is provide for future uses where a different estimation algorithm might be used.
            /// </summary>
            get: function () {
                return this.sameProbability;
            },
            set: function (p_sameProbability) {
                if (p_sameProbability >= KSGenerator.MIN_SAME_PROBABILITY && p_sameProbability <= KSGenerator.MAX_SAME_PROBABILITY) {
                    this.sameProbability = p_sameProbability;
                }
                else {
                    throw new RangeError("Same probability should have range ["
                        + KSGenerator.MIN_SAME_PROBABILITY + ","
                        + KSGenerator.MAX_SAME_PROBABILITY + "].");
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KSGenerator.prototype, "Asset", {
            /// <summary>
            /// Getter/setter for the instance of the TwoA asset
            /// </summary>
            get: function () {
                return this.asset;
            },
            set: function (p_asset) {
                this.asset = p_asset;
            },
            enumerable: true,
            configurable: true
        });
        ////// END: Constructors
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for creating a knowledge structure
        /// <summary>
        /// Expands the specified knowledge structure with new states by applying Rule 2.
        /// </summary>
        /// 
        /// <param name="p_ks">Knowledge structure to be expanded with new states.</param>
        /// 
        /// <returns>Expanded knowledge structure</returns>
        KSGenerator.prototype.createExpandedKStructure = function (p_ks) {
            // Implements Rule 2:  Given a set GR of problems with a rank R and a set GR-1 of problems with rank R-1, 
            // a union of any subset of GR with any knowledge state KR-1 containing at least one problem from GR-1 is a state.
            // [SC] make sure the knowledge structure object is not null
            if (typeof p_ks === 'undefined' && p_ks === null) {
                this.Log(AssetPackage.Severity.Error, "createExpandedKStructure: KStructure object is null. Returning from method.");
                return;
            }
            // [SC] make sure the rank order of categories is available
            if (!p_ks.hasRankOrder()) {
                this.Log(Severity.Error, "createExpandedKStructure: KStructure object contains no rank order. Returning from method.");
                return;
            }
            // [SC] make sure the knowledge structure has ranks
            if (!p_ks.hasRanks()) {
                this.Log(Severity.Error, "createExpandedKStructure: KStructure object contains no ranks with states. Returning from method.");
                return;
            }
            var prevRank = null;
            for (var _i = 0, _a = p_ks.rankOrder.getRanks(); _i < _a.length; _i++) {
                var rank = _a[_i];
                if (prevRank !== null) {
                    // [SC] getting all unique subsets of categories in this rank
                    var subsets = rank.getSubsets();
                    // [SC] retrieve all KS ranks with minimum required state size
                    var ksRanks = new Array();
                    for (var _b = 0, _c = p_ks.getRanks(); _b < _c.length; _b++) {
                        var ksRank = _c[_b];
                        if (ksRank.RankIndex >= prevRank.RankIndex) {
                            ksRanks.push(ksRank);
                        }
                    }
                    if (ksRanks.length === 0) {
                        continue;
                    }
                    // [SC] this list contains all relevant states that contain any category from GR-1
                    var states = new Array();
                    for (var _d = 0, ksRanks_1 = ksRanks; _d < ksRanks_1.length; _d++) {
                        var ksRank = ksRanks_1[_d];
                        // [SC] From given KS rank, retrieve all states that contain at least one problem from GR-1 and add them to the common list
                        for (var _e = 0, _f = ksRank.getStates(); _e < _f.length; _e++) {
                            var kState = _f[_e];
                            for (var _g = 0, _h = kState.getCategories(); _g < _h.length; _g++) {
                                var category = _h[_g];
                                if (prevRank.getCategory(category.Id) !== null) {
                                    states.push(kState);
                                    break;
                                }
                            }
                        }
                    }
                    if (states.length == 0) {
                        continue;
                    }
                    // [SC] iterate through subsets of GR
                    for (var _j = 0, subsets_1 = subsets; _j < subsets_1.length; _j++) {
                        var subset = subsets_1[_j];
                        for (var _k = 0, states_1 = states; _k < states_1.length; _k++) {
                            var state = states_1[_k];
                            // [SC] if state already contains the entire subset then skip it
                            var skipStateFlag = true;
                            for (var _l = 0, _m = state.getCategories(); _l < _m.length; _l++) {
                                var categoryOne = _m[_l];
                                var containsFlag = false;
                                for (var _o = 0, subset_1 = subset; _o < subset_1.length; _o++) {
                                    var categoryTwo = subset_1[_o];
                                    if (categoryOne.Id === categoryTwo.Id) {
                                        containsFlag = true;
                                        break;
                                    }
                                }
                                if (!containsFlag) {
                                    skipStateFlag = false;
                                    break;
                                }
                            }
                            if (skipStateFlag) {
                                continue;
                            }
                            // [SC] creating a new state
                            var newState = new TwoANS.KState(null, KSGenerator.EXPANDED_STATE, null);
                            for (var _p = 0, _q = state.getCategories(); _p < _q.length; _p++) {
                                var category = _q[_p];
                                newState.addCategory(category);
                            }
                            for (var _r = 0, subset_2 = subset; _r < subset_2.length; _r++) {
                                var category = subset_2[_r];
                                newState.addCategory(category);
                            }
                            // [SC] add the new state to the respective rank
                            var newStateRank = void 0;
                            for (var _s = 0, _t = p_ks.getRanks(); _s < _t.length; _s++) {
                                var ksRank = _t[_s];
                                if (ksRank.RankIndex === newState.getCategoryCount()) {
                                    newStateRank = ksRank;
                                    break;
                                }
                            }
                            if (newStateRank.addState(newState)) {
                                newState.Id = KSGenerator.getStateID(newStateRank.RankIndex, newStateRank.getStateCount());
                                // [SC] find immediate lower and higher ranks
                                var prevStateRank = null;
                                var nextStateRank = null;
                                for (var _u = 0, _v = p_ks.getRanks(); _u < _v.length; _u++) {
                                    var ksRank = _v[_u];
                                    if (ksRank.RankIndex === newState.getCategoryCount() - 1) {
                                        prevStateRank = ksRank;
                                    }
                                    else if (ksRank.RankIndex === newState.getCategoryCount() + 1) {
                                        nextStateRank = ksRank;
                                    }
                                    if (prevStateRank !== null && nextStateRank !== null) {
                                        break;
                                    }
                                }
                                // [SC] link the new state with previous states of lower rank
                                if (prevStateRank !== null) {
                                    for (var _w = 0, _x = prevStateRank.getStates(); _w < _x.length; _w++) {
                                        var prevState = _x[_w];
                                        if (prevState.isSubsetOf(newState)) {
                                            prevState.addNextState(newState);
                                            newState.addPrevState(prevState);
                                        }
                                    }
                                }
                                // [SC] link the new state with next states of higher rank
                                if (nextStateRank !== null) {
                                    for (var _y = 0, _z = nextStateRank.getStates(); _y < _z.length; _y++) {
                                        var nextState = _z[_y];
                                        if (newState.isSubsetOf(nextState)) {
                                            nextState.addPrevState(newState);
                                            newState.addNextState(nextState);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                prevRank = rank;
            }
        };
        /// <summary>
        /// Generates a knowledge structure (KStructure object) from a ranked order (RankOrder object) by applying Rule 1.
        /// </summary>
        /// 
        /// <param name="p_rankOrder">RankOrder object that is used to generate a knowledge structure.</param>
        /// 
        /// <returns>KStructure object, or null if error occured.</returns>
        KSGenerator.prototype.createKStructure = function (p_rankOrder) {
            // Implements Rule 1: Given a set GR of problems with a rank R and a set G<R of problems of lower ranks, 
            // a union of any subset of GR with G<R is a knowledge state.
            // [SC] make sure the rankOrder object is not null
            if (typeof p_rankOrder === 'undefined' || p_rankOrder === null) {
                this.Log(Severity.Error, "createKStructure: Null object is passed as RankOrder parameter. Returning null.");
                return null;
            }
            // [SC] make sure there is at least one rank in the rank order
            if (p_rankOrder.getRankCount() === 0) {
                this.Log(Severity.Error, "createKStructure: rank order has no ranks. Returning null.");
                return null;
            }
            // [SC] make sure the ranks are sorted in an ascending order
            p_rankOrder.sortAscending();
            // [SC] creating knowledge states
            var allStates = new Array();
            var prevCategories = new Array();
            for (var _i = 0, _a = p_rankOrder.getRanks(); _i < _a.length; _i++) {
                var rank = _a[_i];
                // [SC] getting all unique subsets of categories in this rank
                var subsets = rank.getSubsets();
                // [SC] for each subset, create a knowledge state by combining with all categories of lower ranks
                for (var _b = 0, subsets_2 = subsets; _b < subsets_2.length; _b++) {
                    var subset = subsets_2[_b];
                    var state = new TwoANS.KState(null, null, null);
                    for (var _c = 0, prevCategories_1 = prevCategories; _c < prevCategories_1.length; _c++) {
                        var category = prevCategories_1[_c];
                        state.addCategory(category);
                    }
                    for (var _d = 0, subset_3 = subset; _d < subset_3.length; _d++) {
                        var category = subset_3[_d];
                        state.addCategory(category);
                    }
                    allStates.push(state);
                }
                for (var _e = 0, _f = rank.getCategories(); _e < _f.length; _e++) {
                    var category = _f[_e];
                    prevCategories.push(category);
                }
            }
            // [SC] sort states by their sizes in an ascending order
            allStates.sort(function (stateOne, stateTwo) {
                if (stateOne.getCategoryCount() < stateTwo.getCategoryCount()) {
                    return -1;
                }
                else if (stateOne.getCategoryCount() > stateTwo.getCategoryCount()) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            // [SC] creating an empty knowledge structure object
            var ks = new TwoANS.KStructure(p_rankOrder);
            // [SC] creating 0th rank with an empty root state
            var rankIndex = 0;
            var stateCounter = 0; // [SC] used to generate an ID for each state
            var prevRank = null;
            var currRank = new TwoANS.KSRank(rankIndex, null); // [SC] the root rank will automatically add an empty root state
            ks.addRank(currRank);
            // [SC] adding all states in respective ranks
            for (var _g = 0, allStates_1 = allStates; _g < allStates_1.length; _g++) {
                var state = allStates_1[_g];
                if (state.getCategoryCount() > rankIndex) {
                    stateCounter = 0;
                    prevRank = currRank;
                    currRank = new TwoANS.KSRank(++rankIndex, null);
                    ks.addRank(currRank);
                }
                if (currRank.addState(state)) {
                    state.Id = KSGenerator.getStateID(rankIndex, ++stateCounter);
                    for (var _h = 0, _j = prevRank.getStates(); _h < _j.length; _h++) {
                        var prevState = _j[_h];
                        if (prevState.isSubsetOf(state)) {
                            prevState.addNextState(state);
                            state.addPrevState(prevState);
                        }
                    }
                }
            }
            return ks;
        };
        ////// END: Methods for creating a knowledge structure
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods for creating a rank order
        /// <summary>
        /// Creates a rank order from an array of difficulty ratings. Category IDs are auto generated.
        /// </summary>
        /// 
        /// <param name="p_ratings">Array of difficulty ratings to be used for generating a rank order.</param>
        /// 
        /// <returns>RankOrder object</returns>
        KSGenerator.prototype.createRankOrder = function (p_ratings) {
            var categories = new Array();
            var counter = 0;
            for (var _i = 0, p_ratings_1 = p_ratings; _i < p_ratings_1.length; _i++) {
                var betaVal = p_ratings_1[_i];
                categories.push(new TwoANS.PCategory("" + (++counter), betaVal));
            }
            return this.createRankOrderFromCats(categories);
        };
        /// <summary>
        /// Creates a rank order from a list of categories with difficulty ratings.
        /// </summary>
        /// 
        /// <param name="p_categories">List of categories.</param>
        /// 
        /// <returns>RankOrder object</returns>
        KSGenerator.prototype.createRankOrderFromCats = function (p_categories) {
            for (var _i = 0, p_categories_1 = p_categories; _i < p_categories_1.length; _i++) {
                var category = p_categories_1[_i];
                if (!category.hasId()) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Category ID  is missing. Returning null.");
                    return null;
                }
            }
            // [SC] sorting by an ascending order of ID
            p_categories.sort(function (catOne, catTwo) {
                if (catOne.Id < catTwo.Id) {
                    return -1;
                }
                else if (catOne.Id > catTwo.Id) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            var prevCat = null;
            for (var _a = 0, p_categories_2 = p_categories; _a < p_categories_2.length; _a++) {
                var category = p_categories_2[_a];
                if (!category.hasRating()) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Rating for category '"
                        + category.Id + "' is missing. Returning null.");
                    return null;
                }
                if (prevCat !== null && prevCat.isSameId(category)) {
                    this.Log(Severity.Error, "createRankOrder: Cannot create a rank order. Duplicate category ID is found: '"
                        + category.Id + "'. Returning null.");
                    return null;
                }
                prevCat = category;
            }
            // [SC] sorting by an ascending order of ratings
            p_categories.sort(function (catOne, catTwo) {
                if (catOne.Rating < catTwo.Rating) {
                    return -1;
                }
                else if (catOne.Rating > catTwo.Rating) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
            // [SC] building ranks
            var rankOrder = new TwoANS.RankOrder(this.Threshold);
            var rankIndex = 0;
            var rank = null;
            var firstCat = null;
            while (p_categories.length > 0) {
                var nextCat = p_categories[0];
                if (firstCat === null || this.isSignificantlyDifferent(firstCat.Rating, nextCat.Rating)) {
                    rank = new TwoANS.Rank(++rankIndex, null);
                    rankOrder.addRank(rank);
                    firstCat = nextCat;
                }
                rank.addCategory(nextCat);
                var index = p_categories.indexOf(nextCat, 0);
                if (index > -1) {
                    p_categories.splice(index, 1);
                }
            }
            return rankOrder;
        };
        /// <summary>
        /// returns true if two difficulty ratings are significantly diffferent
        /// </summary>
        /// 
        /// <param name="p_betaOne">first difficulty rating</param>
        /// <param name="p_betaTwo">second difficulty rating</param>
        /// 
        /// <returns>boolean</returns>
        KSGenerator.prototype.isSignificantlyDifferent = function (p_betaOne, p_betaTwo) {
            var observedProbability = this.calcDifferenceProbability(p_betaOne, p_betaTwo);
            return Math.abs(this.SameProbability - observedProbability) >= this.Threshold;
        };
        /// <summary>
        /// Calculates probability of difference of two difficulty ratings.
        /// </summary>
        /// 
        /// <param name="p_betaOne">first difficulty rating</param>
        /// <param name="p_betaTwo">second difficulty rating</param>
        /// 
        /// <returns>a value in range [0, 0.5) indicating probability in difficulty difference</returns>
        KSGenerator.prototype.calcDifferenceProbability = function (p_betaOne, p_betaTwo) {
            return 1 / (Math.exp(p_betaOne - p_betaTwo) + 1);
        };
        ////// END: Methods for creating a rank order
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Helper methods
        /// <summary>
        /// Generates a knowledge state ID based on its rank index and the number of existing states in the same rank
        /// </summary>
        /// 
        /// <param name="p_rankIndex">states rank index</param>
        /// <param name="p_stateCounter">the number of existing states in the same rank</param>
        /// 
        /// <returns>state ID as string</returns>
        KSGenerator.getStateID = function (p_rankIndex, p_stateCounter) {
            return "S" + p_rankIndex + "." + p_stateCounter;
        };
        /// <summary>
        /// Returns true if threshold value has a valid range, and false otherwise.
        /// </summary>
        /// 
        /// <param name="p_threshold">threshold value to be verified</param>
        /// 
        /// <returns>boolean</returns>
        KSGenerator.validThreshold = function (p_threshold) {
            if ((p_threshold >= KSGenerator.MIN_THRESHOLD && p_threshold < KSGenerator.MAX_THRESHOLD)
                || p_threshold === KSGenerator.UNASSIGNED_THRESHOLD) {
                return true;
            }
            return false;
        };
        /// <summary>
        /// Sends a log message to the asset
        /// </summary>
        /// 
        /// <param name="p_severity"> Message severity type</param>
        /// <param name="p_logStr">   Log message</param>
        KSGenerator.prototype.Log = function (p_severity, p_logStr) {
            if (typeof this.asset !== 'undefined' && this.asset !== null) {
                this.asset.Log(p_severity, p_logStr);
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: constants
        /// <summary>
        /// The value is used to indicate that a rating was not assigned a valid value.
        /// </summary>
        KSGenerator.UNASSIGNED_RATING = -9999.99;
        /// <summary>
        /// The value is used to indicate that a rank was not assigned a valid index.
        /// </summary>
        KSGenerator.UNASSIGNED_RANK = -1;
        /// <summary>
        /// The value is used to indicate that a threshold was not assigned a valid value.
        /// </summary>
        KSGenerator.UNASSIGNED_THRESHOLD = -1;
        /// <summary>
        /// A default value for a threshold.
        /// </summary>
        KSGenerator.DEFAULT_THRESHOLD = 0.1;
        /// <summary>
        /// Min valid value of a threshold (inclusive).
        /// </summary>
        KSGenerator.MIN_THRESHOLD = 0;
        /// <summary>
        /// Max valid value of a threshold (exclusive).
        /// </summary>
        KSGenerator.MAX_THRESHOLD = 1;
        /// <summary>
        /// Default sameness probability.
        /// </summary>
        KSGenerator.DEFAULT_SAME_PROBABILITY = 0.5;
        /// <summary>
        /// Min valid sameness probability.
        /// </summary>
        KSGenerator.MIN_SAME_PROBABILITY = 0;
        /// <summary>
        /// Max valid sameness probability.
        /// </summary>
        KSGenerator.MAX_SAME_PROBABILITY = 1;
        /// <summary>
        /// State type: 'root'
        /// </summary>
        KSGenerator.ROOT_STATE = "root";
        /// <summary>
        /// State type: 'core'
        /// </summary>
        KSGenerator.CORE_STATE = "core";
        /// <summary>
        /// State type: 'expanded'
        /// </summary>
        KSGenerator.EXPANDED_STATE = "expanded";
        return KSGenerator;
    }());
    TwoANS.KSGenerator = KSGenerator;
})(TwoANS || (TwoANS = {}));
/// Copyright 2018
///     Enkhbold Nyamsuren (http://www.bcogs.net , http://www.bcogs.info/)
/// 
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
/// 
///     http://www.apache.org/licenses/LICENSE-2.0
/// 
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///
/// <reference path="../../../RageAssetManager/ILog.ts"/>
/// <reference path="../../../RageAssetManager/Dictionary.ts"/>
///
/// <reference path="../RankOrder.ts"/>
/// <reference path="../Rank.ts"/>
/// <reference path="../PCategory.ts"/>
/// <reference path="../KStructure.ts"/>
/// <reference path="../KState.ts"/>
/// <reference path="../KSRank.ts"/>
///
/// <reference path="../../TwoA.ts"/>
///
var TwoANS;
(function (TwoANS) {
    var Severity = AssetPackage.Severity;
    var Dictionary = AssetManagerPackage.Dictionary;
    var RankOrder = TwoANS.RankOrder;
    var Rank = TwoANS.Rank;
    var PCategory = TwoANS.PCategory;
    var KStructure = TwoANS.KStructure;
    var KState = TwoANS.KState;
    var KSRank = TwoANS.KSRank;
    /// <summary>
    /// XMLFactory with singleton.
    /// </summary>
    var XMLFactory = /** @class */ (function () {
        ////// END: Properties
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Constructor
        function XMLFactory() {
            /// <summary>
            /// XML related objects
            /// </summary>
            this.parser = new DOMParser();
            this.serializer = new XMLSerializer();
            if (XMLFactory.instance) {
                throw new Error("Error: Instantiation failed. Use XMLFactory.Instance getter instead of new.");
            }
            XMLFactory.instance = this;
        }
        Object.defineProperty(XMLFactory, "Instance", {
            ////// END: fields
            //////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////
            ////// START: Properties
            /// <summary>
            /// Returns a singleton instance.
            /// </summary>
            get: function () {
                if (XMLFactory.instance === null || typeof XMLFactory.instance === 'undefined') {
                    XMLFactory.instance = new XMLFactory;
                }
                return XMLFactory.instance;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XMLFactory.prototype, "asset", {
            /// <summary>
            /// Instance of the TwoA asset
            /// </summary>
            get: function () {
                return this.twoA;
            },
            set: function (p_twoA) {
                if (p_twoA !== null && typeof p_twoA !== 'undefined') {
                    this.twoA = p_twoA;
                }
            },
            enumerable: true,
            configurable: true
        });
        ////// END: Constructor
        //////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: Methods
        /// <summary>
        /// creates an XML document object from a given KStructure object
        /// </summary>
        /// 
        /// <param name="p_kStructure">KStructure object with a rank order and knowledge structure</param>
        /// 
        /// <returns>XmlDocument object</returns>
        XMLFactory.prototype.createXml = function (p_kStructure) {
            // [SC] verifying that KStructure object is not null
            if (p_kStructure === null || typeof p_kStructure === "undefined") {
                this.Log(Severity.Error, "Unable to transform knowledge structure into XML format. kStructure parameter is null. Returning null.");
                return null;
            }
            // [SC] create xml document object
            var doc = this.parser.parseFromString(""
                + "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>"
                + "<TwoA xmlns=\"https://github.com/rageappliedgame/HatAsset\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" />", "text/xml");
            var twoAElem = doc.getElementsByTagName(XMLFactory.TWOA_ELEM)[0];
            // [SC] create a list of categories and a rank order
            if (p_kStructure.hasRankOrder()) {
                var rankOrder = p_kStructure.rankOrder;
                rankOrder.sortAscending();
                // [SC] add 'TwoA/PCategories' list element
                var pcatsElem = doc.createElement(XMLFactory.PCATS_ELEM);
                twoAElem.appendChild(pcatsElem);
                // [SC] add 'TwoA/RankOrder' element
                var rankOrderElem = doc.createElement(XMLFactory.RANKORDER_ELEM);
                twoAElem.appendChild(rankOrderElem);
                // [SC] add 'TwoA/RankOrder/Params' list element
                var rankParamsElem = doc.createElement(XMLFactory.PARAMS_ELEM);
                rankOrderElem.appendChild(rankParamsElem);
                // [SC] add 'TwoA/RankOrder/Params/Threshold' element
                var thresholdElem = doc.createElement(XMLFactory.THRESHOLD_ELEM);
                rankParamsElem.appendChild(thresholdElem);
                thresholdElem.textContent = "" + rankOrder.Threshold;
                // [SC] create 'TwoA/RankOrder/Ranks' list element
                var ranksElem = doc.createElement(XMLFactory.RANKS_ELEM);
                rankOrderElem.appendChild(ranksElem);
                // [SC] iterate through ranks and create correspoinding XML elements
                for (var rankCounter = 0; rankCounter < rankOrder.getRankCount(); rankCounter++) {
                    var rank = rankOrder.getRankAt(rankCounter);
                    // [SC] add 'TwoA/RankOrder/Ranks/Rank' element
                    var rankElem = doc.createElement(XMLFactory.RANK_ELEM);
                    ranksElem.appendChild(rankElem);
                    // [SC] add 'TwoA/RankOrder/Ranks/Rank@Index' attribute to the 'Rank' element
                    var indexAttr = doc.createAttribute(XMLFactory.INDEX_ATTR);
                    indexAttr.nodeValue = "" + rank.RankIndex;
                    rankElem.setAttributeNode(indexAttr);
                    // [SC] interate through categories in the rank and create corresponding XML element and reference to it
                    for (var catCounter = 0; catCounter < rank.getCategoryCount(); catCounter++) {
                        var pcat = rank.getCategoryAt(catCounter);
                        // [SC] add 'TwoA/PCategories/PCategory' element with 'xsd:id' attribute
                        var pcatElem = doc.createElement(XMLFactory.PCAT_ELEM);
                        pcatsElem.appendChild(pcatElem);
                        // [SC] add 'TwoA/PCategories/PCategory@xsd:id' attribute
                        var idAttr = doc.createAttribute(XMLFactory.ID_ATTR);
                        idAttr.nodeValue = "" + pcat.Id;
                        pcatElem.setAttributeNode(idAttr);
                        // [SC] add 'TwoA/PCategories/PCategory/Rating' element
                        var ratingElem = doc.createElement(XMLFactory.RATING_ELEM);
                        pcatElem.appendChild(ratingElem);
                        ratingElem.textContent = "" + pcat.Rating;
                        // [SC] add 'TwoA/RankOrder/Ranks/Rank/PCategory' element with 'xsd:idref' attribute
                        var pcatRefElem = doc.createElement(XMLFactory.PCAT_ELEM);
                        rankElem.appendChild(pcatRefElem);
                        // [SC] add 'TwoA/RankOrder/Ranks/Rank/PCategory@xsd:idref' attribute
                        var idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                        idrefAttr.nodeValue = "" + pcat.Id;
                        pcatRefElem.setAttributeNode(idrefAttr);
                    }
                }
            }
            else {
                this.Log(Severity.Warning, "Rank order is missing while transforming KStructure object into XML format.");
            }
            // [SC] creates elements for 'KStructure'
            if (p_kStructure.hasRanks()) {
                p_kStructure.sortAscending();
                // [SC] add 'TwoA/KStructure' element
                var kStructureElem = doc.createElement(XMLFactory.KSTRUCTURE_ELEM);
                twoAElem.appendChild(kStructureElem);
                // [SC] iterate through KSRanks and create corresponding XML elements
                for (var rankCounter = 0; rankCounter < p_kStructure.getRankCount(); rankCounter++) {
                    var rank = p_kStructure.getRankAt(rankCounter);
                    // [SC] add 'TwoA/KStructure/KSRank' element
                    var ksRankElem = doc.createElement(XMLFactory.KSRANK_ELEM);
                    kStructureElem.appendChild(ksRankElem);
                    // [SC] add 'TwoA/KStructure/KSRank@Index' attribute
                    var indexAttr = doc.createAttribute(XMLFactory.INDEX_ATTR);
                    indexAttr.nodeValue = "" + rank.RankIndex;
                    ksRankElem.setAttributeNode(indexAttr);
                    // [SC] iterate through states and add corresponding XML elements
                    for (var stateCounter = 0; stateCounter < rank.getStateCount(); stateCounter++) {
                        var state = rank.getStateAt(stateCounter);
                        // [SC] add 'TwoA/KStructure/KSRank/KState' element with 'xsd:id' attribute
                        var stateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                        ksRankElem.appendChild(stateElem);
                        // [SC] add 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                        var idAttr = doc.createAttribute(XMLFactory.ID_ATTR);
                        idAttr.nodeValue = "" + state.Id;
                        stateElem.setAttributeNode(idAttr);
                        // [SC] add 'TwoA/KStructure/KSRank/KState@Type' attribute
                        var typeAttr = doc.createAttribute(XMLFactory.TYPE_ATTR);
                        typeAttr.nodeValue = "" + state.StateType;
                        stateElem.setAttributeNode(typeAttr);
                        // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories' list element
                        var pcatsElem = doc.createElement(XMLFactory.PCATS_ELEM);
                        stateElem.appendChild(pcatsElem);
                        // [SC] iterate through categories in the state
                        for (var catCounter = 0; catCounter < state.getCategoryCount(); catCounter++) {
                            var pcat = state.getCategoryAt(catCounter);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories/PCategory' element with 'xsd:idref' attribute
                            var pcatElem = doc.createElement(XMLFactory.PCAT_ELEM);
                            pcatsElem.appendChild(pcatElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PCategories/PCategory@xsd:idref' attribute
                            var idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + pcat.Id;
                            pcatElem.setAttributeNode(idrefAttr);
                        }
                        // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates' list element
                        var prevStatesElem = doc.createElement(XMLFactory.PREV_STATES_ELEM);
                        stateElem.appendChild(prevStatesElem);
                        // [SC] iterate through immediate prerequisite states in the gradient
                        for (var prevStateCounter = 0; prevStateCounter < state.getPrevStateCount(); prevStateCounter++) {
                            var prevState = state.getPrevStateAt(prevStateCounter);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates/KState' element with 'xsd:idref' attribute
                            var prevStateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                            prevStatesElem.appendChild(prevStateElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/PreviousStates/KState@xsd:idref' attribute
                            var idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + prevState.Id;
                            prevStateElem.setAttributeNode(idrefAttr);
                        }
                        // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates' list element
                        var nextStatesElem = doc.createElement(XMLFactory.NEXT_STATES_ELEM);
                        stateElem.appendChild(nextStatesElem);
                        // [SC] iterate through immediate next states in the gradient
                        for (var nextStateCounter = 0; nextStateCounter < state.getNextStateCount(); nextStateCounter++) {
                            var nextState = state.getNextStateAt(nextStateCounter);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates/KState' element with 'xsd:idref' attribute
                            var nextStateElem = doc.createElement(XMLFactory.KSTATE_ELEM);
                            nextStatesElem.appendChild(nextStateElem);
                            // [SC] add 'TwoA/KStructure/KSRank/KState/NextStates/KState@xsd:idref' attribute
                            var idrefAttr = doc.createAttribute(XMLFactory.IDREF_ATTR);
                            idrefAttr.nodeValue = "" + nextState.Id;
                            nextStateElem.setAttributeNode(idrefAttr);
                        }
                    }
                }
            }
            else {
                this.Log(Severity.Warning, "Knowledge structure is missing while transforming KStructure object into XML format.");
            }
            return doc;
        };
        /// <summary>
        /// iimplementations of createKStructure overloads
        /// </summary>
        XMLFactory.prototype.createKStructure = function (x) {
            var doc = null;
            if (typeof x === "string") {
                x = this.parser.parseFromString(x, "text/xml");
            }
            else if (x instanceof Document) {
                doc = x;
            }
            else {
                return null;
            }
            if (doc === null || typeof doc === "undefined") {
                return null;
            }
            var nodeNames;
            // [SC] a hash table of all categories
            var categories = new Dictionary();
            // [SC] a hash table of all states
            var states = new Dictionary();
            // [SC] iterate through 'TwoA/PCategories/PCategory' elements
            nodeNames = new Array(XMLFactory.PCATS_ELEM, XMLFactory.PCAT_ELEM);
            for (var _i = 0, _a = this.SelectNodes(doc.documentElement, nodeNames); _i < _a.length; _i++) {
                var categoryElem = _a[_i];
                // [SC] get the value of 'TwoA/PCategories/PCategory@xsd:id' attribute
                var id = categoryElem.getAttribute(XMLFactory.ID_ATTR);
                // [SC] get the value of 'TwoA/PCategories/PCategory/Rating' element
                var rating = parseFloat(this.SelectSingleNode(categoryElem, new Array(XMLFactory.RATING_ELEM)).textContent);
                if (isNaN(rating)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse rating for category " + id + ". Returning null.");
                    return null; // [TODO] no need due to schema check?
                }
                var category = new PCategory(id, rating);
                categories.add(id, category);
            }
            var rankOrder = new RankOrder(null);
            // [SC] parse the value of 'TwoA/RankOrder/Params/Threshold' element
            nodeNames = new Array(XMLFactory.RANKORDER_ELEM, XMLFactory.PARAMS_ELEM, XMLFactory.THRESHOLD_ELEM);
            var threshold = parseFloat(this.SelectSingleNode(doc.documentElement, nodeNames).textContent);
            if (isNaN(threshold)) {
                this.Log(Severity.Error, "createKStructure: unable to parse the threshold value. Returning null value. Returning null.");
                return null; // [TODO] no need due to schema check?
            }
            else {
                rankOrder.Threshold = threshold;
            }
            // [SC] iterate through 'TwoA/RankOrder/Ranks/Rank' elements
            nodeNames = new Array(XMLFactory.RANKORDER_ELEM, XMLFactory.RANKS_ELEM, XMLFactory.RANK_ELEM);
            for (var _b = 0, _c = this.SelectNodes(doc.documentElement, nodeNames); _b < _c.length; _b++) {
                var rankElem = _c[_b];
                var rank = new Rank(null, null);
                // [SC] parse the value of 'TwoA/RankOrder/Ranks/Rank@Index' attribute
                var rankIndex = parseInt(rankElem.getAttribute(XMLFactory.INDEX_ATTR));
                if (isNaN(rankIndex)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse the index of a rank in the rank order. Returning null.");
                    return null; // [TODO] no need due to schema check?
                }
                else {
                    rank.RankIndex = rankIndex;
                }
                // [SC] iterate through 'TwoA/RankOrder/Ranks/Rank/PCategory' elements
                for (var _d = 0, _e = this.SelectNodes(rankElem, new Array(XMLFactory.PCAT_ELEM)); _d < _e.length; _d++) {
                    var categoryElem = _e[_d];
                    // [SC] parse 'TwoA/RankOrder/Ranks/Rank/PCategory@xsd:idref' attribute
                    var id = categoryElem.getAttribute(XMLFactory.IDREF_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID for a category in rank "
                            + rankIndex + " of the rank order. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    // [SC] retrieve PCategory object by its id and add it to the rank object
                    var category = categories[id];
                    if (typeof category === "undefined" || category === null) {
                        this.Log(Severity.Error, "createKStructure: category " + id + " from rank "
                            + rankIndex + " of rank order is not found in the list of categories. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    rank.addCategory(category);
                }
                rankOrder.addRank(rank);
            }
            var kStructure = new KStructure(rankOrder);
            // [SC] iterate through 'TwoA/KStructure/KSRank' elements
            nodeNames = new Array(XMLFactory.KSTRUCTURE_ELEM, XMLFactory.KSRANK_ELEM);
            for (var _f = 0, _g = this.SelectNodes(doc.documentElement, nodeNames); _f < _g.length; _f++) {
                var ksrankElem = _g[_f];
                var ksrank = new KSRank(null, null);
                // [SC] parse the value of 'TwoA/KStructure/KSRank@Index' attribute
                var rankIndex = parseInt(ksrankElem.getAttribute(XMLFactory.INDEX_ATTR));
                if (isNaN(rankIndex)) {
                    this.Log(Severity.Error, "createKStructure: unable to parse index of a rank in the knowledge structure. Returning null.");
                    return null; // [TODO] no need due to schema check?
                }
                else {
                    ksrank.RankIndex = rankIndex;
                }
                if (rankIndex === 0) {
                    var rootStateElem = this.SelectSingleNode(ksrankElem, new Array(XMLFactory.KSTATE_ELEM));
                    // [SC] parse 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                    var id = rootStateElem.getAttribute(XMLFactory.ID_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID of the root state in the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    ksrank.getStateAt(0).Id = id;
                    states.add(ksrank.getStateAt(0).Id, ksrank.getStateAt(0));
                    kStructure.addRank(ksrank);
                    continue;
                }
                // [SC] iterate through 'TwoA/KStructure/KSRank/KState' elements
                for (var _h = 0, _j = this.SelectNodes(ksrankElem, new Array(XMLFactory.KSTATE_ELEM)); _h < _j.length; _h++) {
                    var stateElem = _j[_h];
                    var kstate = new KState(null, null, null);
                    // [SC] parse 'TwoA/KStructure/KSRank/KState@xsd:id' attribute
                    var id = stateElem.getAttribute(XMLFactory.ID_ATTR);
                    if (!id) {
                        this.Log(Severity.Error, "createKStructure: unable to parse ID of a state in the rank "
                            + rankIndex + " of the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    kstate.Id = id;
                    // [SC] parse 'TwoA/KStructure/KSRank/KState@Type' attribute
                    var stateType = stateElem.getAttribute(XMLFactory.TYPE_ATTR);
                    if (!stateType) {
                        this.Log(Severity.Error, "createKStructure: unable to parse state type in the rank "
                            + rankIndex + " of the knowledge structure. Returning null.");
                        return null; // [TODO] no need due to schema check?
                    }
                    kstate.StateType = stateType;
                    // [SC] iterate through 'TwoA/KStructure/KSRank/KState/PCategories/PCategory' elements
                    nodeNames = new Array(XMLFactory.PCATS_ELEM, XMLFactory.PCAT_ELEM);
                    for (var _k = 0, _l = this.SelectNodes(stateElem, nodeNames); _k < _l.length; _k++) {
                        var categoryElem = _l[_k];
                        // [SC] parse 'TwoA/KStructure/KSRank/KState/PCategories/PCategory@xsd:idref' attribute
                        var statePcatId = categoryElem.getAttribute(XMLFactory.IDREF_ATTR);
                        if (!statePcatId) {
                            this.Log(Severity.Error, "createKStructure: unable to parse ID of a category in the state "
                                + kstate.Id + ". Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        // [SC] retrieve PCategory object by its id and add it to the rank object
                        var category = categories[statePcatId];
                        if (category === null || typeof category === "undefined") {
                            this.Log(Severity.Error, "createKStructure: category " + statePcatId + " from the state "
                                + kstate.Id + " is not found in the list of categories. Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        kstate.addCategory(category);
                    }
                    // [SC] iterate through 'TwoA/KStructure/KSRank/KState/PreviousStates/KState' elements
                    nodeNames = new Array(XMLFactory.PREV_STATES_ELEM, XMLFactory.KSTATE_ELEM);
                    for (var _m = 0, _o = this.SelectNodes(stateElem, nodeNames); _m < _o.length; _m++) {
                        var prevStateElem = _o[_m];
                        // [SC] parse 'TwoA/KStructure/KSRank/KState/PreviousStates/KState@xsd:idref' attribute
                        var prevStateId = prevStateElem.getAttribute(XMLFactory.IDREF_ATTR);
                        if (!prevStateId) {
                            this.Log(Severity.Error, "createKStructure: unable to parse ID of a previous state for a state "
                                + kstate.Id + ". Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        // [SC] retrieve prev state object by its id and add it to the current state object
                        var prevState = states[prevStateId];
                        if (prevState === null || typeof prevState === "undefined") {
                            this.Log(Severity.Error, "createKStructure: unable to find previously created state object with id '"
                                + prevStateId + "'. Returning null.");
                            return null; // [TODO] no need due to schema check?
                        }
                        kstate.addPrevState(prevState);
                        prevState.addNextState(kstate);
                    }
                    states.add(kstate.Id, kstate);
                    ksrank.addState(kstate);
                }
                kStructure.addRank(ksrank);
            }
            return kStructure;
        };
        /// <summary>
        /// A helper function that emulates xPath-like method for selecting a list of xml child nodes by name
        /// </summary>
        /// 
        /// <param name="p_startNode">    Parent node</param>
        /// <param name="p_nodeNames">    Contains a path to destination child nodes which is the last item in the array</param>
        /// 
        /// <returns>A list of target child nodes, or empty list if child node is not found.</returns>
        XMLFactory.prototype.SelectNodes = function (p_startNode, p_nodeNames) {
            var result = new Array();
            ;
            if (p_nodeNames === null || typeof p_nodeNames === "undefined") {
                return result;
            }
            if (p_nodeNames.length === 0) {
                return result;
            }
            for (var index = 0; index < p_nodeNames.length; index++) {
                if (p_startNode === null || typeof p_startNode === "undefined") {
                    return result;
                }
                if (index === p_nodeNames.length - 1) {
                    var directChildren = p_startNode.childNodes;
                    for (var nodeIndex = 0; nodeIndex < directChildren.length; nodeIndex++) {
                        var childNode = directChildren[nodeIndex];
                        if (childNode.nodeName === p_nodeNames[index]) {
                            result.push(childNode);
                        }
                    }
                }
                else {
                    var directChildren = p_startNode.childNodes;
                    for (var nodeIndex = 0; nodeIndex < directChildren.length; nodeIndex++) {
                        var childNode = directChildren[nodeIndex];
                        if (childNode.nodeName === p_nodeNames[index]) {
                            p_startNode = childNode;
                        }
                    }
                }
            }
            return result;
        };
        /// <summary>
        /// A helper function that emulates xPath-like method for selecting a single xml node by its name
        /// </summary>
        /// 
        /// <param name="p_startNode">    Parent node</param>
        /// <param name="p_nodeNames">    Contains a path to destination child nodes which is the last item in the array</param>
        /// 
        /// <returns>Child node, or null if the node is not found</returns>
        XMLFactory.prototype.SelectSingleNode = function (p_startNode, p_nodeNames) {
            var nodes = this.SelectNodes(p_startNode, p_nodeNames);
            if (nodes === null || typeof nodes === "undefined" || nodes.length == 0) {
                return null;
            }
            else {
                return nodes[0];
            }
        };
        /// <summary>
        /// A helper function that serializes XDocument object into a formatted string.
        /// </summary>
        /// 
        /// <param name="p_doc">XDocument to be serialized</param>
        /// 
        /// <returns>string</returns>
        XMLFactory.prototype.serialize = function (p_doc) {
            return this.serializer.serializeToString(p_doc);
        };
        /// <summary>
        /// Sends a log message to the asset
        /// </summary>
        /// 
        /// <param name="p_severity"> Message severity type</param>
        /// <param name="p_logStr">   Log message</param>
        XMLFactory.prototype.Log = function (p_severity, p_logStr) {
            if (this.asset !== null && typeof this.asset !== "undefined") {
                this.asset.Log(p_severity, p_logStr);
            }
        };
        //////////////////////////////////////////////////////////////////////////////////////
        ////// START: fields
        /// <summary>
        /// A singleton instance.
        /// </summary>
        XMLFactory.instance = null;
        /// <summary>
        /// Default namespace
        /// </summary>
        XMLFactory.twoaNS = "https://github.com/rageappliedgame/HatAsset";
        /// <summary>
        /// Standard XSD namespace to be used with 'id' and 'idref' attributes
        /// </summary>
        XMLFactory.xsdNS = "http://www.w3.org/2001/XMLSchema";
        /// <summary>
        /// XName for XmlElement("TwoA")
        /// </summary>
        XMLFactory.TWOA_ELEM = "TwoA";
        /// <summary>
        /// XName for XmlElement("PCategories")
        /// </summary>
        XMLFactory.PCATS_ELEM = "PCategories";
        /// <summary>
        /// XName for XmlElement("PCategory")
        /// </summary>
        XMLFactory.PCAT_ELEM = "PCategory";
        /// <summary>
        /// XName for XmlElement("Rating")
        /// </summary>
        XMLFactory.RATING_ELEM = "Rating";
        /// <summary>
        /// XName for XmlElement("RankOrder")
        /// </summary>
        XMLFactory.RANKORDER_ELEM = "RankOrder";
        /// <summary>
        /// XName for XmlElement("Params")
        /// </summary>
        XMLFactory.PARAMS_ELEM = "Params";
        /// <summary>
        /// XName for XmlElement(""Threshold"")
        /// </summary>
        XMLFactory.THRESHOLD_ELEM = "Threshold";
        /// <summary>
        /// XName for XmlElement("Ranks")
        /// </summary>
        XMLFactory.RANKS_ELEM = "Ranks";
        /// <summary>
        /// XName for XmlElement("Rank")
        /// </summary>
        XMLFactory.RANK_ELEM = "Rank";
        /// <summary>
        /// XName for XmlElement("KStructure")
        /// </summary>
        XMLFactory.KSTRUCTURE_ELEM = "KStructure";
        /// <summary>
        /// XName for XmlElement("KSRank")
        /// </summary>
        XMLFactory.KSRANK_ELEM = "KSRank";
        /// <summary>
        /// XName for XmlElement("KState")
        /// </summary>
        XMLFactory.KSTATE_ELEM = "KState";
        /// <summary>
        /// XName for XmlElement("PreviousStates")
        /// </summary>
        XMLFactory.PREV_STATES_ELEM = "PreviousStates";
        /// <summary>
        /// XName for XmlElement("NextStates")
        /// </summary>
        XMLFactory.NEXT_STATES_ELEM = "NextStates";
        /// <summary>
        /// XName for XmlAttribute("Index")
        /// </summary>
        XMLFactory.INDEX_ATTR = "Index";
        /// <summary>
        /// XName for XmlAttribute("Type")
        /// </summary>
        XMLFactory.TYPE_ATTR = "Type";
        /// <summary>
        /// XName for XmlAttribute("xsd:id")
        /// </summary>
        XMLFactory.ID_ATTR = "xsd:id";
        /// <summary>
        /// XName for XmlAttribute("xsd:idref")
        /// </summary>
        XMLFactory.IDREF_ATTR = "xsd:idref";
        /// <summary>
        /// XName for XmlAttribute("xmlns")
        /// </summary>
        XMLFactory.XMLNS_ATTR = "xmlns";
        /// <summary>
        /// XName for XmlAttribute("xmlns:xsd")
        /// </summary>
        XMLFactory.XSD_ATTR = "xmlns:xsd";
        return XMLFactory;
    }());
    TwoANS.XMLFactory = XMLFactory;
})(TwoANS || (TwoANS = {}));
//# sourceMappingURL=TwoA.js.map