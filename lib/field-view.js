var InputView = require('ampersand-input-view');
var _ = require('underscore');

module.exports = InputView.extend({
    bindings: _.extend({
        'removable': {
            type: 'toggle',
            hook: 'remove-field'
        }
    }, InputView.prototype.bindings),
    props: {
        removable: 'boolean',
        template: ['string']
    },
    events: {
        'click [data-hook~=remove-field]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.parent.removeField(this);
    }
});
