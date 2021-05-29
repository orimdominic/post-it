import { config } from "dotenv";

// TODO: Apply auth to /posts

process.env.NODE_ENV === "production"
  ? config()
  : config({ path: ".local.env" });

export const Server = {
  ENV: process.env.NODE_ENV ? process.env.NODE_ENV.toString() : "development",
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 5000,
  BaseApiRoute: "/api",
};

/**
 * Message string constants
 */
export enum Message {
  RouteNotFound = "Route not found",

  EmailExists = "Email already exists",
  EmailInexistent = "Email does not exist",

  RegMailSubject = "%useremail% 🤝 Post It",
  RegMailContent = "Hello! %useremail%! Welcome to Post It!",

  ForgotPasswordMailSubject = "🔐 Post It - Password Reset?",
  ForgotPasswordMailContent = `Hello! %useremail%!,
You requested a password reset.
Use the code below to reset your password.

CODE: %code%

Ignore this message if you didn't make this request.

Regards,
Post It.`,
  ResetPasswordMailSubject = "🔐 Post It - Password Reset Successful",
  ResetPasswordMailContent = `Hello! %useremail%!,
Just letting you know that you have successfully reset your password 😉.

Regards,
Post It.`,

  RegistrationSuccessful = "Registration successful",
  LoginSuccessful = "Login successful",
  PasswordResetCodeSent = "Password reset code sent",
  PasswordResetSuccessful = " Password reset successful",
  NotFound = "Not found",
}

/**
 * Application routes
 */
export enum Route {
  Register = "/auth/register",
  Login = "/auth/login",
  ForgotPassword = "auth/forgot-password",
  ResetPassword = "auth/password-reset",
  Posts = "/posts",
  PostWithIdParam = "/posts/:id",
}

/**
 * The URI for the mongodb database used
 */
export const dbURI = process.env.DB_URI
  ? process.env.DB_URI
  : "mongodb://localhost:27017/posts-db";

export enum ModelName {
  Post = "Post",
  User = "User",
  PasswordRest = "PasswordReset",
}

export const NodeMailerConfig = {
  email: process.env.NODEMAILER_EMAIL ? process.env.NODEMAILER_EMAIL : "",
  password: process.env.NODEMAILER_PASSWORD
    ? process.env.NODEMAILER_PASSWORD
    : "",
};

export const CloudinaryConfig = {
  name: process.env.CLOUD_NAME ? process.env.CLOUD_NAME : "",
  apiKey: process.env.CLOUD_API_KEY ? process.env.CLOUD_API_KEY : "",
  apiSecret: process.env.CLOUD_API_SECRET ? process.env.CLOUD_API_SECRET : "",
};
