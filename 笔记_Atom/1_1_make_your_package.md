# Atom 1.0 插件制作——计算当前文档字数

[来源](https://atom.io/docs/v1.0.11/hacking-atom-package-word-count)

1. `shift` + `cmd` + `p` 或 `shift` + `ctrl` + `p` 弹出命令行界面，输入`Generate Package`

1. 在插件地址栏输入想要保存的路径，如 `/Users/aben/github/my-package`

1. 在右侧 `tree view` 中会看到如下的文件结构图，在下次启动的时候，该 `my-package` 会自动加载进来

    ```
    my-package
        |
        |- keymaps
        |   `- my-package.cson
        |
        |- lib
        |   |- my-package-view.coffee
        |   `- my-package.coffee
        |
        |- menus
        |   `- my-package.cson
        |
        |- spec
        |   |- my-package-spec.coffee
        |   `- my-package-view-spec.coffee
        |
        |- styles
        |   `- my-package.less
        |
        |- .gitignore
        |- CHANGELOG.md
        |- LICENSE.md
        |- package.json
        `- README.md
    ```

    对部分文件及其内容解释：

    ```
    package.json                # 使用方式和目的与 npm 的 package.json 一致，必须在顶层
        |- main                 # 主文件入口
        |- styles               # 样式文件的路径列表，不声明则默认使用顶层同名文件夹
        |- keymaps              # 按键索引的路径列表，不声明则默认使用顶层同名文件夹
        |- menus                # 菜单索引的路径列表，不声明则默认使用顶层同名文件夹
        |- snippets             # 片段索引的路径列表，不声明则默认使用顶层同名文件夹（1.0 好像没了）
        |- activationCommands   # 促发插件命令调用的对象，其 key 为 css 选择器的名字，其 value 为命令列表
        `- activationHooks      # 促发插件命令调用的钩子列表，范式为 `language-package-name:grammar-used`，如 `language-javascript:grammar-used`

    lib/my-package.coffee
        |- activate(state)  # 插件激活时调用，类似 c++ 构造函数
        |- deactivate()     # 插件销毁时调用，类似 c++ 析构函数
        |- serialize()      # 窗口关闭时会返回你的组件的状态值（json格式），窗口重开时，会把数据传回给 activate 方法
        `- toggle()         # 插件切换时使用

    styles  # 样式文件支持 less 和 css，默认是 less
            # Atom 默认提供了一套定义好的样式，可以通过 `cmd-shift-P` 输入 `styleguide` 或直接通过 `cmd-ctrl-shift-G` 进行查询
            # 如果要自定义的话，请通过编辑 `styles/my-package.less` 文件，或对 `package.json` 的参数 `styles` 进行文件加载

    keymaps/my-package.cson     # 快捷键绑定，如
                                # 'atom-workspace':
                                #   'ctrl-alt-o': 'my-package:toggle'
                                # 表示在 `atom-workspace` 版面，按下 `ctrl-alt-o` 组合键会促发组件 `my-package` 的 `toggle` 事件

    menus   # 菜单分 `context-menu` 和 `menu`（my-package 的快捷调用入口）
            # context-menu : 显示在右键弹出菜单
            #         menu : 显示在顶部的主菜单
            # 一般键值有 `label` `submenu` `command` 和 `type`

    spec    # 使用 Jasmine 的单元测试，
            #      my-package-spec.coffee : 逻辑单元测试
            # my-package-view-spec.coffee : 界面单元测试
    ```

1. 逻辑主文件 `lib/my-package.coffee` 和视图主文件 `lib/my-package-view.coffee` 的编辑

    lib/my-package-view.coffee

    ```
    module.exports =
    class WordcountView
      constructor: (serializedState) ->
        # Create root element
        @element = document.createElement('div')
        @element.classList.add('my-package')

        # Create message element
        message = document.createElement('div')
        message.textContent = "The MyPackage package is Alive! It's ALIVE!"
        message.classList.add('message')
        @element.appendChild(message)

      # Returns an object that can be retrieved when package is activated
      serialize: ->

      # Tear down any state and detach
      destroy: ->
        @element.remove()

      getElement: ->
        @element

      setCount: (count) ->
        displayText = "There are #{count} words."
        @element.children[0].textContent = displayText
    ```

    lib/my-package.coffee

    ```
    MyPackageView = require './my-package-view'
    {CompositeDisposable} = require 'atom'

    module.exports = MyPackage =
      myPackageView: null
      modalPanel: null
      subscriptions: null

      activate: (state) ->
        @myPackageView = new MyPackageView(state.myPackageViewState)
        @modalPanel = atom.workspace.addModalPanel(item: @myPackageView.getElement(), visible: false)

        # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        @subscriptions = new CompositeDisposable

        # Register command that toggles this view
        @subscriptions.add atom.commands.add 'atom-workspace', 'my-package:toggle': => @toggle()

      deactivate: ->
        @modalPanel.destroy()
        @subscriptions.dispose()
        @myPackageView.destroy()

      serialize: ->
        myPackageViewState: @myPackageView.serialize()

      toggle: ->
        console.log 'MyPackage was toggled!'

        if @modalPanel.isVisible()
          @modalPanel.hide()
        else
          editor = atom.workspace.getActiveTextEditor()
          words = editor.getText().split(/\s+/).length
          @myPackageView.setCount(words)
          @modalPanel.show()
    ```

    * `activate` 函数是必须的
    * `deactivate` 和 `serialize` 属于可选函数，但会被 Atom 调用
    * `toggle` 函数由操作引起的
    * `activate` 命令会做一系列事情。其中一点要注意的是，当 Atom 启动的时候，它不会被自动调用，仅当定义在 `package.json` 文件中的 `activationCommands` 所定义的命令被调用时，它才会被第一次调用。如果没人通过菜单项或快捷键促发，代码将永远不会被调用
