var env = process.NODE_ENV  || 'development'
console.log('env ******', env)

if (env == 'development') {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/db-name' 
} else {
	process.env.PORT = 3000;
	process.env.MONGODB_URI = 'mongodb://localhost:27017/db-name-test' 
}
