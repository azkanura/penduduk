// -------------------------------------------------------------------------
// Initialize DEMO

$(function () {
    var file = String(document.location).split('/').pop();

    // Remove unnecessary file parts
    file = file.replace(/(\.html).*/i, '$1');

    if (!/.html$/i.test(file)) {
        file = 'index.html';
    }

    // Activate current nav item
    $('body > .px-nav')
        .find('.px-nav-item > a[href="' + file + '"]')
        .parent()
        .addClass('active');

    $('body > .px-nav').pxNav();
    $('body > .px-footer').pxFooter();

    $('#navbar-notifications').perfectScrollbar();
    $('#navbar-messages').perfectScrollbar();
});