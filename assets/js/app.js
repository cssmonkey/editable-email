window.EQTR = (function (module, $) {
    "use strict";

    $(function () {
        $('.emailholder').load(function () {
            module.emailEditor();
        });
        popup.init();
    });

    module.emailEditor = function () {
        var windowHeight = $(window).height();
        var emailIframe = $('.emailholder');

        // set the email iframe to be the same height as the browser window
        $('.emailholder').height(windowHeight);


        var editableImages = function () {
            // edit alt attr
            // edit src
            // make clickable (add an anchor)
            //  emailIframe.contents().find('img[data-editable="true"]').each
            emailIframe.contents().find('img[data-editable="true"]').on('click', function () {
                var imgSrc = $(this).attr('src'),
                    altAttr = $(this).attr('alt'),
                    imgPreview = '<div class="image"><img src="'+ imgSrc +'" alt="" /></div>',
                    srcField = '<div class="field"><label for="imagesrc">Image Src</label><input name="imagesrc" type="text" value="' + imgSrc + '"/></div>',
                    altField = '<div class="field"><label for="imagealt">Image Alt Attr</label><input name="imagealt" type="text" value="' + altAttr + '"/></div>',
                    html = $('<div class="container" />');

                html[0].innerHTML = imgPreview + srcField + altField;

                popup.open(html);
            });
        }
        editableImages();

        var emailEditorControls = function () {

            // Generate HTML
            $('.generateHTML').on('click', function (e) {
                e.preventDefault();

                generateHTML();
            });

            // Reset page 
            $('.resetLink').on('click', function (e) {
                e.preventDefault();

                resetPage();
            });

            // Highlight editable regions
            $('.editableRegionsToggle').on('change', function (e) {
                if ($(this).prop('checked')) {
                    emailIframe.contents().find('html').addClass('highlightRegions');
                }
                else {
                    emailIframe.contents().find('html').removeClass('highlightRegions');
                }
            });

            // Discard changes and reset the page
            function resetPage() {
                location.reload();
            }

            // Clean-up HTML and generate HTML markup
            function generateHTML() {

                // strip out any classnames or attrs added by editor interface
                emailIframe.contents().find('html').removeClass('highlightRegions');
                emailIframe.contents().find('[contenteditable]').removeAttr('contenteditable');


                var html = window.frames['emailholder'].document.documentElement.outerHTML;

                $('.textFieldHolder .htmlField').val(html);
                if ($('.textFieldHolder').is(':hidden')) {
                    $('.textFieldHolder').slideDown(function () {
                        scrollPage($(this), 60);
                    });
                }
            }
        }
        emailEditorControls();
    }


    /*---------------------------------------------------
    [ Reusable/Global Stuff ] 
    --------------------------------------------------- */

    var popup = {
        init: function () {
            $('.modal').on('click', function () {
                popup.close();
            })
        },
        open: function (content) {
            var $popup = $('.popup');

            $('.content', $popup).html(content);
            $popup.css({ marginTop: -($popup.height() / 2) });

            $('html').addClass('showPopup');
        },
        close: function () {
            $('html').removeClass('showPopup');
            $('.popup').removeAttr('style').find('.contents').html('');
        }
    }


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



