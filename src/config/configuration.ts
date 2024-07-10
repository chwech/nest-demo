export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE || 'test',
    },
  },
  qiniu: {
    ak: process.env.QINIU_ACCESSKEY,
    sk: process.env.QINIU_SECRETKEY,
  },
  aes: {
    password: process.env.AES_PASSWORD,
    salt: process.env.AES_SALT,
  },
  wechat: {
    appid: process.env.WECHAT_APPID,
    appsecret: process.env.WECHAT_APPSECRET,
  },
});
