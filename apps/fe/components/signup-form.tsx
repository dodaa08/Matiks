import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

type SignupFormProps = Omit<React.ComponentProps<typeof Card>, "onSubmit"> & {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  error?: string;
  username: string;
  email: string;
  password: string;
  setconfirmPass : (V : string) =>void;
  confirmPass : string;
  setUsername: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
};

export function SignupForm({  onSubmit, isPending, error,
  username, email, password, setconfirmPass, confirmPass,
  setUsername, setEmail, setPassword,  ...props}: SignupFormProps) {
    const router  = useRouter();
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input value={username}
                onChange={(e) => setUsername(e.target.value)} id="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"  
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
              <FieldDescription>
                We&apos;ll use this to contact you. We will not share your email
                with anyone else.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input value={password}
                onChange={(e) => setPassword(e.target.value)} id="password" type="password" required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input value={confirmPass} onChange={(e)=>setconfirmPass(e.target.value)} id="confirm-password" type="password" required />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                 {error && <p className="text-sm text-red-500">{error}</p>}

                <Button disabled={isPending}  type="submit">{
                  isPending ? "Creating.." : "Create Account"
                  }</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <button onClick={()=>router.push("/auth/signin")} >Sign in</button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}