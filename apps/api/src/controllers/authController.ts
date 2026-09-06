import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User.js';
import { signToken } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required' },
    });
    return;
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.isActive) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email address or inactive account' },
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials provided' },
    });
    return;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    department: user.department,
    designation: user.designation,
  });

  await AuditService.logAction(
    { email: user.email, name: user.name, role: user.role },
    'LOGIN',
    'User',
    `User logged in with role ${user.role}`,
    { resourceId: user._id.toString(), ipAddress: req.ip }
  );

  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        designation: user.designation,
      },
    },
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
    return;
  }

  try {
    let user = null;
    if (req.user.userId && mongoose.isValidObjectId(req.user.userId)) {
      user = await User.findById(req.user.userId).select('-passwordHash');
    }
    if (!user && req.user.email) {
      user = await User.findOne({ email: req.user.email }).select('-passwordHash');
    }
    if (!user) {
      res.status(401).json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User session expired or record not found' } });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          designation: user.designation,
        },
      },
    });
  } catch (err) {
    res.status(401).json({ success: false, error: { code: 'AUTH_FAILED', message: 'Failed to verify user session' } });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  if (req.user) {
    await AuditService.logAction(req.user, 'LOGOUT', 'User', 'User logged out', {
      resourceId: req.user.userId,
    });
  }
  res.json({ success: true, message: 'Logged out successfully' });
}
