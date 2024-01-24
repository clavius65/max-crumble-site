let AudioPlayer = null;
let AudioPlayerNode = null;
let AudioPlayerContainer = null;
let AllTracks = new Array();
let CurrentTrack = null;
let playedOnce = false;
let singlePlay = false;
let sortMode = 'newest';  // oldest, newest, nameA, nameZ

// Name of album/track to play when user first clicks on "Music" section
// In HTML these are represented with the following elements:
//     <div class="album" data-title="<< FIRST_SONG_ALBUM >>" ...>
//     <li class="audio-track" data-track= "<< FIRST_SONG_TRACK >>" ...>
let FIRST_SONG_ALBUM = "";
let FIRST_SONG_TRACK = "";
// let FIRST_SONG_ALBUM = "talisman";
// let FIRST_SONG_TRACK = "care";


$(function() {

    //window.onhashchange = onHashChange;
    //window.onpopstate = onPopState;
    //window.onpushstate = onPushState;
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pushstate', onPushState);

    wireAudioTracks();
    wirePanels(window.location.pathname === "/");

    let parts = getRouteParts(window.location.pathname);
    handleRoute(parts);

    history.replaceState(null, null, null);
});

function wireAudioTracks() {
    $('body').find('audio').mediaelementplayer(
        {
            // Called when player is loaded
            success: function (player, node) {

                AudioPlayer = player;
                AudioPlayerNode = node;
                AudioPlayerContainer = $(AudioPlayerNode).parents('.audio-list-player');

                $('.audio-track').each(function(key, track) {
                    AllTracks.push(track);
                    $(track).click(onClickTrack);
                });


                // Add styles when playing to make things a bit more obvious in the UI
                AudioPlayer.addEventListener('play', function(e) {
                    if (CurrentTrack != null) {
                        playerChange();
                        $(CurrentTrack).parents('.album').find('.album-title').addClass('audio-list-player-playing');
                    }
                    return false;
                });
                AudioPlayer.addEventListener('pause', function(e) {
                    if (CurrentTrack != null) {
                        $(CurrentTrack).parents('.album').find('.album-title').removeClass('audio-list-player-playing');
                    }
                    return false;
                });

                // Set up to auto-play the next track
                AudioPlayer.addEventListener('ended', function (e) {

                    if (singlePlay === true) {
                        singlePlay = false;
                        return false;
                    }

                    if (CurrentTrack != null) {
                        $(CurrentTrack).removeClass('playing');
                        $(CurrentTrack).parents('.album').find('.album-title').removeClass('audio-list-player-playing');

                        let idx = $.inArray(CurrentTrack, AllTracks);
                        let nextTrack = (idx + 1 < $(AllTracks).size()) ? AllTracks[idx + 1] : AllTracks[0];
                        $(nextTrack).click();

                        if ($(window).width() > 480) {
                            $(nextTrack).parents('.album').scrollIntoView();
                        } else {
                            $(nextTrack).scrollIntoView();
                        }
                    }
                    return false;
                });

            },

            // array of keyboard actions such as play pause
            keyActions: [
                {
                    keys: [
                        32, // SPACE
                        179 // GOOGLE play/pause button
                    ],
                    action: function(player, media) {
                        if (media.paused || media.ended) {
                            media.play();
                        } else {
                            media.pause();
                        }
                    }
                },
                {
                    keys: [38], // UP
                    action: function(player, media) {

                        if (CurrentTrack != null) {
                            let idx = $.inArray(CurrentTrack, AllTracks);
                            let prevTrack = (idx > 0) ? AllTracks[idx - 1] : AllTracks[$(AllTracks).size() - 1];
                            $(prevTrack).trigger('click');

                            if ($(window).width() > 480) {
                                $(prevTrack).parents('.album').scrollIntoView();
                            } else {
                                $(prevTrack).scrollIntoView();
                            }

                            $('.audio-list-player').find('button').first().focus();
                        }
                    }
                },
                {
                    keys: [40], // DOWN
                    action: function(player, media) {

                        if (CurrentTrack != null) {
                            let idx = $.inArray(CurrentTrack, AllTracks);
                            let nextTrack = (idx + 1 < $(AllTracks).size()) ? AllTracks[idx + 1] : AllTracks[0];
                            $(nextTrack).trigger('click');

                            if ($(window).width() > 480) {
                                $(nextTrack).parents('.album').scrollIntoView();
                            } else {
                                $(nextTrack).scrollIntoView();
                            }

                            $('.audio-list-player').find('button').first().focus();

                        }
                    }
                },
                {
                    keys: [
                        37, // LEFT
                        227 // Google TV rewind
                    ],
                    action: function(player, media) {
                        if (!isNaN(media.duration) && media.duration > 0) {
                            if (player.isVideo) {
                                player.showControls();
                                player.startControlsTimer();
                            }

                            // 5%
                            let newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
                            media.setCurrentTime(newTime);
                        }
                    }
                },
                {
                    keys: [
                        39, // RIGHT
                        228 // Google TV forward
                    ],
                    action: function(player, media) {
                        if (!isNaN(media.duration) && media.duration > 0) {
                            // 5%
                            let newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
                            media.setCurrentTime(newTime);
                        }
                    }
                },
                {
                    keys: [77], // M
                    action: function(player, media) {
                        player.container.find('.mejs-volume-slider').css('display','block');
                        if (player.media.muted) {
                            player.setMuted(false);
                        } else {
                            player.setMuted(true);
                        }
                    }
                }
            ]

        });

    // Hide player initially
    $('div.audio-list-player').fadeOut();
}

