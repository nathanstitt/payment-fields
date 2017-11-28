# Integrate Braintree/Stripe/Square payment fields

A React component to make integrating [Braintree's Hosted Fields](https://developers.braintreepayments.com/guides/hosted-fields/), [Stripe's Elements](https://stripe.com/docs/elements) and [Square's Payment Form](https://docs.connect.squareup.com/articles/adding-payment-form) easier.

Care is taken so the API is (nearly) identical across the vendors.

This is intended for a Saas that allows customers to use their own payment processor, as long as it uses the newish "hosted iframe" approach.

further docs to be written

[![Build Status](https://travis-ci.org/nathanstitt/payment-fields.svg?branch=master)](https://travis-ci.org/nathanstitt/payment-fields)

See [demo site](https://nathanstitt.github.io/payment-fields/) for a working example. It renders [demo.jsx](demo.jsx)

## Example

Note: methods are removed for brevity and this isn't fully copy & pastable.  For a working example see [demo.jsx](demo.jsx)

```javascript

import React from 'react';
import PaymentFields from 'payment-fields';
import PropTypes from 'prop-types';

class PaymentForm extends React.PureComponent {

    static propTypes = {
        vendor: PropTypes.oneOf(['Square', 'Stripe', 'Braintree']).isRequired,
        authorization: PropTypes.String.isRequired,
    }

    render() {
      return (
        <PaymentFields
            vendor={this.props.vendor}
            authorization={this.props.authorization}
            onError={this.onError}
            onValidityChange={(ev) => this.setState({ valid: ev.isValid })}
            onCardTypeChange={(c)  => this.setState({ card: c.brand })}
            onReady={this.onFieldsReady}
            styles={{
                base: {
                    'font-size': '24px',
                    'font-family': 'helvetica, tahoma, calibri, sans-serif',
                    padding: '6px',
                    color: '#7d6b6b',
                },
                focus: { color: '#000000' },
                valid: { color: '#00bf00' },
                invalid: { color: '#a00000' },
            }}
        >
            <h4>Form is Valid: {this.state.isValid ? '👍' : '👎'}</h4>
            <p>Card number ({this.state.card}):</p>
            <PaymentFields.Field
                type="cardNumber"
                placeholder="•••• •••• •••• ••••"
                onBlur={this.logEvent}
                onFocus={this.logEvent}
                onValidityChange={this.onNumberValid}
                onChange={this.logEvent}
            />
            Date: <PaymentFields.Field type="expirationDate" />
            CVV: <PaymentFields.Field type="cvv" />
            Zip: <PaymentFields.Field type="postalCode" />
        </PaymentFields>
     );
  }

}

```

## PaymentFields Component

Props:
 * vendor: Required, one of Braintree, Square, or Stripe
 * authorization: Required, the string key that corresponds to:
   * Braintree: calls it "authorization"
   * Square: "applicationId"
   * Stripe: the Api Key for Stripe Elements
 * onReady: function called once form fields are initialized and ready for input
 * onValidityChange: function that is called whenever the card validity changes.  May be called repeatedly even if the validity is the same as the previous call.  Will be passed a single object with a `isValid` property.  The object may have other type specific properties as well.
 * onCardTypeChange: Called as soon as the card type is known and whenever it changes.   Passed a single object with a `brand` property.  The object may have other type specific properties as well.
 * onError: A function called whenever an error occurs, typically during tokenization but some vendors (Square at least) will also call it when the fields fail to initialize.
 * styles: A object that contains 'base', 'focus', 'valid', and 'invalid' properties.   The `PaymentFields` component will convert the styles to match each vendor's method of specifying them and attempt to find the lowest common denominator.  `color` and `font-size` are universally supported.
 * passThroughStyles: For when the `styles` property doesn't offer enough control.  Anything specified here will be passed through to the vendor specific api in place of the `styles`.
 * tagName: which element to use as a wrapper element.  Defaults to `div`
 * className: a className to set on the wrapper element, it's applied in addition to `payment-fields-wrapper`

## PaymentFields.Field Component

Props:
 * type: Required, one of 'cardNumber', 'expirationDate', 'cvv', 'postalCode' Depending on fraud settings, some vendors do not require postalCode.
 * placeholder: What should be displayed in the field when it's empty and is not focused
 * className: a className to set on the placeholder element, some vendors will replace the placeholder with an iframe, while others will render the iframe inside the placeholder.  All vendors retain the className property though so it's safe to use this for some styling.
 * onValidityChange: A function  called when the field's validity changes.  Like the onValidityChange on the main PaymentFields wrapper, may be called repeatedly with the same status
 * onFocus: A function called when the field is focused.  Will be called with the vendor specific event
 * onBlur:  A function called when the field loses focus.  Will be called with the vendor specific event, as well as a `isValid` property that indicates if the field is valid.
