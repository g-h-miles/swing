# General Design Guidelines

## Icon Styling

### Phosphor Icons
When using Phosphor icons, use the `fill` or `stroke` Tailwind property instead of `text` for coloring:

```tsx
// ✅ Correct - Use fill for icon coloring
<Circle size={16} weight="fill" className="fill-red-500" />

// ✅ Correct - Use stroke for icon outline
<Circle size={16} weight="fill" className="stroke-red-500" />

// ❌ Incorrect - Don't use text for icon coloring
<Circle size={16} weight="fill" className="text-red-500" />
```

**Reasoning**: Phosphor icons are SVG-based and respond better to fill properties rather than text color properties. This ensures proper color rendering and avoids conflicts with parent component text styling.