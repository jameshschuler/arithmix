import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

type Option<Value> = { id: Value; label: string }

type OptionGroupProps<Value extends string | number> = {
  label: string
  options: Option<Value>[]
  value: Value
  onChange: (value: Value) => void
}

export function OptionGroup<Value extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<Value>) {
  const handleValueChange = (values: string[]) => {
    const selected = options.find((option) => String(option.id) === values[0])

    if (selected) {
      onChange(selected.id)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <ToggleGroup
        aria-label={label}
        variant="outline"
        spacing={0}
        value={[String(value)]}
        onValueChange={handleValueChange}
        className="w-full"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={String(option.id)}
            className="h-12 flex-1 text-base aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          >
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
