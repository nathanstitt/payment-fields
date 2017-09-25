import React from 'react'; // eslint-disable-line no-unused-vars
import HostedFieldsApi from './hosted-fields-api';
import { camelCaseKeys } from './util';
    // The Square docs note:
    // If you host a copy of this library on your own server, or use a copy hosted on a third-party server,
    // your application will be disabled without notice.
    // we have no choice but to load and pollute the global namespace.

export const EVENTS_MAP = {
    focusClassAdded: 'onFocus',
    focusClassRemoved: 'onBlur',
    errorClassAdded: 'onValidityChange',
    errorClassRemoved: 'onValidityChange',
    cardBrandChanged: 'onCardTypeChange',
    postalCodeChanged: 'onChange',
};

const EVENT_DECODERS = {

    onCardTypeChange(event) {
        return { brand: event.cardBrand };
    },

};

// sandbox-sq0idp-i06hC8ZeXrqOujH_QfYt5Q

export class SquareField extends HostedFieldsApi.Field {

    constructor(api, props) {
        super(api, props);
        this.options.elementId = this.id;
    }

}


export default class SquareApi extends HostedFieldsApi {

    FieldClass = SquareField;

    constructor(props) {
        super({
            isReady: !!global.SqPaymentForm,
            urls: ['https://js.squareup.com/v2/paymentform'],
            props,
        });
    }

    isApiReady() {
        return !!global.SqPaymentForm;
    }

    createInstance() {
        const options = {
            inputClass: 'hosted-card-field',
            applicationId: this.authorization,
            captureUncaughtExceptions: true,
            inputStyles: [
                camelCaseKeys(this.styles.base),
            ],
        };
        for (const type in this.fields) { // eslint-disable-line
            const field = this.fields[type];
            options[field.type] = field.options;
        }
        options.callbacks = {
            cardNonceResponseReceived: this.onCardNonce.bind(this),
            inputEventReceived: this.onFieldEvent.bind(this),
            paymentFormLoaded: this.onFieldsReady.bind(this),
        };
        this.hostedFields = new global.SqPaymentForm(options);
        this.hostedFields.build();
    }

    onFieldEvent(event) {
        const type = EVENTS_MAP[event.eventType] || event.eventType;
        const attrs = EVENT_DECODERS[type] ? EVENT_DECODERS[type](event) : {};

        const sanitizedEvent = Object.assign({
            field: event.field,
            type,
            event,
        }, attrs);

        this.fields[event.field].emit(sanitizedEvent);

        super.onFieldEvent(sanitizedEvent);

        if (event.currentState.isCompletelyValid !== event.previousState.isCompletelyValid) {
            this.onFieldValidity(Object.assign(sanitizedEvent, {
                type: 'validityChange',
                isValid: event.currentState.isCompletelyValid,
            }));
        }
    }

    onCardNonce(errors, nonce, cardData) {
        const { pendingToken } = this;
        this.pendingToken = null;
        if (errors) {
            pendingToken.reject({ errors });
            return;
        }
        pendingToken.resolve({ token: nonce, cardData });
    }

    tokenize() {
        if (this.pendingToken) {
            return Promise.reject({ errors: ['tokenization in progress'] });
        }
        return new Promise((resolve, reject) => {
            this.pendingToken = { resolve, reject };
            this.hostedFields.requestCardNonce();
        });
    }

    teardown() {
        if (this.hostedFields) { this.hostedFields.destroy(); }
        super.teardown();
    }

}
