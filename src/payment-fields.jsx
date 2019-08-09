import React from 'react';
import PropTypes from 'prop-types';
import Vendors from './vendors';
import Field from './field.jsx';
import PaymentFieldsContext from './context';

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

    constructor(props) {
        super(props);
        const Api = Vendors[props.vendor];
        this.api = new Api(props);
    }

    componentDidMount() {
        if (this.props.authorization) {
            this.api.setAuthorization(this.props.authorization);
        }
    }

    componentWillUnmount() {
        this.api.teardown();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.authorization !== this.props.authorization) {
            this.api.setAuthorization(this.props.authorization);
        }
    }

    tokenize(options) {
        return this.api.tokenize(options);
    }

    render() {
        const { className: providedClass, tagName: Tag } = this.props;
        let className = 'payment-fields-wrapper';
        if (providedClass) { className += ` ${providedClass}`; }
        return (
            <PaymentFieldsContext.Provider value={this.api}>
                <Tag className={className}>
                    {this.props.children}
                </Tag>
            </PaymentFieldsContext.Provider>
        );
    }

}
