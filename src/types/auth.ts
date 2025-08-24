export type SignInFormProps = {
  isDarkMode?: boolean;
  onEmailChange?: (email: string) => void;
  onGoogleSignIn?: () => void;
  onDirectLogin?: (email: string, password: string) => void;
  onSendOtp?: (email: string) => void;
  onVerifyOtp?: (email: string, otp: string) => void;
  isLoading?: boolean;
  email?: string;
  otpSent?: boolean;
  onBackToEmail?: () => void;
}

export type AuthFormProps = {
  pathname: string;
  isDarkMode?: boolean;
}