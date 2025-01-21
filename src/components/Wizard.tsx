import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AboutMe from "./FormFields/AboutMe";
import AddressForm from "./FormFields/AddressForm";
import BirthdatePicker from "./FormFields/BirthdatePicker";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface UserData {
  email: string;
  password: string;
  about_me: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  birthdate: string;
}

const fieldMapping: { [key: string]: keyof UserData } = {
  AboutMe: "about_me",
  AddressForm: "street_address",
  BirthdatePicker: "birthdate",
};

const Wizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<{ [key: number]: string[] }>({ 2: [], 3: [] });
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
    about_me: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
    birthdate: "",
  });
  const [isStepValid, setIsStepValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ["Email & Password", "Personal Information I", "Personal Information II"];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const fetchConfigAndUser = async () => {
      try {
        const configResponse = await axios.get(`${backendUrl}/api/admin/config`);
        setConfig(configResponse.data);

        const email = localStorage.getItem("user_email");
        if (email) {
          const stepResponse = await axios.get(`${backendUrl}/api/onboarding/step/${email}`);
          setCurrentStep(stepResponse.data.current_step);

          const userResponse = await axios.get(`${backendUrl}/api/onboarding/step/${email}`);
          setUserData((prev) => ({
            ...prev,
            email,
            ...userResponse.data,
          }));
        }
      } catch (err) {
        console.error("Error fetching config or user data:", err);
      }
    };

    fetchConfigAndUser();
  }, []);

  const validateCurrentStep = useCallback(() => {
    if (currentStep === 2 || currentStep === 3) {
      const requiredFields = config[currentStep] || [];
      const isValid = requiredFields.every((field) => {
        const mappedField = fieldMapping[field];
        if (!mappedField) return true;
        const value = userData[mappedField];
        return typeof value === "string" && value.trim() !== "";
      });
      setIsStepValid(isValid);
    }
  }, [currentStep, config, userData]);

  useEffect(() => {
    validateCurrentStep();
  }, [currentStep, userData, validateCurrentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async () => {
    try {
      const loginResponse = await axios.post(`${backendUrl}/api/onboarding/login`, {
        email: userData.email,
        password: userData.password,
      });

      const { current_step, user_data } = loginResponse.data;
      setUserData((prev) => ({ ...prev, ...user_data }));
      setCurrentStep(current_step);
      localStorage.setItem("user_email", userData.email);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          try {
            const registerResponse = await axios.post(`${backendUrl}/api/onboarding/register`, {
              email: userData.email,
              password: userData.password,
            });

            if (registerResponse.status === 201) {
              setCurrentStep(2);
              localStorage.setItem("user_email", userData.email);
              setError(null);
              return;
            }
          } catch (registerErr) {
            setError("Failed to register. Please try again.");
            throw registerErr;
          }
        } else if (err.response?.status === 401) {
          setError("Incorrect password. Please try again.");
        } else {
          setError("Failed to log in. Please try again.");
        }
      } else {
        setError("An unexpected error occurred.");
      }
      throw err;
    }
  };

  const saveUserData = async () => {
    try {
      await axios.post(`${backendUrl}/api/onboarding/update`, userData);
    } catch (err) {
      setError("Failed to save user data.");
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      await saveUserData();
      alert("Data submitted successfully!");
      localStorage.removeItem("user_email");
      setError(null);
    } catch (err) {
      setError(`Failed to submit data. ${err}`);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isEmailValid = emailRegex.test(userData.email);
      const isPasswordValid = userData.password.length >= 6;

      if (!isEmailValid) {
        setError("Please enter a valid email address.");
        return;
      }
      if (!isPasswordValid) {
        setError("Password must be at least 6 characters.");
        return;
      }

      try {
        await handleRegistration();
      } catch (err) {
        console.error("Error during registration or login:", err);
        return;
      }
    }

    if (currentStep === 2 || currentStep === 3) {
      const requiredFields = config[currentStep] || [];
      const isValid = requiredFields.every((field) => {
        const mappedField = fieldMapping[field];
        if (!mappedField) return true;
        const value = userData[mappedField];
        return typeof value === "string" && value.trim() !== "";
      });

      if (!isValid) {
        setError("Please fill out all required fields.");
        return;
      }

      try {
        await saveUserData();
      } catch (err) {
        console.error("Error saving user data:", err);
        return;
      }
    }

    try {
      const nextStep = Math.min(currentStep + 1, 3);
      setCurrentStep(nextStep);
      setError(null);
    } catch (err) {
      console.error("Error moving to the next step:", err);
      setError("Failed to proceed to the next step. Please try again.");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mb-4">Step 1: Email and Password</h2>
          <div className="grid grid-cols-2 gap-6">
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input px-3 py-4 border bg-gray-200 rounded-lg placeholder-gray-500 text-xl"
                value={userData.email}
                onChange={handleInputChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="input px-3 py-4 border bg-gray-200 rounded-lg placeholder-gray-500 text-xl"
                value={userData.password}
                onChange={handleInputChange}
            />
          </div>
        </div>
      );
    }

    const components = config[currentStep] || [];
    return (
      <div className="flex flex-col gap-6">
        {components.includes("AboutMe") && (
          <AboutMe name="about_me" onChange={handleInputChange} value={userData.about_me} />
        )}
        {components.includes("AddressForm") && (
          <AddressForm
            onChange={handleInputChange}
            values={{
              street_address: userData.street_address,
              city: userData.city,
              state: userData.state,
              zip: userData.zip,
            }}
          />
        )}
        {components.includes("BirthdatePicker") && (
          <BirthdatePicker name="birthdate" onChange={handleInputChange} value={userData.birthdate} />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-[1000px]">
      <h1 className="text-3xl font-semibold">Onboarding Wizard</h1>
      {/* Progress Bar */}
      <div className="relative w-full bg-gray-200 h-4 rounded-full -mb-4">
        <motion.div
          className="absolute top-0 left-0 h-4 bg-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      {/* Steps Display */}
      <div className="flex justify-between text-gray-700 text-xl">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`${
              currentStep === index + 1
                ? "text-green-700 font-bold"
                : currentStep > index + 1
                ? "text-green-500"
                : ""
            }`}
          >
            {step}
          </div>
        ))}
      </div>
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
      >
        {renderStep()}
      </motion.div>
      <div className="flex gap-6 mt-4">
        <button 
            onClick={prevStep} 
            disabled={currentStep === 1} 
            className="btn px-10 py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xl font-semibold"
          >
          Back
        </button>
        {currentStep === 3 ? (
          <button 
            onClick={handleSubmit} 
            disabled={!isStepValid} 
            className="btn px-10 py-4 bg-green-800 hover:bg-green-700 text-white rounded-lg text-xl font-semibold"
          >
            Submit
          </button>
        ) : (
          <button 
            onClick={nextStep} 
            className="btn px-10 py-4 bg-green-800 hover:bg-green-700 text-white rounded-lg text-xl font-semibold"
          >
            Next
          </button>
        )}
      </div>
      {error && <p className="text-xl text-red-500">{error}</p>}
    </div>
  );
};

export default Wizard;
