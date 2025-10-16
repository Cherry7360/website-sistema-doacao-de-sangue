import nodemailer from "nodemailer";
import  dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Sistema de Doação de Sangue" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    console.log("Email enviado com sucesso!");
  } catch (error) {
    console.error(" Erro ao enviar email:", error.message);
    throw error;
  }
};
