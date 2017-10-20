# TensorFlow

## 简介

TensorFlow 是应用于深度学习（Deep Learning）的框架，底层为 C++，主要支持 Python，通过 gRPC 和 HTTP 协议，也可支持其他语言。

## 安装

* [真正从零开始，TensorFlow详细安装入门图文教程！](https://www.leiphone.com/news/201606/ORlQ7uK3TIW8xVGF.html)

### Ubuntu 安装

1. 确保安装 pip（`sudo apt-get python-pip`）

1. 进入 [TensorFlow 的 GitHub 官网](https://github.com/tensorflow/tensorflow/)，在 “Installation” 栏目下的 “Individual whl files” 下载对应平台和 python 版本的 `whl` 文件

1. 进入到下载 `whl` 文件的目录，执行 `sudo pip install --upgrade xxoo.whl`（`xxoo.whl` 为对应的 TensorFlow 下载的文件名）