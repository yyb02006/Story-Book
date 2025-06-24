/**
 * 주어진 기본 URL과 선택적 쿼리 파라미터를 사용하여 SNS 인증 URL을 생성.
 *
 * @param {string} baseURL - SNS 인증의 기본 URL.
 * @param {Object} [params] - URL에 추가할 쿼리 파라미터 객체. 각 키는 파라미터 이름이고, 각 값은 파라미터 값.
 * @returns {string} - 생성된 SNS 인증 URL.
 */
export const getSNSAuthURL = (baseURL: string, params?: { [key: string]: string }) => {
  const formattedParams = new URLSearchParams(params).toString()
  return `${baseURL}?${formattedParams}`
}
