var module = (function() {
    const webjs = require("webjs-helper");

    var _id = "", _dir_path = "", _handlers = [];
    var _playlist_id = "", _is_mobile = false;
    var _web_loaded = false;
    
    function _on_web_loaded(data) {
        if (data["url"].startsWith("https://open.spotify.com/playlist")) {
            webjs.import(_dir_path + "/spotify.js");

            _handlers.forEach(function(handler) {
                handler();
            });

            _web_loaded = true, _handlers = [];

            return;
        }
    }
    
    function _get_object(id, handler) {
        const object = view.object(id);

        if (!object) {
            timeout(0.1, function() {
                _get_object(id, handler);
            });
        } else {
            handler(object);
        }
    }

    return {
        initialize: function(id, playlist_id, is_mobile) {
            var web_prefix = id.replace(".", "_");
            var dir_path = this.__ENV__["dir-path"];
            
            global[web_prefix + "__on_web_loaded"] = function(data) {
                _on_web_loaded(data);
            }

            webjs.initialize(id + ".web", "__$_bridge");
            _get_object(id, function(object) {
                object.action("load", { 
                    "filename": dir_path + "/web.sbml",
                    "dir-path": dir_path,
                    "web-id": id, 
                    "web-prefix": web_prefix,
                    "playlist-id": playlist_id,
                    "mobile": is_mobile ? "yes" : "no"
                });
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
                        });
                }

                _web_loaded ? handler() : _handlers.push(handler);
            });
        },

        get_album_image: function() {
            return new Promise(function(resolve, reject) {
                var handler = function() {
                    webjs.call("getAlbumImage", [ _is_mobile ])
                        .then(function(result) {
                            resolve(result);
                        })
                        .catch(function(error) {
                            reject(error);
                        });
                }

                _web_loaded ? handler() : _handlers.push(handler);
            });
        }
    }
})();

__MODULE__ = module;
