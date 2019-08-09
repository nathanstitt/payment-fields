const config = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 2,
                targets: '> 1% in US',
            },
        ], [
            '@babel/preset-react', {

            },
        ],
    ],
    plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
    ],
};

// if (process.env.NODE_ENV !== 'production') {
//     config.plugins.push('transform-dynamic-import');
// }

module.exports = config;
