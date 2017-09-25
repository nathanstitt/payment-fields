import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

export default class HostedField extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf([
            'cardNumber', 'expirationDate', 'cvv', 'postalCode',
        ]).isRequired,
        placeholder: PropTypes.string,
        className: PropTypes.string,

        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
    }

    static defaultProps = {
        placeholder: '',
    }

    static contextTypes = {
        hostedFieldsApi: PropTypes.object,
    }

    focus() {
        this.context.hostedFieldsApi.focusField(this.props.type);
    }

    clear() {
        this.context.hostedFieldsApi.clearField(this.props.type);
    }

    componentWillMount() {
        this.fieldId = this.context.hostedFieldsApi.checkInField(this.props);
    }

    get className() {
        const list = ['hosted-card-field'];
        if (this.props.className) { list.push(this.props.className); }
        return list.join(' ');
    }

    render() {
        return <div id={this.fieldId} className={this.className} />;
    }

}
