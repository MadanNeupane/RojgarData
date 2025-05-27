import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner"; // assuming you installed/created this

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
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <section className="flex items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container flex flex-col items-center justify-center px-4 mx-auto">
        <Card className="w-full max-w-md p-6">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
              {authType === "register" ? "Register" : "Login"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {authType === "register"
                ? "Nice to meet you! Let's get started."
                : "Welcome back!"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {authType === "register" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Username"
                      onChange={(e) => setUsername(e.target.value)}
                    />
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
              </div>

              <div className={authType === "register" ? "grid grid-cols-2 gap-4" : ""}>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {authType === "register" && (
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm Password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {authType === "register" ? (
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
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
