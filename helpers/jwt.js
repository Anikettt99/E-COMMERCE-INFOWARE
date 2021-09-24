const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

function authJwt(){
    const secret = process.env.SECRET_JWT;
    return expressJwt(
        {
            secret,
            algorithms: ['HS256'],
            isRevoked: isRevoked
        }
    ).unless({
        path: [
            '/owner/add-account',
            '/owner/login',
            '/product/get-products',
            '/user/signUp',
            '/user/logIn'
        ]
    });
}

async function isRevoked(req , payload , done)
{
    const authHeader = req.get('Authorization');
    const secret = process.env.SECRET_JWT;
    if(!authHeader)
    {
        const error = new Error('Not authenticated');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];
    let decodedToken = jwt.verify(token , secret);
    req.userId = decodedToken.userId;
    req.isOwner = decodedToken.isOwner;
    done();
}

module.exports = authJwt;