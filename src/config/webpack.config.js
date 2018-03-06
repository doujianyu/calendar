const path = require('path')
//Node.js path 模块提供了一些用于处理文件路径的小工具，我们可以通过以下方式引入该模块：
//http://www.runoob.com/nodejs/nodejs-path-module.html
module.exports={
	entry:"./src/main.js",
	output:{
		path:__dirname,
		filename:"bundle.js"
	},
	module:{
		rules:[
			{
				test:/\.css$/,//是一个正则，代表css后缀的文件要使用下面的loader
				use:[
				{loader:"style-loader"},
				{
					loader:"css-loader",
					options:{
						module:true
					}
				}
				]

			},
			{
			test:path.join(__dirname,"es6"),//__dirname node全局变量 存储的是文件所在的文件目录
			//path.join()方法可以连接任意多个路径字符串。要连接的多个路径可做为参数传入。path.join()方法在接边路径的同时也会对路径进行规范化。例如：
			loader:"babel-loader",
			query:{
				presets:["es2015"]
			}
		},
		{
			test:/\.(png|jpg)$/,
			use:[
			{
			loader:'url-loader',
			options:{
				limit: 10000//代表小与1000k的图片编译成base64  

			}
		}
			]

		}
		]
	}
}