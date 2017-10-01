import loadjs from 'loadjs';

let NEXT_FIELD_ID = 0;

export function resetIDCounter() {
    NEXT_FIELD_ID = 0;
}

function nextFieldId() {
    NEXT_FIELD_ID += 1;
    return NEXT_FIELD_ID;
}

class Field {

    constructor(api, props) {
        this.api = api;
        this.isReady = false;
        this.events = Object.create(null);
        this.props = props;
        const { type, ...rest } = props;
        this.id = `field-wrapper-${nextFieldId()}`;
        this.type = type;
        for (const key in rest) { // eslint-disable-line
            if (key.startsWith('on')) {
                this.events[key] = rest[key];
                delete rest[key];
            }
        }
        this.options = rest;
    }

    emit(event) {
        if (this.events[event.type]) {
            this.events[event.type](event);
        }
    }

    get selector() {
        return `#${this.id}`;
    }

}


export default class ClientApi {

    static Field = Field;

    fields = Object.create(null);

    fieldHandlers = Object.create(null);

    constructor({ isReady, urls, props }) {
        const { authorization: _, styles, ...callbacks } = props;
        this.styles = styles || {};
        this.wrapperHandlers = callbacks || {};
        this.tokenize = this.tokenize.bind(this);
        if (!isReady) {
            this.fetch(urls);
        }
    }

    isApiReady() {
        return false;
    }

    fetch(urls) {
        loadjs(urls, {
            success: () => {
                if (this.pendingAuthorization) {
                    this.setAuthorization(this.pendingAuthorization);
                }
            },
            error: this.onError.bind(this),
        });
    }

    setAuthorization(authorization) {
        if (!this.isApiReady()) {
            this.pendingAuthorization = authorization;
            return;
        }
        if (!authorization && this.authorization) {
            this.teardown();
        } else if (authorization && authorization !== this.authorization) {
            if (this.authorization) { this.teardown(); }
            this.authorization = authorization;
            this.createInstance(authorization);
        }
    }

    onError(err) {
        if (!err) { return; }
        if (this.wrapperHandlers.onError) { this.wrapperHandlers.onError(err); }
    }

    checkInField(props) {
        const { FieldClass } = this;
        const field = new FieldClass(this, props);
        this.fields[field.type] = field;
        return field.id;
    }

    onFieldsReady() {
        if (this.wrapperHandlers.onReady) {
            this.wrapperHandlers.onReady({ tokenize: this.tokenize });
        }
    }

    onFieldValidity(event) {
        if (this.wrapperHandlers.onValidityChange) {
            this.wrapperHandlers.onValidityChange(event);
        }
    }

    onFieldEvent(event) {
        if (this.wrapperHandlers[event.type]) {
            this.wrapperHandlers[event.type](event);
        }
    }

    // the following fields are implemented in each client lib
    createInstance() {}

    tokenize() { }

    teardown() { }


}
