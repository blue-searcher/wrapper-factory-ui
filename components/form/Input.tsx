import TextField from '@mui/material/TextField';


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
  placeholder
}: Props) {
  return (
    <>
      <TextField 
        label={label} 
        variant={variant} 
        placeholder={placeholder}
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        {...field}
      />
      {touched[field.name] && errors[field.name] && (
        <div className="invalid-feedback">{errors[field.name]}</div>
      )}
    </>
  );
}
