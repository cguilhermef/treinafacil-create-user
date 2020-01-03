require('dotenv').config();
const Axios = require('axios');

const getUserFromArgs = function(callback) {
    try {
        const name = process.argv[2];
        const email = process.argv[3];
        const password = process.argv[4];
        callback(null, {name, email, password});
    } catch (e) {
        console.log(e);
        callback(true);
    }
}

const login = function(callback) {
    const loginUrl = process.env.API_LOGIN_URL;
    const loginUser = process.env.API_LOGIN_USER;
    const loginPassword = process.env.API_LOGIN_PASSWORD;
    const axios = Axios.create({
        headers: {'Content-Type': 'application/json'}
    });
    axios.post(loginUrl, {data: {email: loginUser, password: loginPassword}})
    .then(function(response) {
        callback(null, response.data.token);
    })
    .catch(function(error){
        callback(error);
    })
}

const createUser = function(callback) {
    getUserFromArgs(function(error, user) {
        if (error) {
            console.log('Parametros incorretos!');
            return;
        }

        login(function(errorLogin, token) {
            if (errorLogin || !token) {
                console.log('Erro ao fazer login');
                return;
            }

            const apiUrl = process.env.API_CREATE_URL;
            const axios = Axios.create({
                headers: {
                    'Authorization': `Bearer ${ token }`
                }
            });

            const company_id = Number(process.env.COMPANY_ID);
            const country_id = Number(process.env.COUNTRY_ID);
            const city_id = Number(process.env.CITY_ID);
            const language_id = Number(process.env.LANGUAGE_ID);
            const state_id = Number(process.env.STATE_ID);
            const user_type_name = process.env.USER_TYPE_NAME;

            axios.post(apiUrl, {
                data: {
                    ...user,
                    company_id,
                    country_id,
                    city_id,
                    language_id,
                    state_id,
                    user_type_name
                }
            })
            .then(function(response){
                callback(null, response.data.data);
            })
            .catch(function(error) {
                callback(error);
            });

        });
    });
}

createUser(function(error, user) {
    if(error) {
        console.log('Erro ao criar o usuário!');
        return;
    }
    console.log('Usuário criado com sucesso');
    console.log(user);
});

