function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    // need to strip out the html tags from the WBS description field
    var str = g_form.getValue('u_description');
    jslog('>> str =' + str);
    // regex from https://stackoverflow.com/questions/822452/strip-html-from-text-javascript
	
    str = str.replace(/<\s*br\/*>/gi, "\n");
    str = str.replace(/<\s*a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str = str.replace(/<\s*\/*.+?>/ig, "\n");
    str = str.replace(/ {2,}/gi, " ");
	str = str.replace(/\n+\s*/gi, "\n\n");
    

    g_form.addInfoMessage('the result is ' + str);

}