function findTrack(album, song) {
    return AllTracks.find(t => {
       let title = $(t).closest(".album").data("title");
       let track = $(t).data("track");
       return (title === album && track === song);
    });
}

function wirePanels(startMusic) {

    $('.column.about').click(function(event) {
        history.pushState(null, null, "/about");
    });

    $('.column.blog').click(function(event) {
        history.pushState(null, null, "/movies");
    });

    $('.column.contact').click(function(event) {
        history.pushState(null, null, "/contact");
    });

    $('.column.albums').click(function(event) {
        showMusicPlayer();
        //history.pushState(null, null, "/music");
    });

    $("#albumSort").click(toggleSortChoices);

    $(".sort-choice").click(function(e) {
        let sort = $(this).data("sort");
        albumSort(sort);
        e.preventDefault();

        return false;
    });

    albumSort(sortMode);

    $("#close").click(onClickClose);

    if (startMusic === true) {
        $('.column.albums').one("click", function(event) {
            if (!playedOnce) {
                playedOnce = true;
                // let firstTrack = AllTracks[0];
                let firstTrack = findTrack(FIRST_SONG_ALBUM, FIRST_SONG_TRACK);
                if (firstTrack === undefined)
                    firstTrack = AllTracks[0];
                $(firstTrack).click();
            }
        });
    }
}

/**
 * Interprets components of URL path
 * @param parts     Components of URL, parts[0] is the base URL
 */
function handleRoute(parts, firstLoad) {

    // Handle path in URL
    if (parts.length > 0) {

        let route = parts[0];
        switch (route) {

            case "about": {
                $('.column.about').click();
                break;
            }

            case "music": {
                let albums = $('.column.albums');
                albums.click();

                if (parts.length > 1) {

                    let title = parts[1];
                    let album = $(albums).find('.album').filter(function(idx) {
                        return ($(this).data("title") === title);
                    });

                    let trackEl;
                    if (parts.length > 2) {
                        let sel = ".audio-track[data-track='" + parts[2] + "']";
                        trackEl = $(album).find(sel).find('a');
                        singlePlay = true;
                    } else {
                        trackEl = $(album).find('.audio-track').first().find('a');
                    }

                    window.setTimeout(function() {
                        trackEl.scrollIntoView(false);
                        trackEl.click();
                    }, 1500);

                }

                break;
            }

            case "movies": {
                $('.column.blog').click();
                break;
            }

            case "contact": {
                $('.column.contact').click();
                break;
            }
        }
    }
}

function getRouteParts(url) {
    if ((url === undefined) || (url === null))
        return [];

    let parts = $(url.split("/")).filter(function(idx, el) {
        return (el !== "") && (el !== null);
    }).toArray();
    return parts;
}

