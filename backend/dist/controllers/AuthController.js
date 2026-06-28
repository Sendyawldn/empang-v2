"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth_1 = require("../utils/auth");
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'Email dan password wajib diisi.'
        });
        return;
    }
    try {
        const user = await prisma_1.default.users.findUnique({
            where: { email }
        });
        if (!user || !(await (0, auth_1.verifyPassword)(password, user.password))) {
            res.status(401).json({
                success: false,
                message: 'Email atau password salah.'
            });
            return;
        }
        const token = (0, auth_1.generateToken)(Number(user.id), user.email);
        res.json({
            success: true,
            message: 'Login Berhasil',
            access_token: token,
            token_type: 'Bearer',
            user
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
const logout = async (req, res) => {
    // With JWT, logout is usually handled on the client side by removing the token.
    res.json({
        success: true,
        message: 'Berhasil keluar (Logout)'
    });
};
exports.logout = logout;
