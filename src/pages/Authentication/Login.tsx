import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormCheckbox, ProFormText } from "@ant-design/pro-components";
import {
  Card
} from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Tabs, message, theme } from "antd";
import { useAppDispatch } from "app/store";
import background from "assets/background/dai-hoc-fpt-tp-hcm-2.jpg";
import FlexBox from "components/FlexBox";
import { Small } from "components/Typography";
import {
  SocialIconButton
} from "components/authentication/StyledComponents";
import AppConstants from "enums/app";
import { loginAdministrator, loginGoogle } from "features/authSlice";
import GoogleIcon from "icons/GoogleIcon";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.scss';

type LoginType = 'administration' | 'admissionOfficer';

const Login: FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  let navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem(AppConstants.USER))
  const { token } = theme.useToken();
  const [loginType, setLoginType] = useState<LoginType>('admissionOfficer');
  const loginWithGoogle = async () => {
    try {
      if (isAuthenticated) {
        navigate('/')
      } else {
        const result = await dispatch(loginGoogle())
        const user = unwrapResult(result)
        if (user.data.account.roleId === 1) {
          navigate('/dashboard');
        } else {
          message.warning('You have not permission to access!')
          navigate('/login');
        }
      }
    } catch (error) {
      message.warning('You have not permission to access!')
      if (error instanceof Error) setError(error.message);
    }
  }
  const handleLoginAdmin = async (value: any) => {
    console.log('lo cc')
    console.log('value: ', value)
    const payload = {
      username: value.username,
      password: value.password
    }
    await dispatch(loginAdministrator(payload)).then((response: any) => {
      // navigate('/')
      console.log('response: ', response);
      if (response.payload.status === 200) {
        localStorage.setItem(AppConstants.ACCESS_TOKEN, response.payload.data.data.accessToken);
        localStorage.setItem(AppConstants.USER, JSON.stringify(response.payload.data.data));
        message.success('Login successful.');
        console.log('response.payload.data.data.roleId: ', response.payload.data.data.roleId)
        if (response.payload.data.data.roleId === 3) {
          navigate('/administrator/dashboard');
        }
      } else {
        message.error('Username or password is not correct')
      }
    }).catch((error) => {
      message.error(error)
    })

  }
  return (
    <FlexBox
      sx={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: { sm: "100%" },
        width: '100%'
      }}
      style={{ backgroundImage: `url(${background})`, backgroundRepeat: 'none', backgroundSize: "100%" }}
    >
      <Card sx={{ padding: 4, width: 650, boxShadow: 10, height: 510 }} >
        <LoginForm

          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', }}
          logo={<img className="logo" src="/static/logo/supfamof_logo.png" alt="SupFAmOf Logo" />}
          // title={<span style={{ color: "#F09101" }}>SupFAmOf</span>}
          // subTitle={' Sign In to SupFAmOf'}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            render: (props) => (
              loginType === 'admissionOfficer' ? <></> : <Button type="primary" htmlType="submit" onClick={() => props.form?.submit()}>Login</Button>
            )
          }}
          onFinish={(formData) => handleLoginAdmin(formData)}
        >
          <Tabs
            centered
            activeKey={loginType}
            onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          >
            <Tabs.TabPane key={'admissionOfficer'} tab={'Admission Officer'} />
            <Tabs.TabPane key={'administration'} tab={'Administration'} />
          </Tabs>
          {
            loginType === 'administration' && (
              <>
                <ProFormText
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined rev={undefined} className={'prefixIcon'} />,
                  }}
                  placeholder={'Adminítration'}
                  rules={[
                    {
                      required: true,
                      message: 'User name is required!',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined rev={undefined} className={'prefixIcon'} />,
                  }}
                  placeholder={'Password'}
                  rules={[
                    {
                      required: true,
                      message: 'Password is required!',
                    },
                  ]}
                />
                <div
                  style={{
                    marginBlockEnd: 24,
                  }}
                >
                  <ProFormCheckbox noStyle name="autoLogin">
                    Save account?
                  </ProFormCheckbox>
                  <a
                    style={{
                      float: 'right',
                    }}
                  >
                    Forgot password!
                  </a>
                </div>
              </>
            )}
          {
            loginType === 'admissionOfficer' && (
              <>
                <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem" alignItems={'center'} style={{ display: 'flex' }}
                >
                  <SocialIconButton
                    className="button-login"
                    onClick={() => loginWithGoogle()}
                    startIcon={<GoogleIcon sx={{ mr: 1 }} />}
                    style={{ width: '230px' }}
                  >
                    <span>Sign in with Google</span>
                  </SocialIconButton>

                  <Small className="noted-text" justifySelf={"center"} margin={'auto'} color="text.disabled">
                    Sign in with fe.edu.vn mail
                  </Small>
                </FlexBox>
              </>
            )}
        </LoginForm>

      </Card>
    </FlexBox >
  );
};

export default Login;
