module.exports = {
    runtimeCompiler:true,
    lintOnSave: true,
    configureWebpack: {
    },
    devServer: {
        disableHostCheck: true,
	watchOptions: {
	    poll: true
	},
	host: '195.54.198.35',
	port: 8082,
	hot: true
    }
};
