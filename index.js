'use strict';

const path = require('path');
const merge = require('lodash.merge');
const SvgStorePlugin = require('external-svg-sprite-loader/lib/SvgStorePlugin');

const getChildrenRules = (loader) => loader.use || loader.oneOf || (Array.isArray(loader.loader) && loader.loader) || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result;
    const rules = Array.isArray(rulesSource) ? rulesSource : getChildrenRules(rulesSource);

    rules.some((rule, index) => (
        result = ruleMatcher(rule) ? { index, rules } : findIndexAndRules(getChildrenRules(rule), ruleMatcher))
    );

    return result;
};

const addBeforeRule = (rulesSource, ruleMatcher, value) => {
    const { index, rules } = findIndexAndRules(rulesSource, ruleMatcher);

    rules.splice(index, 0, value);
};

const fileLoaderRuleMatcher = (rule) => rule.loader && rule.loader.indexOf(`${path.sep}file-loader${path.sep}`) !== -1;

const createRewire = (options) => (config, env) => {
    options = merge({
        test: /\.svg$/,
        include: path.resolve('src'),
        exclude: undefined,
        loaderOptions: {
            name: env === 'production' ? 'static/media/svg-sprite.[hash:8].svg' : 'static/media/svg-sprite.svg',
        },
        pluginOptions: {},
    }, options);

    // Add loader
    const rule = {
        test: options.test,
        include: options.include,
        exclude: options.exclude,
        use: [
            {
                loader: require.resolve('external-svg-sprite-loader'),
                options: options.loaderOptions,
            },
            // Uniquify classnames and ids so that if svgxuse injects the sprite into the body,
            // it doesn't cause DOM conflicts
            {
                loader: require.resolve('svg-css-modules-loader'),
                options: {
                    transformId: true,
                },
            },
        ],
    };

    addBeforeRule(config.module.rules, fileLoaderRuleMatcher, rule);

    // Add plugin
    config.plugins.push(new SvgStorePlugin(options.pluginOptions));

    return config;
};

module.exports = (...args) => {
    if (args[0] && args[0].module) {
        const [config, env, options] = args;

        return createRewire(options)(config, env);
    }

    return createRewire(args[0]);
};
