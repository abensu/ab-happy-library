# 简单操作说明

1. 安装：命令行运行 `npm i`

1. 编译：命令行运行 `npm run dev` 或者 `npm run build`

    * `node_modules/.bin/parcel src/*.html -d ./dist`：编译多个文件，并输出到 `dist` 文件夹中

    * `node_modules/.bin/parcel build src/*.html -d ./dist --no-source-maps --public-url ./dist/`：编译多个文件，不输出 `source-map` 文件，修改路径，并输出到 `dist` 文件夹中