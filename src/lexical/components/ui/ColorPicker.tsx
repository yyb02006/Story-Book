import { TextInput } from '#/components/Inputs'
import { basicColorGroups } from '#/lexical/const'
import { getHsvWithoutAlpha, isHexColor, tinycolor } from '#/lexical/plugins/utils'
import { cls } from '#/libs/client/utils'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { z } from 'zod/v4'

export type Hsv = { h: number; s: number; v: number }

const SeperateBar = () => {
  return <div className="dark:bg-dark-border bg-light-border -mx-3 h-[1px]" />
}

const addHashToHexCode = (hex: string): string => {
  const trimmedHex = hex.trim()
  if (!trimmedHex.startsWith('#')) {
    return '#' + trimmedHex
  } else {
    return trimmedHex
  }
}

const SelectedColorInput = ({
  hexString,
  setHsv,
}: {
  hexString: string
  setHsv: Dispatch<SetStateAction<Hsv>>
}) => {
  const [isValid, setIsValid] = useState(true)
  const [currentHexString, setCurrentHexString] = useState(hexString)
  const handleChange = (value: string) => {
    const hashValue = addHashToHexCode(value)
    const hexColorRegex = /^#([0-9A-Fa-f]*)?$/
    if (hashValue.length > 7 || !hexColorRegex.test(hashValue)) return
    setCurrentHexString(hashValue)
    const { success } = z
      .string()
      .length(7)
      .refine((color) => isHexColor(color))
      .safeParse(hashValue)
    if (success) {
      setHsv(() => {
        return getHsvWithoutAlpha(tinycolor(hashValue).toHsv())
      })
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }

  useEffect(() => {
    setCurrentHexString(hexString)
  }, [hexString])
  return (
    <TextInput
      type="text"
      value={currentHexString}
      onChange={(value) => {
        handleChange(value)
      }}
      maxLength={7}
      placeholder=""
      name="selected-color-input"
      aria-label="selected-color-input"
      className={cls(
        isValid ? 'dark:border-midnight-gray border-light-border' : 'border-red-400',
        'text-smooth-white h-full min-w-0 flex-1 rounded-sm border px-1',
      )}
    />
  )
}

const SLPicker = ({
  children,
  setHsv,
  hsv,
  onChange,
}: {
  children: ReactNode
  setHsv: Dispatch<SetStateAction<Hsv>>
  hsv: Hsv
  onChange: (value: string, skipHistoryStack: boolean) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [onThumbMove, setOnThumbMove] = useState(false)

  const updatePostion = useCallback(
    (event: globalThis.MouseEvent, container: HTMLDivElement | null) => {
      if (!container) return

      const containerRect = container.getBoundingClientRect()

      const x = event.clientX - containerRect.left
      const y = event.clientY - containerRect.top

      // thumb 크기 고려해서 오른쪽/아래로 못 넘도록 제한
      const clampX = Math.max(0, Math.min(x, containerRect.width))
      const clampY = Math.max(0, Math.min(y, containerRect.height))

      // 백분율로 변환하지 말고 0~1로 표시하는 게 좋음 tinyColor에서 0~1범위를 백분율로 변환해서 받아들임
      const [saturation, value] = [
        clampX / containerRect.width,
        Math.abs(clampY - containerRect.height) / containerRect.height,
      ]

      setPosition({ x: clampX, y: clampY })

      setHsv((p) => ({
        ...p,
        s: saturation,
        v: value,
      }))

      onChange(tinycolor({ h: hsv.h, s: saturation, v: value }).toHexString(), true)
    },
    [setHsv, hsv.h, onChange],
  )

  useEffect(() => {
    if (onThumbMove) return
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const x = hsv.s * containerRect.width
    const y = (1 - hsv.v) * containerRect.height
    setPosition({ x, y })
  }, [hsv, onThumbMove])

  useEffect(() => {
    const thumb = thumbRef.current
    const container = containerRef.current

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      updatePostion(event, container)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setOnThumbMove(false)
    }

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      event.preventDefault()
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      if (event.target !== thumb) {
        updatePostion(event, container)
      }

      setOnThumbMove(true)
    }

    container?.addEventListener('mousedown', handleMouseDown)
    return () => {
      container?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [updatePostion])

  return (
    <div ref={containerRef} className="relative cursor-pointer">
      {children}
      <div
        ref={thumbRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          backgroundColor: tinycolor(hsv).toHexString(),
        }}
        className="border-smooth-white absolute -top-3 -left-3 size-6 cursor-pointer rounded-full border-2 drop-shadow-[0_2px_4px_#00000066]"
      />
    </div>
  )
}

const HuePicker = ({
  children,
  setHsv,
  hsv,
  onChange,
}: {
  children: ReactNode
  setHsv: Dispatch<SetStateAction<Hsv>>
  hsv: Hsv
  onChange: (value: string, skipHistoryStack: boolean) => void
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0 })
  const [onThumbMove, setOnThumbMove] = useState(false)

  const updatePosition = useCallback(
    (event: globalThis.MouseEvent, container: HTMLDivElement | null) => {
      if (!container) return
      const containerRect = container.getBoundingClientRect()

      const x = event.clientX - containerRect.left

      const clampX = Math.max(0, Math.min(x, containerRect.width))

      const hue = (clampX * 360) / containerRect.width

      setPosition({ x: clampX })

      setHsv((p) => ({ ...p, h: hue }))

      onChange(tinycolor({ h: hue, s: hsv.s, v: hsv.v }).toHexString(), true)
    },
    [setHsv, hsv.s, hsv.v, onChange],
  )

  useEffect(() => {
    if (onThumbMove) return
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    const x = (hsv.h / 360) * containerRect.width
    setPosition({ x })
  }, [hsv, onThumbMove])

  useEffect(() => {
    const thumb = thumbRef.current
    const container = containerRef.current

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      updatePosition(event, container)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      setOnThumbMove(false)
    }

    const handleMouseDown = (event: globalThis.MouseEvent) => {
      event.preventDefault()
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      if (event.target !== thumb) {
        updatePosition(event, container)
      }
      setOnThumbMove(true)
    }

    container?.addEventListener('mousedown', handleMouseDown)
    return () => {
      container?.removeEventListener('mousedown', handleMouseDown)
    }
  }, [updatePosition])

  return (
    <div ref={containerRef} className="relative cursor-pointer">
      {children}
      <div
        ref={thumbRef}
        style={{
          transform: `translate(${position.x}px, -50%)`,
          backgroundColor: `hsl(${(((position.x * 100) / (containerRef.current?.getBoundingClientRect().width || 100)) * 360) / 100}, 100%, 50%)`,
        }}
        className="border-smooth-white absolute top-1/2 -left-3 size-6 cursor-pointer rounded-full border-2 drop-shadow-[0_0_4px_#00000066]"
      />
    </div>
  )
}

