window.EQTR = (function (module, $) {
    "use strict";

    $(function () {
        module.createEmail(); 
    });

    module.createEmail = function () {
        var windowHeight = $(window).height();

        $('.emailholder').height(windowHeight);

        var bindEvents = function () {
            $('.createNewEmailLink').on('click', function (e) {
                e.preventDefault();

                var frame = window.frames['emailholder'];
                generateHTML(frame);
            });
            $('.resetLink').on('click', function (e) {
                e.preventDefault();

                resetPage();
            });
            $('.editableRegionsToggle').on('change', function (e) {
                if ($(this).prop('checked')) {
                    $('html').addClass('highlightRegions');
                }
                else {
                    $('html').removeClass('highlightRegions');
                }
            });
        }
        bindEvents();

        function resetPage() {
            location.reload();
        }

        function generateHTML(frame) {

            var html = frame.document.documentElement.outerHTML;

            $('.textFieldHolder .htmlField').val(html);
            if($('.textFieldHolder').is(':hidden')) {
                $('.textFieldHolder').slideDown(function () {
                    scrollPage($(this), 60);
                });
            }
        }
    }


    /*---------------------------------------------------
    [ Reusable/Global Stuff ] 
    --------------------------------------------------- */


    /* Scroll to a specified element. Scroll postion can be offset by a specified amount. 
       Element selector and offset are passed through as params. */
    var scrollPage = function (elem, offset) {
        var topPos = (elem ? elem.offset().top - offset : 0);

        $('html,body').animate({
            scrollTop: topPos
        }, 500, function () {
            $('html,body').clearQueue();
        });
    };

    return module;
})(window.EQTR || {}, window.jQuery);



