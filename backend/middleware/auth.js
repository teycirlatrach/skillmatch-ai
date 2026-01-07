import { verifyAccess } from "../utils/tokens.js";

export function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Not authorized: missing token"));
  }
  const token = header.split(" ")[1];
  try {
    req.user = verifyAccess(token); // { sub, role }
    next();
  } catch {
    res.status(401);
    next(new Error("Not authorized: invalid/expired token"));
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    res.status(403);
    return next(new Error("Forbidden: admin only"));
  }
  next();
}
