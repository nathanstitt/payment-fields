import Api from './api';

// sandbox_g42y39zw_348pk9cgf3bgyw2b

export const EVENTS_MAP = {
    focus: 'onFocus',
    blur: 'onBlur',
    validityChange: 'onValidityChange',
    cardTypeChange: 'onCardTypeChange',
};

const EVENT_DECODERS = {

    onCardTypeChange(event) {
        const card = (1 === event.cards.length) ? event.cards[0] : {};
        return Object.assign(
            card,
            { type: 'onCardTypeChange', brand: card.type },
        );
    },

};

export const TYPES_MAP = {
    cardNumber: 'number',
};

export class BraintreeField extends Api.Field {

    constructor(api, props) {
        super(api, props);
        this.type = TYPES_MAP[this.type] || this.type;
        this.options.selector = `#${this.id}`;
    }

}

export default class BraintreeApi extends Api {


    FieldClass = BraintreeField;

    constructor(props) {
        super({
            props,
            isReady: !!global.braintree,
            urls: [
                'https://js.braintreegateway.com/web/3.22.2/js/client.js',
                'https://js.braintreegateway.com/web/3.22.2/js/hosted-fields.js',
            ],
        });
    }

    isApiReady() {
        return !!global.braintree;
    }

    createInstance() {
        global.braintree.client.create(
            { authorization: this.authorization },
            (err, clientInstance) => {
                if (err) {
                    this.onError(err);
                } else {
                    this.createFields(clientInstance);
                }
            },
        );
    }

    createFields(client) {
        const fields = {};
        Object.keys(this.fields).forEach((fieldName) => {
            fields[fieldName] = this.fields[fieldName].options;
        });
        global.braintree.hostedFields.create({
            client,
            fields,
            styles: {
                input: this.styles.base,
                ':focus': this.styles.focus,
                '.invalid': this.styles.invalid,
                '.valid': this.styles.valid,
            },
        }, (err, hostedFields) => {
            if (err) {
                this.onError(err);
                return;
            }
            this.hostedFields = hostedFields;
            [
                'blur', 'focus', 'empty', 'notEmpty',
                'cardTypeChange', 'validityChange',
            ].forEach((eventName) => {
                hostedFields.on(eventName, ev => this.onFieldEvent(eventName, ev));
            });
            this.onFieldsReady();
        });
    }

    onFieldEvent(eventName, event) {
        const type = EVENTS_MAP[eventName] || eventName;
        const attrs = EVENT_DECODERS[type] ? EVENT_DECODERS[type](event) : {};
        const field = this.fields[TYPES_MAP[event.emittedBy] || event.emittedBy];
        const sanitizedEvent = Object.assign({
            field: field.props.type,
            type,
            event,
            isPotentiallyValid: event.fields[event.emittedBy].isPotentiallyValid,
            isValid: event.fields[event.emittedBy].isValid,
        }, attrs);
        field.emit(sanitizedEvent);

        if ('validityChange' === eventName) {
            let isValid = true;
            const fields = Object.keys(event.fields);
            for (let fi = 0; fi < fields.length; fi++) {
                isValid = Boolean(event.fields[fields[fi]].isValid);
                if (!isValid) { break; }
            }
            this.onFieldValidity(Object.assign(sanitizedEvent, { isValid }));
        } else {
            super.onFieldEvent(sanitizedEvent);
        }
    }

    tokenize(options = {}) {
        return new Promise((resolve, reject) => {
            this.hostedFields.tokenize(options, (err, payload) => {
                if (err) {
                    this.onError(err);
                    reject(err);
                } else {
                    resolve({ token: payload });
                }
            });
        });
    }

    teardown() {
        if (this.hostedFields) { this.hostedFields.teardown(); }
    }

}
