import {
  Avatar,
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
} from "@chakra-ui/react";
import { Field, Formik, FormikProps } from "formik";
import { useCurrentNetwork } from "../hooks";

interface InvestBoxProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
}
const InvestBox = ({ onSubmit, onCancel }: InvestBoxProps) => {
  const CurrentNetwork = useCurrentNetwork();
  const validate = {
    amount: (amount: number) => {
      if (!amount) {
        return "Required";
      }
      if (amount < 0) {
        return "Amount must be greater than 0";
      }
    },
  };

  return (
    <chakra.form pb={4} w="100%">
      <Formik
        initialValues={{ amount: 0 }}
        onSubmit={(values, actions) => {
          onSubmit(values);
        }}
      >
        {(props: FormikProps<any>) => (
          <>
            <Stack spacing={4} pt={4}>
              <Field name="amount" validate={validate.amount}>
                {({ field, form }: { field: any; form: any }) => (
                  <FormControl
                    id="amount"
                    isRequired
                    isInvalid={form.errors.amount && form.touched.amount}
                  >
                    <FormLabel fontSize={"sm"} fontWeight="bold">
                      <Avatar size="xs" src={CurrentNetwork.logo} mr={2} />
                      {CurrentNetwork.currencyInfo.symbol}
                    </FormLabel>
                    <NumberInput
                      {...field}
                      defaultValue={0}
                      min={0}
                      variant="filled"
                      onChange={(val) => form.setFieldValue(field.name, val)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{form.errors.amount}</FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Flex width="100%" justify="flex-end" mt={4}>
                <Button variant="outline" onClick={() => onCancel()}>
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  onClick={() => props.submitForm()}
                  disabled={!!(props.errors.amount || props.errors.symbol)}
                  ml={4}
                >
                  Add Funds
                </Button>
              </Flex>
            </Stack>
          </>
        )}
      </Formik>
    </chakra.form>
  );
};

export default InvestBox;
