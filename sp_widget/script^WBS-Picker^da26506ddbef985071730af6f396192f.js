(function() {

    //name become u_wbs_number
    data.pageSize = 500;


    var dep = new GlideRecord('u_evt_wbs');

    if (input.id) {
        //Get selected wbs;
        var sys_ids = [];
        var labels = [];
        var label = '';

        var selected = new GlideRecord('u_evt_wbs');
        selected.addQuery('sys_id', 'IN', input.selected).addOrCondition('sys_id', 'IN', input.id);
        selected.orderBy('u_wbs_number');
        selected.query();

        while (selected.next()) {
            label = selected.u_wbs_number.toString();
            label = label.replace(/,/g, "&#44"); //Replace any erroneous commas with character code "&#44" so we can make a comma seperated list

            labels.push(label);
            sys_ids.push(selected.sys_id.toString());
        }
        data.sys_ids = sys_ids.join();
        data.labels = labels.join();

        return;
    }


    if (input.page) {
        //console.log(input);
        data.treedata = [];
        var filter = input.filter.toLowerCase();

        if (filter)
            data.pageSize = 500;

        var page = input.page - 1; //We want to be 0 indexed
        var start = (page * data.pageSize);
        var end = ((page + 1) * data.pageSize);

        dep.addNullQuery('u_parent');
        dep.orderBy('u_wbs_number');
        // select only the project from the controller
        dep.addQuery('u_project', input.u_project);
        //dep.addQuery('u_project', '1df43921db67d85071730af6f3961927');
        dep.chooseWindow(start, end, true);
        dep.query();

        if (!filter)
            data.count = dep.getRowCount();
        else
            data.count = 0;
        //console.log("Count " + data.count + " / " + data.pageSize);
        while (dep.next()) {
            var sys_id = dep.getValue('sys_id');
            var name = dep.getValue('u_wbs_number');
            var title = dep.getValue('u_title');

            var gr = new GlideRecord('u_evt_wbs');

            //Only show if a child down below contains the search string in the name
            if (filter) {
                var hasChildrenWithName = hasChildWithName(dep.sys_id, filter);
                if (!hasChildrenWithName)
                    continue;
            }

            gr.get(sys_id);

            var node = {};
            //node.label = name ;
            node.label = name + ' - ' + title;
            node.id = sys_id;
            //node.depID = gr.getValue('u_id');  - want to eliminate this u_id field from u_evt_wbs if possible
			node.depID = gr.getValue('u_wbs_number');
            node.children = findChildren(gr, filter, false);
            if (!filter && name.indexOf('Topdanmark') != 0) //Collapse tree if showing full tree view
                node.collapsed = true;
            data.treedata.push(node);
            data.count++;
        }
    }

    function inObject(objects, property, toSearch) {
        var found = false;
        if (objects.length == 0)
            return false; //No need to search an empty object
        for (var i = 0; i < objects.length; i++) {
            for (var key in objects[i]) {
                if (objects[i][property][key].indexOf(toSearch) != -1) {
                    found = true;
                }
            }
        }
        return found;
    }

    // Get the top level wbs - does not have a parent and work downward
    // Note that the server script is an Immediatedly Invoked Function Expression
    // so all functions are called by default
    function getTopLevel(child_id) {

        var dep = new GlideRecord('u_evt_wbs');
        dep.get(child_id);
        if (dep.u_parent.u_parent == '')
            return dep.u_parent;
        return getTopLevel(dep.u_parent);
    }

    function hasChildWithName(depID, filter) {
        var hasChilds = false;
        var dep = new GlideRecord('u_evt_wbs');

        dep.get(depID);

        var child = new GlideRecord('u_evt_wbs');
        child.addQuery('u_parent', dep.sys_id);
        child.query();
        hasChilds = child.hasNext();

        if (!hasChilds)
            return false;

        child.initialize(); //reset gr
        child.addQuery('u_parent', dep.sys_id);
        child.orderBy('u_wbs_number');
        child.query();

        while (child.next()) {
            if (child.name.toLowerCase().indexOf(filter) >= 0)
                return true;

            if (hasChildWithName(child.sys_id, filter))
                return true;
        }
        return false;
    }

    function findChildren(u_parent, filter, expand) {
        var result = [];

        var child = new GlideRecord('u_evt_wbs');
        child.addQuery('u_parent', u_parent.sys_id);
        child.orderBy('u_wbs_number');
        child.query();

        while (child.next()) {
            var filterMatch;
            if (filter)
                filterMatch = child.name.toLowerCase().indexOf(filter);
            //Only show if a this child or child down below contains the search string in the name
            if (filter && filterMatch == -1) {
                var hasChildrenWithName = hasChildWithName(child.sys_id, filter);
                if (!hasChildrenWithName)
                    continue;
            }

            var node = {};

            node.label = child.getValue('u_wbs_number') + ' - ' + child.getValue('u_title');
            node.id = child.getValue('sys_id');
            //node.depID = child.getValue('u_id');
			node.depID = child.getValue('u_wbs_number');
            if (!filter && !expand) //Collapse tree if showing full tree view
                node.collapsed = true;

            if (filterMatch >= 0)
                node.children = findChildren(child, '', true); // Display all children if this child matches the filter
            else
                node.children = findChildren(child, filter, false);
            result.push(node);
        }
        return result;
    }
})();