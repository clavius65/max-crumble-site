/* Menu Icons Effect */
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
