import z from "zod"

export const usernameValidator = z
  .string()
  .min(4, "Username cannot be less than 4 characters")
  .max(20, "Username cannot exceed 20 characters")
  .regex(
    /^[A-Z][a-z]*(\s[A-Z][a-z]*)* [A-Z]\.$/,
    "Username must follow the pattern: Name Initial. (e.g., Jean B.)"
  )

export const inviteCodeValidator = z.string().length(6, "Invalid invite code")
