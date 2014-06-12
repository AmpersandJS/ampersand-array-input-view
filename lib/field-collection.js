var Collection = require('ampersand-collection');
var FieldState = require('ampersand-input-view');


module.exports = Collection.extend({
    model: FieldState,
    getValues: function () {
        return this.map(function (field) {
            return field.value;
        });
    }
});
