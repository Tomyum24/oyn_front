import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Location, useLocation } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@/shared/components/ui/input-group";
import { Toaster } from "@/shared/components/ui/sonner";

import { FormInput } from "@/shared/components/controllable/input/input";

import { Logo } from "@/shared/images/svg/Logo";

import { useAuth } from "../../context/useAuth";

import { EyeIcon, EyeOffIcon } from "lucide-react";

type LoginForm = {
  username: string;
  password: string;
};

const Login = () => {
  const { login, isLoginLoading } = useAuth();
  const location = useLocation();

  const form = useForm<LoginForm>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { control } = form;

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleSubmit = (values: LoginForm) => {
    const { username, password } = values;

    const fromLocation = (location.state as { from?: Location })?.from;
    const from = fromLocation
      ? `${fromLocation.pathname}${fromLocation.search}${fromLocation.hash}`
      : "/";

    login(
      {
        variables: {
          input: { username, password },
        },
        context: {
          fetchOptions: {
            credentials: "include",
          },
        },
      },
      from,
    );
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex w-full flex-col gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                <Logo />
                <h1 className="text-xl font-semibold">OYN</h1>
              </div>
              <div className="flex flex-col gap-4">
                <FormInput
                  control={control}
                  name="username"
                  label="Логин"
                  placeholder="Введите логин"
                />
                <FormInput
                  control={control}
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  label="Пароль"
                  placeholder="****"
                  addon={
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        variant="secondary"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                      >
                        {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  }
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isLoginLoading}
                >
                  Войти
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Login;
