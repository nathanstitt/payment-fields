import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Braintree from './braintree-mocks';
import Square from './square-mocks.js';
import Stripe from './stripe-mocks.js';
import TestingComponent from './testing-component-factory.jsx';
import { resetIDCounter } from '../src/api';

const Mocks = {
    Braintree,
    Square,
    Stripe,
};

[
    'Stripe',
    'Square',
    'Braintree',
].forEach((vendor) => {
    const mountComponent = props => mount(TestingComponent.build({ vendor, ...props }));

    describe(`${vendor} Api`, () => {
        let mocks;
        const authorization = `${vendor}-123456`;

        beforeEach(() => {
            mocks = new Mocks[vendor]();
        });

        afterEach(() => {
            mocks.reset();
            resetIDCounter();
        });

        it('renders and matches snapshot', () => {
            expect(renderer.create(
                TestingComponent.build({ vendor, authorization }),
            )).toMatchSnapshot();
        });

        it('sets properties', () => {
            const styles = { base: { 'font-size': '18px' } };
            mountComponent({ authorization, styles });
            mocks.expectInitialized({ authorization, styles });
        });

        it('forwards events to fields', () => {
            const onFocus = jest.fn();
            const onBlur = jest.fn();
            const onValidityChange = jest.fn();
            const fieldTypes = ['cardNumber', 'expirationDate', 'cvv', 'postalCode'];
            const fields = {};
            fieldTypes.forEach((f) => { fields[f] = { onFocus, onBlur }; });
            mountComponent({
                authorization,
                onValidityChange,
                props: fields,
            });

            fieldTypes.forEach((f) => {
                mocks.emitFocusEvent(f);
                expect(onFocus).toHaveBeenCalledWith(
                    expect.objectContaining({
                        field: f, type: 'onFocus', isValid: false,
                    }),
                );

                mocks.emitBlurEvent(f);
                expect(onBlur).toHaveBeenCalledWith(
                    expect.objectContaining({
                        field: f, type: 'onBlur', isValid: false,
                    }),
                );
                onFocus.mockReset();
                onBlur.mockReset();
            });

            mocks.emitValid(true);
            expect(onValidityChange).toHaveBeenCalledWith(
                expect.objectContaining({ isValid: true }),
            );
            onValidityChange.mockReset();
            mocks.emitValid(false);
            expect(onValidityChange).toHaveBeenCalledWith(
                expect.objectContaining({ isValid: false }),
            );
        });

        it('can generate token', () => {
            const onReady = jest.fn();
            mountComponent({ authorization, onReady });
            expect(onReady).toHaveBeenCalledWith(expect.objectContaining({
                tokenize: expect.anything(),
            }));
            return onReady
                .mock.calls[0][0].tokenize()
                .then(token => mocks.expectValidToken(token));
        });
    });
});
