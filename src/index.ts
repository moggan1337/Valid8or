export interface ValidationError { field: string; message: string; }
export interface Schema { [key: string]: Validator; }
export interface Validator { (v: any): boolean; message: string; }

export const validators = {
  required: (v: any) => v !== null && v !== undefined && v !== '', message: 'Required',
  email: (v: string) => /^.+@.+\..+/.test(v), message: 'Invalid email',
  min: (n: number) => (v: number) => v >= n,
  max: (n: number) => (v: number) => v <= n,
  minLength: (n: number) => (v: string) => v.length >= n,
  maxLength: (n: number) => (v: string) => v.length <= n,
  pattern: (re: RegExp) => (v: string) => re.test(v),
};

export class Validator {
  constructor(private schema: Schema) {}

  validate(data: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];
    for (const [field, validator] of Object.entries(this.schema)) {
      if (!validator(data[field])) errors.push({ field, message: validator.message });
    }
    return errors;
  }
}
export default Validator;
