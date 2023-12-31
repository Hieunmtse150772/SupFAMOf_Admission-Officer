import { styled, TextField, TextFieldProps } from "@mui/material";

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  "& .MuiOutlinedInput-input": {
    fontWeight: 500,
    color: theme.palette.text.primary,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "8px",
    border: "2px solid",
    borderColor:
      theme.palette.mode === "light"
        ? theme.palette.secondary[300]
        : theme.palette.divider,
  },
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary[300],
  },
  "& .MuiInputBase-root": {
    padding: '0px 0px 0px 10px',
    height: '40px'
  }
}));

const LightTextField = (props: TextFieldProps) => {
  return <StyledTextField {...props} />;
};

export default LightTextField;
