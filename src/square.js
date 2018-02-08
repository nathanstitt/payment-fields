import Api from './api';
import { camelCaseKeys } from './util';

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

export class SquareField extends Api.Field {

    constructor(api, props) {
        super(api, props);
        this.options.elementId = this.id;
    }

    emit(ev) {
        Object.assign(ev, {
            isValid: ev.event.currentState.isCompletelyValid,
            isPotentiallyValid: ev.event.currentState.isPotentiallyValid,
        });
        super.emit(ev);
        if (this.isValid !== ev.event.currentState.isCompletelyValid) {
            this.isValid = ev.event.currentState.isCompletelyValid;
            super.emit(Object.assign({}, ev, {
                type: 'onValidityChange',
            }));
        }
    }

}


export default class SquareApi extends Api {

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
                isPotentiallyValid: event.currentState.isPotentiallyValid,
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
            return Promise.reject(new Error('tokenization in progress'));
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
