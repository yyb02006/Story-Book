'use server'

export const handleSignupForm = async (
  prevState: {
    id: FormDataEntryValue | null
    password: FormDataEntryValue | null
  } | null,
  formData: FormData,
) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // error 처리에 사용하거나 다음 단계 인증으로 넘어가기 위한 상태 전달에 사용
  return {
    id: formData.get('id'),
    password: formData.get('password'),
  }
}
