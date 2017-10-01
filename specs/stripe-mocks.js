import loadjs from 'loadjs';
import VendorMock from './vendor-mock';
import { camelCaseKeys } from '../src/util';
import { TYPES_MAP } from '../src/stripe';

jest.mock('loadjs');


export default class StripeMocks extends VendorMock {

    install() {
        const mock = this;
        mock.fields = Object.create(null);
        class ElementMock {

            constructor(options) { this.options = options; }
            listeners = {}
            mount = jest.fn()

            addEventListener = jest.fn((eventName, cb) => {
                if (!this.listeners[eventName]) {
                    this.listeners[eventName] = [];
                }
                this.listeners[eventName].push(cb);
                if ('ready' === eventName) { cb(); }
            })

        }

        class ElmentsMock {

            create = jest.fn((type, options) => {
                mock.fields[type] = new ElementMock(options);
                return mock.fields[type];
            });

        }

        global.Stripe = jest.fn(() => ({
            createToken: jest.fn(() => Promise.resolve({
                id: 'stripe-12345', object: 'token', card: { id: 'card_BSiaK89MCCSEwX' },
            })),
            elements: jest.fn(() => {
                mock.elements = new ElmentsMock(this);
                return mock.elements;
            }),
        }));
    }

    expectInitialized({ authorization, styles = {} }) {
        expect(loadjs).toHaveBeenCalledWith([
            'https://js.stripe.com/v3/',
        ], expect.anything());
        expect(global.Stripe).toHaveBeenCalledWith(authorization);
        const fields = Object.keys(this.fields);
        expect(fields).toEqual(
            ['cardNumber', 'cardExpiry', 'cardCvc', 'postalCode'],
        );
        fields.forEach((f) => {
            expect(this.fields[f].mount).toHaveBeenCalled();
            expect(this.fields[f].options.style.base).toEqual(
                { ...camelCaseKeys(styles.base), ':focus': {} },
            );
        });
    }

    emitFocusEvent(f) {
        const field = TYPES_MAP[f] || f;
        this.fields[field].listeners.focus.forEach(cb => cb({ type: 'focus' }));
    }

    emitBlurEvent(f) {
        const field = TYPES_MAP[f] || f;
        this.fields[field].listeners.blur.forEach(cb => cb({ type: 'blur' }));
    }

    emitValid(v) {
        Object.keys(this.fields).forEach((f) => {
            this.fields[f].listeners.change.forEach(cb => cb({ complete: v }));
        });
    }

    expectValidToken(token) {
        expect(token).toMatchObject({ id: 'stripe-12345' });
    }

    reset() {
        global.Stripe = undefined;
        this.mocks = undefined;
    }

}
