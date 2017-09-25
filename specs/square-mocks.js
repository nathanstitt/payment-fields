import loadjs from 'loadjs';
import VendorMock from './vendor-mock';
import { EVENTS_MAP } from '../src/square';
import invert from './invert';
import { camelCaseKeys } from '../src/util';

jest.mock('loadjs');

const INVERTED_EVENTS_MAP = invert(EVENTS_MAP);

export default class SquareMocks extends VendorMock {

    install() {
        const mock = this;
        class SqMock {

            constructor(options) {
                this.options = options;
                this.options.callbacks.paymentFormLoaded();
            }
            build = jest.fn(() => { mock.mock = this; })
            requestCardNonce = jest.fn(() => {
                this.options.callbacks.cardNonceResponseReceived(null, 'square-12345', {});
            });

        }
        global.SqPaymentForm = SqMock;
    }

    expectInitialized({ authorization, styles = {} }) {
        expect(loadjs).toHaveBeenCalledWith(
            'https://js.squareup.com/v2/paymentform', expect.anything(),
        );
        expect(this.mock.options.applicationId).toEqual(authorization);
        expect(this.mock.options.inputStyles[0]).toEqual(camelCaseKeys(styles.base));
        expect(this.mock.build).toHaveBeenCalled();
    }

    emitFocusEvent(field) {
        this.mock.options.callbacks.inputEventReceived({
            field,
            eventType: INVERTED_EVENTS_MAP.onFocus,
            previousState: { isCompletelyValid: false },
            currentState: { isCompletelyValid: false },
        });
    }

    emitBlurEvent(field) {
        this.mock.options.callbacks.inputEventReceived({
            field,
            eventType: INVERTED_EVENTS_MAP.onBlur,
            previousState: { isCompletelyValid: false },
            currentState: { isCompletelyValid: false },
        });
    }

    emitValid(val) {
        this.mock.options.callbacks.inputEventReceived({
            field: 'postalCode',
            eventType: INVERTED_EVENTS_MAP.onBlur,
            currentState: { isCompletelyValid: val },
            previousState: { isCompletelyValid: !val },
        });
    }


    expectValidToken(token) {
        expect(token).toMatchObject({ token: 'square-12345' });
    }

    reset() {
        global.SqPaymentForm = undefined;
        this.mock = undefined;
    }

}
