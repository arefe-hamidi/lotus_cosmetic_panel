import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  username: "Username",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  password: "Password",
  confirmPassword: "Confirm Password",
  submit: "Sign Up",
  loading: "Signing up...",
  success: "Account created successfully!",
  error: "An error occurred. Please try again.",
  passwordsMismatch: "Passwords do not match",
} satisfies iDictionaryBaseStructure;

const fa = {
  username: "نام کاربری",
  email: "ایمیل",
  firstName: "نام",
  lastName: "نام خانوادگی",
  password: "رمز عبور",
  confirmPassword: "تأیید رمز عبور",
  submit: "ثبت نام",
  loading: "در حال ثبت نام...",
  success: "حساب کاربری با موفقیت ایجاد شد!",
  error: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
  passwordsMismatch: "رمزهای عبور مطابقت ندارند",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
