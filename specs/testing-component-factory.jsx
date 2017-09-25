import React from 'react';
import HostedField from '../src/field.jsx';
import HostedFieldsWrapper from '../src/fields-wrapper.jsx';

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
            <HostedFieldsWrapper
                className="testing-component"
                vendor={vendor}
                authorization={authorization}
                onValidityChange={onValidityChange}
                onReady={onReady}
                styles={styles}
            >
                <HostedField type="cardNumber"      placeholder="cc #"  {...props.cardNumber}      />
                <HostedField type="expirationDate"  placeholder="date"  {...props.expirationDate}  />
                <HostedField type="cvv"             placeholder="cvv"   {...props.cvv}             />
                <HostedField type="postalCode"      placeholder="zip"   {...props.postalCode}      />
            </HostedFieldsWrapper>
        );
    },

};
