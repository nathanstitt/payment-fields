import React from 'react'; // eslint-disable-line no-unused-vars
import PaymentFields from '../src/payment-fields.jsx';

export default {

    build({
        vendor,
        props = {},
        styles = {},
        onReady = jest.fn(),
        onValidityChange = jest.fn(),
        authorization = 'sandbox_test_one_two_three',
    } = {}) {
        return (
            <PaymentFields
                className="testing-component"
                vendor={vendor}
                authorization={authorization}
                onValidityChange={onValidityChange}
                onReady={onReady}
                styles={styles}
            >
                <PaymentFields.Field type="cardNumber"     placeholder="cc #" {...props.cardNumber}      />
                <PaymentFields.Field type="expirationDate" placeholder="date" {...props.expirationDate}  />
                <PaymentFields.Field type="cvv"            placeholder="cvv"  {...props.cvv}             />
                <PaymentFields.Field type="postalCode"     placeholder="zip"  {...props.postalCode}      />
            </PaymentFields>
        );
    },

};
