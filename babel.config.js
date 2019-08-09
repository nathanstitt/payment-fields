const config = {
    presets: [
        [
            '@babel/preset-env', {
                useBuiltIns: 'entry',
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

module.exports = config;
