# Component使用总结

## 资源

1. <http://emberjs.cn/guides/components/>

## `Ember.Component`与`Ember.View`的关系

`Ember.Component`是`Ember.View`的子类，既有view的相关属性（property）与事件（event），自身也有独特的性质，可以理解为**具有独立特性的View，作为组件/插件使用**


## {{yield}}：使模板成为模板的模板

`{{yield}}`有两个作用：

1. 使引用components模板的那部分内容，成为components模板内部的模板（部分）
2. 使数据模型的节点直接成为`{{yield}}`中的变量名，而不用在引用模板的那部分进行设置，如`{{#blog-post}}`中的`myTit`


具体请看以下部分，准备脚本：

	<script>
		App = Ember.Application.create();

		posts = [
			{
				title	: "Rails is omakase",
				body	: "There are lots of à la carte software environments in this world.",
				author	: "hello"
			},{
				title	: "Broken Promises",
				body	: "James Coglan wrote a lengthy article about Promises in node.js.",
				author	: "world"
			}
		];
		
		App.IndexRoute = Ember.Route.extend({
			model: function() {
				return posts; 
			}
		});
	</script>


components的{{yield}}模板

    <script type="text/x-handlebars" data-template-name="index">
		{{#each}}
			{{#blog-post myTit=title}}
				<span class="author">by {{author}}</span>
				<p class="body">{{body}}</p>
			{{/blog-post}}
		{{/each}}
	</script>
    
    <script type="text/x-handlebars" data-template-name="components/blog-post">
		<h1>{{myTit}}</h1>
		<p>{{yield}}</p>
	</script>

其实等价于

    <script type="text/x-handlebars" data-template-name="index">
		{{#each}}
			{{blog-post myTit=title body=body author=author}}
		{{/each}}
	</script>
    
    <script type="text/x-handlebars" data-template-name="components/blog-post">
		<h1>{{myTit}}</h1>
		<p>
			<span class="author">by {{author}}</span>
			<p class="body">{{body}}</p>
		</p>
	</script>

