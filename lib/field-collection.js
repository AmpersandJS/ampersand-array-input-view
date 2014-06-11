var Collection = require('ampersand-collection');
var FieldState = require('./field-state');


module.exports = Collection.extend({
    model: FieldState,
    getValues: function () {
        return this.map(function (field) {
            return field.value;
        });
    }
});
