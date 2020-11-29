function onChange(control, oldValue, newValue, isLoading, isTemplate) {
    if (isLoading || newValue === '') {
        return;
    }

    GlideList2.get(g_form.getTableName() + '.sysapproval_approver.sysapproval').setFilterAndRefresh('');

}