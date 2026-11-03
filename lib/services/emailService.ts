import { Resend } from 'resend';
import { render } from '@react-email/components';
import WelcomeEmail from '../emails/WelcomeEmail';
import ResetPasswordEmail from '../emails/ResetPasswordEmail';
import React from 'react';

// El cliente de Resend solo se crea cuando se va a enviar un email de verdad.
// Así el build en Vercel no explota si RESEND_API_KEY no está configurada.
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no configurada: no se pueden enviar emails.');
  }
  return new Resend(apiKey);
}

const FROM_EMAIL = 'Goalkeeper Training <noreply@igeco.mx>'; // Cambiar a tu dominio verificado

export async function sendWelcomeEmail(
  to: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/es/verify-email?token=${verificationToken}`;

  try {
    const emailHtml = await render(
      React.createElement(WelcomeEmail, { name, email: to, verificationUrl })
    );

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Bienvenido a Goalkeeper Training - Verifica tu cuenta',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/es/reset-password?token=${resetToken}`;

  try {
    const emailHtml = await render(
      React.createElement(ResetPasswordEmail, { name, resetUrl })
    );

    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Restablece tu contraseña - Goalkeeper Training',
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
}
