var State = require('ampersand-state');


module.exports = State.extend({
    props: {
        value: 'string',
        valid: 'boolean'
    },
    derived: {
        removable: {
            cache: false,
            fn: function () {
                return this.collection.at(0) !== this;
            }
        }
    }
});
