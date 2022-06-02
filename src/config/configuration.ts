export default () => ({
  db: {
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'test',
    },
  },
});
