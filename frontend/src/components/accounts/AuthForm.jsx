import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";

const AuthForm = ({ type, role = "jobseeker" }) => {
  const authType = type;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authType === "register") {
        const response = await api.post("/accounts/users/", {
          first_name: firstName,
          last_name: lastName,
          email: email,
          username: username,
          password: password,
          role: role,
        });
        console.log(response, " ", response.data);
        if (response.status === 201) {
          console.log(response.data, "response.data");
          const accessToken = response.data.access
          const refreshToken = response.data.refresh
          localStorage.setItem(ACCESS_TOKEN, accessToken)
          localStorage.setItem(REFRESH_TOKEN, refreshToken)
          navigate("/");
        }
      } else if (authType === "login") {
        const response = await api.post("/accounts/jwt/create/", {
          username: email,
          password: password,
        });
        if (response.status === 200) {
          const accessToken = response.data.access;
          const refreshToken = response.data.refresh;
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
          console.log(accessToken, " ", refreshToken);
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <section className="flex items-center h-full dark:bg-gray-50 dark:text-gray-800">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <Card color="transparent" shadow={false}>
            <Typography variant="h4" color="blue-gray">
              {authType === "register" ? "Register" : "Login"}
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              {authType === "register"
                ? "Nice to meet you! Let's get started."
                : "Welcome Back!"}
            </Typography>
            <form
              className="mt-4 mb-2 w-80 max-w-screen-lg sm:w-96"
              onSubmit={handleSubmit}
            >
              {/* <div className="mb-1 flex flex-col gap-3"> */}
                {authType === "register" && (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                        >
                          First Name
                        </Typography>
                        <Input
                          size="md"
                          placeholder="First Name"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Typography
                          variant="h6"
                          color="blue-gray"
                        >
                          Last Name
                        </Typography>
                        <Input
                          size="md"
                          placeholder="Last Name"
                          className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                          labelProps={{
                            className: "before:content-none after:content-none",
                          }}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                    >
                      Username
                    </Typography>
                    <Input
                      size="md"
                      placeholder="Username"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </>
                )}
                <Typography variant="h6" color="blue-gray">
                  Email
                </Typography>
                <Input
                  size="md"
                  type="email"
                  placeholder="example@rojgardata.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              <div className={authType === 'register' ? 'grid grid-cols-2 gap-6' : ''}>
                <div>
                  <Typography
                    variant="h6"
                    color="blue-gray"
                  >
                    Password
                  </Typography>
                  <Input
                    size="md"
                    type="password"
                    placeholder="Password"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {authType === "register" && (
                  <div>
                    <Typography
                      variant="h6"
                      color="blue-gray"
                    >
                      Confirm Password
                    </Typography>
                    <Input
                      size="md"
                      type="password"
                      placeholder="Confirm Password"
                      className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {authType === "register" ? (
                <Checkbox
                  label={
                    <Typography
                      variant="small"
                      color="gray"
                      className="flex items-center font-normal"
                    >
                      I agree the Terms and Conditions
                    </Typography>
                  }
                  containerProps={{ className: "-ml-2.5" }}
                />
              ) : (
                <>
                  <Link
                    to="#"
                    className="text-sm text-gray-600 hover:underline mx-auto my-2 block"
                  >
                    Forgot password?
                  </Link>
                </>
              )}
              <Button size="md" className="w-full" type="submit" disabled={loading}>
                {authType === "register" ? "Register" : "Login"}
              </Button>
            {/* </div> */}
            </form>
            <Typography color="gray" className="mt-2 text-center font-normal">
              {authType === "register"
                ? "Already have an account? "
                : "Don't have an account? "}
              <Link
                to={authType === "register" ? "/login" : "/jobseeker/register"}
                className="font-medium text-blue-900 transition-colors hover:text-gray-900"
              >
                {authType === "register" ? "Login" : "Register"}
              </Link>
            </Typography>
          </Card>
        </div>
      </section>
    </>
  );
}

export default AuthForm;
