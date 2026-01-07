import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "No token" });

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // ex: { sub: userId, role: "ADMIN" }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}
