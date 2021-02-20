var module = (function() {
    const webjs = require("webjs-helper");

    var _id = "", _dir_path = "", _handlers = [];
    var _playlist_id = "", _is_mobile = false;
    var _web_loaded = false;
    
    function _on_web_loaded(data) {
        console.log(data["url"])
        if (data["url"].startsWith("https://open.spotify.com/playlist")) {
            webjs.import(_dir_path + "/spotify.js");

            _handlers.forEach(function(handler) {
                handler();
            });

            _web_loaded = true, _handlers = [];

            return;
        }
    }

    function _on_web_start(data) {
        if (data["url"].startsWith("intent://")) {
            view.object(_id + ".web").action("home");

            return;
        }
    }
    
    return {
        initialize: function(id, playlist_id, is_mobile) {
            var web_prefix = id.replace(".", "_");
            var dir_path = this.__ENV__["dir-path"];

            webjs.initialize(id + ".web", "__$_bridge");
            
            global[web_prefix + "__on_web_loaded"] = function(data) {
                _on_web_loaded(data);
            }
            global[web_prefix + "__on_web_start"] = function(data) {
                _on_web_start(data);
            }

            view.object(id).action("load", { 
                "filename": dir_path + "/web.sbml",
                "dir-path": dir_path,
                "web-id": id, 
                "web-prefix": web_prefix,
                "playlist-id": playlist_id
            });

            _id = id, _dir_path = dir_path;
            _playlist_id = playlist_id, _is_mobile = is_mobile;

            return this;
        },

        get_playlist_id: function() {
            return _playlist_id;
        },

        get_musics: function() {
            return new Promise(function(resolve, reject) {
                var handler = function() {
                    webjs.call("getMusics", [ _is_mobile ])
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                }

                _web_loaded ? handler() : _handlers.push(handler);
            });
        },
    }
})();

__MODULE__ = module;
