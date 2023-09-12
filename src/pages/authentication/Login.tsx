import {
  Box,
  Card
} from "@mui/material";
import { useAppDispatch } from "app/store";
import background from "assets/background/dai-hoc-fpt-tp-hcm-2.jpg";
import FlexBox from "components/FlexBox";
import { H1, Small } from "components/Typography";
import {
  SocialIconButton
} from "components/authentication/StyledComponents";
import { loginGoogle } from "features/authSlice";
import GoogleIcon from "icons/GoogleIcon";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.scss';
const Login: FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('user') ? true : false

  const loginWithGoogle = async () => {
    try {
      if (isAuthenticated) {
        navigate('/')
      } else {
        const result = await dispatch(loginGoogle())
        if (result) {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      if (error instanceof Error) setError(error.message);
    }

  }
  return (
    <FlexBox
      sx={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: { sm: "100%" },

      }}
      style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'none', backgroundSize: "100%" }}
    >
      <Card sx={{ padding: 4, width: 650, boxShadow: 10, backgroundColor: 'rgba(255, 255, 255, 0.8)' }} >
        <FlexBox
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          mb={5}
          margin={5}
        >
          <Box width={100} mb={3}>
            <img src="/static/logo/supfamof_logo.png" width="100%" alt="Uko Logo" />
          </Box>
          <H1 fontSize={24} fontWeight={600}>
            Sign In to SupFAmOf
          </H1>
        </FlexBox>

        <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem" margin={10} alignItems={'center'}
        >
          <SocialIconButton
            className="button-login"
            onClick={() => loginWithGoogle()}
            startIcon={<GoogleIcon sx={{ mr: 1 }} />}
          >
            Sign in with Google
          </SocialIconButton>

          <Small className="noted-text" justifyContent="space-between" alignItems={'center'} mt={3} color="text.disabled">
            Sign in with fe.edu.vn mail
          </Small>
        </FlexBox>
      </Card>
    </FlexBox>
  );
};

export default Login;
