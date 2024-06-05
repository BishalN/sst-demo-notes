import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Auth } from "aws-amplify";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, Route, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const formSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 character long" }),

    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 character long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const confirmFormSchema = z.object({
  confirmationCode: z.string().min(6, { message: "Please enter a valid code" }),
});

interface SingupFormProps {
  Route: Route;
}

export function SignupForm({ Route }: SingupFormProps) {
  const auth = useAuth();
  const router = useRouter();
  const navigate = Route.useNavigate();
  const search = Route.useSearch();

  const [isConfirming, setIsConfirming] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const confirmForm = useForm<z.infer<typeof confirmFormSchema>>({
    resolver: zodResolver(confirmFormSchema),
    defaultValues: {
      confirmationCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await Auth.signUp(values.email, values.password);
      await router.invalidate();
      setIsConfirming(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function onConfirm(values: z.infer<typeof confirmFormSchema>) {
    try {
      // get values from previous form
      const { email, password } = form.getValues();
      await Auth.confirmSignUp(email, values.confirmationCode);
      await Auth.signIn(email, password);
      await auth.login(email);
      await router.navigate({ to: "/dashboard" });
    } catch (error) {
      console.log(error);
    }
  }

  if (isConfirming) {
    return (
      <Form {...confirmForm}>
        <form
          onSubmit={confirmForm.handleSubmit(onConfirm)}
          className="space-y-8"
        >
          <FormField
            control={confirmForm.control}
            name="confirmationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation Code</FormLabel>
                <FormControl>
                  <Input placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </form>
      </Form>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ben@awad.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign up
        </Button>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
