import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export const usePhoneAuth = () => {
  const [loading, setLoading] = useState(false);

  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    try {
      await authClient.phoneNumber.sendVerificationOTP({
        phoneNumber,
        type: "sign-up"
      });
      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    setLoading(true);
    try {
      const result = await authClient.phoneNumber.verifyOTP({
        phoneNumber,
        otp
      });

      if (result.data) {
        return { success: true, user: result.data.user };
      } else {
        return { success: false, error: 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Invalid OTP' };
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber, otp) => {
    setLoading(true);
    try {
      const result = await authClient.phoneNumber.signIn({
        phoneNumber,
        otp
      });

      if (result.data) {
        return { success: true, user: result.data.user };
      } else {
        return { success: false, error: 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Sign in failed' };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
    signInWithPhone,
    loading
  };
};