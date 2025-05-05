import { handleLogin } from "../api/authApi";
import Cookies from "js-cookie";

const submit = async (
  email,
  password,
  setErr,
  setIsLoading,
  setSuccess,
  router
) => {
  if (!email || !password) {
    setErr("Please fill in all required fields.");
    return;
  }

  try {
    setIsLoading(true);

    const loginResponse = await handleLogin(email, password);

    if (loginResponse.status === 200) {
      console.log("Login successful! Access token received.");

      Cookies.set("access", loginResponse.data.accessToken);
      Cookies.set("refresh", loginResponse.data.refreshToken);
      setSuccess("Login successful! Redirecting...");

      router.replace("/dashboard/overview");
    }

    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    if (error.response && error.response.data && error.response.data.errors) {
      const errMsg = error.response.data.errors[0]?.detail;
      setErr(
        errMsg === "Invalid email or password"
          ? "Incorrect email or password."
          : errMsg
      );
    } else {
      setErr("An error occurred. Please try again.");
    }
  }
};

export default submit;
