function getMusics(isMobile, onResult, onError) {
    if (isMobile) {
        _getMusicsForMobile({}, [], onResult, onError);
    } else {
        _getMusicsForDesktop({}, [], onResult, onError);
    }
}

function _getMusicsForMobile(musicsData, musicsKeys, onResult, onError) {
    try {
        var musicsTags = document.getElementsByClassName('EntityRowV2__Container-sc-1ogsdp5-0');
        
        console.log("musicsTags: " + musicsTags.length);
        if (musicsTags.length === 0) {
            setTimeout(function() {
                _getMusicsForMobile(musicsData, musicsKeys, onResult, onError);
            }, 200);

            return;
        }

        for (var i = 0; i < musicsTags.length; ++i) {
            var anchorTags = musicsTags[i].getElementsByClassName('Row__Container-sc-1mo2gpu-0')[0].getElementsByTagName('a');
            var trackUrl = anchorTags[0].href;

            if (!musicsKeys.includes(trackUrl)) {
                musicsData[trackUrl] = {
                    "title": anchorTags[0].textContent,
                    "singer": anchorTags[1].textContent
                }
                musicsKeys.push(trackUrl);
            }
        }

        var listTag = document.getElementsByClassName('EntityView__Container-sc-1lc2zv4-0')[0];
        var footerTags = document.getElementsByClassName('PlaylistEntityView__Heading-sc-1qgncvr-3');

        listTag.scrollTop = listTag.scrollHeight - listTag.clientHeight;

        if (footerTags.length > 0) {
            var musics = [];

            musicsKeys.forEach(function(key) {
                musics.push(musicsData[key]);
            });

            onResult({ "musics": musics });
        } else {
            setTimeout(function() {
                _getMusicsForMobile(musicsData, musicsKeys, onResult, onError);
            }, 200);
        }
    } catch (e) {
        setTimeout(function() {
            _getMusicsForMobile(musicsData, musicsKeys, onResult, onError);
        }, 200);
    }
}

function _getMusicsForDesktop(musicsData, musicsKeys, onResult, onError) {
    try {
        var musicsTags = document.querySelectorAll("div[role='row']");

        for (var i = 0; i < musicsTags.length; ++i) {
            var rowIndex = musicsTags[i].getAttribute('aria-rowindex');

            if (rowIndex !== "1") {
                var songTag = musicsTags[i].getElementsByClassName('da0bc4060bb1bdb4abb8e402916af32e-scss')[0];
                var artistTag = musicsTags[i].getElementsByClassName('_966e29b71d2654743538480947a479b3-scss')[0];

                musicsData[rowIndex] = {
                    "title": songTag.textContent,
                    "singer": artistTag.textContent
                }
                musicsKeys.push(rowIndex);
            }
        }

        var listTag = document.getElementsByClassName('os-viewport')[0];
        var lastScrollTop = listTag.scrollTop;

        listTag.scrollTop = listTag.scrollTop + listTag.clientHeight;

        if (listTag.scrollTop === lastScrollTop) {
            var musics = [];

            musicsKeys.forEach(function(key) {
                musics.push(musicsData[key]);
            });

            onResult(musics);
        } else {
            setTimeout(function() {
                _getMusicsForDesktop(musicsData, musicsKeys, onResult, onError);
            }, 100);
        }
    } catch (e) {
        setTimeout(function() {
            _getMusicsForDesktop(musicsData, musicsKeys, onResult, onError);
        }, 200);
    }
}
