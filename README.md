# Valid8or

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

**Type-Safe Validation Library for Forms, APIs, and Objects**

[Features](#features) • [Installation](#installation) • [Quick Start](#quick-start) • [Validators](#built-in-validators) • [API Reference](#api-reference) • [Examples](#examples)

</div>

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Built-in Validators](#built-in-validators)
5. [Validator Reference Table](#validator-reference-table)
6. [Usage Examples](#usage-examples)
   - [Form Validation](#form-validation)
   - [API Request Validation](#api-request-validation)
   - [Object Validation](#object-validation)
7. [Custom Validators](#custom-validators)
8. [Schema Examples](#schema-examples)
9. [API Reference](#api-reference)
10. [TypeScript Support](#typescript-support)
11. [Best Practices](#best-practices)
12. [License](#license)

---

## Features

### Why Valid8or?

- **📋 Schema-based Validation** - Define your validation rules once and reuse them across your application. Create reusable schemas for forms, API endpoints, and data models.

- **🔧 Extensible** - Built-in validators cover common use cases, but creating custom validators is straightforward. Compose complex validation logic from simple building blocks.

- **📝 Clear Error Messages** - Every validation failure returns a structured error with the field name and a human-readable message, making it easy to display feedback to users.

- **⚡ Zero Dependencies** - Valid8or has no external dependencies, keeping your bundle size small and your project secure. No transitive dependency vulnerabilities to worry about.

- **💪 TypeScript Native** - Written in TypeScript with full type definitions. Get autocompletion and type checking in your IDE for a better development experience.

- **🎯 Lightweight** - Under 1KB gzipped. Valid8or is designed to be fast and efficient, suitable for both client and server environments.

- **🔄 Framework Agnostic** - Works with any JavaScript framework or vanilla JS. Use it in React, Vue, Svelte, Node.js, Deno, or any other environment.

- **✅ Predictable** - Validates all fields in a single pass and returns all errors at once, so users can see all problems with their input simultaneously.

---

## Installation

### NPM

```bash
npm install valid8or
```

### Yarn

```bash
yarn add valid8or
```

### PNPM

```bash
pnpm add valid8or
```

### Bun

```bash
bun add valid8or
```

### CDN (Browser)

```html
<script type="module">
  import { validators, Validator } from 'https://esm.sh/valid8or';
</script>
```

### Requirements

- Node.js 14.0.0 or higher
- ES Modules support (or use a bundler like webpack, rollup, or vite)

---

## Quick Start

```typescript
import { validators, Validator } from 'valid8or';

// Define a validation schema
const userSchema = {
  email: validators.email,
  name: validators.required,
  age: validators.min(18),
};

// Create a validator instance
const validator = new Validator(userSchema);

// Validate data
const errors = validator.validate({
  email: 'user@example.com',
  name: 'John Doe',
  age: 25,
});

if (errors.length === 0) {
  console.log('✅ Validation passed!');
} else {
  console.log('❌ Validation failed:', errors);
  // []
}
```

---

## Built-in Validators

Valid8or includes a comprehensive set of built-in validators for common validation scenarios:

### Core Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `required` | Ensures value is not null, undefined, or empty string | `validators.required` |
| `email` | Validates email format | `validators.email` |

### String Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `minLength(n)` | Minimum string length | `validators.minLength(8)` |
| `maxLength(n)` | Maximum string length | `validators.maxLength(100)` |
| `pattern(regex)` | Matches a regular expression | `validators.pattern(/^[A-Z]/)` |

### Number Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `min(n)` | Minimum numeric value | `validators.min(0)` |
| `max(n)` | Maximum numeric value | `validators.max(100)` |

---

## Validator Reference Table

This table provides a complete reference for all built-in validators:

| Validator | Input Type | Parameters | Default Message |
|-----------|------------|------------|----------------|
| `required` | Any | None | "Required" |
| `email` | String | None | "Invalid email" |
| `min(n)` | Number | `n: number` | Dynamic: "Value must be >= n" |
| `max(n)` | Number | `n: number` | Dynamic: "Value must be <= n" |
| `minLength(n)` | String | `n: number` | Dynamic: "Length must be >= n" |
| `maxLength(n)` | String | `n: number` | Dynamic: "Length must be <= n" |
| `pattern(regex)` | String | `re: RegExp` | Dynamic: "Pattern mismatch" |

### Validator Function Signatures

```typescript
// No parameters required
required: () => Validator

// Single parameter required
min: (n: number) => Validator
max: (n: number) => Validator
minLength: (n: number) => Validator
maxLength: (n: number) => Validator
pattern: (re: RegExp) => Validator

// No parameters
email: Validator
```

---

## Usage Examples

### Form Validation

Form validation is one of the most common use cases for Valid8or. Here's a complete example:

```typescript
import { validators, Validator } from 'valid8or';

// Define the form validation schema
const contactFormSchema = {
  firstName: {
    ...validators.required,
    message: 'First name is required',
  },
  lastName: {
    ...validators.required,
    message: 'Last name is required',
  },
  email: {
    ...validators.email,
    message: 'Please enter a valid email address',
  },
  phone: {
    ...validators.pattern(/^\+?[1-9]\d{1,14}$/),
    message: 'Please enter a valid phone number',
  },
  message: {
    ...validators.minLength(10),
    message: 'Message must be at least 10 characters',
  },
};

// Create validator instance
const contactFormValidator = new Validator(contactFormSchema);

// Simulate form submission
function handleFormSubmit(formData: Record<string, string>) {
  const errors = contactFormValidator.validate(formData);

  if (errors.length > 0) {
    // Display errors to user
    const errorMap = errors.reduce((acc, err) => {
      acc[err.field] = err.message;
      return acc;
    }, {} as Record<string, string>);

    console.log('Form errors:', errorMap);
    return { success: false, errors: errorMap };
  }

  // Submit form data
  console.log('Form submitted successfully!');
  return { success: true };
}

// Example usage
const result = handleFormSubmit({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  message: 'Hello, I would like to learn more about your services.',
});

console.log(result);
// { success: true }
```

### API Request Validation

Validate incoming API requests to ensure data integrity:

```typescript
import { validators, Validator } from 'valid8or';

// Schema for user registration endpoint
const registrationSchema = {
  username: {
    ...validators.minLength(3),
    message: 'Username must be at least 3 characters',
  },
  email: {
    ...validators.email,
    message: 'Invalid email format',
  },
  password: {
    fn: (v: string) => {
      // Custom password validation logic
      const hasUpperCase = /[A-Z]/.test(v);
      const hasLowerCase = /[a-z]/.test(v);
      const hasNumber = /\d/.test(v);
      const hasMinLength = v.length >= 8;
      return hasUpperCase && hasLowerCase && hasNumber && hasMinLength;
    },
    message: 'Password must contain uppercase, lowercase, number, and be 8+ characters',
  },
  confirmPassword: validators.required,
  age: {
    ...validators.min(13),
    message: 'You must be at least 13 years old',
  },
};

const registrationValidator = new Validator(registrationSchema);

// Express.js example
function validateRegistration(req: any, res: any, next: any) {
  const errors = registrationValidator.validate(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors,
      message: 'Validation failed',
    });
  }

  // Check password match
  if (req.body.password !== req.body.confirmPassword) {
    return res.status(400).json({
      success: false,
      errors: [{ field: 'confirmPassword', message: 'Passwords do not match' }],
    });
  }

  next();
}

// Example request body
const requestBody = {
  username: 'johndoe',
  email: 'john.doe@example.com',
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123',
  age: 25,
};

const errors = registrationValidator.validate(requestBody);
console.log('Validation result:', errors.length === 0 ? 'Passed' : 'Failed');
// Validation result: Passed
```

### Object Validation

Validate complex objects and nested data structures:

```typescript
import { validators, Validator } from 'valid8or';

// Define a product schema
const productSchema = {
  name: {
    ...validators.required,
    message: 'Product name is required',
  },
  sku: {
    ...validators.pattern(/^[A-Z]{3}-\d{4}$/),
    message: 'SKU must be in format ABC-1234',
  },
  price: {
    ...validators.min(0.01),
    message: 'Price must be greater than 0',
  },
  quantity: {
    ...validators.min(0),
    message: 'Quantity cannot be negative',
  },
  category: validators.required,
};

// Create validator
const productValidator = new Validator(productSchema);

// Validate a product
const product = {
  name: 'Wireless Mouse',
  sku: 'ELC-0001',
  price: 29.99,
  quantity: 150,
  category: 'Electronics',
};

const errors = productValidator.validate(product);
console.log('Product validation:', errors.length === 0 ? 'Valid' : 'Invalid');
// Product validation: Valid

// Validate an invalid product
const invalidProduct = {
  name: '',
  sku: 'invalid-sku',
  price: -10,
  quantity: -5,
  category: '',
};

const invalidErrors = productValidator.validate(invalidProduct);
console.log('Invalid product errors:', invalidErrors);
// [
//   { field: 'name', message: 'Product name is required' },
//   { field: 'sku', message: 'SKU must be in format ABC-1234' },
//   { field: 'price', message: 'Price must be greater than 0' },
//   { field: 'quantity', message: 'Quantity cannot be negative' },
//   { field: 'category', message: 'Required' }
// ]
```

---

## Custom Validators

Create your own validators for domain-specific validation needs:

### Basic Custom Validator

```typescript
import { Validator } from 'valid8or';

// Define a custom validator
const isUrl = {
  fn: (v: string) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  },
  message: 'Must be a valid URL',
};

// Use it in a schema
const linkSchema = {
  url: isUrl,
  title: {
    fn: (v: string) => v.length >= 3 && v.length <= 100,
    message: 'Title must be between 3 and 100 characters',
  },
};

const linkValidator = new Validator(linkSchema);
const errors = linkValidator.validate({
  url: 'https://example.com',
  title: 'Example Website',
});

console.log('Link validation:', errors.length === 0 ? 'Valid' : 'Invalid');
// Link validation: Valid
```

### Advanced Custom Validators

```typescript
import { validators, Validator } from 'valid8or';

// Validator for credit card number (Luhn algorithm)
const isValidCreditCard = {
  fn: (v: string) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  },
  message: 'Invalid credit card number',
};

// Validator for date of birth
const isValidDateOfBirth = {
  fn: (v: string) => {
    const date = new Date(v);
    const now = new Date();
    const minAge = 13;
    const minDate = new Date(now.getFullYear() - 120, now.getMonth(), now.getDate());

    return date <= now && date >= minDate && (now.getFullYear() - date.getFullYear()) >= minAge;
  },
  message: 'Must be a valid date of birth (13-120 years old)',
};

// Validator for username (alphanumeric with underscores)
const isValidUsername = {
  fn: (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
  message: 'Username must be 3-20 characters, alphanumeric with underscores',
};

// Payment form schema using custom validators
const paymentSchema = {
  cardNumber: isValidCreditCard,
  cardHolder: {
    fn: (v: string) => v.length >= 2 && v.length <= 50,
    message: 'Card holder name must be 2-50 characters',
  },
  expiryMonth: {
    fn: (v: number) => v >= 1 && v <= 12,
    message: 'Month must be between 1 and 12',
  },
  expiryYear: {
    fn: (v: number) => v >= 2024 && v <= 2050,
    message: 'Year must be between 2024 and 2050',
  },
  cvv: {
    fn: (v: string) => /^\d{3,4}$/.test(v),
    message: 'CVV must be 3 or 4 digits',
  },
};

const paymentValidator = new Validator(paymentSchema);

const paymentData = {
  cardNumber: '4532015112830366', // Valid test card
  cardHolder: 'John Doe',
  expiryMonth: 12,
  expiryYear: 2027,
  cvv: '123',
};

const paymentErrors = paymentValidator.validate(paymentData);
console.log('Payment validation:', paymentErrors.length === 0 ? 'Valid' : 'Invalid');
// Payment validation: Valid
```

### Composing Validators

Combine multiple validators for complex validation rules:

```typescript
import { validators, Validator } from 'valid8or';

// Create a "strong" required validator
const strongRequired = {
  fn: (v: any) => v !== null && v !== undefined && v !== '' && (typeof v !== 'string' || v.trim().length > 0),
  message: 'This field is required and cannot be blank',
};

// Create a "strict" email validator
const strictEmail = {
  fn: (v: string) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
  message: 'Please enter a valid email address',
};

// Numeric range validator
const numericRange = (min: number, max: number) => ({
  fn: (v: number) => typeof v === 'number' && v >= min && v <= max,
  message: `Value must be between ${min} and ${max}`,
});

// String length range validator
const stringLengthRange = (min: number, max: number) => ({
  fn: (v: string) => typeof v === 'string' && v.length >= min && v.length <= max,
  message: `Length must be between ${min} and ${max} characters`,
});

// IP address validator
const isValidIPv4 = {
  fn: (v: string) => /^(\d{1,3}\.){3}\d{1,3}$/.test(v),
  message: 'Must be a valid IPv4 address',
};

// Zip code validator (US format)
const isValidZipCode = {
  fn: (v: string) => /^\d{5}(-\d{4})?$/.test(v),
  message: 'Must be a valid US ZIP code',
};

// Create a shipping address schema using composed validators
const shippingSchema = {
  fullName: {
    ...strongRequired,
    ...stringLengthRange(2, 100),
  },
  email: strictEmail,
  phone: {
    fn: (v: string) => /^\+?1?\d{10,14}$/.test(v),
    message: 'Must be a valid phone number',
  },
  address: {
    ...strongRequired,
    ...stringLengthRange(5, 200),
  },
  city: {
    ...strongRequired,
    ...stringLengthRange(2, 100),
  },
  state: {
    fn: (v: string) => /^[A-Z]{2}$/.test(v),
    message: 'Must be a 2-letter state code',
  },
  zipCode: isValidZipCode,
  ipAddress: isValidIPv4,
};

const shippingValidator = new Validator(shippingSchema);

const shippingAddress = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+14155551234',
  address: '123 Main Street',
  city: 'San Francisco',
  state: 'CA',
  zipCode: '94102',
  ipAddress: '192.168.1.1',
};

const addressErrors = shippingValidator.validate(shippingAddress);
console.log('Shipping validation:', addressErrors.length === 0 ? 'Valid' : 'Invalid');
// Shipping validation: Valid
```

---

## Schema Examples

### User Profile Schema

```typescript
const userProfileSchema = {
  username: {
    fn: (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
    message: 'Username must be 3-20 characters, alphanumeric',
  },
  displayName: {
    ...validators.minLength(1),
    ...validators.maxLength(50),
    message: 'Display name must be 1-50 characters',
  },
  bio: {
    fn: (v: string) => v.length <= 500,
    message: 'Bio cannot exceed 500 characters',
  },
  website: {
    fn: (v: string) => !v || /^https?:\/\/.+/.test(v),
    message: 'Website must be a valid URL starting with http:// or https://',
  },
  birthYear: {
    ...validators.min(1900),
    ...validators.max(new Date().getFullYear()),
    message: 'Invalid birth year',
  },
};
```

### E-commerce Order Schema

```typescript
const orderSchema = {
  customerId: validators.required,
  items: {
    fn: (v: any[]) => Array.isArray(v) && v.length > 0,
    message: 'Order must contain at least one item',
  },
  shippingAddress: validators.required,
  paymentMethod: {
    fn: (v: string) => ['credit_card', 'debit_card', 'paypal', 'bank_transfer'].includes(v),
    message: 'Invalid payment method',
  },
  subtotal: {
    ...validators.min(0),
    message: 'Subtotal cannot be negative',
  },
  tax: {
    ...validators.min(0),
    message: 'Tax cannot be negative',
  },
  shippingCost: {
    ...validators.min(0),
    message: 'Shipping cost cannot be negative',
  },
  total: {
    fn: (v: number, data: any) => v === data.subtotal + data.tax + data.shippingCost,
    message: 'Total does not match sum of subtotal, tax, and shipping',
  },
  couponCode: {
    fn: (v: string) => !v || /^[A-Z0-9]{4,20}$/.test(v),
    message: 'Invalid coupon code format',
  },
};
```

### Settings Configuration Schema

```typescript
const settingsSchema = {
  theme: {
    fn: (v: string) => ['light', 'dark', 'system'].includes(v),
    message: 'Theme must be light, dark, or system',
  },
  language: {
    fn: (v: string) => /^[a-z]{2}(-[A-Z]{2})?$/.test(v),
    message: 'Language must be a valid locale code (e.g., en, en-US)',
  },
  notifications: {
    email: { ...validators.email, message: 'Invalid notification email' },
    push: {
      fn: (v: boolean) => typeof v === 'boolean',
      message: 'Push notifications must be true or false',
    },
    frequency: {
      fn: (v: string) => ['instant', 'daily', 'weekly', 'monthly'].includes(v),
      message: 'Invalid frequency option',
    },
  },
  privacy: {
    profileVisibility: {
      fn: (v: string) => ['public', 'private', 'friends'].includes(v),
      message: 'Invalid visibility setting',
    },
    showEmail: {
      fn: (v: boolean) => typeof v === 'boolean',
      message: 'Show email must be true or false',
    },
    showActivity: {
      fn: (v: boolean) => typeof v === 'boolean',
      message: 'Show activity must be true or false',
    },
  },
};
```

---

## API Reference

### Types

#### ValidationError

```typescript
interface ValidationError {
  field: string;    // The name of the field that failed validation
  message: string;  // Human-readable error message
}
```

#### Schema

```typescript
interface Schema {
  [key: string]: Validator;  // Field name to Validator mapping
}
```

#### Validator

```typescript
interface Validator {
  fn: (value: any, data?: Record<string, any>) => boolean;  // Validation function
  message: string;  // Error message when validation fails
}
```

### Classes

#### Validator

The main class for creating validation instances.

##### Constructor

```typescript
constructor(schema: Schema)
```

Creates a new Validator instance with the given schema.

**Parameters:**
- `schema` - An object mapping field names to Validator functions

**Example:**
```typescript
const validator = new Validator({
  email: validators.email,
  name: validators.required,
});
```

##### Methods

###### validate

```typescript
validate(data: Record<string, any>): ValidationError[]
```

Validates the provided data against the schema.

**Parameters:**
- `data` - An object containing the values to validate

**Returns:**
- An array of ValidationError objects. Empty array means validation passed.

**Example:**
```typescript
const errors = validator.validate({ email: 'test@example.com', name: 'John' });
if (errors.length === 0) {
  // Validation passed
} else {
  // Handle errors
  errors.forEach(err => console.log(`${err.field}: ${err.message}`));
}
```

### Validators Object

The built-in validators exported from the module.

```typescript
import { validators } from 'valid8or';
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `required` | Validator | Ensures value is not null, undefined, or empty |
| `email` | Validator | Validates email format |

#### Methods (Curried)

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `min(n)` | `n: number` | Validator | Validates minimum numeric value |
| `max(n)` | `n: number` | Validator | Validates maximum numeric value |
| `minLength(n)` | `n: number` | Validator | Validates minimum string length |
| `maxLength(n)` | `n: number` | Validator | Validates maximum string length |
| `pattern(re)` | `re: RegExp` | Validator | Validates against a regular expression |

---

## TypeScript Support

Valid8or is written in TypeScript and provides full type definitions out of the box:

```typescript
import { validators, Validator, Schema, ValidationError } from 'valid8or';

// Fully typed schema
interface UserRegistration {
  username: string;
  email: string;
  password: string;
  age: number;
}

const userSchema: Schema = {
  username: {
    fn: (v: string) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
    message: 'Invalid username',
  },
  email: validators.email,
  password: {
    fn: (v: string) => v.length >= 8,
    message: 'Password too short',
  },
  age: {
    fn: (v: number) => v >= 18,
    message: 'Must be 18 or older',
  },
};

const userValidator = new Validator(userSchema);

// Type-safe validation
const result: ValidationError[] = userValidator.validate({
  username: 'johndoe',
  email: 'john@example.com',
  password: 'securepass123',
  age: 25,
});

// Result is fully typed
result.forEach((error: ValidationError) => {
  console.log(`${error.field}: ${error.message}`);
});
```

---

## Best Practices

### 1. Reuse Schemas

Define schemas once and reuse them across your application:

```typescript
// schemas/user.ts
export const userSchema = {
  email: validators.email,
  name: validators.required,
};

// In form component
import { userSchema } from './schemas/user';
const formValidator = new Validator(userSchema);

// In API middleware
import { userSchema } from './schemas/user';
const apiValidator = new Validator(userSchema);
```

### 2. Provide Clear Error Messages

Always provide descriptive error messages for custom validators:

```typescript
// ❌ Unclear
{ fn: (v: string) => v.length >= 8, message: 'Invalid' }

// ✅ Clear
{ fn: (v: string) => v.length >= 8, message: 'Password must be at least 8 characters long' }
```

### 3. Validate on Both Client and Server

Always validate on the server even if you validate on the client:

```typescript
// Client-side: Immediate feedback
const clientErrors = formValidator.validate(formData);

// Server-side: Security and data integrity
const serverErrors = apiValidator.validate(req.body);
if (serverErrors.length > 0) {
  return res.status(400).json({ errors: serverErrors });
}
```

### 4. Compose Validators for Reusability

Create reusable validator factories:

```typescript
const emailRequired = {
  ...validators.required,
  message: 'Email is required',
};

const emailValid = {
  ...validators.email,
  message: 'Please enter a valid email',
};

const schema = {
  primaryEmail: {
    ...emailRequired,
    fn: (v: string) => v.includes('@'), // Additional check
  },
  secondaryEmail: emailValid, // Optional email only needs to be valid
};
```

### 5. Group Related Fields in Schemas

Keep schemas organized and maintainable:

```typescript
const complexSchema = {
  // Personal info
  firstName: validators.required,
  lastName: validators.required,
  email: validators.email,
  
  // Address
  street: validators.required,
  city: validators.required,
  zipCode: validators.pattern(/^\d{5}$/),
  
  // Payment
  cardNumber: customValidators.creditCard,
  expiryDate: customValidators.expiryDate,
};
```

---

## License

MIT License

Copyright (c) 2024 Valid8or Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<div align="center">

**Built with ❤️ using TypeScript**

[Back to top](#valid8or)

</div>
