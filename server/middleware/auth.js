import jwt from "jsonwebtoken";
import {} from "dotenv/config";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Not authorized to access this route" });
  }
};

export default auth;
