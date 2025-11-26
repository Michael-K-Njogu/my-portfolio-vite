// postcss.config.cjs
module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    }),
    require('cssnano')({
      preset: [
        'default',
        {
          mergeLonghand: true,
          cssDeclarationSorter: false,
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
        },
      ],
    }),
  ],
};
