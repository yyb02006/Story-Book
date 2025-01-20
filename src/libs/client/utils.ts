/**
 *
 * 주어진 클래스 이름들을 공백으로 연결하여 하나의 문자열로 반환
 *
 * @param {...string} className - 연결할 클래스 이름들
 * @returns {string} 연결된 클래스 이름 문자열
 *
 * @example
 * const classList = cls('btn', 'btn-primary', 'active');
 *
 * console.log(classList); // "btn btn-primary active"
 */
export function cls(...className: string[]) {
  return className.join(' ')
}

/**
 *
 * 주어진 문자열의 첫 글자를 대문자로 변환후 반환
 *
 * @param {string} string - 변환할 문자열
 * @returns {string} 첫 글자가 대문자로 변환된 문자열
 *
 * @example
 * const modifiedString = ('first-Letter');
 *
 * console.log(modifiedString); // "First-Letter"
 */
export function cfl(string: string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : string
}
