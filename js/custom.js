/* Opening Animations */
var homebody = $("#home");
var section = $("section");
var sidemenu = $("nav ul li");
$(document).ready(function () {
    "use strict";
    section.eq(0).addClass("show");
    background();
    mobileheader();
    subtitle();
    if ($(window).width() < 480) {
        $('.content').find(".grids").slideUp(100);
    }
});
function loading() {
    "use strict";
    $('body').find('#loading').fadeOut();
}

function mobileheader() {
    "use strict";
    if ($(window).width() < 480) {
        $('.main').find('#mobile-header-image').show();
    } else {
        $('.main').find('#mobile-header-image').hide();
    }
}
function subtitle() {
    "use strict";
    if ($(window).width() < 650) {
    } else {
        $('header h2').removeClass('animated fadeOutDown').css('width','100%').delay(2000).fadeIn(1000);
    }
}
function subtitleHide() {
    "use strict";
    if ($(window).width() < 650) {
    } else {
        $('header h2').addClass('animated fadeOutDown').stop().delay(100).fadeOut(1000).animate({
            'width': '0%'
        }, 10);
    }
}

/* Article Opening Effect */
function openeffect() {
    "use strict";
    if ($(window).width() > 1024) {
        var clm = $(".show .column");
        clm.each(function (i) {
            var e = $(this);
            e.fadeTo(0, 0);
            setTimeout(function () {
                e.fadeTo(250, 1);
            }, i * 250);
        });
    }
}

/* Article Backgrounds */
function background() {
    "use strict";
    if ($(window).width() > 480) {
        homebody.backstretch("images/bg.png");
        $('.main').find(".about").backstretch("images/photos/main_1.jpg");
        $('.main').find(".albums").backstretch("images/photos/main_2.jpg");
        $('.main').find(".blog").backstretch("images/photos/main_3.jpg");
        $('.main').find(".contact").backstretch("images/photos/main_4.jpg");
    }
}

/* Clear Background Images */
function clear() {
    "use strict";
    $('.main').find(".backstretch img").remove();

}

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

if ($(window).width() > 480) {

    /* Homepage Article Effects */
    var clmn = $('.column');
    var curtain = $('#curtain');
    clmn.on("click",

        function (event) {
            "use strict";
            curtain.stop().animate({
                'height': '0%'
            }, 10);
            var $clickedElement = $(event.target);
            var $theid = $clickedElement.closest(clmn);

            if ($theid.hasClass('active') === false) {
                $theid.addClass('active');

                subtitleHide();

                clmn.each(function () {
                    var e = $(this);
                    if (e.hasClass('active')) {
                        $(this).stop().fadeOut(1000).delay(500).animate({
                            'width': '100%'
                        }, 10).fadeIn(500);
                    } else {
                        $(this).addClass('animated fadeOutDown').delay(200).stop().fadeOut(1000).animate({
                            'width': '0%'
                        }, 10);
                    }
                });
                $('.main').find('.active .desc').stop().delay(1000).animate({
                    'marginLeft': '25%'
                }, 1000).delay(200).animate({
                    'width': '75%',
                    'height': '100%',
                    'padding-top': '80px'
                }, 1000);

                homebody.find('#close').fadeIn();
            }
        });

    homebody.find('#close').on("click",

        function () {
            "use strict";
            clmn.removeClass('animated fadeOutDown');
            curtain.stop().animate({
                'height': '100%'
            }, 500);
            $('.main').find('.active').stop().animate({
                'width': '25%'
            }, 1000);
            clmn.stop().delay(1000).animate({
                'width': '25%'
            }, 1000).delay(200).fadeIn("slow");

            clmn.find('.desc').stop().animate({
                scrollTop: 0,
                'height': '125px',
                'width': '100%',
                'padding-top': '0px'
            }, 800).animate({
                'marginLeft': '0'
            }, 1000);
            homebody.find('#close').fadeOut();

            subtitle();

            clmn.removeClass('active');
        });

    /* Paging Effects */
    /*
    var nextlink = $('#next');
    var prevlink = $('#prev');
    nextlink.on("click", function () {
        "use strict";
        $("body").find(".show").removeClass('show').next().addClass('show');
        clear();
        openeffect();
        background();

        if (section.first().hasClass('show')) {
            prevlink.fadeOut();
        } else {
            prevlink.delay(1500).fadeIn();
        }
        if (section.last().hasClass('show')) {
            nextlink.fadeOut();
        } else {
            nextlink.delay(1500).fadeIn();
        }

    });

    prevlink.on("click", function () {
        "use strict";
        $("body").find(".show").removeClass('show').prev().addClass('show');
        clear();
        openeffect();
        background();

        if (section.first().hasClass('show')) {
            prevlink.fadeOut();
        } else {
            prevlink.delay(1500).fadeIn();
        }
        if (section.last().hasClass('show')) {
            nextlink.fadeOut();
        } else {
            nextlink.delay(1500).fadeIn();
        }

    });
    */

}
if ($(window).width() < 480) {
    var dsc = $('.desc');
    var grds = $('.grids');
    dsc.on("click", function (event) {
        "use strict";
        var $clickedElement = $(event.target);
        var $theid = $clickedElement.closest(dsc);
        var $allListElements = $(grds);
        $theid.find($allListElements).slideToggle();
        $(grds).toggleClass('active-grid');
    });
}
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
});


/* Sidebar Menu */
/*
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
*/

/////////////////* LOADING ANIMATION ( DON'T REMOVE ! ) */////////////////////////

window.onload = loading();