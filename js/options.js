function save_options()
{

    var options = get_supported_checks();
    var save = options;

    //step over domains and get the exclusions

    $(".addme").each(function() {
        var children = $(this);
        console.log(children);
        for (var i = 0; i < children.length; i++)
        {
            console.log(i + ' ' + children[i]);
/*
            if (children[i].find('td') == 1)
            {
                console.log('hi');
            }
*/
        }
    });

    /*
    $(".domain").each(function() {
        //get anything checked
        console.log('looking at ' + $(this).text() + ', with a length of ' + options.count);
        for (var i = 0; i < options.count; i++)
        {
            var name = '#' + $(this).text() + i;
            console.log(name);
            $(name).each(function() {
                console.log('value: ' + $(this).checked);
            });
        }
    });
*/
/*
    for (each in options)
    {
        for (each2 in options[each])
        {
            save[each][each2] = {options[each][each2]: []};
            console.log(options[each][each2]);
            //if (options[each][each2].length > 0)
            //{
            //    console.log(options[each][each2]);
            //}
        }
    }
*/
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

function create_options_page(options)
{
    //create the page based on passed in options
    var body = document.getElementsByTagName('body')[0];

    //create the table and set atributes
    var table = document.createElement('table');
    table.style.width = '100%';
    table.setAttribute('border', '1');
    var tbody = document.createElement('tbody');

    //create the top row with groups of things we're looking for
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.setAttribute('rowspan', '2');
    th.appendChild(document.createTextNode('Domain'));
    tr.appendChild(th);

    //create the second row with things we're looking for
    var tr2 = document.createElement('tr');

    for (key in options)
    {
        if (key != 'count')
        {
        var th = document.createElement('th');
        th.setAttribute('colspan', options[key].length);
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);

        //step through each sub-item and add them to the second header row so we can append them later
        for (key2 in options[key])
        {
            var th2 = document.createElement('th');
            th2.setAttribute('colspan', '1');
            th2.appendChild(document.createTextNode(options[key][key2]));
            tr2.appendChild(th2);
        }
        }
    }

    //add the table to the page
    table.appendChild(tr);
    table.appendChild(tr2);

    //temporary. remove before pushing
    var tr3 = document.createElement('tr');
    var td = document.createElement('td');
//    td.id = 'domain';
    td.className = 'domain';
    td.appendChild(document.createTextNode('google.com'));
    tr3.className = 'addme';
    tr3.appendChild(td);
    
    for (var i = 0; i < 6; i++)
    {
        var td = document.createElement('td');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = 'google.com' + i;
        td.appendChild(input);
        tr3.appendChild(td);
    }
    table.appendChild(tr3);
    //end temporary

    body.appendChild(table);
}

function get_supported_checks()
{
    //this is a list of supported checks.  currently, it is hard-coded in code
    //it should be moved to chrome.storage.sync
    options = {"html": ["hidden_field"], "cookies": ["csrf", "session"], "headers": ["present", "missing"], "urls": ["session fixation"], "count": 6};
    return options;
}

function restore_options()
{
    var options = get_supported_checks();
    create_options_page(options);
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
