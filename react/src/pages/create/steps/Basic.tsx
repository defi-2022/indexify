import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Field, Formik, FormikProps } from "formik";

interface StepProps {
  activeStep: number;
  nextStep: () => void;
  prevStep: () => void;
  reset?: () => void;
  stepsLength: number;
  onSubmit: (values: any) => void;
}

export default function Basic({
  activeStep,
  nextStep,
  prevStep,
  reset,
  stepsLength,
  onSubmit,
}: StepProps) {
  const bg = useColorModeValue("gray.100", "gray.700");

  const validate = {
    name: (value: string) => {
      if (!value) {
        return "Required";
      }
      if (value.length < 5) {
        return "Minimum  characters";
      }
      if (value.length > 50) {
        return "Maximum 50 characters";
      }
    },
    symbol: (value: string) => {
      if (!value) {
        return "Required";
      }
      if (value.length < 3) {
        return "Minimum 3 characters";
      }
      if (value.length > 5) {
        return "Maximum 5 characters";
      }
    },
  };

  return (
    <chakra.form pb={4}>
      <Formik
        initialValues={{ name: "", symbol: "" }}
        onSubmit={(values, actions) => {
          onSubmit({ ...values, symbol: values.symbol.toUpperCase() });
          nextStep();
        }}
      >
        {(props: FormikProps<any>) => (
          <>
            <Stack spacing={4}>
              <Field name="name" validate={validate.name}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    id="name"
                    isRequired
                    isInvalid={form.errors.name && form.touched.name}
                  >
                    <FormLabel>Name</FormLabel>
                    <Input {...field} type="text" variant="filled" />
                    <FormHelperText>The name of the fund</FormHelperText>
                    <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="symbol" validate={validate.symbol}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    id="symbol"
                    isRequired
                    isInvalid={form.errors.symbol && form.touched.symbol}
                  >
                    <FormLabel>Symbol</FormLabel>
                    <Input
                      {...field}
                      type="text"
                      textTransform="uppercase"
                      variant="filled"
                    />
                    <FormHelperText>
                      The $SYMBOL of the fund (Min: 3 chars, Max: 5 chars)
                    </FormHelperText>
                    <FormErrorMessage>{form.errors.symbol}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Stack>
            <Flex width="100%" justify="flex-end" mt={4}>
              <Button mr={4} onClick={prevStep} variant="ghost">
                Prev
              </Button>
              <Button
                variant="gradient"
                onClick={() => props.submitForm()}
                disabled={!!(props.errors.name || props.errors.symbol)}
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </Formik>
    </chakra.form>
  );
}
