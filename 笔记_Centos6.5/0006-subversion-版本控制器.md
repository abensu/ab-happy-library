# subversion 安装、配置

## 前言

`subversion` 包含 `svnserve`（svn 服务器）和 `svn`（svn 客户端）

## 使用 `yum` 安装

检查是否已安装：
```
rpm -qa subversion
```

卸载旧版本：
```
yum remove subversion
```

安装：
```
yum install subversion
```

检查是否安装成功：
```
[xxoo ~]# svnserve --version

svnserve, version 1.6.11 (r934486)
   compiled Aug 17 2015, 08:37:43
Copyright (C) 2000-2009 CollabNet.
Subversion is open source software, see http://subversion.tigris.org/
This product includes software developed by CollabNet (http://www.Collab.Net/).
The following repository back-end (FS) modules are available:
* fs_base : Module for working with a Berkeley DB repository.
* fs_fs : Module for working with a plain file (FSFS) repository.
Cyrus SASL authentication is available.
```

## 创建 svn 仓库

创建仓库目录：
```
mkdir /home/my-svn
```

创建 svn 项目：
```
svnadmin create /home/my-svn
```

检查是否创建成功：
```
[xxoo ~]# ls /home/my-svn

conf db format hooks locks README.txt
```

## 配置用户权限、用户密码和访问权限

用户权限（编辑 `/home/my-svn/authz` 文件）：
```
[groups]
manager = user1, user2
other = user3, user4

[/]
@manager = rw
@other = r
```

用户密码（编辑 `/home/my-svn/passwd` 文件）：
```
[users]
user1 = user1password
user2 = user2password
user3 = user3password
user4 = user4password
```

访问权限（编辑 `/home/my-svn/svnserve.conf` 文件）：
```
#匿名访问者权限
anon-access = none
#验证用户权限
auth-access = write
#密码文件地址
password-db = /home/my-svn/passwd
#权限文件地址
authz-db = /home/my-svn/authz
#项目名称（UUID）
realm = my_project
```

## 开通防火墙，启动 svn 服务器

启动 svn 服务器：
```
svnserve -d -r /home/my-svn
```
> `-d`：守护进程方式启动
>
> `-r`：svn 根目录指向
>
> `--listen-port`：服务启动的端口，默认是 `3690`

开通防火墙：
```
# 修改
iptables -I INPUT -p tcp --dport 3690 -j ACCEPT
# 保存
/etc/rc.d/init.d/iptables save
# 重启
service iptables restart
# 查看
/etc/init.d/iptables status
```

## 拉项目数据

如果是本地的话，拉取如下：
```
mkdir /home/my-project
svn checkout svn://127.0.0.1 /home/my-project
# 后面按提示输入用户信息及其密码，成功后即可 checkout 成功
```

如果是非本地（windows 用户），需要安装 [TortoiseSVN](https://tortoisesvn.net/) 作为客户端，在目标目录右键点击 `SVN Checkout...` 并填入对应的 `svn://<server ip>` 即可。

> windows 用户，在 svn 登录时，如果勾选了保存验证信息，但填错信息的话，会导致之后无法再次登录，一直提示验证失败，需要到 `C:\Users\someuser\AppData\Roaming\Subversion\auth\svn.simple` 找到对应的缓存文件并删除，再进行登录操作。

## 重启 svn 服务器

通过 `service svnserve restart` 是不行的，需要如下操作：
```
killall svnserve && svnserve -d -r /home/my-project
```

## svn 的钩子

在 `/home/my-svn/hooks` 文件夹下有 `post-lock.tmpl`、`post-unlock.tmpl`、`pre-lock.tmpl`、`pre-unlock.tmpl`、`post-commit.tmpl`、`post-revprop-change.tmpl`、`pre-commit.tmpl`、`pre-revprop-change.tmpl`、`start-commit.tmpl`，这些都是 svn 每个数据处理阶段的钩子脚本模板（要去掉 `.tmpl` 后缀，并变为可执行文件才可使用）。

* `pre-lock`、`post-lock`：加锁前、加锁后

* `pre-unlock`、`post-unlock`：解锁前、解锁后

* `pre-revprop-change`、`post-revprop-change`：恢复某版本之前、恢复某版本之后

* `pre-commit`、`start-commit`、`post-commit`：数据提交前、数据开始提交、数据提交完毕

例如，我们想在数据顺利提交到 svn 服务端后，`update` 服务器的 svn 客户端数据。

1. 先新建 `post-commit` 文件，并编辑以下内容：

    ```
    cd /home/my-project && svn update
    ```

1. 保存好文件后，对文件执行 `chmod a+x post-commit`，然后就能正常被调用了。

## 其他小技巧

* 完整删除文件夹：`rm -r -f /home/my-project`

## 来源

* [Linux(centOS6.5)下SVN的安装、配置及开机启动](http://www.blogjava.net/rockblue1988/archive/2014/11/19/420246.aspx)

* [CentOS 6.5安装SVN 客户端TortoiseSVN](http://www.linuxidc.com/Linux/2015-01/111748.htm)

* [SVN服务器启动、重启、停止等操作脚本](http://blog.csdn.net/long7181226/article/details/22316795)

* [ SVN清除本地已有的用户名和密码](http://blog.csdn.net/jubincn/article/details/7636786)

* [rm和rmdir 删除目录](http://blog.csdn.net/zzwdkxx/article/details/7948531)