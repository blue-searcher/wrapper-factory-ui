import { Input as MuiInput } from '@mui/material'
import { TextField } from '@mui/material'

type Field = {
  name: string
}

type FormikProps = {
  errors: any
  touched: any
}

interface Props {
  field: Field
  form: FormikProps
  variant: string
  label: string
  type: string
  placeholder: string | undefined
  startAdornment: React.ReactNode | undefined
  endAdornment: React.ReactNode | undefined
}

const getFieldCSSClasses = (touched, error) => {
  const classes = ["form-control"];
  if (touched && error) {
    classes.push("is-invalid");
  }

  return classes.join(" ");
};

export default function Input({
  field, 
  form: { touched, errors }, 
  label,
  variant = "standard",
  type,
  placeholder,
  startAdornment = undefined,
  endAdornment = undefined
}: Props) {
  return (
    <>
      <TextField 
        label={label} 
        variant={variant} 
        placeholder={placeholder}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        {...field}
      />
      {touched[field.name] && errors[field.name] && (
        <div className="invalid-feedback">{errors[field.name]}</div>
      )}
    </>
  );
}
