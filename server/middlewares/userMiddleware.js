import jwt from "jsonwebtoken"

const protect = (req, res, next) => 
{
    const token = req.headers.authorization? req.headers.authorization.split(' ')[1]: null;

    if(!token)
    {
        return res.status(401).json({message: 'Not authorized, Get out you stupid hacker!'});
    }
    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }
    catch(error)
    {
        return res.status(401).json({message: 'Not authorized, Invalid token!'});
    }

}


export default protect;