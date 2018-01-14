import React from 'react';
import PropTypes from 'prop-types';
import Vendors from './vendors';
import Field from './field.jsx';

export { Vendors };

export default class PaymentFields extends React.Component {

    static Field = Field;

    static propTypes = {
        vendor: PropTypes.oneOf(Object.keys(Vendors)).isRequired,
        children: PropTypes.node.isRequired,
        onReady: PropTypes.func,
        authorization: PropTypes.string,
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
        paymentFieldsApi: PropTypes.object,
    }

    constructor(props) {
        super(props);
        const Api = Vendors[props.vendor];
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
        return { paymentFieldsApi: this.api };
    }

    render() {
        const { className: providedClass, tagName: Tag } = this.props;
        let className = 'payment-fields-wrapper';
        if (providedClass) { className += ` ${providedClass}`; }
        return (
            <Tag className={className}>
                {this.props.children}
            </Tag>
        );
    }

}
