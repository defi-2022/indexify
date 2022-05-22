import { Alert, Spinner, Text, Link } from "@chakra-ui/react";
import { useCurrentNetwork } from "../hooks";

interface DeploymentStatusProps {
  status:
    | "None"
    | "PendingSignature"
    | "Mining"
    | "Success"
    | "Fail"
    | "Exception";
  receipt?: any;
}
const TxStatus = ({ status, receipt }: DeploymentStatusProps) => {
  const CurrentNetwork = useCurrentNetwork();
  if (status === "None") {
    return null;
  }
  if (status === "PendingSignature") {
    return (
      <Alert status="info" borderRadius={12} justifyContent="space-between">
        <Text>
          Your transaction is pending signature. Please confirm or cancel the
          transaction from your wallet
        </Text>
        <Spinner size="xs" />
      </Alert>
    );
  }
  if (status === "Mining") {
    return (
      <Alert status="info" borderRadius={12} justifyContent="space-between">
        <Text>
          Your transaction is being mined. Please wait for confirmation
        </Text>
        <Spinner size="xs" />
      </Alert>
    );
  }
  if (status === "Success") {
    const address = receipt?.events?.find(
      (e: any) => e.event === "LogDeployedIndexContract"
    ).args[0];
    return (
      <>
        <Alert
          status="success"
          borderRadius={12}
          justifyContent="space-between"
        >
          <Text>Your transaction has been mined successfully</Text>
        </Alert>
        {address && (
          <Alert
            status="success"
            borderRadius={12}
            justifyContent="space-between"
            mt={4}
          >
            <Text>
              Your index contract has been deployed at{" "}
              <Link
                color="blue.500"
                target="_blank"
                href={CurrentNetwork.getExplorerAddressLink(address)}
              >
                {address}
              </Link>
            </Text>
          </Alert>
        )}
      </>
    );
  }
  if (status === "Fail") {
    return (
      <Alert status="error" borderRadius={12} justifyContent="space-between">
        <Text>Your transaction has failed</Text>
      </Alert>
    );
  }
  if (status === "Exception") {
    return (
      <Alert status="error" borderRadius={12} justifyContent="space-between">
        <Text>Your transaction has failed due to an exception</Text>
      </Alert>
    );
  }
  return null;
};

export default TxStatus;
