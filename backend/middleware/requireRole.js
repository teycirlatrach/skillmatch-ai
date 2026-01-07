export function requireRole(role) {
  return (req, res, next) => {
    const r = req.user?.role;
    if (r !== role) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}
