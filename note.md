# ipst_cli 开发笔记

### 1. 起步
    1. 初始化项目： ```yarn init```
    2. 安装依赖: ```yarn add commander download-git-repo inquirer handlebars ora chalk log-symbols -S```
### 2.处理命令行
node.js内置了对命令行操作的支持，在package.json中的bin字段可以定义命名和关联的执行文件
    ```{
        //...
        "bin": {
            "ipst":"index.js"
        },
        //...
        }
    ```
在index.js中定义init命令
index.js
```
    #!/usr/bin/env/ Node
    const program = require('commander')
    program.version('1.0.0', '-V, --version') // 将-V，--sersion添加到命令中，打印出版本号
        .command('init <name>') // init命令初始化项目 name必须值
        .action(name => { // action: 是执行init命令会发生的行为，在这里执行生成项目的过程
            console.log('创建项目:', name)
        })
    program.parse(process.argv)
```
这里：
- init是初始化项目
- action 是init的执行过程。以上代码action中打印了init项目的名称

### 3.下载模板 download-git-repo
[download-git-repo](https://www.npmjs.com/package/download-git-repo)可以从github、gitlab、bitbucket下载仓库。

由于公司暂时没有gitlab仓库，先从github上下载模板
index.js 添加download
```
#!/usr/bin/env/ Node

const program = require('commander')
const download = require('download-git-repo')
program.version('1.0.0', '-V, --version') 
       .command('init <name>') 
       .action(name => { 
           download(
                // 'http://git@github.com:ipstFE/ipst_admin.git#master', // gitLab
                // 'github:baggiomygod/fui-admin', // github baggiomygod
                'ipstFE/ipst_admin', // github simply ipstFE
                name, // 第二个参数是路径，这里直接在当前创建‘name’的文件夹下存放模板，
                {
                    clone: true
                },
                (err) => {
                    if (err) {
                        console.log('报错:', err)
                        return
                    }
                    console.log('success')
                }
            )
       })
program.parse(process.argv)
```
- github: ‘github:ipstFE/projectName’
- gitlab: 'http://git@github.com:ipstFE/ipst_admin.git#master'

# 4. 命令行交互
命令行交互功能可以在用户执行init命令后，想用户提出问题，接收用户的输入并做出相应的处理。
需要先修改模板项目的package.json
```
    name: "{{name}}",
    description: "{{description}}",
    author: "{{author}}"
    ...
```
这里需要使用inquirer.js
```
    program.version('1.0.0', '-V, --version') // 将-V，--sersion添加到命令中，打印出版本号
       .command('init <name>') // init命令初始化项目 name必须值
       .action(name => { // action: 是执行init命令会发生的行为，在这里执行生成项目的过程
            // 需要用户输入的内容
            inquirer.prompt([
                {
                    name: 'author',
                    message: '请输入作者名称(ipst)'
                },
                {
                    name: 'description',
                    message: '请输入项目描述'
                }
            ])
            .then((answers) => {
                download(
                    // 'http://git@github.com:ipstFE/ipst_admin.git#master', // gitLab
                    'github:baggiomygod/fui-admin', // github baggiomygod
                    // 'ipstFE/ipst_admin', // github simply ipstFE
                    name,
                    {
                        clone: true
                    },
                    (err) => {
                        if (err) {
                            console.log(err)
                            return
                        }

                        const meta = {
                            name: name,
                            description: answers.description | '',
                            author: answers.author | 'ipst'
                        }
                        // 修改模板的package.json文件
                        console.log('修改package.json...')
                        const fileName = `${name}/package.json`
                        const content = fs.readFileSync(fileName).toString()
                        const result = handlebars.compile(content)(meta) // 模板引擎，将用户提交的信息动态填充到文件中
                        fs.writeFileSync(fileName, result)
                    }
                )
            })
       })
```

### 4. 视觉美化 ora
    1. ora 提示用户正在下载模板
    
    未完待续...


## 发布到npm
    1. 添加bin/ipst文件
        ```
            #! /usr/bin/env node
            require('../src/index');
        ```
    2. 修改package.json
    ```
        // ...
        "main": "src/index.js",
        // ...
        "bin": {
            "ipst":"bin/ipst"
        }
    ```
    3. 发布(每次发布前都要更新version)
    npm login
    npm publish