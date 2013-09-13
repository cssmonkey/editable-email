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

        var editableText = function () {

            emailIframe.contents().find('[data-texteditable="true"]').each(function (i) {
                $(this).attr('data-textindex','text_' + i);
            })

            emailIframe.contents().find('[data-texteditable="true"]').on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var text = $(this).html(),
                    html = $('<div class="container" data-element="' + $(this).data('textindex') + '"><h3 class="title">Text Editor</h3><div class="editor" name="editor" id="editor">' + text + '</div><div class="textSave submitBtn"><input type="submit" value="Update" / ></div></div>');

                popup.open(html);

            });

            emailIframe.contents().find('[data-texteditable="true"] a').on('click', function (e) {
                e.preventDefault();
            });

            $(document).on('setuprichtext', function () {
                tinyMCE.init({
                    // General options
                    mode: 'exact',
                    elements: 'editor',
                    theme: "modern",
                    plugins: "link",
                    menubar: false,
                    toolbar: "bold italic | link",
                });
            });

            $('.popup').on('click', '.textSave input', function (e) {
                e.preventDefault();

                var content = tinyMCE.activeEditor.getContent(),
                    textSelector = $('.popup .container').data('element'),
                    textElement = emailIframe.contents().find('[data-textindex="'+ textSelector +'"]');

                textElement.html(content);

                popup.close();
            });
            

        }
        editableText();

        var editableAnchors = function () {
            emailIframe.contents().find('a[data-editable="true"]').on('click', function (e) {
                e.preventDefault();

                var anchor = $(this),
                    title = '<h3 class="title">Link Editor</h3>',
                    href = $(this).attr('href'),
                    anchorText = $(this).text(),
                    anchorPreview = '<div class="preview anchor"><a target="_blank" data-orighref="' + href + '" href="' + href + '">' + anchorText + '</a></div>',
                    hrefField = '<div class="field"><label for="anchorhref">Link Href</label><input name="anchorhref" type="text" value="' + href + '"/></div>',
                    textField = '<div class="field"><label for="anchortext">Link Text</label><input name="anchortext" type="text" value="' + anchorText + '"/></div>',
                    submit = '<div class="anchorSave submitBtn"><input type="submit" value="Update" / ></div>',
                    html = $('<div class="container editanchor" />');

                html[0].innerHTML = title + anchorPreview + hrefField + textField + submit;

                popup.open(html);
            });

            $('.popup').on('keyup', '[name="anchorhref"]', function () {
                var newHref = $(this).val();

                $('.popup .anchor a').attr('href', newHref);
            });

            $('.popup').on('keyup', '[name="anchortext"]', function () {
                var newText = $(this).val();

                $('.popup .anchor a').text(newText);
            });

            $('.popup').on('click', '.anchorSave input', function (e) {
                e.preventDefault();

                var anchorHref = $('.popup .anchor a').data('orighref'),
                    anchorElem = emailIframe.contents().find('a[href="' + anchorHref + '"]'),
                    newHref = $('.popup [name="anchorhref"]').val(),
                    newText = $('.popup [name="anchortext"]').val();

                anchorElem.attr('href', newHref);
                anchorElem.text(newText);

                popup.close();
            });

        }
        editableAnchors();

        var editableImages = function () {
            // edit alt attr
            // edit src
            // make clickable (add an anchor)
            //  emailIframe.contents().find('img[data-editable="true"]').each
            emailIframe.contents().find('img[data-editable="true"]').on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var img = $(this),
                    imgSrc = $(this).attr('src'),
                    altAttr = $(this).attr('alt'),
                    title = '<h3 class="title">Image Editor</h3>',
                    link = $(this).parent(),
                    linkHref = (link.attr('href')) ? link.attr('href') : '',
                    imgPreview = '<div class="preview image"><a href="' + linkHref + '" target="_blank"><img data-origsrc="' + imgSrc + '" src="' + imgSrc + '" alt="" /></a></div>',
                    srcField = '<div class="field"><label for="imagesrc">Image Src</label><input name="imagesrc" type="text" value="' + imgSrc + '"/></div>',
                    altField = '<div class="field"><label for="imagealt">Image Alt Attr</label><input name="imagealt" type="text" value="' + altAttr + '"/></div>',
                    hrefField = '<div class="field"><label for="imagehref">Link Href</label><input name="imagehref" type="text" value="' + linkHref + '"/></div>',
                    submit = '<div class="imageSave submitBtn"><input type="submit" value="Update" / ></div>',
                    html = $('<div class="container editimage" />');

                html[0].innerHTML = title + imgPreview + srcField + altField + hrefField + submit;

                popup.open(html);
            });

            $('.popup').on('keyup', '[name="imagesrc"]', function () {
                var newSrc = $(this).val();

                $('.popup .image img').attr('src', newSrc);
            });

            $('.popup').on('keyup', '[name="imagealt"]', function () {
                var newAlt = $(this).val();

                $('.popup .image img').attr('alt', newAlt);
            });

            $('.popup').on('keyup', '[name="imagehref"]', function () {
                var newHref = $(this).val();

                $('.popup .image a').attr('href', newHref);
            });

            $('.popup').on('click', '.imageSave input', function (e) {
                e.preventDefault();

                var imageSrc = $('.popup img').data('origsrc'),
                    image = emailIframe.contents().find('img[src="' + imageSrc + '"]'),
                    newImageSrc = $('.popup [name="imagesrc"]').val(),
                    newImageAlt = $('.popup [name="imagealt"]').val(),
                    newImageHref = $('.popup [name="imagehref"]').val();

                image.attr('src', newImageSrc);
                image.attr('alt', newImageAlt);

                if (newImageHref && !image.parent('a').length > 0) {
                    image.wrap('<a class="imageLink" data-editable="true" href="' + newImageHref + '" />')
                }
                else if (!newImageHref && image.parent('a').length) {
                    image.parent('a').removeAttr('href');
                }
                else if (newImageHref && image.parent('a').length) {
                    image.parent('a').attr('href', newImageHref);
                }

                popup.close();
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
                emailIframe.contents().find('[data-texteditable]').removeAttr('data-texteditable');
                emailIframe.contents().find('[data-editable]').removeAttr('data-editable');


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

            $(document).trigger('setuprichtext');

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



