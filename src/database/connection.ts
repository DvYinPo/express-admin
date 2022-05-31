const { createConnection, Connection } = require("typeorm");

module.exports = async() => {
    try {
        await createConnection({
            type: "postgres",
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB
        })
        console.log('=> 数据库连接成功');
    } catch (error) {
        console.log('=> 数据库连接失败', error);
        return error
    }
}