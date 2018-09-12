# ipst-cli

## 介绍
ipst-cli是可以快速创建项目基本骨架的手脚架工具，目的是避免重复劳动，将基础的代码和页面布局通过模板的行驶生成，使开发中专注于业务。

## 功能
1. 创建后台管理系统项目骨架PC
    模板:[ipst_admin](https://github.com/ipstFE/ipst_admin) --- 可以下载模板
2. 创建大屏项目骨架  --- 未完成
3. 创建移动端项目骨架  --- 未完成
4. 代码规范检查和格式化  --- 未完成
5. 其他

## 安装
```
    sudo npm install -g ipst-cli
    ipst-cli init 项目名称
    # 根据提示完成项目模板创建
```
## 第三方库
    - commander.js 可以自动的解析命令和参数，用于处理用户输入的命令
    - download-git-repo 下载并提取git仓库，用于下载项目模板
    - Inquirer.js 通过命令行用户界面集合，用于和用户进行交互
    - handlebars.js 模板引擎，将用户提交的信息动态填充到文件中
    - ora 下载过程动画效果
    - chalk 终端添加文字颜色
    - log-symbols 可以在终端上显示 √ 或 × 等的图标