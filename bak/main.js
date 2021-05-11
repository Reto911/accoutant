let axios = require('axios');

axios.get('http://localhost:3000/users/name')
    .then(res => {
        console.log(res.data);
    }).catch(err => console.log(err))