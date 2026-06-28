import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { verifyPassword, generateToken } from '../utils/auth';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email dan password wajib diisi.'
    });
    return;
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      res.status(401).json({
        success: false,
        message: 'Email atau password salah.'
      });
      return;
    }

    const token = generateToken(Number(user.id), user.email);

    res.json({
      success: true,
      message: 'Login Berhasil',
      access_token: token,
      token_type: 'Bearer',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  // With JWT, logout is usually handled on the client side by removing the token.
  res.json({
    success: true,
    message: 'Berhasil keluar (Logout)'
  });
};
