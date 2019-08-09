import babel from 'rollup-plugin-babel';
const pkg = require('./package.json');
const plugins = [
    babel({ exclude: 'node_modules/**' }),
];

const input = './src/payment-fields.jsx';
const external = ['react', 'loadjs', 'prop-types'];
const globals = {
    react: 'React',
    loadjs: 'loadjs',
    invariant: 'invariant',
    'prop-types': 'PropTypes',
};

export default {
    input,
    plugins,
    external,
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'payment-fields',
            moduleName: 'payment-fields',
            sourceMap: true,
            globals,
        },
        {
            file: pkg.module,
            format: 'es',
            sourceMap: true,
            globals,
        },
    ],
};
