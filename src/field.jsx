import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

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

    static contextTypes = {
        paymentFieldsApi: PropTypes.object,
    }

    focus() {
        this.context.paymentFieldsApi.focusField(this.props.type);
    }

    clear() {
        this.context.paymentFieldsApi.clearField(this.props.type);
    }

    componentWillMount() {
        this.fieldId = this.context.paymentFieldsApi.checkInField(this.props);
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
