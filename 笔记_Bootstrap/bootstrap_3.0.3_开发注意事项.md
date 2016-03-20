# Bootstrap 3.0.3 开发注意事项

## [基本框架](http://v3.bootcss.com/getting-started/#template)

	<!DOCTYPE html>
	<html>
		<head>
			<title>Bootstrap 101 Template</title>
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<!-- Bootstrap -->
			<link rel="stylesheet" href="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/css/bootstrap.min.css">

			<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
			<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
			<!--[if lt IE 9]>
				<script src="http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.min.js"></script>
				<script src="http://cdn.bootcss.com/respond.js/1.3.0/respond.min.js"></script>
			<![endif]-->
		</head>
		<body>
			<h1>Hello, world!</h1>

			<!-- jQuery (使用Bootstrap's的js插件时必须加载，v3必须依赖版本为1.9或以上) -->
			<script src="http://cdn.bootcss.com/jquery/1.10.2/jquery.min.js"></script>
    		
			<!-- Include all compiled plugins (below), or include individual files as needed -->
			<script src="http://cdn.bootcss.com/twitter-bootstrap/3.0.3/js/bootstrap.min.js"></script>
		</body>
	</html>


***


## [主导航栏](http://v3.bootcss.com/examples/starter-template/)

带栏目：

	<div class="navbar navbar-inverse navbar-fixed-top">
    	<div class="container">    	
    		<div class="navbar-header">
    			<button class="navbar-toggle" type="button" data-toggle="collapse" data-target=".navbar-collapse">
    				<span class="sr-only">Toggle navigation（为了标示元素，不显示）</span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    				<span class="icon-bar"></span>
    			</button>
    			<a href="#" class="navbar-brand">Logo位置</a>
    		</div>
    		<div class="collapse navbar-collapse">
    			<ul class="nav navbar-nav">
    				<li class="active"><a href="#">首页</a></li>
    				<li><a href="#about">关于</a></li>
    				<li><a href="#contact">联系我们</a></li>
    			</ul>
    		</div>
    	</div>
    </div>

带登录框：

	<div class="navbar navbar-inverse navbar-fixed-top">
    	<div class="container">
        	<div class="navbar-header">
        		<!-- 同上同一区域 -->
        		...
        	</div>
        	<div class="navbar-collapse collapse">
        		<form class="navbar-form navbar-right" role="form">
            		<div class="form-group">
            			<input type="text" placeholder="Email" class="form-control">
            		</div>
            		<div class="form-group">
            			<input type="password" placeholder="Password" class="form-control">
            		</div>
            		<button type="submit" class="btn btn-success">Sign in</button>
        		</form>
        	</div>
    	</div>
    </div>

    
> ### 要点说明：

> * 头部/底部主导航栏中的相关元素基本以`navbar`开头

> * `.navbar-toggle`为小屏时出现的**更多**按钮（必须设置好`data-toggle`和`data-target`的值，前者设置类型，后者设置作用对象），点击后展开所有导航栏目

> * 上面两例可组合在一起，成为具有栏目与登录框的主导航栏


***


## [栅格系统](http://v3.bootcss.com/examples/grid/)

基本类型：

	<div class="container">
		<div class="row">
    		<div class="col-md-4">.col-md-4</div>
        	<div class="col-md-4">.col-md-4</div>
        	<div class="col-md-4">.col-md-4</div>
    	</div>
    </div>
    
嵌套类型：

	<div class="container">
		<div class="row">
        	<div class="col-md-8">
        		.col-md-8
        		<div class="row">
          			<div class="col-md-6">.col-md-6</div>
          			<div class="col-md-6">.col-md-6</div>
        		</div>
        	</div>
        	<div class="col-md-4">.col-md-4</div>
    	</div>
    </div>
    
组合类型：

	<div class="container">
		<div class="row">
        	<div class="col-xs-12 col-md-8">.col-xs-12 .col-md-8</div>
        	<div class="col-xs-6 col-md-4">.col-xs-6 .col-md-4</div>
    	</div>
    </div>
    
> ### 要点说明：

> * v3版本的栅格系统确定了四种屏幕宽度范围（v2版本只有一种，即v3版本中的md）

<table class="table table-bordered table-striped">
	<thead>
		<tr>
			<th>
				&nbsp;
			</th>
			<th>
				超小屏幕设备<br />
				<small>手机 (&lt;768px)</small>
			</th>
			<th>
				小屏幕设备<br />
				<small>平板 (≥768px)</small>
			</th>
			<th>
				中等屏幕设备<br />
				<small>桌面 (≥992px)</small>
			</th>
			<th>
				大屏幕设备<br />
				<small>桌面 (≥1200px)</small>
			</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th>栅格系统行为</th>
			<td>总是水平排列</td>
			<td colspan="3">开始是堆叠在一起的（每一个元素独立一行），超过这些阈值将变为水平排列</td>
		</tr>
		<tr>
			<th><code>.container</code>宽度</th>
			<td>None (自动)</td>
			<td>750px</td>
			<td>970px</td>
			<td>1170px</td>
		</tr>
		<tr>
			<th>class前缀</th>
			<td><code>.col-xs-</code></td>
			<td><code>.col-sm-</code></td>
			<td><code>.col-md-</code></td>
			<td><code>.col-lg-</code></td>
		</tr>
		<tr>
			<th>列数</th>
			<td colspan="4">12</td>
		</tr>
		<tr>
			<th>最大列宽</th>
			<td class="text-muted">自动</td>
			<td>60px</td>
			<td>78px</td>
			<td>95px</td>
		</tr>
		<tr>
			<th>槽宽</th>
			<td colspan="4">30px (每列左右padding各有15px)</td>
		</tr>
		<tr>
			<th>可嵌套</th>
			<td colspan="4">Yes</td>
		</tr>
		<tr>
			<th>偏移（Offsets）</th>
			<td colspan="4">Yes</td>
		</tr>
		<tr>
			<th>列排序</th>
			<td colspan="4">Yes</td>
		</tr>
	</tbody>
</table>

> * 在**组合类型**中，优先级从大（lg）到小（xs），当屏幕宽度小于大级时，则按最近小级的显示效果显示，例如`<div class="col-xs-4 col-md-8">.col-xs-4 .col-md-8</div>`，当显示宽度小于992时，div从**8栏**宽度变为**4栏**宽度

> * `.container`为固定宽度，`.container-fluid`为100%宽度


***


## [表单](http://v3.bootcss.com/css/#forms)

普通表单（所有元素各为一行）：
	
	<form role="form">
		<div class="form-group">
    		<label for="exampleInputEmail1">Email address</label>
    		<input class="form-control" type="email" id="exampleInputEmail1" placeholder="Enter email">
		</div>
		<div class="form-group">
			<label for="exampleInputPassword1">Password</label>
			<input class="form-control" type="password" id="exampleInputPassword1" placeholder="Password">
		</div>
		<div class="form-group">
			<label for="exampleInputFile">File input</label>
			<input type="file" id="exampleInputFile">
			<p class="help-block">Example block-level help text here.</p>
		</div>
		<div class="checkbox">
			<label>
				<input type="checkbox"> Check me out
			</label>
		</div>
		<button type="submit" class="btn btn-default">Submit</button>
	</form>


内联表单（全部排成一列）：

	<form class="form-inline" role="form">
		<div class="form-group">
			<label class="sr-only" for="exampleInputEmail2">Email address</label>
			<input type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
		</div>
		<div class="form-group">
			<label class="sr-only" for="exampleInputPassword2">Password</label>
			<input type="password" class="form-control" id="exampleInputPassword2" placeholder="Password">
		</div>
		<div class="checkbox">
			<label>
				<input type="checkbox"> Remember me
			</label>
		</div>
		<button type="submit" class="btn btn-default">Sign in</button>
	</form>

水平排列表单（分成多行，左标题，有表单元素）：

	<form class="form-horizontal" role="form">
		<div class="form-group">
			<label for="inputEmail3" class="col-sm-2 control-label">Email</label>
			<div class="col-sm-10">
				<input type="email" class="form-control" id="inputEmail3" placeholder="Email">
			</div>
		</div>
		<div class="form-group">
			<label for="inputPassword3" class="col-sm-2 control-label">Password</label>
			<div class="col-sm-10">
				<input type="password" class="form-control" id="inputPassword3" placeholder="Password">
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<div class="checkbox">
					<label>
						<input type="checkbox"> Remember me
					</label>
				</div>
			</div>
		</div>
		<div class="form-group">
			<div class="col-sm-offset-2 col-sm-10">
				<button type="submit" class="btn btn-default">Sign in</button>
			</div>
		</div>
	</form>
	
> ### 要点说明：

> * 文本框（`input`和`textarea`）默认宽度为100%，可通过设置包含ta的元素的宽度来规定其大小；其右边必须有相应的`label`元素存在

> * `.sr-only`用于隐藏和标示`label`，标示相应表单元素的作用

> * 【普通型结构】form > div.form-group > label + input.form-cotrol

> * 【内联型结构】form.form-inline > div.form-group > label.sr-only + input.form-control

> * 【水平型结构】form.form-horizontal > div.form-group > label.control-label.col-sm-2 + div.col-sm-10 > input.form-control 









