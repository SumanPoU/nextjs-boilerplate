'use client';

import Link from 'next/link';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useForm } from '@tanstack/react-form';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/rootReducer';
import { setShowPassword } from '@/store/slices/auth.slice';

import { RegisterSchema } from '@/validation/auth';
import { useRegister } from '@/hooks/api/use-auth';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export function Register() {
  const dispatch = useDispatch();
  const register = useRegister();
  const { showPassword } = useSelector((state: RootState) => state.auth);

  const form = useForm({
    defaultValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: RegisterSchema,
    },
    onSubmit: async ({ value }) => {
      await register.mutateAsync(value);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Heading */}
        <div className="space-y-3 text-left">
          <h1 className="text-3xl font-semibold text-primary">Sign Up</h1>
          <p className="text-sm text-muted-foreground">Create an account to get started!</p>
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
            {/* Display Name */}
            <form.Field name="displayName">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Display Name <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="John Doe"
                      autoComplete="name"
                      aria-invalid={isInvalid}
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

            {/* Email */}
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
                      autoComplete="email"
                      aria-invalid={isInvalid}
                      className="h-11 rounded-none transition-all duration-300 placeholder:text-muted-foreground/40
              focus:placeholder:text-muted-foreground/25"
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Password */}
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
                        autoComplete="new-password"
                        aria-invalid={isInvalid}
                        className="h-11 rounded-none pr-10 transition-all duration-300 placeholder:text-muted-foreground/40
              focus:placeholder:text-muted-foreground/25"
                      />

                      <button
                        type="button"
                        onClick={() => dispatch(setShowPassword(!showPassword))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition"
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            {/* Confirm Password */}
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password <span className="text-red-500">*</span>
                    </FieldLabel>

                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPassword ? 'text' : 'password'}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Re-enter your password"
                        autoComplete="new-password"
                        aria-invalid={isInvalid}
                        className="h-11 rounded-none pr-10 transition-all duration-300 placeholder:text-muted-foreground/40
              focus:placeholder:text-muted-foreground/25"
                      />
                    </div>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* Submit */}
          <Button
            type="submit"
            disabled={register.isPending}
            className="w-full h-11 rounded-sm bg-primary text-white font-semibold text-base cursor-pointer"
          >
            {register.isPending ? 'Registering…' : 'Register'}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-left text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
