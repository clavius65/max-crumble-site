/* Menu Icons Effect */
/*
var menuitem = $(".menuitem");
menuitem.hover(

function (event) {
    "use strict";
    var $clickedElement = $(event.target);
    var $theid = $clickedElement.closest(menuitem);
    var $allListElements = menuitem.find('.info');
    $theid.find($allListElements).slideDown(100);

},

function (event) {
    "use strict";
    var $clickedElement = $(event.target);
    var $theid = $clickedElement.closest(menuitem);
    var $allListElements = menuitem.find('.info');
    $theid.find($allListElements).slideUp(100);
});
*/

/////////////////* COMMENTS */////////////////////////

var cmnts = $('#read-comments');
cmnts.on("click", function () {
    "use strict";
    $('body').find('.comments_block').slideDown(1000);
    $('body').find('.comment-link').fadeOut();
});

/////////////////* TABS */////////////////////////

$(document).ready(function () {
    "use strict";
    $("body").find("#tab-content div").hide();
    $("body").find("#tabs li:first").attr("id", "current");
    $("body").find("#tab-content div:first").fadeIn();

    $("body").find('#tabs a').on("click", function (e) {
        e.preventDefault();
        $("body").find("#tab-content div").hide();
        $("body").find("#tabs li").attr("id", "");
        $(this).parent().attr("id", "current");
        $('#' + $(this).attr('title')).fadeIn();
    });

    mobiletitle();
});

/////////////////* Title Size */////////////////////////

function mobiletitle() {
    "use strict";
    if ($(window).width() < 1024) {
        $('header .title-regular').hide();
        $('header .title-small').show();
    } else {
        $('header .title-regular').show();
        $('header .title-small').hide();
    }
}

function onWindowResize(callback) {
    var width = jQuery(window).width(),
        height = jQuery(window).height();

    jQuery(window).resize(function () {
        var newWidth = jQuery(window).width(),
            newHeight = jQuery(window).height();

        if (newWidth !== width || newHeight !== height) {
            width = newWidth;
            height = newHeight;
            callback();
        }
    });
}

onWindowResize(function () {
    "use strict";
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) === false) {
        if (window.RT) clearTimeout(window.RT);
        window.RT = setTimeout(function () {
            location.reload();
        }, 200);
    }
});

/////////////////* Go to top link */////////////////////////

$("#credits").find('#top').on("click", function () {
    "use strict";
    var bdy = $('html, body');
    bdy.animate({ scrollTop: 0 }, 'slow');
});

/* Sidebar Menu */
var sidemenu = $("nav ul li");

sidemenu.on("click", function (event) {
    "use strict";
    var $clickedElement = $(event.target);
    var $theid = $clickedElement.closest(sidemenu);
    var $allListElements = $theid.find('ul li');
    if ($theid.hasClass('side-active')) {
        $allListElements.slideUp(100);
        $theid.find($allListElements).removeClass('animated fadeInLeft');
        $theid.removeClass('side-active');
    }
    else {
        $theid.addClass('side-active');
        $allListElements.slideDown(100);
        $theid.find($allListElements).addClass('animated fadeInLeft');
    }

});

/////////////////* URL parameters */////////////////////////

var getUrlParameter = function (sParam, defaultValue) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }

    return defaultValue;
};
