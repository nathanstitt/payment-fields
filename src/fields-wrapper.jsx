import React from 'react';
import PropTypes from 'prop-types';

import Braintree from './braintree';
import Square from './square';
import Stripe from './stripe';

export default class CreditCardFieldsWrapper extends React.Component {

    static Vendors= {
        Stripe,
        Square,
        Braintree,
    };

    static propTypes = {
        vendor: PropTypes.string.isRequired,
        children: PropTypes.node.isRequired,
        authorization: PropTypes.string,

        onReady: PropTypes.func.isRequired,
        onValidityChange: PropTypes.func,
        onCardTypeChange: PropTypes.func,
        onError: PropTypes.func,

        passThroughStyles: PropTypes.any,
        styles: PropTypes.object,
        className: PropTypes.string,
        tagName: PropTypes.string,
    }

    static defaultProps = {
        tagName: 'div',
        styles: {},
    }

    static childContextTypes = {
        hostedFieldsApi: PropTypes.object,
    }

    constructor(props) {
        super(props);
        const Api = this.constructor.Vendors[props.vendor];
        this.api = new Api(props);
    }

    componentDidMount() {
        this.api.setAuthorization(this.props.authorization);
    }

    componentWillUnmount() {
        this.api.teardown();
    }

    componentWillReceiveProps(nextProps) {
        this.api.setAuthorization(nextProps.authorization);
    }

    tokenize(options) {
        return this.api.tokenize(options);
    }

    getChildContext() {
        return { hostedFieldsApi: this.api };
    }

    render() {
        const { className: providedClass, tagName: Tag } = this.props;
        let className = 'braintree-hosted-fields-wrapper';
        if (providedClass) { className += ` ${providedClass}`; }
        return (
            <Tag className={className}>
                {this.props.children}
            </Tag>
        );
    }

}
