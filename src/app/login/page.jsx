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
  // Use `useField` for email input
  const emailField = useField("", (value) => emailPattern.test(value));
  const passwordField = useField("", (value) => passwordPattern.test(value));

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleLogin = () => {
    router.push("/dashboard/overview");
  };

  return (
    <div className="page-row xxl:!text-[24px] lg:!text-[16px] md:!text-[12px] sm:!text-[10px] xs:!text-[8px] !text-[6px]">
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
          <p className="text-txt text-[3em] font-bold font-titillium-web ">
            Another Slogan!
          </p>
        </div>
        <div className="col w-full !items-start z-10 gap-[1em]  ">
          <Row
            text="Advice number one, conseil numéro un, Ratschlag Nummer Eins."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="Advice number one, conseil numéro un, Ratschlag Nummer Eins."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="Advice number one, conseil numéro un, Ratschlag Nummer Eins."
            icon={<MdOutlineTextSnippet />}
          />
          <Row
            text="Advice number one, conseil numéro un, Ratschlag Nummer Eins."
            icon={<MdOutlineTextSnippet />}
          />
        </div>
      </div>

      <div className="page-col !w-1/2  px-[5em] gap-[1.5em] h-full  ">
        <div className="row gap-[1em] ">
          <p className="">LOGO</p>
          <p className="text-txt font-bold text-[1.75em] font-titillium-web ">
            GeoAlert
          </p>
        </div>
        <div className="col gap-[0.5em]">
          <p className="text-txt font-[600] text-[1.75em] font-titillium-web  ">
            Welcome Back
          </p>
          <p className="text-txt  text-[1em] font-titillium-web  ">
            Log in to access your account
          </p>
        </div>
        <div className="col gap-[1em] w-full ">
          <InputField
            label="Email"
            iconSrc={MdMailOutline}
            placeholder="Entrez votre email"
            inputType="text"
            isValid={
              !emailField.isValid && emailField.value && !emailField.focus
                ? false
                : true
            }
            onChange={(e) => emailField.setValue(e.target.value)}
            value={emailField.value}
            errorMessage="S'il vous plaît, entrez une adresse email valide"
            holderClassName=""
            containerClassName=" mb-[2em] "
            onFocus={() => emailField.setFocus(true)}
            onBlur={() => emailField.setFocus(false)}
          />

          <InputField
            label="Password"
            iconSrc={MdLockOutline}
            placeholder="Entrez votre mot de passe"
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
            errorMessage="S'il vous plaît, entrez un mot de passe valide"
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
