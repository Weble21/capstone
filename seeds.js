const mongoose = require('mongoose');
const Product = require('./models/game');

mongoose.connect('mongodb://localhost:27017/games')
.then(()=> {
    console.log('MONGO CONNECTION OPEN!!!');
})
.catch(err => {
    console.log('Oh No,,, Error!!!');
    console.log(err);
})

const seedProducts = [
    {
        sport: 'soccer',
        area: '전주',
        time: new Date("2023-04-24 18:00"),
        contents: '전주 스포츠박스 덕진점',
        tier: 'pro',
        application: false
    },
    {
        sport: 'soccer',
        area: '익산',
        time: new Date("2023-04-30 09:30"),
        contents: '익산 시민의 숲 축구장',
        tier: 'elite',
        application: false
    },
    {
        sport: 'soccer',
        area: '서울',
        time: new Date("2023-05-01 20:00"),
        contents: '성북구 실외 풋살장',
        tier: 'amateur',
        application: false
    },
    {
        sport: 'soccer',
        area: '서울',
        time: new Date("2023-05-02 19:00"),
        contents: '성동 스포츠엑스 3번 경기장',
        tier: 'beginner',
        application: false
    },
    {
        sport: 'soccer',
        area: '전주',
        time: new Date("2023-04-26 18:30"),
        contents: '전주 스포츠박스 완산점',
        tier: 'elite',
        application: false
    },
    {
        sport: 'soccer',
        area: '군산',
        time: new Date("2023-04-30 19:30"),
        contents: '군산대학교 중앙 운동장',
        tier: 'pro',
        application: false
    },
    {
        sport: 'soccer',
        area: '서울',
        time: new Date("2023-04-25 18:00"),
        contents: '잠실 실외 축구장',
        tier: 'amateur',
        application: false
    },
    {
        sport: 'soccer',
        area: '서울',
        time: new Date("2023-05-01 20:00"),
        contents: '강북구청 1번 축구장',
        tier: 'beginner',
        application: false
    }  
]

Product.insertMany(seedProducts)
.then(res => {
    console.log(res)
})
.catch(e => {
    console.log(e)
})