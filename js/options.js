function load_options() {
  chrome.storage.sync.get({
    ignoredDomains: [],
  },
  function(items) {

    // First removed all entries from the table, so they can
    // be repopulated.  This will eliminate any inconsistencies we may
    // have by merely updating the view.
    $('#ignoredDomains tr').remove();

    // Add all of the ignored domains to the ignored domains table
    for (var index in items.ignoredDomains) {
      $('#ignoredDomains> tbody:last-child').append(
        $('<tr/>').append(
          $('<td/>').text(items.ignoredDomains[index]),
          $('<td/>').append('<button/>')
        )
      );
    }
  });
}

function add_ignore_domain() {
  var newDomain = $('#newDomainToIgnore').val();
  chrome.storage.sync.get({
    ignoredDomains: [],
  },
  function(items) {
    var newDomains = items.ignoredDomains;
    newDomains.push(newDomain);
    chrome.storage.sync.set({
      ignoredDomains: newDomains
    }, function () {
      load_options();
      $('newDomainToIgnore').val('');
    });
  });
}

$(document).ready(function() {
  load_options();
  $('#addIgnoredDomain').click(add_ignore_domain);
});
