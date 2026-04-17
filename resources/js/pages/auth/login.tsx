import { Form, Head, Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register, home } from '@/routes/index';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#0a0a0a] p-6 md:p-10">
            <Head title="Log in" />

            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -left-[10%] -top-[20%] h-[70%] w-[70%] rounded-full bg-orange-500/10 blur-[120px] animate-pulse duration-[10000ms]" />
                <div className="absolute -right-[10%] -bottom-[20%] h-[70%] w-[70%] rounded-full bg-[#162a5b]/40 blur-[120px] animate-pulse duration-[8000ms] delay-1000" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)]" />
            </div>

            <div className="relative z-10 w-full max-w-[440px]">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-3 transition-transform duration-300 hover:scale-105"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-sm group-hover:border-orange-500/30 group-hover:bg-white/[0.05]">
                                <AppLogoIcon className="size-10 fill-current text-white group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Welcome Back</h2>
                        </Link>

                        <div className="space-y-1 text-center">
                            <p className="text-sm font-medium text-muted-foreground/80">
                                Enter your credentials to access the IMS portal
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Glassmorphism Card */}
                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:border-white/20">
                            <Form
                                {...store.form()}
                                resetOnSuccess={['password']}
                                className="flex flex-col gap-7"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-7">
                                            <div className="grid gap-2.5">
                                                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] ml-1">
                                                    Email address
                                                </Label>
                                                <div className="relative group">
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        name="email"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="email"
                                                        placeholder="name@company.com"
                                                        className="h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-muted-foreground/30 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 rounded-xl px-4 transition-all"
                                                    />
                                                </div>
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="grid gap-2.5">
                                                <div className="flex items-center ml-1">
                                                    <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">
                                                        Password
                                                    </Label>
                                                    {canResetPassword && (
                                                        <TextLink
                                                            href={request()}
                                                            className="ml-auto text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors"
                                                            tabIndex={5}
                                                        >
                                                            Forgot?
                                                        </TextLink>
                                                    )}
                                                </div>
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                    className="h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-muted-foreground/30 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 rounded-xl px-4 transition-all"
                                                />
                                                <InputError message={errors.password} />
                                            </div>

                                            <div className="flex items-center space-x-3 ml-1">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="border-white/20 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500 rounded-[4px]"
                                                />
                                                <Label htmlFor="remember" className="text-sm font-medium text-muted-foreground/70 cursor-pointer hover:text-muted-foreground transition-colors">
                                                    Keep me logged in
                                                </Label>
                                            </div>

                                            <Button
                                                type="submit"
                                                className="mt-2 h-12 w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-sm rounded-xl shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)] border-none transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-[0.98] disabled:opacity-70"
                                                tabIndex={4}
                                                disabled={processing}
                                                data-test="login-button"
                                            >
                                                {processing ? <Spinner className="mr-2 h-4 w-4" /> : null}
                                                Sign In
                                            </Button>
                                        </div>

                                        {canRegister && (
                                            <div className="text-center text-sm font-medium text-muted-foreground/60">
                                                New to IMS?{' '}
                                                <TextLink href={register()} className="text-white hover:text-orange-400 transition-colors" tabIndex={5}>
                                                    Join Waitlist
                                                </TextLink>
                                            </div>
                                        )}
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>

                    {status && (
                        <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-center text-sm font-medium text-green-400 backdrop-blur-md">
                            {status}
                        </div>
                    )}

                    {/* Footer Credits */}
                    <div className="mt-4 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">
                            Powered by Accrete Infosolution Technologies
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