function onClickClose(e) {
    let url = "/";
    history.pushState(url, "", url);
}

function toggleSortChoices(e) {

    let btn = $(e.target);

    if ($(btn).hasClass("sort-active")) {
        $(".sort-choice").hide();
        $(btn).removeClass("sort-active");
    } else {
        $(".sort-choice").show(100);
        $(btn).addClass("sort-active");
    }

    return false;
}

function albumSort(mode) {
    let wrapper = $('.albums .grids');
    let footer = $(wrapper).find('footer');

    $(".sort-choice").removeClass("sort-active");
    $(".sort-choice[data-sort=" + mode + "]").addClass("sort-active");

    switch (sortMode = mode) {
        case "newest":
        {
            $(wrapper).find('.album').sort(function (a, b) {
                return $(b).data('date') - $(a).data('date');
            }).appendTo(wrapper);
            break;
        }
        case "oldest":
        {
            $(wrapper).find('.album').sort(function (a, b) {
                return $(a).data('date') - $(b).data('date');
            }).appendTo(wrapper);
            break;
        }
        case "nameA":
        {
            $(wrapper).find('.album').sort(function (a, b) {
                return String.prototype.localeCompare.call($(a).find('.album-title').text().toLowerCase(), $(b).find('.album-title').text().toLowerCase());
            }).appendTo(wrapper);
            break;
        }
        case "nameZ":
        {
            $(wrapper).find('.album').sort(function (a, b) {
                return String.prototype.localeCompare.call($(b).find('.album-title').text().toLowerCase(), $(a).find('.album-title').text().toLowerCase());
            }).appendTo(wrapper);
            break;
        }
    }

    $(footer).appendTo(wrapper);

}

function onClickTrack(e) {

    let path = $('a', this).attr('href');
    let song = $('a', this).text();
    let composer = $('span', this).text();

    e.preventDefault();

    if (CurrentTrack != null) {
        $(CurrentTrack).removeClass('playing');
        $(CurrentTrack).parents('.album').find('.album-title').removeClass('audio-list-player-playing');
    }

    $(this).addClass('playing');
    CurrentTrack = this;
    pushCurrentTrackState(true);

    AudioPlayer.setSrc(path);
    AudioPlayer.load();
    AudioPlayer.play();

    $(AudioPlayerContainer).find('h4').html(song);
    $(AudioPlayerContainer).find('h5').html(composer);
    $(AudioPlayerContainer).find('button').first().focus();

    return false;
}

function playerChange() {

    // Visual cue for the current song box
    //let songElement = $('h4', '.mejs__controls');
    let songElement = $('h4', '.audio-list-player');

    $(songElement).css('webkitAnimationName', '');
    setTimeout(function() {
        $(songElement).addClass('greenGlow');
        $(songElement).css('webkitAnimationName', 'greenGlow');
    }, 10);

}

function pushCurrentTrackState(includeState) {
    if ((CurrentTrack === null) || (CurrentTrack === undefined))
        return;

    let root = $(CurrentTrack).parents('.albums').data("group");
    if ((root === null) || (root === undefined))
        return;

    let albumName = $(CurrentTrack).parents('.album').data("title");
    let trackName = $(CurrentTrack).data("track");
    let url = root + "/" + albumName + "/" + trackName;
    let state = (includeState === true) ? url : null;
    history.pushState(state, null, url);

    let trackTitle = $(CurrentTrack).find("a").text();
    document.title = "Max Crumble Orchestra - " + trackTitle;
}

function onHashChange(event) {

    if ((location.hash === null) || (location.hash === "")) {
        console.info("HashChange --> NULL");
    } else {
        console.info("HashChange --> " + location.hash);
    }
    //if (location.hash.length > 0) {
    //    let url = location.hash;
    //    requestView(url)
    //}
}

function onPopState(event) {

    console.info("PopState --> " + event.state);

    if (event.state !== null) {
        let parts = getRouteParts(event.state);
        handleRoute(parts);
    }
}

function onPushState(event) {

    console.info("PushState --> " + event.state);

}

