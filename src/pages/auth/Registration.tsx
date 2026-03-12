import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { InputGroupAddon, InputGroupButton } from "@/shared/components/ui/input-group";
import { Toaster } from "@/shared/components/ui/sonner";

import { FormInput } from "@/shared/components/controllable/input/input";

import { Logo } from "@/shared/images/svg/Logo";

import { EyeIcon, EyeOffIcon } from "lucide-react";

type RegistrationForm = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Registration = () => {
  const location = useLocation();
  const role = (location.state as { role?: string })?.role;

  const form = useForm<RegistrationForm>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { control, watch } = form;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const password = watch("password");

  const handleSubmit = (values: RegistrationForm) => {
    if (values.password !== values.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Registration values:", values);
    console.log("Selected role:", role);
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
                <h1 className="text-xl font-semibold">Create Account</h1>
                {role && <p className="text-sm text-muted-foreground">Role: <strong>{role}</strong></p>}
              </div>

              <div className="flex flex-col gap-4">
                <FormInput control={control} name="username" label="Username" placeholder="Enter username" />
                <FormInput control={control} name="email" label="Email" placeholder="Enter email" />

                <FormInput
                  control={control}
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  label="Password"
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

                <FormInput
                  control={control}
                  type={isConfirmVisible ? "text" : "password"}
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="****"
                  addon={
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-xs"
                        variant="secondary"
                        onClick={() => setIsConfirmVisible((prev) => !prev)}
                      >
                        {isConfirmVisible ? <EyeOffIcon /> : <EyeIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  }
                />

                <Button type="submit" className="w-full">
                  Create account
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default Registration;