import z, { email, ZodError } from "zod";

const SignUpSchema = z.object({
    email : z.email(),
    password : z.string().length(5, "Password should be min 5 length"),
    username : z.string()
});

const SignInSchema = z.object({
    email : z.email(),
    password : z.string().length(5, "Password should be min 5 length"),
});

const zodError = ({error}: {error : ZodError})=>{
    return error.issues.map((errormsg)=>`error ${errormsg.input}, message : ${errormsg.message}`).join(`,`);
}

export {SignInSchema, SignUpSchema, zodError};