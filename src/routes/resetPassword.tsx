import { Form as RouterForm, useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import { authClient } from "../lib/auth.client";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function meta() {
  return [
    { title: "Reset Password - Codeboard" },
    {
      name: "description",
      content: "Reset your account password.",
    },
  ];
}

const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(32, { message: "Password must be at most 32 characters long" }),
});

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const token = useSearchParams()[0].get("token");

  if (!token) {
    return (
      <div>
        Invalid token. If you got here through a link in an email, please
        contact support.
      </div>
    );
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const forgetPassword = async () => {
    await authClient.resetPassword({
      newPassword: password,
      token: token as string,
    });
    navigate("/signin");
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setPassword(values.password);
    forgetPassword();
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Form {...form}>
            <RouterForm
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="password"
                className="grid gap-2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </RouterForm>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
