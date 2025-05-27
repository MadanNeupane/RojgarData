import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import loginImage from "../../assets/auth/login.svg";
import registerImage from "../../assets/auth/register.svg";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/ui/theme-toggle";


const AuthForm = ({ type, role = "jobseeker" }) => {
  const authType = type;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (authType === "register") {
      if (!firstName) newErrors.firstName = "First name is required.";
      if (!lastName) newErrors.lastName = "Last name is required.";
      if (!username) newErrors.username = "Username is required.";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (authType === "register") {
        const response = await api.post("/accounts/users/", {
          first_name: firstName,
          last_name: lastName,
          email,
          username,
          password,
          role,
        });
        if (response.status === 201) {
          const accessToken = response.data.access;
          const refreshToken = response.data.refresh;
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
          navigate("/");
        }
      } else if (authType === "login") {
        const response = await api.post("/accounts/jwt/create/", {
          username: email,
          password,
        });
        if (response.status === 200) {
          const accessToken = response.data.access;
          const refreshToken = response.data.refresh;
          localStorage.setItem(ACCESS_TOKEN, accessToken);
          localStorage.setItem(REFRESH_TOKEN, refreshToken);
          navigate("/");
        }
      }
    } catch (error) {
      const message = error?.response?.data?.detail || "An error occurred. Please check your inputs.";
      setErrors({ form: message });
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <section className="flex flex-col lg:flex-row items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hidden lg:block w-1/2 p-8">
        <img
          src={authType === "register" ? registerImage : loginImage}
          alt={`${authType} illustration`}
          className="w-full h-auto"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 py-8">
        {/* <ThemeToggle /> */}

        <Card className="w-full max-w-md p-6 shadow-xl border border-gray-200 dark:border-gray-700">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {authType === "register" ? "Register" : "Login"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {authType === "register"
                ? "Nice to meet you! Let's get started."
                : "Welcome back!"}
            </p>

            {errors.form && (
              <p className="text-sm text-red-500 mb-2">{errors.form}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authType === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="e.g. John"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="e.g. Doe"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="e.g. johndoe123"
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@rojgardata.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className={authType === "register" ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                {authType === "register" && (
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Repeat password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                )}
              </div>

              {authType === "register" ? (
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" className="border rounded-sm" />
                  <Label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the Terms and Conditions
                  </Label>
                </div>
              ) : (
                <Link
                  to="#"
                  className="text-sm text-gray-600 hover:underline block"
                >
                  Forgot password?
                </Link>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Processing...
                  </div>
                ) : (
                  authType === "register" ? "Register" : "Login"
                )}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-4">
              {authType === "register"
                ? "Already have an account? "
                : "Don't have an account? "}
              <Link
                to={authType === "register" ? "/login" : "/jobseeker/register"}
                className="text-blue-600 hover:underline"
              >
                {authType === "register" ? "Login" : "Register"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AuthForm;
