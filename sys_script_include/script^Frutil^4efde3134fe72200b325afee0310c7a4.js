var Frutil = Class.create();
Frutil.prototype = {
    initialize: function() {
    },

    /*
     *  Set the name of this object to be a string derived from this object's ancestry.
     */
    calcluatePortalFieldLabel: function (_currentGr) {
        // The character(s) used to separate the ancestors in the object's name
        var nameSeparator = ' > ';

        // Functionally scoped variables
        var nameArray = [];

        // Service portal hierarchy
        // Object with table name as key, object as value that contains parent field as key and parent table as value
        var portalHierarchy = {
            sp_column: {
                sp_row: 'sp_row'
            },
            sp_container: {
                sp_page: 'sp_page'
            },
            sp_page : {},
            sp_row: {
                sp_column: 'sp_column',
                sp_container: 'sp_container'
            }
        }

        traverseAndLabelAncestors(_currentGr);
        return nameArray.reverse().join(nameSeparator);

        function traverseAndLabelAncestors (record) {
            if (record === null) return;
            nameArray.push(getLabelFromRecord(record));
            traverseAndLabelAncestors(getParentRecord(record));
        }

        function getLabelFromRecord (record) {
            var label = '';

            switch (record.getTableName()) {
                case 'sp_page':
                    label = record.getValue('title') || record.getValue('id');
                    break;
                case 'sp_container':
                    label += 'T' + record.getValue('order');
                    break;
                case 'sp_column':
                    label += 'C' + record.getValue('order');
                    break;
                case 'sp_row':
                    label += 'R' + record.getValue('order');
                    break;
                default:
                    label += 'X?';
            }

            return label;
        }

        function getParentRecord (record) {
            var recordTableName = record.getTableName();
            var hierarchyObj = portalHierarchy[recordTableName];

            for (var parentFieldName in hierarchyObj) {
                if (record.getValue(parentFieldName)) {
                    return record[parentFieldName].getRefRecord();
                }
            }

            return null;
        }
    },

    type: 'Frutil'
};