import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  logo: "Lotus Cosmetic Panel",
  login: {
    title: "Login",
    description: "Enter your credentials to access your account",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submit: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
  },
  signUp: {
    title: "Sign Up",
    description: "Create a new account to get started",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    submit: "Sign Up",
    haveAccount: "Already have an account?",
    login: "Login",
  },
} satisfies iDictionaryBaseStructure;

const fa = {
  logo: "لوتوس کازمتیک پنل",
  login: {
    title: "ورود",
    description: "برای دسترسی به حساب کاربری خود، اطلاعات خود را وارد کنید",
    email: "ایمیل",
    password: "رمز عبور",
    rememberMe: "مرا به خاطر بسپار",
    forgotPassword: "رمز عبور را فراموش کرده‌اید؟",
    submit: "ورود",
    noAccount: "حساب کاربری ندارید؟",
    signUp: "ثبت نام",
  },
  signUp: {
    title: "ثبت نام",
    description: "برای شروع، یک حساب کاربری جدید ایجاد کنید",
    email: "ایمیل",
    password: "رمز عبور",
    confirmPassword: "تأیید رمز عبور",
    submit: "ثبت نام",
    haveAccount: "قبلاً حساب کاربری دارید؟",
    login: "ورود",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fa });
