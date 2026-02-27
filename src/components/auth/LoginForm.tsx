'use client';

import Link from 'next/link';
import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { useForm } from '@tanstack/react-form';

import { LoginFormSchema } from '@/validation/auth';
import { useLogin } from '@/hooks/api/use-auth';

import { Checkbox, CheckboxIndicator } from '@/components/animate-ui/primitives/radix/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export function Login() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean | 'indeterminate'>(false);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: LoginFormSchema,
    },
    onSubmit: async ({ value }) => {
      await login.mutateAsync(value);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Heading */}
        <div className="space-y-3 text-left">
          <h1 className="text-3xl font-semibold text-primary">Sign In</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password to sign in!</p>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Email <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="info@gmail.com"
                      aria-invalid={isInvalid}
                      autoComplete="email"
                      className="h-11 rounded-none
            placeholder:text-muted-foreground/40
            focus:placeholder:text-muted-foreground/25
            transition-all duration-300"
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Password <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Enter your password"
                        aria-invalid={isInvalid}
                        autoComplete="current-password"
                        className="h-11 rounded-none pr-10
              placeholder:text-muted-foreground/40
              focus:placeholder:text-muted-foreground/25
              transition-all duration-300"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isChecked}
                onCheckedChange={setIsChecked}
                className="size-5 flex items-center justify-center border rounded-none
                  data-[state=checked]:bg-primary
                  data-[state=checked]:text-white transition"
              >
                <CheckboxIndicator className="size-3.5" />
              </Checkbox>
              <span className="text-sm text-muted-foreground">Keep me logged in</span>
            </div>

            <Link href="/reset-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-11 rounded-sm bg-primary text-white font-semibold text-base"
          >
            {login.isPending ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Signup */}
        <div className="text-left text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary font-semibold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
