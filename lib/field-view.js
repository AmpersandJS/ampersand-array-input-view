var InputView = require('ampersand-input-view');
var _ = require('underscore');


module.exports = InputView.extend({
    template: [
        '<label>',
            '<input>',
            '<div role="message-container" class="message message-below message-error">',
                '<p role="message-text"></p>',
            '</div>',
            '<a role="remove-field">remove</a>',
        '</label>',
    ].join(''),
    bindings: _.extend({
        'removable': {
            type: 'toggle',
            role: 'remove-field'
        }
    }, InputView.prototype.bindings),
    props: {
        removable: 'boolean'
    },
    events: {
        'click [role=remove-field]': 'handleRemoveClick'
    },
    handleRemoveClick: function () {
        this.parent.removeField(this);
    }
});
