import loadjs from 'loadjs';

jest.mock('loadjs');

export default class VendorMock {

    constructor() {
        const mock = this;
        loadjs.mockImplementation(jest.fn((url, { success }) => {
            if (!mock.mock) { mock.install(mock); }
            success();
        }));
    }

}
