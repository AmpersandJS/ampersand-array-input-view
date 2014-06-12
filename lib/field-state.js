var State = require('ampersand-state');


module.exports = State.extend({
    props: {
        value: ['string', true, ''],
        directlyEdited: ['boolean', true, false],
        shouldValidate: ['boolean', true, false],
        message: ['string', true, '']
    },
    derived: {
        removable: {
            cache: false,
            fn: function () {
                return this.collection.at(0) !== this;
            }
        },
        valid: {
            deps: ['value'],
            fn: function () {
                this.message = this.collection.parent.testValue(this.value);
                return !this.message;
            }
        },
        showMessage: {
            deps: ['message', 'shouldValidate'],
            fn: function () {
                return this.shouldValidate && !this.message;
            }
        }
    }
});
