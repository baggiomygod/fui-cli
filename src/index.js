const program = require('commander')
const download = require('download-git-repo')
const handlebars = require('handlebars');
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')

const fs = require('fs')
const templates = {
    admin: 'github:baggiomygod/fui-admin',
    multiple: 'git@github.com:baggiomygod/mul-template.git',
    mobile: 'github:baggiomygod/fui', // 暂无
    screen: 'github:baggiomygod/screen-template', // 暂无
    pwa: 'github:baggiomygod/fui-pwa' // 暂无
}
program.version('1.0.0', '-V, --version') // 将-V，--sersion添加到命令中，打印出版本号
       .command('init <name>') // init命令初始化项目 name必须值
       .action(name => { // action: 是执行init命令会发生的行为，在这里执行生成项目的过程
            if (!fs.existsSync(name)) { // 如果读取不到name的文件夹 说明本地没有同名目录
                // 需要用户输入的内容
                inquirer.prompt([
                    {
                        name: 'author',
                        message: '请输入作者名称'
                    },
                    {
                        name: 'description',
                        message: '请输入项目描述'
                    },
                    {
                        type: 'list',
                        message: '请选择模板类型:',
                        name: 'template',
                        choices: ['pc', 'multiple', 'mobile', 'screen', 'pwa']
                    }
                ])
                .then((answers) => {
                    let templateRepository = ''
                    // if (answers.template !== 'admin') {
                    //     console.log(symbols.warning, chalk.yellow(answers.template + '模板建设中,暂不支持创建'))
                    //     return
                    // }
                    
                    switch(answers.template) {
                        case 'admin':
                            templateRepository = 'github:baggiomygod/fui-admin'
                        break;
                        case 'multiple':
                            templateRepository = 'github:baggiomygod/mul-template'
                        break;
                        default:
                            console.log(symbols.warning, chalk.yellow(answers.template + '模板建设中,暂不支持创建'))
                        return
                    }
                    const spinner = ora('正在下载模板...')
                    spinner.start()
                    download(
                        // 'http://git@github.com:ipstFE/ipst_admin.git#master', // gitLab
                        // 'github:baggiomygod/fui-admin', // github baggiomygod
                        templateRepository,
                        name,
                        {
                            clone: true
                        },
                        (err) => {
                            if (err) {
                                spinner.fail()
                                console.log(symbols.error, chalk.red(err))
                                return
                            }
                            // 下载成功
                            spinner.succeed()
                            const meta = {
                                name: name,
                                description: answers.description | '',
                                author: answers.author | 'servyou'
                            }
                            // 修改模板的package.json文件
                            const fileName = `${name}/package.json`
                            if (fs.existsSync(fileName)) {
                                const content = fs.readFileSync(fileName).toString()
                                const result = handlebars.compile(content)(meta) // 模板引擎，将用户提交的信息动态填充到文件中
                                fs.writeFileSync(fileName, result)
                                }
                                console.log(symbols.success, chalk.green('项目初始化完成'))
                                console.log('----------启动项目--------------')
                                console.log(symbols.info, chalk.white('进入项目目录:cd ' + name))
                                console.log(symbols.info, chalk.white('下载依赖:yarn'))
                                console.log(symbols.info, chalk.white('启动项目:yarn start'))
                                console.log('----------启动项目--------------')
                            }
                    )
                })
            } else {
                // 错误提示项目已存在，避免覆盖原有项目
                console.log(symbols.error, chalk.red('项目已存在'));
            }

       })
program.parse(process.argv)