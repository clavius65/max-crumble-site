var AudioPlayer = null;
var AudioPlayerNode = null;
var AudioPlayerContainer = null;
var AllTracks = new Array();
var CurrentTrack = null;
var playedOnce = false;
var singlePlay = false;
var sortMode = 'newest';  // oldest, newest, nameA, nameZ

$(function() {

    //window.onhashchange = onHashChange;
    //window.onpopstate = onPopState;
    //window.onpushstate = onPushState;
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onPopState);
    window.addEventListener('pushstate', onPushState);

    wireAudioTracks();
    wirePanels(window.location.pathname === "/");

    var parts = getRouteParts(window.location.pathname);
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

                        var idx = $.inArray(CurrentTrack, AllTracks);
                        var nextTrack = (idx + 1 < $(AllTracks).size()) ? AllTracks[idx + 1] : AllTracks[0];
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
                            var idx = $.inArray(CurrentTrack, AllTracks);
                            var prevTrack = (idx > 0) ? AllTracks[idx - 1] : AllTracks[$(AllTracks).size() - 1];
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
                            var idx = $.inArray(CurrentTrack, AllTracks);
                            var nextTrack = (idx + 1 < $(AllTracks).size()) ? AllTracks[idx + 1] : AllTracks[0];
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
                            var newTime = Math.max(media.currentTime - player.options.defaultSeekBackwardInterval(media), 0);
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
                            var newTime = Math.min(media.currentTime + player.options.defaultSeekForwardInterval(media), media.duration);
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
        //history.pushState(null, null, "/music");
    });

    $("#albumSort").click(function(e) {

        if ($(this).hasClass("active")) {
            $(".sort-choice").hide();
            $(this).removeClass("active");
        } else {
            $(".sort-choice").show(100);
            $(this).addClass("active");
        }

        //$(".sort-choice").toggle();
        //$(this).toggleClass("active");
        return false;
    });

    $(".sort-choice").click(function(e) {
        var sort = $(this).data("sort");
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
                var firstTrack = AllTracks[0];
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

        var route = parts[0];
        switch (route) {

            case "about": {
                $('.column.about').click();
                break;
            }

            case "music": {
                var albums = $('.column.albums');
                albums.click();

                if (parts.length > 1) {

                    var title = parts[1];
                    var album = $(albums).find('.album').filter(function(idx) {
                        return ($(this).data("title") === title);
                    });

                    var trackEl;
                    if (parts.length > 2) {
                        var sel = ".audio-track[data-track='" + parts[2] + "']";
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

    var parts = $(url.split("/")).filter(function(idx, el) {
        return (el !== "") && (el !== null);
    }).toArray();
    return parts;
}

function onClickClose(e) {
    var url = "/";
    history.pushState(url, "", url);
}

function albumSort(mode) {
    var wrapper = $('.albums .grids');
    var footer = $(wrapper).find('footer');

    $(".sort-choice").removeClass("active");
    $(".sort-choice[data-sort=" + mode + "]").addClass("active");

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

    var path = $('a', this).attr('href');
    var song = $('a', this).text();
    var composer = $('span', this).text();

    e.preventDefault();

    if (CurrentTrack != null) {
        $(CurrentTrack).removeClass('playing');
        $(CurrentTrack).parents('.album').find('.album-title').removeClass('audio-list-player-playing');
        //pushCurrentTrackState(true);
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
    //var songElement = $('h4', '.mejs__controls');
    var songElement = $('h4', '.audio-list-player');

    $(songElement).css('webkitAnimationName', '');
    setTimeout(function() {
        $(songElement).addClass('greenGlow');
        $(songElement).css('webkitAnimationName', 'greenGlow');
    }, 10);

}

function pushCurrentTrackState(includeState) {
    if ((CurrentTrack === null) || (CurrentTrack === undefined))
        return;

    var albumName = $(CurrentTrack).parents('.album').data("title");
    var trackName = $(CurrentTrack).data("track");
    var url = "/music/" + albumName + "/" + trackName;
    var state = (includeState === true) ? url : null;
    history.pushState(state, null, url);

    var trackTitle = $(CurrentTrack).find("a").text();
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
        var parts = getRouteParts(event.state);
        handleRoute(parts);
    }
}

function onPushState(event) {

    console.info("PushState --> " + event.state);

}

