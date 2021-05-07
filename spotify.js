function getMusics(isMobile, onResult, onError) {
    if (isMobile) {
        _getMusicsForMobile({}, [], onResult, onError);
    } else {
        _getMusicsForDesktop({}, [], onResult, onError);
    }
}

function _getMusicsForMobile(musicData, musicKeys, onResult, onError) {
    try {
        var musicTags = document.getElementsByClassName('EntityRowV2__Container-sc-1ogsdp5-0');
        
        if (musicTags.length === 0) {
            setTimeout(function() {
                _getMusicsForMobile(musicData, musicKeys, onResult, onError);
            }, 200);

            return;
        }

        for (var i = 0; i < musicTags.length; ++i) {
            var anchorTags = musicTags[i].getElementsByClassName('Row__Container-sc-1mo2gpu-0')[0].getElementsByTagName('a');
            var trackUrl = anchorTags[0].href;

            if (!musicKeys.includes(trackUrl)) {
                musicData[trackUrl] = {
                    "title": anchorTags[0].textContent,
                    "singer": anchorTags[1].textContent
                }
                musicKeys.push(trackUrl);
            }
        }

        var listTag = document.getElementsByClassName('EntityView__Container-sc-1kbeo3t-0')[0];
        var footerTags = document.getElementsByClassName('CardGrid-sc-35jz0b-0');

        listTag.scrollTop = listTag.scrollHeight - listTag.clientHeight;

        if (footerTags.length > 0) {
            var musics = [];

            musicKeys.forEach(function(key) {
                musics.push(musicData[key]);
            });

            onResult({ "musics": musics });
        } else {
            setTimeout(function() {
                _getMusicsForMobile(musicData, musicKeys, onResult, onError);
            }, 200);
        }
    } catch (e) {
        setTimeout(function() {
            _getMusicsForMobile(musicData, musicKeys, onResult, onError);
        }, 200);
    }
}

function _getMusicsForDesktop(musicData, musicKeys, onResult, onError) {
    try {
        var musicTags = document.querySelectorAll("div[role='row']");

        for (var i = 0; i < musicTags.length; ++i) {
            var rowIndex = musicTags[i].getAttribute('aria-rowindex');

            if (rowIndex !== "1") {
                var songTag = musicTags[i].getElementsByClassName('da0bc4060bb1bdb4abb8e402916af32e-scss')[0];
                var artistTag = musicTags[i].getElementsByClassName('_966e29b71d2654743538480947a479b3-scss')[0];

                musicData[rowIndex] = {
                    "title": songTag.textContent,
                    "singer": artistTag.textContent
                }
                musicKeys.push(rowIndex);
            }
        }

        var listTag = document.getElementsByClassName('os-viewport')[0];
        var lastScrollTop = listTag.scrollTop;

        listTag.scrollTop = listTag.scrollTop + listTag.clientHeight;

        if (listTag.scrollTop === lastScrollTop) {
            var musics = [];

            musicKeys.forEach(function(key) {
                musics.push(musicData[key]);
            });

            onResult({ "musics": musics });
        } else {
            setTimeout(function() {
                _getMusicsForDesktop(musicData, musicKeys, onResult, onError);
            }, 100);
        }
    } catch (e) {
        setTimeout(function() {
            _getMusicsForDesktop(musicData, musicKeys, onResult, onError);
        }, 200);
    }
}

function getAlbumImage(isMobile, onResult, onError) {
    if (isMobile) {
        _getAlbumImageForMobile(onResult, onError);
    } else {
        _getAlbumImageForDesktop(onResult, onError);
    }
}

function _getAlbumImageForMobile(onResult, onError) {
    try {
        var wrapperTag = document.getElementsByClassName('AlbumArt-sc-4up5tn-1')[0];
        var imageTag = wrapperTag.getElementsByTagName('img')[0];
        
        if (imageTag.src) {
            onResult({ "url": imageTag.src });
        } else {
            setTimeout(function() {
                _getAlbumImageForMobile(onResult, onError);
            }, 200);
        }
    } catch (e) {
        setTimeout(function() {
            _getAlbumImageForMobile(onResult, onError);
        }, 200);
    }
}

function _getAlbumImageForDesktop(onResult, onError) {
    try {
        var wrapperTag = document.getElementsByClassName('_9e10063a7b1e2d5f588e34f07376302a-scss')[0];
        var imageTag = wrapperTag.getElementsByTagName('img')[0];

        if (imageTag.src) {
            onResult({ "url": imageTag.src });
        } else {
            setTimeout(function() {
                _getAlbumImageForDesktop(onResult, onError);
            }, 200);
        }
    } catch (e) {
        setTimeout(function() {
            _getAlbumImageForDesktop(onResult, onError);
        }, 200);
    }
}
