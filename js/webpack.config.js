var path = require('path');

module.exports = {
    entry: {
        app: path.resolve(__dirname, 'src/app/App.ts'),
        personal: path.resolve(__dirname, 'src/personal/Personal.ts'),
        admin: path.resolve(__dirname, 'src/admin/Admin.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ocr[name].js',
        library: ['OCA', 'Ocr'],
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    tsConfigFile: 'tsconfig.app.json',
                }
            },
            {
                test: /\.hbs$/,
                loader: "handlebars-loader?runtime=handlebars/runtime"
            },
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'tsconfig.app.json',
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts']
    },
    externals: [
        {
            'handlebars/runtime': {
                root: 'Handlebars',
                amd: 'handlebars/runtime',
                commonjs2: 'handlebars/runtime',
                commonjs: 'handlebars/runtime'
            }
        }
    ]
};
