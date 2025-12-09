import jsonwebtoken from 'jsonwebtoken';

const generateToken = (userId) => {
    const token = jsonwebtoken.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
    return token;
}

export default generateToken;
