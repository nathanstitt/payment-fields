import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');

export default {
    entry: './src/payment-fields.jsx',
    plugins: [
        babel({
            babelrc: true,
            exclude: 'node_modules/**',
            presets: [['es2015', { modules: false }], 'react', 'es2015-rollup'],
            plugins: [
                'transform-decorators-legacy',
                'transform-class-properties',
                'transform-object-rest-spread',
            ],
        }),
    ],
    globals: {
        react: 'React',
        loadjs: 'loadjs',
        invariant: 'invariant',
        'prop-types': 'PropTypes',
    },
    external: ['react', 'loadjs', 'prop-types'],
    targets: [
        {
            dest: pkg.main,
            format: 'umd',
            moduleName: 'payment-fields',
            sourceMap: true,
        }, {
            dest: pkg.module,
            format: 'es',
            sourceMap: true,
        },
    ],
};
