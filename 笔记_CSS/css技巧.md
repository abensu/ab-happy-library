# CSS技巧


## 页脚置底（兼容低版本IE）

主要代码：

	#wrap {
    	min-height:100%;
    	margin-bottom:-60px;
    	padding-bottom:60px; /* 预防min-height不起作用时引起的错位现象 */
    }			
    #footer {
    	height:60px;
    }

事例代码：

	<!DOCTYPE html>
	<html lang="en">
  		<head>
    		...
    		<style>
    			#wrap {
    				min-height:100%;
    				margin-bottom:-60px;
    				padding-bottom:60px; /* 预防min-height不起作用时引起的错位现象 */
    			}
    			
    			#footer {
    				height:60px;
    			}
    		<style>
  		</head>

  		<body>
  		
    		<div id="wrap">
      			...
    		</div>

    		<div id="footer">
      			<div class="container">
        			<p class="text-muted">
        				Place sticky footer content here.
        			</p>
      			</div>
    		</div>
    		
		</body>
	</html>


## 元素垂直居中（兼容低版本IE）

主要代码：

	.wrap {
		#height: 300px;
		#position: relative;
	}
	.wrap .inner {
		#position: absolute;
		#top: 50%;
		#left: 0;
	}
	.wrap .cell {
		#position: relative;
		#top: -50%;
		#left: 0;
	}
	
	.wrap {
		height: 300px;
		display: table;
	}
	.wrap .inner {
		display: table-cell;
		vertical-align: middle;
	}

事例代码：

	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Document</title>
			<style>
				* {
					padding: 0;
					margin: 0;
				}
				.wrap {
					width: 300px;
					margin: 0 auto;
					background: #eee;
				}
			</style>
			<!--[if lte IE 7]>
			<style>
				.wrap {
					height: 300px;
					position: relative;
				}
				.wrap .inner {
					position: absolute;
					top: 50%;
					left: 0;
				}
				.wrap .cell {
					position: relative;
					top: -50%;
					left: 0;
				}
			</style>
			<![endif]-->
			<style>
				.wrap {
					height: 300px;
					display: table;
				}
				.wrap .inner {
					display: table-cell;
		 			vertical-align: middle;
				}
			</style>
		</head>

		<body>
			<div class="wrap">
				<div class="inner">
					<p class="cell">
						内容
					</p>
				</div>
			</div>
		</body>
	</html>


## 清除浮动

主要代码：

	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: " ";
		clear: both;
		height: 0;
	}
	.clearfix {
		*zoom:1;
	}
	
	
事例代码：

	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>Document</title>
			<style type="text/css">
				.clearfix:after {
					visibility: hidden;
					display: block;
					font-size: 0;
					content: " ";
					clear: both;
					height: 0;
				}

				.clearfix {
					*zoom: 1;
				}

				.wrap {
					background: #ccc;
				}

				.fl {
					width: 120px;
					height: 120px;
					background: #c00;
					float: left;
				}
				
				.fr {
					width: 300px;
					height: 300px;
					background: #0c0;
					float: right;
				}
			</style>
		</head>
		<body>
			<div class="wrap clearfix">
				<div class="fl">左边</div>
				<div class="fr">右边</div>
			</div>
		</body>
	</html>