
const Sequelize = require('sequelize');
const Mock = require('mockjs');
const $s = new Sequelize('test', 'root', '111Asd', {
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql',
    pool: {
        max: 30,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

$s.authenticate()
    .then(() => {
        console.log('connect successfully');
    })
    .catch(err => {
        console.error(err);
    });


const User = $s.define('user', {
    name: {
        type: Sequelize.STRING,
    },
    age: {
        type: Sequelize.INTEGER,
    },
});

const Movie = $s.define('movie', {
    title: {
        type: Sequelize.STRING,
    },
    level: {
        type: Sequelize.INTEGER,
    },
    image: {
        type: Sequelize.STRING,
    },
    isPublic: {
        type: Sequelize.BOOLEAN,
    },
    openDate: {
        type: Sequelize.DATE,
    },
    closeDate: {
        type: Sequelize.DATE,
    },
});

async function mockUser() {
    await User.sync({ force: true });
    var data = Mock.mock({
        'users|50': [
            {
                name: '@FIRST',
                age: /\d{1,2}/,
            },
        ],
    });
    data.users.map(v => {
        // 添加
        User.create(v);
    });
}

async function mockMovie() {
    await Movie.sync({ force: true });
    var data = Mock.mock({
        'movies|50': [
            {
                title: '@string(6)',
                'level|0-5': 1,
                image: Mock.Random.image('200x100'),
                'isPublic|1-2': false,
                openDate: '@datetime',
                closeDate: '@datetime',
            },
        ],
    });
    data.movies.forEach(v => {
        Movie.create(v);
    });
}
mockMovie();
mockUser();


// 查询
// User.findOne({ where: { age: { [$s.Op.between]: [50, 80] } } }).then(v => {
//   console.log(v);
//   // 删除
//   // v.destroy();
//   // 更新
//   // v.name = 'testUpdate';
//   // v.save();
// });
