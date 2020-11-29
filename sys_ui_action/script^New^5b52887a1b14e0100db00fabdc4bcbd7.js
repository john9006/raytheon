// This script follows the pattern used by OOB ServiceNow for the New action in Related Lists.  It has been modified
// to set some field values in the uri and this has been commented in the script below.
var uri = action.getGlideURI();
var path = uri.getFileFromPath() + '';
path = path.substring(0, path.length - 5) + '.do';

uri.set('sys_id', '-1');

if (parent.getTableName() == "u_evt_swa") {

    var parent_sys_id = uri.get('sysparm_collectionID');
    var query = '';
    var gr = new GlideRecord('u_evt_swa');
    if (gr.get(parent_sys_id)) {
        query = 'u_project=' + gr.u_project;
        query += '^' + 'u_type=SWA';
        query += '^' + 'u_title=' + gr.getValue('u_title');
        // need to strip out the html tags as WBS description field is HTML and task is plain string

        var str = gr.getValue('u_description');

        // regex from https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
        str = str.replace(/<\s*br\/*>/gi, "" );
        str = str.replace(/<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
        str = str.replace(/<\s*\/*.+?>/ig, "");
        str = str.replace(/ {2,}/gi, " ");
        str = str.replace(/\n+\s*/gi, "");
        
        query += '^' + 'description=' + str;
    }
    uri.set('sysparm_query', query);

    path = checkWizard(uri, path);

    // end of custom
}

if (path)
    action.setRedirectURL(uri.toString(path));

action.setNoPop(true);


function checkWizard(uri, path) {
    var already = uri.get('WIZARD:action');
    if (already == 'follow')
        return null;

    var wizID = new GlideappWizardIntercept(path).get();
    if (!wizID)
        return path;

    uri.set('sysparm_parent', wizID);
    uri.deleteParmameter('sysparm_referring_url');
    uri.deleteMatchingParameter('sysparm_list_');
    uri.deleteMatchingParameter('sysparm_record_');
    uri.deleteParmameter('sys_is_list');
    uri.deleteParmameter('sys_is_related_list');
    uri.deleteParmameter('sys_submitted');
    uri.deleteParmameter('sysparm_checked_items');
    uri.deleteParmameter('sysparm_ref_list_query');
    uri.deleteParmameter('sysparm_current_row');

    uri.set('sysparm_referring_url', uri.toString());
    uri.deleteMatchingParameter('fancy.');
    uri.deleteMatchingParameter('sys_rownum');
    uri.deleteMatchingParameter('sysparm_encoded');
    uri.deleteMatchingParameter('sysparm_query_encoded');
    uri.deleteParmameter('sysparm_refer');

    return 'wizard_view.do';
}