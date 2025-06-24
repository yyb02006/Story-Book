'use server'

import { ACCOUNT_LENGTH, PASSWORD_REGEX } from '#/libs/client/constants'
import { z } from 'zod/v4'
import bcrypt from 'bcrypt'
import prisma from '#/libs/server/prisma'
import { TreeifiedError } from '#/app/(auth)/signup/actions'
import { redirect } from 'next/navigation'
import getSession from '#/libs/server/session'

export type LoginTreeifiedErrorType = {
  errors: string[]
  properties?:
    | {
        id?:
          | {
              errors: string[]
            }
          | undefined
        password?:
          | {
              errors: string[]
            }
          | undefined
      }
    | undefined
}

const loginErrorMessages = {
  id: '등록되지 않은 아이디 입니다.',
  password: '잘못된 비밀번호 입니다.',
}

const userLoginFormSchema = z
  .object({
    user_id: z
      .string()
      .refine((value) => value.length !== 0, { error: '아이디를 입력해주세요.', abort: true })
      .trim(),
    password: z
      .string()
      .refine((value) => value.length !== 0, { error: '비밀번호를 입력해주세요.', abort: true })
      .trim(),
  })
  .refine(
    ({ user_id, password }) => {
      const { success: userIdSuccess } = z
        .string()
        .trim()
        .refine((value) => value.length >= ACCOUNT_LENGTH.id.minLength, {
          error: loginErrorMessages.id,
          abort: true,
        })
        .refine((value) => value.length <= ACCOUNT_LENGTH.id.maxLength, {
          error: loginErrorMessages.id,
          abort: true,
        })
        .safeParse(user_id)
      const { success: passwordSuccess } = z
        .string()
        .trim()
        .refine((value) => value.length >= ACCOUNT_LENGTH.password.minLength, {
          error: loginErrorMessages.password,
          abort: true,
        })
        .refine((value) => value.length <= ACCOUNT_LENGTH.password.maxLength, {
          error: loginErrorMessages.password,
          abort: true,
        })
        .regex(PASSWORD_REGEX, { error: loginErrorMessages.password })
        .safeParse(password)
      return userIdSuccess && passwordSuccess
    },
    { error: '존재하지 않는 아이디나 비밀번호입니다.', abort: true },
  )
  .refine(
    async ({ user_id, password }) => {
      const user = await prisma.user.findUnique({
        where: { user_id },
        select: { id: true, username: true, password: true },
      })
      if (user && user.password) {
        const isMatch = await bcrypt.compare(password, user.password)
        return isMatch
      } else {
        return false
      }
    },
    { error: '존재하지 않는 아이디나 비밀번호입니다.' },
  )

export const handleLoginForm = async (
  prevState: TreeifiedError<{ user_id: string; password: string }> | null | undefined,
  formData: FormData,
) => {
  const data = { user_id: formData.get('id'), password: formData.get('password') }
  const result = await userLoginFormSchema.safeParseAsync(data)
  const notExistError: TreeifiedError<{ user_id: string; password: string }> = {
    errors: ['존재하지 않는 아이디나 비밀번호입니다.'],
  }
  if (result.success) {
    const user = await prisma.user.findUnique({
      where: { user_id: result.data.user_id },
      select: { id: true, password: true },
    })

    if (!user) return notExistError

    const isMatch = await bcrypt.compare(result.data.password, user.password ?? 'none')

    if (!isMatch) return notExistError

    const session = await getSession()
    session.id = user.id
    await session.save()
    redirect('/')
  } else {
    return z.treeifyError(result.error)
  }
}
