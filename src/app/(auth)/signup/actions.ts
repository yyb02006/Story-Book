'use server'

import { ACCOUNT_LENGTH, ID_REGEX, PASSWORD_REGEX } from '#/libs/client/constants'
import prisma from '#/libs/server/prisma'
import { z, flattenError, treeifyError } from 'zod/v4'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { typeToFlattenedError } from 'zod'

const { id, password } = ACCOUNT_LENGTH

export type TreeifiedError<T> = ReturnType<typeof treeifyError<T>>

export type FlattenedError<T> = ReturnType<typeof flattenError<T>>

// treeify같은 경우 중첩된 객체 구조를 검사할 때 에러도 중첩된 객체 구조로 내놓기 때문에 명확하지만 반대로 불편해질 수 있다.
// flattenError 같은 경우 중첩된 객체 구조를 검사할 때 에러는 flat화 시켜서 depth 1 프로퍼티에 배열로 전부 전달하기 때문에 명확하지 않지만 편할 수 있다.
export type ValidationResult<T, U extends 'treeifyError' | 'flattenError'> = {
  success: boolean
  data?: T
  error?: U extends 'treeifyError' ? TreeifiedError<T> : FlattenedError<T>
}

const userCredentialFormSchema = (isIdAvailable: boolean) => {
  return z
    .object({
      email: z.email('올바른 이메일 형식이 아닙니다').toLowerCase().trim(),
      user_id: z
        .string()
        .refine((value) => value.length !== 0, { error: '아이디를 입력해주세요.', abort: true })
        .refine((value) => value.length >= id.minLength, {
          error: `아이디는 ${id.minLength}자 이상이어야 합니다.`,
        })
        .refine((value) => value.length <= id.maxLength, {
          error: `아이디는 ${id.maxLength}자 이하여야 합니다.`,
        })
        .regex(ID_REGEX, '아이디는 영문자와 숫자로만 이루어져야 합니다.')
        .refine(
          (value) => {
            return (
              value.length < id.minLength ||
              value.length > id.maxLength ||
              !ID_REGEX.test(value) ||
              isIdAvailable
            )
          },
          { message: '아이디 중복검사를 해주세요.' },
        ),
      password: z
        .string()
        .refine((value) => value.length !== 0, { error: '비밀번호를 입력해주세요.', abort: true })
        .refine((value) => value.length >= password.minLength, {
          error: `password는 ${password.minLength}자 이상이어야 합니다.`,
        })
        .refine((value) => value.length <= password.maxLength, {
          error: `password는 ${password.maxLength}자 이하여야 합니다.`,
        })
        .regex(PASSWORD_REGEX, '대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.')
        .trim(),
      confirm_password: z.string().trim(),
    })
    .refine(({ password, confirm_password }) => password === confirm_password, {
      error: '비밀번호가 일치하지 않습니다.',
      path: ['confirm_password'],
    })
}

export const handleUserCredentialForm = async (
  prevState:
    | typeToFlattenedError<
        {
          user_id: string
          password: string
          confirm_password: string
        },
        string
      >
    | null
    | undefined,
  formData: FormData,
  isIdAvailable: boolean,
) => {
  const data = {
    email: formData.get('email'),
    user_id: formData.get('user_id'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  }
  const result = userCredentialFormSchema(isIdAvailable).safeParse(data)
  if (!result.success) {
    return z.flattenError(result.error)
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12)
    console.log(result.data.password)

    await prisma.user.create({
      data: {
        username: result.data.user_id,
        email: result.data.email,
        user_id: result.data.user_id,
        password: hashedPassword,
      },
    })
    redirect('/login')
  }
}

export const isUserIdTaken = async (user_id: string) => {
  const user = await prisma.user.findUnique({
    where: { user_id },
    select: { id: true },
  })
  return !!user
}

export const isEmailTaken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  })
  return !!user
}

export const checkUserIdAvailability = async (user_id: string) => {
  const { success, data, error } = await z
    .string()
    .refine((value) => value.length !== 0, { error: '아이디를 입력해주세요.', abort: true })
    .regex(/^[a-zA-Z0-9]+$/, '아이디는 영문자와 숫자로만 이루어져야 합니다.')
    .refine((value) => value.length >= id.minLength, {
      error: `아이디는 ${id.minLength}자 이상이어야 합니다.`,
      abort: true,
    })
    .refine((value) => value.length <= id.maxLength, {
      error: `아이디는 ${id.maxLength}자 이하여야 합니다.`,
      abort: true,
    })
    .trim()
    .refine(async (user_id) => !(await isUserIdTaken(user_id)), {
      error: '이미 존재하는 아이디 입니다.',
    })
    .safeParseAsync(user_id)
  const result = {
    success,
    data,
    error: error && flattenError(error),
  }
  return result
}

export const handleEmailValidationForm = async (
  prevState: ValidationResult<string, 'flattenError'> | null,
  formData: FormData,
) => {
  const { success, data, error } = await z
    .email({ error: '올바른 이메일 형식이 아닙니다', abort: true })
    .toLowerCase()
    .trim()
    .refine(
      async (email) => {
        const test = await isEmailTaken(email)
        console.log(test)
        return !test
      },
      { error: '이미 가입된 이메일입니다.' },
    )
    .safeParseAsync(formData.get('email'))
  const result = {
    success,
    data,
    error: error && flattenError(error),
  }
  return result
}
