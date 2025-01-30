import jwt from "jsonwebtoken";
import { getCustomerById } from "./database.js";
import "dotenv/config";

const secretKey = process.env.JWT_SECRET_KEY;

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      console.log("Decoded Token:", decoded);
      req.user = await getCustomerById(decoded.id);
      console.log("User from DB:", req.user);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Only admins have access on this endpoint." });
    }
  };
  