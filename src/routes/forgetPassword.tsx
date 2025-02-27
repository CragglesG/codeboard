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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  email: z.string().email({ message: "Invalid email address" }),
});

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgetPassword = async () => {
    const { data, error } = await authClient.forgetPassword({
      email: email as string,
      redirectTo: "/resetpassword",
    });
    if (error) {
      setContent(
        <div>
          There was an error sending the reset password email. Please try again,
          and if the issue persists, please contact support.
        </div>
      );
    } else {
      setContent(<div>Reset password email sent</div>);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setEmail(values.email);
    forgetPassword();
  }

  const [content, setContent] = useState(
    <Form {...form}>
      <RouterForm
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          className="grid gap-2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </RouterForm>
    </Form>
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forget Password</CardTitle>
          <CardDescription className="text-sm">
            Enter your email address to receive a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">{content}</CardContent>
      </Card>
    </div>
  );
}
