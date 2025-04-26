type ValueOf<T extends Record<string, unknown>> = T[keyof T]

type ThemeMode = 'dark' | 'white'
