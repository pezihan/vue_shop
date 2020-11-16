// 这是项目发布阶段需要到的babel插件
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的查件数组 （使用展开运算符展开数组）
    ...prodPlugins,
    // 路由懒加载依赖配置
    '@babel/plugin-syntax-dynamic-import'
  ]
}
