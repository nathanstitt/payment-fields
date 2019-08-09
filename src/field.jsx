import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import PaymentFieldsContext from './context';

export default class Field extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf([
            'cardNumber', 'expirationDate', 'cvv', 'postalCode',
        ]).isRequired,
        placeholder: PropTypes.string,
        className: PropTypes.string,
        onValidityChange: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
    }

    static defaultProps = {
        placeholder: '',
    }

    static contextType = PaymentFieldsContext;

    constructor(props, context) {
        super(props, context);
        this.fieldId = context.checkInField(this.props);
    }

    focus() {
        this.context.focusField(this.props.type);
    }

    clear() {
        this.context.clearField(this.props.type);
    }

    get className() {
        const list = ['payment-field'];
        if (this.props.className) { list.push(this.props.className); }
        return list.join(' ');
    }

    render() {
        return <div id={this.fieldId} className={this.className} />;
    }

}
