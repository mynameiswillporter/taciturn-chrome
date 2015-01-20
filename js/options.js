var my_domains = [];

//step over domains and get the exclusions
function save_options()
{
    var options = get_supported_checks();
    var save = options;
    var domain = {};

    $(".addme").each(function() {
        var children = $(this);
        //iterate over each domain with a saved setting
        for (var i = 0; i < children.length; i++)
        {
            var temp_domain = children[i]['textContent'];
            //define an empty dict for the domain
            domain[temp_domain] = {};
            
            //iterate over the option categories
            //options is in {category:option} format
            var counter = 0;
            for (var category in options)
            {
                if (options.hasOwnProperty(category) && category != "count")
                {
                    if (domain[temp_domain][category] == null)
                    {
                        domain[temp_domain][category] = {};
                    }
                    //iterate over the options within the category
                    for (var x = 0; x < options[category].length; x++)
                    {
                        //determine if it is checked or not
                        if (document.getElementById(temp_domain + counter).checked)
                        {
                            domain[temp_domain][category][options[category][x]] = 1;
                        }
                        else
                        {
                            domain[temp_domain][category][options[category][x]] = 0;
                        }
                        counter++;
                    }
                }
            }
        }
        //debug: print out our completed object
        console.log(JSON.stringify(domain, null, 4));
    });

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

    /*
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
    */
    //end temporary

    body.appendChild(table);
}

function get_supported_checks()
{
    //this is a list of supported checks.  currently, it is hard-coded in code
    //it should be moved to chrome.storage.sync
    //**must** be alphabetical (though I think this will happen automatically when we move it to the chrome storage)
    options = {"cookies": ["csrf", "session"], "headers": ["missing", "present"], "html": ["hidden_field"], "urls": ["session fixation"], "count": 6};
    return options;
}

function restore_options()
{
    var options = get_supported_checks();
    create_options_page(options);
    chrome.storage.sync.get(
       'ignoredDomains',
    function(items) {
        console.log("loaded " + JSON.stringify(items, null, 4));
        for (var item in items.ignoredDomains)
        {
            console.log("loaded domain " + item);
            my_domains.push(item);
            console.log("object - " + JSON.stringify(items.ignoredDomains[item], null, 4));
            var table = document.getElementById('myTable');
            var tr3 = document.createElement('tr');
            var td = document.createElement('td');
            td.className = 'domain';
            td.id = 'domain';
            td.appendChild(document.createTextNode(item));
            tr3.className = 'addme';
            tr3.appendChild(td);
            var counter = 0;
            //iterate over options
            for (var category in items.ignoredDomains[item])
            {
                if (items.ignoredDomains[item].hasOwnProperty(category) && category != "count")
                {
                    //iterate over values of those options
                    for (var option in items.ignoredDomains[item][category])
                    {
                        if (items.ignoredDomains[item][category].hasOwnProperty(option) && option != "count")
                        {
                            var td = document.createElement('td');
                            td.classname = item;
                            td.id = item;
                            var input = document.createElement('input');
                            input.type = 'checkbox';
                            input.id = item + counter;
                            console.log("Item: " + category + "/" + option);
                            console.log("Value: " + items.ignoredDomains[item][category][option]);
                            console.log("Counter: " + counter)
                            if (items.ignoredDomains[item][category][option] == 1)
                            {
                                input.checked = true;
                            }
                            td.appendChild(input);
                            tr3.appendChild(td);
                            counter++;
                        }
                    }
                }
            }
            table.appendChild(tr3);
        }
    });
}

function add_domain()
{
    var options = get_supported_checks();
    //doesn't follow the technical spec, but makes an effort to validate
    var valid_domain = /^[a-z0-9\-]+\.[a-z0-9\-]+$/i;
    var input = $('.addDomain').val();
    //be nice and reset the textbox
    $('.addDomain').val('');
    
    //failure conditions
    if (!valid_domain.test(input))
    {
        console.log('Rejected invalid domain')
        return;
    }
    if (my_domains.indexOf(input) >= 0)
    {
        console.log('Already added. Idiot.')
        return;
    }
    else
    {
        my_domains.push(input);
    }
        
    //generate the HTML and add it. This will probably eventually need to be changed
    var HTML = '<tr class="addme"><td class="domain" id="domain">' + input + '</td>';
    for (var i = 0; i < options['count']; i++)
    {
        HTML += '<td id="' + input + '"><input type="checkbox" id="' + input + i + '">';
    }
    HTML += '</tr>';
    console.log(HTML);
    //generate the row and add it
    $('#myTable tr:last').after(HTML);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('add').addEventListener('click',
    add_domain);