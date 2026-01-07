import bcrypt from "bcryptjs";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../utils/tokens.js";

function safeUser(u) {
  return { id: u._id, email: u.email, role: u.role };
}

export async function register(req, res, next) {
  try {
    const { email, password, fullName } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      return next(new Error("Email already used"));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, role: "STUDENT" });

    await StudentProfile.create({ userId: user._id, fullName });

    const access = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh = signRefreshToken({ sub: user._id.toString(), role: user.role });

    user.refreshTokenHash = await bcrypt.hash(refresh, 12);
    await user.save();

    res.json({ user: safeUser(user), accessToken: access, refreshToken: refresh });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }

    const access = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refresh = signRefreshToken({ sub: user._id.toString(), role: user.role });

    user.refreshTokenHash = await bcrypt.hash(refresh, 12);
    await user.save();

    res.json({ user: safeUser(user), accessToken: access, refreshToken: refresh });
  } catch (e) {
    next(e);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400);
      return next(new Error("Missing refreshToken"));
    }

    const payload = verifyRefresh(refreshToken); // { sub, role, iat, exp }
    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      res.status(401);
      return next(new Error("Invalid refresh token"));
    }

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) {
      res.status(401);
      return next(new Error("Invalid refresh token"));
    }

    const newAccess = signAccessToken({ sub: user._id.toString(), role: user.role });
    res.json({ accessToken: newAccess });
  } catch (e) {
    res.status(401);
    next(new Error("Refresh token expired or invalid"));
  }
}

export async function logout(req, res, next) {
  try {
    const { userId } = req.body; // simple
    if (userId) {
      await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
