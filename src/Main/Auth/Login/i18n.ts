import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  email: "Email",
  password: "Password",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  submit: "Login",
} satisfies iDictionaryBaseStructure;

const fa = {
  email: "ایمیل",
  password: "رمز عبور",
  rememberMe: "مرا به خاطر بسپار",
  forgotPassword: "رمز عبور را فراموش کرده‌اید؟",
  submit: "ورود",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
