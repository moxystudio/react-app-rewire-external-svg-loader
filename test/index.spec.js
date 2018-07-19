'use strict';

const serializerPath = require('jest-serializer-path');
const rewireExternalSvgLoader = require('..');

expect.addSnapshotSerializer(serializerPath);

const mockConfig = {
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                enforce: 'pre',
                use: [
                    { options: {}, loader: 'path/to/eslint-loader/index.js' },
                ],
                include: 'path/to/src',
            },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: 'path/to/url-loader/index.js',
                        options: {},
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: 'path/to/src',
                        loader: 'path/to/babel-loader/lib/index.js',
                        options: {},
                    },
                    {
                        test: /\.css$/,
                        use: [
                            'path/to/style-loader/index.js',
                            {
                                loader: 'path/to/css-loader/index.js',
                                options: { importLoaders: 1 },
                            },
                            {
                                loader: 'path/to/postcss-loader/lib/index.js',
                                options: {},
                            },
                        ],
                    },
                    {
                        exclude: [/\.js$/, /\.html$/, /\.json$/],
                        loader: 'path/to/file-loader/dist/cjs.js',
                        options: { name: 'static/media/[name].[hash:8].[ext]' },
                    },
                ],
            },
        ],
    },
    plugins: [],
};

it('should modify the webpack config correctly for development', () => {
    const result = rewireExternalSvgLoader(mockConfig, 'development');

    expect(result).toMatchSnapshot();
});

it('should modify the webpack config correctly for production', () => {
    const result = rewireExternalSvgLoader(mockConfig, 'production');

    expect(result).toMatchSnapshot();
});

it('should override the default include / exclude', () => {
    const result = rewireExternalSvgLoader(mockConfig, 'development', {
        include: 'foo',
        exclude: 'bar',
    });

    expect(result).toMatchSnapshot();
});

it('should pass options to the loader', () => {
    const result = rewireExternalSvgLoader(mockConfig, 'development', {
        loaderOptions: { name: 'foo.svg' },
    });

    expect(result).toMatchSnapshot();
});

it('should pass options to the plugin', () => {
    const result = rewireExternalSvgLoader(mockConfig, 'development', {
        pluginOptions: { emit: false },
    });

    expect(result).toMatchSnapshot();
});

it('should allow usage with compose', () => {
    expect(rewireExternalSvgLoader(mockConfig, 'development'))
    .toEqual(rewireExternalSvgLoader()(mockConfig, 'development'));

    expect(rewireExternalSvgLoader(mockConfig, 'development', { include: 'foo' }))
    .toEqual(rewireExternalSvgLoader({ include: 'foo' })(mockConfig, 'development'));
});
