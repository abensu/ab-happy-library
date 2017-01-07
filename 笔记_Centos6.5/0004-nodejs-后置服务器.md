# nodejs 安装、配置

## 使用 `yum` 安装

不建议源码安装，失败率有点高。。。

### 1. 先安装编译所需的库

```
yum -y install gcc make gcc-c++ openssl-devel wget
```

### 2. 获取 nodejs 资源

```
# 6.x
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -

# 5.x
curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -

# 4.x
curl --silent --location https://rpm.nodesource.com/setup_4.x | bash -

# 0.10
curl --silent --location https://rpm.nodesource.com/setup | bash -
```

> 上面选其中一个命令执行，建议选择长期稳定版（复数版本号）

### 3. 安装 `nodejs`

```
yum install -y nodejs
```


## 来源

* [CentOS 7 通过 yum 安装 nodejs 和 npm](http://jingyan.baidu.com/article/dca1fa6f48f478f1a5405272.html)

* [用yum在centos上安装node.js](http://www.jianshu.com/p/783906f10d58)
