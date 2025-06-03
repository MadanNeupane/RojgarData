import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";
import loginImage from "../../assets/auth/login.svg";
import registerImage from "../../assets/auth/register.svg";

import {
  Card,
  CardContent,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Spinner } from "@/src/components/ui/spinner";
import Typewriter from "typewriter-effect";

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const validatePasswordStrength = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";

    if (authType === "register") {
      if (!firstName) newErrors.firstName = "First name is required.";
      if (!lastName) newErrors.lastName = "Last name is required.";
      if (!username) newErrors.username = "Username is required.";
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
      if (!validatePasswordStrength(password)) {
        newErrors.password = "Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.";
      }
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
          const { access, refresh } = response.data;
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);
          navigate("/");
        }
      } else {
        const response = await api.post("/accounts/jwt/create/", {
          username: email,
          password,
        });
        if (response.status === 200) {
          const { access, refresh } = response.data;
          localStorage.setItem(ACCESS_TOKEN, access);
          localStorage.setItem(REFRESH_TOKEN, refresh);
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
    <section className="flex flex-col lg:flex-row items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 p-10">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          {authType === "register" ? "Create your journey" : "Welcome back!"}
        </h1>
        <div className="text-xl text-gray-700 dark:text-gray-300 mb-4">
          <Typewriter
            options={{
              strings: authType === "register"
                ? ["Jobseeker or Employer?", "Build your future.", "Start exploring opportunities.", "Full control over employment."]
                : ["Log in to discover.", "New jobs every day.", "Get Salary Insights.", "Companies waiting for you!"],
              autoStart: true,
              loop: true,
              delay: 50,
            }}
          />
        </div>

        <img
          src={authType === "register" ? registerImage : loginImage}
          alt={`${authType} illustration`}
          className="w-2/3 mt-6"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 px-4 py-8">
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
                      <Input id="first-name" onChange={(e) => setFirstName(e.target.value)} />
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" onChange={(e) => setLastName(e.target.value)} />
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" onChange={(e) => setUsername(e.target.value)} />
                    {errors.username && <p className="text-xs text-red-500">{errors.username}</p>}
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className={authType === "register" ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                {authType === "register" && (
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                  </div>
                )}
              </div>

              {authType === "register" ? (
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" className="border rounded-sm" />
                  <Label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to the Terms and Conditions
                  </Label>
                </div>
              ) : (
                <Link to="#" className="text-sm text-gray-600 dark:text-gray-400 hover:underline block">
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

            <p className="text-center">
            { authType === "register" && role === "jobseeker" ? (
              <Link to="/employer/register" className="text-sm">
                Register as Employer
              </Link>
            ) : (
              <Link to="/jobseeker/register" className="text-sm">
                Register as Jobseeker
              </Link>
            )}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AuthForm;