export default function ColorPicker({
  onChange,
  hsv,
  setHsv,
}: {
  onChange: (value: string, skipHistoryStack: boolean) => void
  hsv: Hsv
  setHsv: Dispatch<SetStateAction<Hsv>>
}) {
  const hexString = tinycolor(hsv).toHexString()
  return (
    <div className="input-color-theme absolute top-6 mt-2 space-y-3 rounded-lg border p-3">
      <div className="font-S-CoreDream-400 text-sm">색상선택</div>
      <div className="flex h-[calc(20px*2+4px*1)] w-[calc(20px*10+4px*9)] flex-wrap gap-1">
        {basicColorGroups.flat().map(({ utilityClass, colorHex }) => (
          <button
            key={colorHex}
            onClick={() => {
              setHsv(getHsvWithoutAlpha(tinycolor(colorHex).toHsv()))
              onChange(colorHex, true)
            }}
            className={cls(utilityClass, 'size-5 cursor-pointer rounded-full')}
          />
        ))}
      </div>
      <SeperateBar />
      <div className="space-y-6">
        <SLPicker setHsv={setHsv} hsv={hsv} onChange={onChange}>
          <div
            style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
            className="aspect-video w-full bg-[linear-gradient(transparent,black),linear-gradient(to_right,white,transparent)]"
          />
        </SLPicker>
        <HuePicker setHsv={setHsv} hsv={hsv} onChange={onChange}>
          <div className="h-4 w-full rounded-sm bg-[linear-gradient(to_right,hsl(0,100%,50%),hsl(60,100%,50%),hsl(120,100%,50%),hsl(180,100%,50%),hsl(240,100%,50%),hsl(300,100%,50%),hsl(360,100%,50%))]" />
        </HuePicker>
      </div>
      <SeperateBar />
      <div className="flex h-7 w-[calc(20px*10+4px*9)] items-center gap-3">
        <div className="font-S-CoreDream-400 text-light-gray text-sm">Hex</div>
        <SelectedColorInput hexString={hexString} setHsv={setHsv} />
        <div style={{ backgroundColor: hexString }} className="size-7 rounded-sm" />
      </div>
    </div>
  )
}
