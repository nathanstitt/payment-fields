import React from 'react';
import PropTypes from 'prop-types';

export default class CreditCardFieldsWrapper extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        authorization: PropTypes.string,
        getTokenRef: PropTypes.func,
        onValidityChange: PropTypes.func,
        onCardTypeChange: PropTypes.func,
        onError: PropTypes.func,
        styles: PropTypes.object,
        className: PropTypes.string,
        tagName: PropTypes.string,
    }

    static defaultProps = {
        tagName: 'div',
    }


    constructor(props) {
        super(props);
        const Api = TYPES[props.type];
        this.api = new Api(props);
    }


    componentDidMount() {
        this.api.setAuthorization(this.props.authorization);
        if (this.props.getTokenRef) {
            this.props.getTokenRef(this.api.tokenize.bind(this.api));
        }
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
        return { braintreeApi: this.api };
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
