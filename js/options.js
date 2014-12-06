function save_options()
{
    var options = get_supported_checks();
    var save = options;
    var domain = {};

    //step over domains and get the exclusions

    $(".addme").each(function() {
        var children = $(this);
        //console.log("hi"+children);
        for (var i = 0; i < children.length; i++)
        {
            var checked = 0;
            console.log("searching for '" + children[i]['textContent'] + i + "'")
            //$("#" + children[i]['textContent'] + i).each(function(){
            $("#google.com0").each(function() {
                console.log("hello" + ($this).checked)
                if ($(this).checked)
                    checked = 1;
                else
                    checked = 0;
            });
            console.log(i);
            domain[children[i]['textContent']] = {};

            for (var key in options) 
            {
                if (options.hasOwnProperty(key) && key != "count") 
                {
                    domain[children[i]['textContent']][key] = {};
                    for (var x = 0; x < options[key].length; x++)
                    {
                        if (checked)
                        {
                            domain[children[i]['textContent']][key][options[key][x]] = 1;    
                            console.log("checked");
                        }
                        else
                        {
                            domain[children[i]['textContent']][key][options[key][x]] = 0;
                            console.log("not checked");
                        }
                    }
                    
                    //console.log("hey, does it work " + JSON.stringify(domain, null, 4));
                }
            }
            
            //we really should pull this out of the body, but for now hard code
            //console.log("hihih" +JSON.stringify(domain, null, 4));
            domain[domain.length] = children[i]['textContent'];
        }
    });

    //domain.push(document.getElementById('domain').value);
    chrome.storage.sync.set({
        ignoredDomains: domain
    }, function () {
        //Update status to let user know options were saved
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
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
    table.setAttribute('id', 'myTable');
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

    ///*
    //temporary. remove before pushing
    var tr3 = document.createElement('tr');
    var td = document.createElement('td');
    td.className = 'domain';
    td.id = 'domain';
    td.appendChild(document.createTextNode('google.com'));
    tr3.className = 'addme';
    tr3.appendChild(td);
    
    for (var i = 0; i < 6; i++)
    {
        var td = document.createElement('td');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'google.com' + i;
        td.appendChild(input);
        tr3.appendChild(td);
    }
    table.appendChild(tr3);
    //*/
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
    chrome.storage.sync.get(
        //ignoredDomains: ['Google'],
       'ignoredDomains', 
    function(items) {
        //console.log("hello " + JSON.stringify(items, null, 4));
        for (item in items.ignoredDomains)
        {
            console.log("loaded domain " + item);// items.ignoredDomains[item]);
            console.log("Full object - " + JSON.stringify(items.ignoredDomains[item], null, 4));
            var table = document.getElementById('myTable');
            //document.getElementById('domain').value = Items.ignoredDomains[item];
            var tr3 = document.createElement('tr');
            var td = document.createElement('td');
            td.className = 'domain';
            td.id = 'domain';
            td.appendChild(document.createTextNode(items.ignoredDomains[item]));
            tr3.className = 'addme';
            tr3.appendChild(td);
            //iterate over options
            for (var key in items.ignoredDomains[item]) 
            {
                if (items.ignoredDomains[item].hasOwnProperty(key) && key != "count") 
                {
                    //iterate over values of those options
                    for (var key2 in items.ignoredDomains[item][key])
                    {
                        if (items.ignoredDomains[item][key].hasOwnProperty(key2) && key2 != "count")
                        {
                            var td = document.createElement('td');
                            td.classname = item;
                            td.id = item;
                            var input = document.createElement('input');
                            input.type = 'checkbox';
                            console.log("Item: " + key + "/" + JSON.stringify(items.ignoredDomains[item][key][key2], null, 4)); 
                            console.log("Vaue: " + key2);
                            console.log("Row " + tr3);
                            if (items.ignoredDomains[item][key][key2] == 1)
                            {
                                input.checked = key2;   
                            }
                            td.appendChild(input);
                            tr3.appendChild(td);
                        }
                    }
                }
            }
            table.appendChild(tr3);
        }
       });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
