"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

const FormSubmitComponent = ({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementInstance[];
}) => {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});

  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) return false;

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });

      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong!",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-dark-900 text-white w-full p-8 overflow-y-auto border border-dark-700 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-green-500">Form Submitted to us</h1>
          
          <p className="text-muted-foreground">
            Thank you for submitting the form. You can close this page now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full h-full items-center p-8 bg-dark-800">
      <div key={renderKey} className="max-w-[620px] flex flex-col gap-6 flex-grow bg-dark-900 text-white w-full p-8 overflow-y-auto border border-dark-700 shadow-lg rounded-lg">
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}

        <Button
          className="mt-6 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-all ease-in-out duration-200"
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={pending}
        >
          {!pending ? (
            <>
              <HiCursorClick className="mr-2" />
              Submit
            </>
          ) : (
            <ImSpinner2 className="animate-spin" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormSubmitComponent;
