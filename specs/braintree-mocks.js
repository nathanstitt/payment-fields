import loadjs from 'loadjs';
import VendorMock from './vendor-mock';
import { EVENTS_MAP, TYPES_MAP } from '../src/braintree';
import invert from './invert';

jest.mock('loadjs');

const INVERTED_TYPES_MAP = invert(TYPES_MAP);

export default class BraintreeMocks extends VendorMock {

    install(mock) {
        this.mocks = {
            client: {
                create: jest.fn((opts, cb) => cb(null, mock.mocks.hostedFields)),
            },
            hostedFields: {
                on: jest.fn(),
                create: jest.fn((opts, cb) => cb(null, mock.mocks.hostedFields)),
                tokenize: jest.fn((o, cb) => cb(null, 'bt-token')),
            },
        };
        global.braintree = this.mocks;
    }

    reset() {
        global.braintree = undefined;
    }

    expectInitialized({ authorization, styles = {} }) {
        expect(loadjs).toHaveBeenCalledWith(
            [
                'https://js.braintreegateway.com/web/3.43.0/js/client.min.js',
                'https://js.braintreegateway.com/web/3.43.0/js/hosted-fields.min.js',
            ],
            expect.anything(),
        );
        expect(global.braintree.client.create).toHaveBeenCalledWith(
            { authorization }, expect.anything(),
        );
        expect(global.braintree.hostedFields.create).toHaveBeenCalledWith(
            expect.objectContaining({
                styles: { input: styles.base },
            }), expect.anything(),
        );
    }

    emitFocusEvent(field) {
        const emittedBy = INVERTED_TYPES_MAP[field] || field;
        this.getCb('focus')({
            emittedBy,
            type: 'onFocus',
            fields: {
                [`${emittedBy}`]: { isValid: false, isPotentiallyValid: true },
            },
        });
    }

    emitBlurEvent(field) {
        const emittedBy = INVERTED_TYPES_MAP[field] || field;
        this.getCb('blur')({
            emittedBy,
            type: 'onBlur',
            fields: {
                [`${emittedBy}`]: { isValid: false, isPotentiallyValid: true },
            },
        });
    }

    emitValid(val) {
        this.getCb('validityChange')({
            emittedBy: 'number',
            fields: {
                number: { isValid: val },
                expirationDate: { isValid: val },
                cvv: { isValid: val },
                postalCode: { isValid: val },
            },
        });
    }

    getCb(evName) {
        const call = this.mocks.hostedFields.on.mock.calls.find((c => c[0] === evName));
        return call ? call[1] : null;
    }

    expectValidToken(token) {
        expect(token).toEqual({ token: 'bt-token' });
    }

}
