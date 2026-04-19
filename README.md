# Valid8or ✅

**Type-Safe Validation** - Forms, APIs, objects.

## Features

- **📋 Schema-based** - Define once, validate many
- **🔧 Custom Validators** - Build your own
- **📝 Clear Errors** - Detailed error messages
- **⚡ Fast** - Zero dependencies

## Installation

```bash
npm install valid8or
```

## Usage

```typescript
import { validators, Validator } from 'valid8or';

const v = new Validator({
  email: validators.email,
  name: { 
    fn: (v) => v.length >= 2,
    message: 'Name must be at least 2 characters'
  },
  age: { 
    fn: (v) => v >= 18 && v <= 120,
    message: 'Must be between 18 and 120'
  }
});

const errors = v.validate({
  email: 'invalid',
  name: 'J',
  age: 15
});

console.log(errors);
// [
//   { field: 'email', message: 'Invalid email' },
//   { field: 'name', message: 'Name must be at least 2 characters' },
//   { field: 'age', message: 'Must be between 18 and 120' }
// ]
```

## Built-in Validators

| Validator | Description |
|-----------|-------------|
| `required` | Not null/undefined/empty |
| `email` | Valid email format |
| `minLength(n)` | Min string length |
| `maxLength(n)` | Max string length |
| `min(n)` | Min number |
| `max(n)` | Max number |
| `pattern(regex)` | Regex match |

## Custom Validators

```typescript
const isStrongPassword = {
  fn: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v),
  message: 'Must contain uppercase, lowercase, digit, 8+ chars'
};
```

## License

MIT
