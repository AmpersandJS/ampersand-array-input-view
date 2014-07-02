var InputView = require('ampersand-input-view');
var _ = require('underscore');


module.exports = InputView.extend({
    bindings: _.extend({
        'removable': {
            type: 'toggle',
            role: 'remove-field'
        }
    }, InputView.prototype.bindings),
    props: {
        removable: 'boolean',
        template: ['string']
    },
    events: {
        'click [role=remove-field]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.parent.removeField(this);
    }
});
