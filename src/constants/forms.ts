export type AuthFormProps = {
  id: string;
  name: string;
  inputType: "checkbox" | "input";
  type?: HTMLInputElement["type"];
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder?: string;
  autoComplete?: HTMLInputElement["autocomplete"];
};

export const SIGN_IN_FORM: AuthFormProps[] = [
  {
    id: "code",
    name: "code",
    inputType: "input",
    type: "password" as HTMLInputElement["type"],
    placeholder: "auth.form.input_code",
    label: "",
    autoComplete: "new-password",
  },
  {
    id: "remember",
    name: "remember",
    inputType: "checkbox",
    label: "auth.form.remember_code",
    placeholder: "auth.form.remember_code",
  },
];

type FormConstantsProps = {
  signInForm: AuthFormProps[];
};

export const FORM_CONSTANTS: FormConstantsProps = {
  signInForm: SIGN_IN_FORM,
};
