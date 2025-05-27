"use client";
import React, { useState } from "react";
import InputField from "@/Components/Global/InputField";
import {
  MdMailOutline,
  MdLockOutline,
  MdOutlineTextSnippet,
} from "react-icons/md";
import useField from "@/hooks/useField";
import Image from "next/image";
import { useRouter } from "next/navigation";
import submit from "@/lib/submit";
import StatusMessage from "@/Components/Global/StatusMessage";
import Spinner from "@/Components/Global/Spinner";

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//const passwordPattern = /^(?=.*\d)(?=.*[A-Z])[A-Za-z\d]{8,30}$/;
const passwordPattern = /^.{3,}$/;

const Row = ({ text, icon }) => {
  return (
    <div className="row gap-[1em] ">
      <p className=" text{1em} ">{icon}</p>
      <p className="text-txt ">{text}</p>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  // Use useField for email input
  const emailField = useField("", (value) => emailPattern.test(value));
  const passwordField = useField("", (value) => passwordPattern.test(value));
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleLogin = () => {
    const email = emailField.value;
    const password = passwordField.value;

    if (emailField.isValid && passwordField.isValid) {
      submit(email, password, setErr, setSuccess, setIsLoading, router);
    } else {
      setErr("Please fill in all required fields.");
    }
  };

  return (
    <div className="page-row xxl:!text-[24px] lg:!text-[16px] md:!text-[12px] sm:!text-[10px] xs:!text-[8px] !text-[6px]">
      <StatusMessage
        isLoading={isLoading}
        success={success}
        error={err}
        hideAlert={() => {
          setErr("");
          setSuccess("");
        }}
      />
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-white bg-opacity-50">
          <Spinner />
        </div>
      )}

      <div className="page-col !w-1/2 px-[2.5em] relative overflow-hidden h-full gap-[1.5em] ">
        <Image
          src="/SignInImg.jpeg"
          alt="Login Image"
          fill
          className="object-cover opacity-15 absolute"
        />

        <div className="col w-full !items-start z-10 leading-[3.5em] ">
          <p className="text-main text-[3em] font-bold font-titillium-web ">
            Stay Alert. Stay Ahead.
          </p>
          <p className="text-txt text-[3em] font-bold font-titillium-web ">
            Navigate with Confidence.
          </p>
        </div>
        <div className="col w-full !items-start z-10 gap-[1em]  ">
          <Row
            text="This app helps you monitor alerts and notify impacted users in real time."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="Track user sentiment to understand how people react to specific alerts."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="Manage notification cooldowns to avoid spamming and maintain user trust."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="View detailed alert statistics to improve response efficiency and decision-making."
            icon={<MdOutlineTextSnippet />}
          />
        </div>
      </div>

      <div className="page-col !w-1/2  px-[5em] gap-[1.5em] h-full  ">
        <div className="row gap-[1em]">
          <div className="">
            <Image src="/login_bg.PNG" alt="" width={90} height={90} />
          </div>
          <div className=" flex flex-col justify-center items-center ">
            <div>
              <p className="text-txt font-bold text-[1.75em] font-titillium-web ">
                GeoAlert
              </p>
            </div>
            <p className="text-txt font-[600] text-[1.75em] font-titillium-web  ">
              Welcome Back
            </p>
            <p className="text-txt  text-[1em] font-titillium-web  ">
              Log in to access your account
            </p>
          </div>
        </div>

        <div className="col gap-[1em] w-full ">
          <InputField
            label="Email"
            iconSrc={MdMailOutline}
            placeholder="Enter your email"
            inputType="text"
            isValid={
              !emailField.isValid && emailField.value && !emailField.focus
                ? false
                : true
            }
            onChange={(e) => emailField.setValue(e.target.value)}
            value={emailField.value}
            errorMessage="Please enter a valid email address"
            holderClassName=""
            containerClassName=" mb-[2em] "
            onFocus={() => emailField.setFocus(true)}
            onBlur={() => emailField.setFocus(false)}
          />

          <InputField
            label="Password"
            iconSrc={MdLockOutline}
            placeholder="Enter your password"
            inputType="password"
            isValid={
              !passwordField.isValid &&
              passwordField.value &&
              !passwordField.focus
                ? false
                : true
            }
            onChange={(e) => passwordField.setValue(e.target.value)}
            value={passwordField.value}
            errorMessage="Please enter a valid password"
            holderClassName=""
            containerClassName=" mb-[2em] "
            onFocus={() => passwordField.setFocus(true)}
            onBlur={() => passwordField.setFocus(false)}
          />
          <div className="flex w-full items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="h-4 w-4 cursor-pointer accent-main"
            />
            <label
              htmlFor="rememberMe"
              className="text-[1em] text-txt cursor-pointer font-medium"
            >
              Remember Me
            </label>
          </div>
          <button onClick={handleLogin} className="btn-primary w-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
