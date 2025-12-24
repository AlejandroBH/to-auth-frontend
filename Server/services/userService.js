import { users } from "../data/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Registro de usuario
export const registerUser = async (userData) => {
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error("El email ya está en uso");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = { id: Date.now(), ...userData, password: hashedPassword };
  users.push(newUser);
  return newUser;
};

// Login de usuario
export const loginUser = async (email, password) => {
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  // Retornar usuario sin la contraseña y el token
  const { password: _, ...userWithoutPassword } = user;
  return {
    message: "Login exitoso",
    user: userWithoutPassword,
    token,
  };
};
