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

/**
 *
 * 주어진 문자열을 float로 파싱
 * 파싱에 성공하면 파싱된 숫자를 반환하고, 실패하여 NaN이 되면 previousValue를 반환
 * 주의: 파싱 성공 시 반환 타입은 항상 number이며, 이는 previousValue의 타입 T와 다를 수 있음
 *
 * @template T - 파싱 실패 시 반환될 값의 타입.
 * @param {string} value - 파싱할 문자열 값.
 * @param {T} previousValue - 파싱 실패 시 반환될 이전 값.
 * @returns {number | T} 파싱된 숫자(number) 또는 파싱 실패 시 previousValue(T).
 *
 * @example
 * const parsedNum = parseInputValue('123.45', 0); // 123.45 (number)
 * const failedNum = parseInputValue('abc', 100); // 100 (number)
 * const failedStr = parseInputValue('xyz', 'default'); // 'default' (string)
 * const failedNull = parseInputValue('err', null); // null (object)
 */
export function parseInputValue<T>(value: string, previousValue: T) {
  const newValue = parseFloat(value)
  if (isNaN(newValue)) {
    return previousValue
  } else {
    return newValue
  }
}
