# 通过任务整合外部工具（[英文原版](http://code.visualstudio.com/docs/editor/tasks)）

许多现存的工具能够完成自动化任务，如构建，打包，测试或部署软件系统。

例子包括 [Make](https://en.wikipedia.org/wiki/Make_software)、[Ant](http://ant.apache.org/)、[Gulp](http://gulpjs.com/)、[Jake](http://jakejs.com/)、[Rake](http://rake.rubyforge.org/) 和 [MSBuild](https://github.com/Microsoft/msbuild)。

![VS Code can talk to a variety of external tools](http://code.visualstudio.com/images/tasks_tasks_hero.png)

这些工具大多在命令行运行，并在内部软件开发过程（编辑、编译、测试和调试）之外自动作业。鉴于其在开发生命周期中的重要性，VS Code 能够有效地帮助你在其内部运行这些工具并分析他们的结果。 

> 请注意，任务仅支持在当前项目文件夹中工作。对单个文件是不可用的。

## Hello World

> 译者注：你可以按 `Ctrl+Shift+B`，编辑器会检测 `.vscode/tasks.json` 是否存在，如果没有存在，则会提示你是否要创建 `tasks.json`，确定后则会自动创建

让我们从一个简单的 “Hello World” 任务开始，它会在运行时将文本显示在输出面板上。

任务会被定义在 `.vscode/tasks.json` 和 VS Code 已有的公共任务执行模板。在命令面板（Ctrl + Shift + P），你可以通过输入 `task` 看到各种任务相关的命令。

![tasks in command palette](http://code.visualstudio.com/images/tasks_tasks-command-palette.png)

选择 `Tasks: Configure Task Runner` 命令，你就会看到一系列任务执行的模板。选择 `Other` 去创建一个执行外部命令的任务。

你现在应该会看到一个 `tasks.json` 文件在项目的 `.vscode` 文件夹中，并附带以下内容：

```
{
    "version": "0.1.0",
    "command": "echo",
    "isShellCommand": true,
    "args": ["Hello World"],
    "showOutput": "always"
}
```

在这个例子中，我们仅运行一个带 “Hello World” 参数的 `echo` 脚本命令。

要测试 `echo` 任务，需要通过运行 `Tasks: Run Tasks` 并在下拉列表选择 `echo`。此时输出面板会打开，你将会看到 “Hello World” 文本。

你可以在 `tasks.json` 的键值上获得智能提示，并通过悬浮和 `Ctrl+空格` 促发自动填写。

![tasks IntelliSense](http://code.visualstudio.com/images/tasks_tasks-intellisense.png)

> 提示：你可以执行你的任务，通过快速打开（`Ctrl+P`）并输入 `task`、空格和命令名称。在本例就是 `task echo`。

## 输出窗口行为

有时您将希望控制输出窗口在运行任务时的行为。例如，在排查错误的时候，您可能希望最大化编辑器空间，只查看任务输出。`showOutput` 属性能够实行这样的行为，其有效值如下：

* `always` - 输出窗口总是被带到前面。这是默认值

* `never` - 用户必须手动地将输出窗口带到前面，通过 `View > Toggle Output` 命令（`Ctrl+Shift+U`）

* `silent` - 当没有 [problem matchers](http://code.visualstudio.com/docs/editor/tasks#_processing-task-output-with-problem-matchers) 被设置到任务时，输出窗口会带到前台

### `echoCommand`

为了查看 VS Code 运行时的额外命令，可以在 `tasks.json` 上设置 `echoCommand` 属性：

![tasks echoCommand](http://code.visualstudio.com/images/tasks_tasks-echoCommand.png)

> 注意：VS Code 使用预定义的 `tasks.json` 模板去运行 npm、MSBuild、maven 和其他命令行工具。学习任务的一个好方法是回顾这些模板，看看哪些工具或任务的运行与你可能使用的其他工具相似。

## `command` 和 `tasks[]`

`tasks.json` 需要一个单一的命令值去执行任务，例如 gulp、grunt 或其他一些命令行工具，像编译器或代码检查器。默认情况下，命令会展示在 `Tasks: Run Task` 下拉中。

你也可以在 `tasks` 序列里定义多个任务，在命令执行时，传入不同的参数或使用不同的设置。

以下是一个传入不同参数执行 `echo` 命令的简单例子：

```
{
    "version": "0.1.0",
    "command": "echo",
    "isShellCommand": true,
    "args": [],
    "showOutput": "always",
    "echoCommand": true,
    "suppressTaskName": true,
    "tasks": [
        {
            "taskName": "hello",
            "args": ["Hello World"]
        },
        {
            "taskName": "bye",
            "args": ["Good Bye"]
        }
    ]
}
```

现在当你执行 `Tasks: Run Task`，你会看到两个任务在下拉列表中，分别是 `hello` 和 `bye`。我们设置 `suppressTaskName` 为 `true`，默认情况下，任务名也会传递给命令，这导致 `echo hello Hello World` 的出现。

![tasks array](http://code.visualstudio.com/images/tasks_tasks-array.png)

一些 `tasks.json` 属性，例如 `showOutput` 和 `suppressTaskName`，能够被设置在全局或特定任务中去重载。`tasks`、`args` 属性值被添加到全局参数中。最后的命令行构建如下：

* 如果 `suppressTaskName` 为 `true`，命令行为 `command 'global args' 'task args'`

* 如果 `suppressTaskName` 为 `false`，则是 `command 'global args' taskName 'task args'`

也有一些特别的属性。其中一个有用的属性是 `isBuildCommand`，如果它被设为 `true`，将会使用 `Tasks: Run Build Task`（`Ctrl+Shift+B`）命令去执行。

## 运行多个命令

如果你想运行多个不同的命令，你可以在每一个任务声明不同的命令。一个 `tasks.json` 文件在每一个任务使用命令如下所示：

```
{
    "version": "0.1.0",
    "tasks": [
        {
            "taskName": "tsc",
            "command": "tsc",
            "args": ["-w"],
            "isShellCommand": true,
            "isBackground": true,
            "problemMatcher": "$tsc-watch"
        },
        {
            "taskName": "build",
            "command": "gulp",
            "args": ["build"],
            "isShellCommand": true
        }
    ]
}
```

第一个任务是在观察模式下运行 TypeScript 编译器，第二个任务是使用 gulp 构建。如果任务指定要运行本地命令的任务名称，则该命令将不包含在命令行中（在这些任务中，`suppressTaskName` 默认设为 `true`）。因为本地命令能够声明本地参数，所以默认情况下没有必要添加它。如果 `tasks.json` 同时声明了全局和局部命令，局部命令会覆盖全局命令。而不是将全局和局部命令合并执行。

## 内置变量

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

以下是一个配置的例子，传入到当前打开文件的 TypeScript 编译器：

```
{
    "command": "tsc",
    "args": ["${file}"]
}
```

## 操作系统特定属性

任务系统支持定义指定操作系统的值（例如，要执行的命令）。想这样做，只要把指定系统的字段，填入到 `tasks.json` 对应的位置即可。

以下例子是使用 Node.js 可执行文件作为命令，在 Windows 和 Linux 上被区别对待：

```
{
    "version": "0.1.0",
    "windows": {
        "command": "C:\\Program Files\\nodejs\\node.exe"
    },
    "linux": {
        "command": "/usr/bin/node"
    }
}
```

有效的操作系统值是 `windows`、`linux` 和 `osx`。被定义的属性在操作系统指定作用域会覆盖全局作用域定义的属性。

在以下事例中：

```
{
    "version": "0.1.0",
    "showOutput": "never",
    "windows": {
        "showOutput": "always"
    }
}
```

只有 Windows 系统上才会总是将窗口带到最前面，其他系统则不会。

任务中的本地命令也能被指定操作。语法与全局命令一致。下面例子是添加一个系统指定的参数到命令中：

```
{
    "version": "0.1.0",
    "tasks": [
        {
            "taskName": "build",
            "command": "gulp",
            "isShellCommand": true,
            "windows": {
                "args": ["build", "win32"]
            },
            "linux": {
                "args": ["build", "linux"]
            },
            "osx": {
                "args": ["build", "osx"]
            }
        }
    ]
}
```

## 任务的实践例子

为了突出任务的力量，这里有一些关于 VS Code 如何使用任务去整合外部工具如编译器和代码检查器的例子。

### 将 TypeScript 编译为 JavaScript

[TypeScript topic](http://code.visualstudio.com/docs/languages/typescript#_transpiling-typescript-into-javascript) 包含一个事例，创建一个任务将 TypeScript 编译为 JavaScript，并且通过 VS Code 观察一些相关的错误。

### 编译 Markdown 为 HTML

1. [Manually compiling with a Build task](http://code.visualstudio.com/docs/languages/markdown#_compiling-markdown-into-html)
1. [Automation of the compile step with a file watcher](http://code.visualstudio.com/docs/languages/markdown#_automating-markdown-compilation)

### 编译 Less 和 Sass 为 HTML

1. [Manually transpiling with a Build task](http://code.visualstudio.com/docs/languages/css#_transpiling-sass-and-less-into-css)
1. [Automation of the compile step with a file watcher](http://code.visualstudio.com/docs/languages/css#_automating-sassless-compilation)

## 自动检测 Gulp、Grunt 和 Jake 任务

VS Code 能够通过 Gulp、Grunt 和 Jake 文件自动检测任务。添加这些任务到任务列表中，不需要添加配置（除非你需要使用 `problem matcher`）。

为了使这个例子更加准确，让我们使用一个单一的 Gulp 文件。里面定义了两个任务：构建和调试。第一个是使用 [Mono](http://www.mono-project.com/)'s 编译器编译 C# 代码。第二个使用 Mono 调试器运行 MyApp。

```
var gulp = require("gulp");

var program = "MyApp";
var port = 55555;

gulp.task('default', ['debug']);

gulp.task('build', function() {
    return gulp
        .src('./**/*.cs')
        .pipe(msc(['-fullpaths', '-debug', '-target:exe', '-out:' + program]));
});

gulp.task('debug', ['build'], function(done) {
    return mono.debug({ port: port, program: program}, done);
});
```

按 `Ctrl+Shift+P`，输入 `Run Task` 然后按 `Enter` 键，就会显示有效的任务列表。选择其中一个，然后按 `Enter` 键去促发任务。

![Task list](http://code.visualstudio.com/images/tasks_gulpautodetect.png)

> 注意：Gulp、Grunt 和 Jake 被自动检测，仅当相应文件（如 `gulpfile.js`）存在于项目目录中（非子目录）。

## 用问题匹配器（即 `problemMatcher` 属性）处理任务输出

VS Code 能够处理带有 `problem matcher` 的任务输出，使用下面的值即可：

* TypeScript：`$tsc` 认为文件名在相对于打开目录中输出

* TypeScript Watch：`$tsc-watch` 匹配在观察者模式下执行 `tsc` 编译的问题上报

* JSHint：`$jshint` 认为文件名作为绝对路径被上报

* JSHint Stylish：`$jshint-stylish` 认为文件名作为绝对路径被上报

* ESLint Compact：`$eslint-compact` 认为文件名在相对于打开目录中输出

* ESLint Stylish：`$eslint-stylish` 认为文件名在相对于打开目录中输出

* Go：`$go` 认为文件名在相对于打开目录中输出

* CSharp and VB Compiler：`$mscompile` 认为文件名作为绝对路径被上报

* Less：`$lessCompile` 认为文件名作为绝对路径被上报

问题匹配器扫描已知的警告或错误字符串，在问题面板和编辑器的行内报告这些信息。

下面会为你介绍如何创建自己的问题匹配器。

## 映射 Gulp、Grunt 和 Jake 的输出到问题匹配器中

如果你想做的不仅仅是简单的运行任务，那么你需要在 `tasks.json`（在项目中的 `.vscode` 文件夹中）配置任务。例如，您可能希望匹配上报的问题，并在 VS Code 中突出显示它们，或者使用 `Tasks: Run Build Task` 命令（`Ctrl+Shift+B`）促发构建任务。

如果你还没有 `tasks.json` 文件在你的项目文件夹中的 `.vscode` 目录里，你可以通过打开命令面板（`Ctrl+Shift+P`），输入 `Tasks: Configure Task Runner`，然后 VS Code 会提供一系列模板供你选择。

以下的例子，是从列表中选择 `Gulp`。使用上面事例中创建的 `gulpfile.js` 文件（放在项目目录中），VS Code 会自动生成 `tasks.json` 文件，内容如下：

```
{
    // See http://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "0.1.0",
    "command": "gulp",
    "isShellCommand": true,
    "args": [
        "--no-color"
    ],
    "tasks": [
        {
            "taskName": "build",
            "args": [],
            "isBuildCommand": true,
            "isWatching": false,
            "problemMatcher": [
                "$lessCompile",
                "$tsc",
                "$jshint"
            ]
        }
    ]
}
```

> 译者注：本地试过不能成功生成以上内容，并有错误信息提示。。。

由于我们执行 Mono 编译器编译 C# 文件，所以应该使用 `$msCompile` 问题匹配器来检测任何由编译器上报上来的问题。

`problemMatcher` 属性应该改为：

```
            "problemMatcher": [
                "$msCompile"
            ]
```

上面这个 `tasks.json` 中，我们需要注意一些事情：

1. 我们想在 shell（VS Code 直接执行它）运行 gulp 命令，需要使用 `isShellCommand`。

1. 我们增加了一个明确的任务属性，能够允许我们在 `gulpfile.js` 的任务中随意添加参数。

1. 我们定义一个问题匹配器 `$msCompile` 去处理输出，因为在编译 C# 时使用 Mono 编译器，其内置的一个工程作为 MSC 支持微软编译器模式。

1. `isWatching` 属性设置为 `false`，所以我们在修改文件后，不能自动对源码进行构建。

## 定义一个问题匹配器

VS Code 创造性地传输一些最常见的问题匹配器。然而还有很多的编译器和检测工具没有被覆盖掉，他们都会产生自己的错误和警告。所以让我讲解一下如何制作自己的问题匹配器。

我们有一个 `helloWorld.c` 程序，它的开发者误将 `printf` 作为 `prinft` 使用。使用 [gcc](https://gcc.gnu.org/) 编译时会产生下面的警告：

```
helloWorld.c:5:3: warning: implicit declaration of function ‘prinft’
```

我们想创建一个问题匹配器能够捕捉信息到输出中，并且展示一个相应的问题在 VS Code 中。问题匹配器在很大程度上依赖正则表达式匹配。下面部分假定你熟悉正则表达式。

> 提示：我们发现一个很好用的工具 [RegEx101 playground](https://regex101.com/)，去开发和测试正则表达式。

像下面的匹配器能够捕捉上面的警告（和错误）：

```
{
    // 问题属于 C++ 语言。
    "owner": "cpp",
    // 上报问题的文件名是相对于所打开的文件夹
    "fileLocation": ["relative", "${workspaceRoot}"],
    // 当前模式匹配输出中的问题
    "pattern": {
        // 正则表达式。例如匹配：helloWorld.c:5:3: warning: implicit declaration of function ‘prinft’ [-Wimplicit-function-declaration]
        "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
        // 第 1 个正则匹配组是（相对路径）文件名
        "file": 1,
        // 第 2 个正则匹配组是发生问题所在的行
        "line": 2,
        // 第 3 个正则匹配组是发生问题所在的列
        "column": 3,
        // 第 4 个正则匹配组是问题的严重程度。可以被忽略。那所有问题会被当错误捕捉。
        "severity": 4,
        // The fifth match group matches the message.
        // 第 5 个正则匹配组是信息
        "message": 5
    }
}
```

请注意 `file`、`line` 和 `message` 是必填的。

以下是最终的 `tasks.json` 文件，上面的代码（除去注释）由当前任务详情进行包裹：

```
{
    "version": "0.1.0",
    "command": "gcc",
    "args": ["-Wall", "helloWorld.c", "-o", "helloWorld"],
    "problemMatcher": {
        "owner": "cpp",
        "fileLocation": ["relative", "${workspaceRoot}"],
        "pattern": {
            "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
            "file": 1,
            "line": 2,
            "column": 3,
            "severity": 4,
            "message": 5
        }
    }
}
```

在 VS Code 中运行它，并按下组合键 `Ctrl+Shift+M` 去获得返回的问题列表，如下所示：

![GCC Problem Matcher](http://code.visualstudio.com/images/tasks_problemmatcher.png)

有更多的键值对能够在 `pattern` 中使用，如：

* `location`：如果问题定位是行或行、列或开始行、开始列、结束行、结束列，那么我们的通用位置匹配组就可以被使用到。

* `endLine`：匹配问题结束行的索引。如果没有结束行提供给编译器，那么该值会被忽略。

* `endColumn`：匹配问题结束列的索引。如果没有结束列提供给编译器，那么该值会被忽略。

* `code`：匹配问题代码的索引。如果没有代码提供给编译器，那么该值会被忽略。

> 注意：一个有效的 `pattern` 必须至少包含 `file`、`message` 和 `line` 或 `location`。

## 定义一个多行的问题匹配器

一些工具会在以多行的形式，上报源码中所发现的问题，尤其是使用一些主流的报告工具。其中一个就是 [ESLint](http://eslint.org/)，以主流模式生成输出信息：

```
test.js
  1:0   error  Missing "use strict" statement                 strict
✖ 1 problems (1 errors, 0 warnings)
```

我们的问题匹配器是基于行的，所以我们需要使用不同的正则表达式去捕获文件名（test.js）、当前问题定位和信息（`1:0 error Missing "use strict" statement`）。

想做多行输出，我们需要为 `pattern` 提供问题模式的数组。这样需要你在 `pattern` 中定义每一行想要匹配展示的内容。

以下的问题匹配器会从 ESLint 的主流模式输出——但还有一个小问题需要我们在之后解决。代码中的第一个正则表达式捕获文件名，第二个则是捕获行、列、严重程度、信息和错误代码：

```
{
    "owner": "javascript",
    "fileLocation": ["relative", "${workspaceRoot}"],
    "pattern": [
        {
            "regexp": "^([^\\s].*)$",
            "file": 1
        },
        {
            "regexp": "^\\s+(\\d+):(\\d+)\\s+(error|warning|info)\\s+(.*)\\s\\s+(.*)$",
            "line": 1,
            "column": 2,
            "severity": 3,
            "message": 4,
            "code": 5
        }
    ]
}
```

当然，这绝不是简单的事情，如果有多个错误在源文件中，这个 `pattern` 将不会工作。例如，想象一下由 ESLint 产生的输出内容：

```
test.js
  1:0   error  Missing "use strict" statement                 strict
  1:9   error  foo is defined but never used                  no-unused-vars
  2:5   error  x is defined but never used                    no-unused-vars
  2:11  error  Missing semicolon                              semi
  3:1   error  "bar" is not defined                           no-undef
  4:1   error  Newline required at end of file but not found  eol-last
✖ 6 problems (6 errors, 0 warnings)
```

`pattern` 中第一个正则匹配到 `test.js`，第二个是 `1:0 error ...`。再下一行的 `1:9 error ...` 会被处理，但匹配不到第一个正则，所以之后不会有问题会被捕获到。

为了让它正常工作，最后一个正则表达式需要为多行匹配模式提供 `loop` 属性。如果设为 `true`，只要作为正则表达式匹配器，它会引导任务系统，将最后的多行匹配器模式，在输出中匹配多行。

所有上一个模式所匹配到的信息会与下一个模式所匹配到的信息相结合，变成一个问题输出到 VS Code 中。

下面是一个能够完全匹配 ESLint 所输出问题风格的问题匹配器：

```
{
    "owner": "javascript",
    "fileLocation": ["relative", "${workspaceRoot}"],
    "pattern": [
        {
            "regexp": "^([^\\s].*)$",
            "file": 1
        },
        {
            "regexp": "^\\s+(\\d+):(\\d+)\\s+(error|warning|info)\\s+(.*)\\s\\s+(.*)$",
            "line": 1,
            "column": 2,
            "severity": 3,
            "message": 4,
            "code": 5,
            "loop": true
        }
    ]
}
```

## 后台 / 正在观察的任务

有些工具提供后台运行，观察文件系统的变化，当一个文件在磁盘中被修改，会促发相应的行为。`Gulp` 就有这样功能，通过 npm 的 [gulp-watch](https://www.npmjs.com/package/gulp-watch)模块来实现。TypeScript 编译器的 `tsc` 已经内置支持，通过 `--watch command` 这个行内选项。

为了提供反馈，在 VS Code 中活动的后台任务和产生的问题结果，问题匹配器必须使用添加的信息去监听这些输出的 `state` 变化。我们拿 `tsc` 编译器作为例子。但编译器以观察者模式启动，它会打印以下附加信息到 console 中：

```
> tsc --watch
12:30:36 PM - Compilation complete. Watching for file changes.
```

当一个有问题的文件在磁盘上发生变化，会显示以下输出：

```
12:32:35 PM - File change detected. Starting incremental compilation...
src/messages.ts(276,9): error TS2304: Cannot find name 'candidate'.
12:32:35 PM - Compilation complete. Watching for file changes.
```

上面看到的这些输出展示了以下的模式：

* 当 `File change detected. Starting incremental compilation...` 被打印到 console 中时，编译器开始运行。

* 当 `Compilation complete. Watching for file changes.` 被打印到 console 中时，编译器停止运行。

* 在以上两行信息之间是上报的问题。

* 一旦初始化开始运行（不会打印 `File change detected. Starting incremental compilation...` 到 console 中），编译器也运行。

为了捕获这个信息，一个问题匹配器提供了一个 `watching` 属性。

对于 `tsc` 编译器，应类似如下书写：

```
"watching": {
    "activeOnStart": true,
    "beginsPattern": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - File change detected\\. Starting incremental compilation\\.\\.\\.",
    "endsPattern": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - Compilation complete\\. Watching for file changes\\."
}
```

在问题匹配器中除了 `watching` 属性，任务自身必须使用 `isWatching` 属性来标记为监听对象。

一个手动书写的完整 `tasks.json` 文件，以观察模式运行的 `tsc` 任务，如下所示：

```
{
    "version": "0.1.0",
    "command": "tsc",
    "suppressTaskName": true,
    "tasks": [
        {
            "taskName": "watch",
            "args": ["--watch"],
            "isWatching": true,
            "problemMatcher": {
                "owner": "typescript",
                "fileLocation": "relative",
                "pattern": {
                    "regexp": "^([^\\s].*)\\((\\d+|\\,\\d+|\\d+,\\d+,\\d+,\\d+)\\):\\s+(error|warning|info)\\s+(TS\\d+)\\s*:\\s*(.*)$",
                    "file": 1,
                    "location": 2,
                    "severity": 3,
                    "code": 4,
                    "message": 5
                },
                "watching": {
                    "activeOnStart": true,
                    "beginsPattern": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - File change detected\\. Starting incremental compilation\\.\\.\\.",
                    "endsPattern": "^\\s*\\d{1,2}:\\d{1,2}:\\d{1,2}(?: AM| PM)? - Compilation complete\\. Watching for file changes\\."
                }
            }
        }
    ]
}
```

## 下一步

让我们继续学习任务相关的内容......

* [tasks.json Schema](http://code.visualstudio.com/docs/editor/tasks_appendix) —— 你可以复习完整的 `tasks.json` 概要和描述。

* [Editing Evolved](http://code.visualstudio.com/docs/editor/editingevolved) —— 代码检测、智能提示、灯泡提示、窥视和跳转到定义位置等。

* [Language Support](http://code.visualstudio.com/docs/languages/overview) —— 学习我们支持的编程语言，使用 VS Code 和社区扩展。

* [Debugging](http://code.visualstudio.com/docs/editor/debugging) —— 直接在你的 VS Code 编辑器调试你的源码。

## 基本问题

问：如何定义多个任务去执行不同的命令？

答：定义多个任务在 `tasks.json` 还不能被 VS Code 完全支持（请看问题 [#981](https://github.com/Microsoft/vscode/issues/981)）。你可以绕过这个限制去执行你的任务命令，通过 shell 的命令（在 Linux 和 Mac 上是 `sh`，在 Windows 上是 `cmd`）。

以下例子是为 `make` 和 `ls` 提供两个任务：

```
{
    "version": "0.1.0",
    "command": "sh",
    "args": ["-c"],
    "isShellCommand": true,
    "showOutput": "always",
    "suppressTaskName": true,
    "tasks": [
        {
            "taskName": "make",
            "args": ["make"]
        },
        {
            "taskName": "ls",
            "args": ["ls"]
        }
    ]
}
```

`make` 和 `ls` 任务会显示在 `Tasks: Run Task` 的下拉列表中。

对于 Windows，你将需要传入 `/C` 参数给 `cmd`，从而让任务参数能够执行。

```
    "command": "cmd",
    "args": ["/C"]
```

---

> 文档更新时间为 2/2/2017