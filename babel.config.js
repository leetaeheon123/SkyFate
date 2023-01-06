module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'babel-plugin-root-import',
      {
        paths: [
          {
            rootPathSuffix: './styles',
            rootPathPrefix: '~/',
          },
          {
            rootPathSuffix: './UsefulFunctions',
            rootPathPrefix: '^/',
          },
          {
            rootPathSuffix: './src/component',
            rootPathPrefix: 'sc/',
          },
        ],
      },
    ],
    // [
    //   'module:react-native-dotenv',
    //   {
    //     moduleName: '@env',
    //     path: '.env',
    //     blacklist: null,
    //     whitelist: null,
    //     safe: true,
    //     allowUndefined: true,
    //   },
    // ],
  ],
};
