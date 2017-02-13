# 调试（[英文原版](http://code.visualstudio.com/docs/editor/debugging)）

VS Code 一个主要的特点是其强大的调试支持。VS Code 内置了调试器帮助促进你的编辑、编译和调试流程。

![Debugging diagram](http://code.visualstudio.com/images/debugging_debugging_hero.png)

## 调试器扩展

VS Code 拥有内置调试器，支持 [Node.js](https://nodejs.org/) 运行时和能够调试 JavaScript、TypeScript 以及任何其他像 JavaScript 一样被熟知的语言。

为了调试其他语言和运行时（包括 [PHP](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug)、[Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby)、[Go](https://marketplace.visualstudio.com/items?itemName=lukehoban.Go)、[C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)、[Python](https://marketplace.visualstudio.com/items?itemName=donjayamanne.python) 以及其他更多的语言），请在我们的 VS Code [市场](https://marketplace.visualstudio.com/vscode/Debuggers)的 `Debuggers` 栏目的[扩展](http://code.visualstudio.com/docs/editor/extension-gallery)区域寻找。

下面几个包含调试支持的流行的扩展：

* [C#](https://marketplace.visualstudio.com/items?itemName=ms-vscode.csharp)

* [Python](https://marketplace.visualstudio.com/items?itemName=donjayamanne.python)

* [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

* [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

> 提示：上面显示的扩展是被动态查询的。点击上面其中一个扩展去阅读其描述和评论，确定哪一个才是最符合自己需求的。 

## 开始调试

下面的文档是基于内置的 [Node.js](https://nodejs.org/) 调试器，但大部分的概念和特点都能与其他调试器相通。

在阅读调试器内容之前，最好先创建一个 Node.js 应用的例子。你可以根据 [Node.js walkthrough](http://code.visualstudio.com/docs/runtimes/nodejs) 去安装 Node.js，并创建简单的 “Hello World” 应用（`app.js`）。一旦你那个简单应用建立起来，本页将会带你领略 VS Code 调试的特性。

## 调试界面

为了打开调试界面，你需要点击 VS Code 中侧边栏的调试图标。

![Debug icon](http://code.visualstudio.com/images/debugging_debugicon.png)

调试界面展示了与调试相关的所有信息，拥有一个调试命令的头部栏和注册设置。

## 启动配置

为了在 VS Code 中调试一个简单的应用，你仅需按 `F5` 键，VS Code 会尝试调试当前激活的文件。

然而，为了更进一步地调试，你首页需要建立你的启动配置文件 `launch.json`。点击调试界面头部的配置齿轮图标，然后 VS Code 就会生成 `launch.json` 在项目目录 `.vscode` 下面。VS Code 会尝试自动检测你的调试环境，如果检测失败，你就必须手动选择你的调试环境（在下拉窗选中 `Node`）。

这里是一个生成好的 Node.js 调试器：

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${file}",
            "cwd": "${workspaceRoot}"
        },
        {
            "type": "node",
            "request": "attach",
            "name": "Attach to Process",
            "port": 5858
        }
    ]
}
```

请注意，这些启动配置中可用的属性因调试器而异。你可以使用智能提示找出一个特定调试器所存在的属性。并且，悬浮帮助可用于所有属性。如果你在你的启动配置上看到绿色标记，将鼠标悬停在它们上面，就能获知问题所在，尝试在启动调试会话前解决它们。

VS Code 调试器通常支持在调试模式或在已运行的程序之上启动程序。根据不同的要求（`attach`或`launch`），不同的属性是必需的，我们 `launch.json` 的验证和建议必定为此提供帮助。

重温生成的值，确保它们对于你的项目和调试环境有意义。

为了添加新的配置到已存在的 `launch.json` 文件上，如果你的光标定位在配置数组中（`configurations`），请使用智能提示。或者仅仅按 `Add Configuration...` 按钮在数组的开端调用智能提示。或简单地在下拉选择 `Add Configuration...` 选项。

![launch json suggestions](http://code.visualstudio.com/images/debugging_add-config.gif)

在调试界面使用配置下拉（点击齿轮图标左边带播放图标的下拉框），选择名为 `Launch` （中文为 “启动程序”）的选项。一旦你的启动配置设置好，可以通过 `F5` 开始你的调试会话。

## 调试行为

一旦一个调试会话开启，调试行为面板会出现在编辑器的顶部。

![Debug Actions](http://code.visualstudio.com/images/debugging_actions.png)

> 译者注：下面从左到右依次解释

* 继续 / 暂定 `F5`

* 同一个调用栈层中移动到下一个可执行的代码行 `F10`

* 移动到下一个可执行的代码行 `F11`

* 在栈中前进到下一层，并在调用函数的下一行停止 `Shift+F11`

* 重启 `Ctrl+Shift+F5`

* 停止 `Shift+F5`

## `launch.json` 属性

有很多 `launch.json` 属性帮助支持不同调试器和调试脚本。如上所述，一旦你已经为 `type` 属性声明了一个值，你就可以使用智能提示（`Ctrl+空格`）去查看有效的属性列表。

![launch json suggestions](http://code.visualstudio.com/images/debugging_launch-json-suggestions.png)

以下属性被强制使用在所有启动配置中：

* `type` —— 所使用的启动配置对应的调试器类型。所有安装了的调试扩展引入一个类型，例如 node 内置调试器 `node` 和 `node2`，或者 PHP、Go 扩展的 `php`、`go`。

* `name` —— 是出现在调试器的启动配置下拉中的提示名称。

以下一些可选的属性值在所有启动配置中均有效：

* `preLaunchTask` —— 在开启一个调试会话之前启动一个任务，该值应该是已在 `tasks.json`（该文件在项目目录的 `.vscode` 文件夹中）中声明了的任务名称。

* `internalConsoleOptions` —— 在调试会话运行时，控制调试器输出面板是否可视。

* `debugServer` —— 仅用于作者调试扩展使用：连接到所声明端口，而不是启动调试适配器。

很多调试器支持以下一些属性：

* `program` —— 在运行调试器时，执行可执行文件

* `cwd` —— 当前工作目录，为了寻找依赖和其他文件

* `port` —— 连接到活动进程的端口

* `stopOnEntry` —— 当程序执行时，立刻会打断

* `console` —— 控制台使用的种类，如 `internalConsole`、`integratedTerminal`、`externalTerminal`

## 内置变量

VS Code 支持在 `launch.json` 使用内置变量的字符串，以下是预定义好的变量：

* `${workspaceRoot}`：在 VS Code 打开的项目路径

* `${workspaceRootFolderName}`：在 VS Code 打开的项目名

* `${file}`：当前打开文件的路径

* `${relativeFile}`：当前打开文件相对于 `workspaceRoot` 的路径

* `${fileBasename}`：当前打开文件的文件名

* `${fileBasenameNoExtension}`：当前打开文件的文件名，但没有后缀

* `${fileDirname}`：当前打开文件的目录名

* `${fileExtname}`：当前打开文件的后缀

* `${cwd}`：任务启动时的当前项目目录

你也可以通过 `${env.Name}`（如 `${env.PATH}`）引用环境变量。但确保要匹配当前环境变量名的外壳，如 Windows 环境下是 `env.Path`。

```
{
    "type": "node",
    "request": "launch",
    "name": "Launch Program",
    "program": "${workspaceRoot}/app.js",
    "cwd": "${workspaceRoot}",
    "args": [ "${env.USERNAME}" ]
}
```

你也可以参照 VS Code 的设置使用 `${config.NAME}` 语法（例如：`${config.editor.fontSize}`）。一些调试扩展甚至引进附加的命令变量作为 `${command.NAME}` 被引入。

## 运行模式

除了调试程序，VS Code 支持运行程序。`Run` 行为通过 `Ctrl+F5` 促发，并且使用当前所选的执行配置。在 `Run` 模式下支持很多启动配置属性。VS Code 保持一个调试会话，当程序在运行和按下停止按钮结束程序时。

请注意：运行模式一直有效，但不是所有的调试扩展都支持 `Run`。在这种情况下，`Run` 和 `Debug` 一样。

## 多目标调试

为了调试牵涉多个进程（例如一个客户端和一个服务端）的复杂脚本，VS Code 支持多目标调试。

使用多目标调试十分简单：在你开启了第一个调试会话后，你仅需启动另一个会话即可。第二个会话一旦启动并运行，VS Code 用户界面就会切换为多目标模式：

* 独立会话现在会在 `CALL STACK` 视图的顶层元素展示。
  ![Callstack View](http://code.visualstudio.com/images/debugging_debug-callstack.png)

* 浮动调试小窗口展示当前活动的会话（和所有其他在下拉菜单上有效的会话）。
  ![Debug Actions Widget](http://code.visualstudio.com/images/debugging_debug-actions-widget.png)

* 调试行为（例如所有在浮动调试小窗口中的行为）在激活的会话中被执行。激活的会话能够被改变，通过使用浮动调试小窗口的下拉菜单或在 `CALL STACK` 视图选择一个不同的元素。

一个启动多调试会话的替代方法，是使用俗称为复合启动的配置。一个复合启动配置罗列了两个或以上并行启动的启动配置。复合启动配置展示在启动配置的下拉菜单中。

```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Server",
            "program": "${workspaceRoot}/server.js",
            "cwd": "${workspaceRoot}"
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Client",
            "program": "${workspaceRoot}/client.js",
            "cwd": "${workspaceRoot}"
        }
    ],
    "compounds": [
        {
            "name": "Server/Client",
            "configurations": ["Server", "Client"]
        }
    ]
}
```

## 断点

断点能够通过点击编辑区边缘进行切换。好的断点控制（开/关/重复）能够在调试器视图的 `BREAKPOINTS ` 模块被实现。

* 断点一般在编辑区边缘用红色实心圈被展示。

* 关闭的断点会有一个灰色实心圈。

* 当一个调试会话开启，无法在调试器上注册的断点更改为灰色空心圆。如果在没有即时编辑支持的调试会话运行的情况下编辑源，则可能会发生同样的情况。

重复所有断点的命令让所有断点回到原来的位置。这很有帮助，如果你的调试环境是 “懒惰” 和 “错位”，断点所在的源码将不会被执行。

一个强大的 VS Code 调试特性是根据表达式或命中计算来设置条件的能力。

* 表达式条件（`Expression condition`）：无论任何时候表达式求值为 `true`，断点都会被击中。

* 命中计算（`Hit count`）：在执行被阻断（`break`）前，命中计算控制一个断点需要被击中多少次。命中计算是否被重视，以及表达式的确切语法如何，取决于所使用的调试器扩展名。

你可以添加条件和（或）命中计算，要么使用 `Add Conditional Breakpoint` 行为创建断点，要么使用 `Edit Breakpoint...` 行为对待已存在的断点。在这两种情况下，带有下拉菜单的内联文本框将打开表达式输入区域。

![HitCount](http://code.visualstudio.com/images/debugging_hitCount.gif)

如果调试器不能支持条件断点，`Add Conditional Breakpoint` 行为将不会出现。

## 函数断点

除了直接打点在源码上外，调试器也可以支持通过声明一个函数名创建断点。这有利于源码中未被调用的位置，但函数名却是已知的。

一个“函数断点”的创建，是通过点击 `BREAKPOINTS` 模块的头部的 `+` 按钮和输入函数名：

![function breakpoint](https://az754404.vo.msecnd.net/public/function-breakpoint.gif)

## 数据检查

变量可以在调试器视图的 `VARIABLES` 模块被检查，或者在编辑器中将鼠标放在他们的源码上。

在 `CALL STACK` 模块中，变量和表达式求值是相对于所选中的堆栈帧。

![Debug Variables](http://code.visualstudio.com/images/debugging_variables.png)

变量和表达式也可以在调试视图的 `WATCH` 模块进行评估和观察。

## 调试控制台

在调试控制台，可以进行表达式求值。为了打开调试控制台，在调试面板顶部使用 `Open Console` 行为或者使用命令面板（`Ctrl+Shift+P`）。调试控制台会在打字的时候展示建议。如果你需要输入多行，在行间使用 `Shift+Enter`，然后按 `Enter` 键发送所有的行进行评估。

![Debug Console](http://code.visualstudio.com/images/debugging_debugconsole.png)

## 下一步

为了学习关于 VS Code 的 Node.js 调试支持，请看下面：

* [Node.js](http://code.visualstudio.com/docs/editor/node-debugging) - 已包含在 VS Code 的 Node.js 调试器。

Node.js 调试器的基础教程，查阅：

* [Intro Video - Debugging](http://code.visualstudio.com/docs/introvideos/debugging) - 介绍视频展示了调试的基础知识。

学习 VS Code 任务执行支持，请去：

* [Tasks](http://code.visualstudio.com/docs/editor/tasks) - 使用 Gulp、Grunt 和 Jake 执行任务。展示错误与警告信息。

编写你自己的调试器扩展，请看：

* [Debuggers](http://code.visualstudio.com/docs/extensions/example-debuggers) - 按步骤创建一个 VS Code 调试扩展，从一个模仿例子开始。

## 基本问题

问：支持的调试方案是什么？

答：调试 Node.js 基本的应用程序能被 Linux、Mac 和 WIndows 等平台的 VS Code 所支持。很多其他的方案被市场上有效的 [VS Code 扩展](https://marketplace.visualstudio.com/vscode/Debuggers?sortBy=Downloads)所支持。

问：在调试视图的下拉中，我看不到启动配置，出什么问题了？

答：最通常的问题是你没有建立 `launch.json` 文件，或有一个语法错误在 `launch.json` 文件上。

---

> 文档更新时间为 2/2/2017