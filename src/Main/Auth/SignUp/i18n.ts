import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  email: "Email",
  password: "Password",
  confirmPassword: "Confirm Password",
  submit: "Sign Up",
} satisfies iDictionaryBaseStructure;

const fa = {
  email: "ایمیل",
  password: "رمز عبور",
  confirmPassword: "تأیید رمز عبور",
  submit: "ثبت نام",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fa });
