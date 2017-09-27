import { render } from 'react-dom';
import React from 'react';

import Vendors from './src/vendors';
import PaymentFields from './src/payment-fields.jsx';

export default class PaymentFieldsDemo extends React.PureComponent {

    constructor(props) {
        super(props);
        [
            'logEvent',
            'getToken',
            'onError',
            'onTypeChange',
            'onFieldsReady',
            'onCardTypeChange',
            'onValidityChange',
            'setAuthorization',
        ].forEach((prop) => { this[prop] = this[prop].bind(this); });
        this.state = {
            type: 'Braintree',
            valid: false,
            log: [],
            isEnabled: false,
        };
    }

    logEvent(ev) {
        let msg = this.state.type;
        if (ev.type) { msg += ` : ${ev.type}`; }
        if (ev.field) { msg += ` : ${ev.field}`; }
        const { event: _, ...attrs } = ev;
        this.setState({
            log: [`${msg} : ${JSON.stringify(attrs)}`].concat(this.state.log),
        });
    }

    onTypeChange(ev) {
        this.inputRef.value = '';
        this.logEvent({ type: 'teardown' });
        this.setState({
            tokenize: null, valid: false, ready: false, type: ev.target.value, authorization: '',
        });
    }

    onError(error) {
        this.logEvent(error);
    }

    getToken() {
        this.state.tokenize().then(
            ev => this.logEvent(ev),
        ).catch(
            error => this.logEvent({ error }),
        );
    }

    onCardTypeChange(card) {
        this.logEvent(card);
        this.setState({ card: card.brand });
    }

    onFieldsReady({ tokenize }) {
        this.logEvent({ type: 'fields ready' });
        this.setState({ ready: true, tokenize });
    }

    onValidityChange(ev) {
        this.logEvent(ev);
        this.setState({ valid: ev.isValid });
    }

    setAuthorization() {
        this.setState({ authorization: this.inputRef.value });
    }

    renderFields() {
        if (!this.state.authorization) { return null; }
        return (
            <PaymentFields
                vendor={this.state.type}
                authorization={this.state.authorization}
                onError={this.onError}
                onValidityChange={this.onValidityChange}
                onCardTypeChange={this.onCardTypeChange}
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
                <div>
                    <h4>Valid: {this.state.valid ? '👍' : '👎'}</h4>
                    Number:
                    <PaymentFields.Field
                        type="cardNumber"
                        placeholder="•••• •••• •••• ••••"
                        onBlur={this.logEvent}
                        onFocus={this.logEvent}
                        onChange={this.logEvent}
                    />
                    <p>Card type: {this.state.card}</p>
                    Date:
                    <PaymentFields.Field type="expirationDate" />
                    CVV:
                    <PaymentFields.Field type="cvv" />
                    Zip:
                    <PaymentFields.Field type="postalCode" />
                </div>
                <div className="footer">
                    <button
                        disabled={!this.state.ready || !this.state.valid}
                        onClick={this.getToken}
                    >
                        Get nonce token
                    </button>
                </div>
            </PaymentFields>
        );
    }

    render() {
        const { type } = this.state;

        return (
            <div>
                <div className="type-selection">
                    {Object.keys(Vendors).map(k => (
                        <label key={k}>
                            <input
                                type="radio" name="type" checked={k === type}
                                value={k} onChange={this.onTypeChange}
                            /> {k}
                        </label>))}
                </div>
                <h3>Payments Field Demo for: {type}</h3>
                <label >
                    Authorization:
                    <input
                        ref={(r) => { this.inputRef = r; }}
                        type="text"
                        className="authorization"
                        defaultValue="sandbox_g42y39zw_348pk9cgf3bgyw2b"
                    />
                    <button onClick={this.setAuthorization}>
                        Render
                    </button>
                </label>

                {this.renderFields()}

                <ul className="log">
                    {this.state.log.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
            </div>
        );
    }

}

render(<PaymentFieldsDemo />, document.getElementById('root'));
