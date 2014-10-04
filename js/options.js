function save_options()
{

    var domain = [];
    domain.push(document.getElementById('domain').value);
    chrome.storage.sync.set({
        ignoredDomains: domain
    }, function () {
        //Update status to let user know options were saved
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimoeout(function () {
            status.textContent = '';
        }, 750);
    });

}

function restore_options()
{
    //use the default value = 'google'
    chrome.storage.sync.get({
        ignoredDomains: ['Google'],
    }, function(items) {
        for (item in items.ignoredDomains)
        {
            document.getElementById('domain').value = items.ignoredDomains[item];
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
