import jwt from 'jsonwebtoken';
import Admin from "../models/admin.js"
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
       try {
            token = req.headers.authorization.split(' ')[1];
            
            // 👇 LOG 1: Check if Secret works
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Decoded ID from Token:", decoded.id); 

            // 👇 LOG 2: Check what DB returns
            const admin = await Admin.findById(decoded.id).select('-password');
            console.log("🔍 Database Search Result:", admin); 

            req.admin = admin;

            if (!req.admin) {
                // 👇 This tells us if the ID format is wrong or user is missing
                console.log("❌ Admin not found in DB!"); 
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            next();
        } catch (error) {
            // 👇 This tells us if it's a Secret mismatch or Connectivity error
            console.error("❌ Middleware Error:", error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, isAdmin };



