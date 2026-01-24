import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  identifier: "Email or Username",
  password: "Password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  submit: "Login",
  loading: "Logging in...",
  error: "Invalid email/username or password.",
} satisfies iDictionaryBaseStructure;

const fa = {
  identifier: "ایمیل یا نام کاربری",
  password: "رمز عبور",
  rememberMe: "مرا به خاطر بسپار",
  forgotPassword: "رمز عبور را فراموش کرده‌اید؟",
  submit: "ورود",
  loading: "در حال ورود...",
  error: "ایمیل/نام کاربری یا رمز عبور اشتباه است.",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
