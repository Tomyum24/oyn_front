# FormMultiCombobox Component

A multi-select combobox component that allows users to search and select multiple options with a clean UI.

## Features

- **Multiple Selection**: Select multiple items from a searchable dropdown
- **Visual Feedback**: Selected items displayed as removable badges
- **Search Functionality**: Filter options by typing in the search field
- **Loading State**: Shows loading indicator during async operations
- **Max Selection Limit**: Optional limit on number of items that can be selected
- **Form Integration**: Fully integrated with React Hook Form
- **Validation**: Supports Zod schema validation

## Usage

### Basic Example

```typescript
import { FormMultiCombobox } from "@/shared/components/controllable/multi-combobox/multi-combobox";
import { useForm } from "react-hook-form";

const form = useForm({
  defaultValues: {
    userIds: [],
  },
});

<FormMultiCombobox
  control={form.control}
  name="userIds"
  label="Select Users"
  options={[
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
  ]}
  placeholder="Choose users..."
/>
```

### With Search and Loading State

```typescript
const [searchValue, setSearchValue] = useState("");
const [isLoading, setIsLoading] = useState(false);

<FormMultiCombobox
  control={control}
  name="userIds"
  label="Users"
  options={userOptions}
  placeholder="Search and select users"
  onSearch={value => setSearchValue(value)}
  isLoading={isLoading}
/>
```

### With Max Selection Limit

```typescript
<FormMultiCombobox
  control={control}
  name="userIds"
  label="Users"
  options={userOptions}
  placeholder="Select up to 5 users"
  maxSelected={5}
/>
```

### With Validation

```typescript
const schema = z.object({
  userIds: z
    .array(z.string())
    .min(1, "Select at least one user")
    .max(10, "Maximum 10 users allowed"),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {
    userIds: [],
  },
});
```

## Props

| Prop          | Type                      | Required | Default       | Description                                  |
| ------------- | ------------------------- | -------- | ------------- | -------------------------------------------- |
| `control`     | `Control<T>`              | Yes      | -             | React Hook Form control object               |
| `name`        | `FieldPath<T>`            | Yes      | -             | Field name in the form                       |
| `label`       | `string`                  | Yes      | -             | Label displayed above the combobox           |
| `options`     | `ComboboxOption[]`        | Yes      | -             | Array of options with `label` and `value`    |
| `placeholder` | `string`                  | No       | "Выберите..." | Placeholder text when no items selected      |
| `description` | `string`                  | No       | -             | Helper text displayed below the field        |
| `required`    | `boolean`                 | No       | `false`       | Shows asterisk (\*) next to label            |
| `className`   | `string`                  | No       | -             | Additional CSS classes for the container     |
| `disabled`    | `boolean`                 | No       | `false`       | Disables the entire component                |
| `isLoading`   | `boolean`                 | No       | `false`       | Shows loading spinner                        |
| `onSearch`    | `(value: string) => void` | No       | -             | Callback fired when search input changes     |
| `maxSelected` | `number`                  | No       | -             | Maximum number of items that can be selected |

## ComboboxOption Interface

```typescript
interface ComboboxOption {
  label: string; // Display text
  value: string; // Unique identifier
}
```

## Complete Example

See the full implementation example in:

- `/src/pages/role-permissions/role/ui/role-users-table/ui/add-multiple-users-modal/add-multiple-users-modal.tsx`

This example shows:

- Async user search with debouncing
- GraphQL integration
- Form validation
- Loading states
- Error handling

## Comparison with Single Select

| Feature   | FormCombobox          | FormMultiCombobox             |
| --------- | --------------------- | ----------------------------- |
| Selection | Single value (string) | Multiple values (string[])    |
| Display   | Selected option text  | Badges for each selected item |
| Removal   | Select different item | Click X on badge              |
| Max Limit | N/A                   | Optional `maxSelected` prop   |
| Use Case  | Select one item       | Select multiple items         |

## Styling

The component uses Tailwind CSS and follows the design system. Selected items are displayed as secondary badges with X buttons for removal.

## Accessibility

- Keyboard navigation supported
- Screen reader friendly
- ARIA roles and labels included
- Focus management handled
