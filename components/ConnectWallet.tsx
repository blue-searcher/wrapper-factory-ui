import { ConnectKitButton } from "connectkit"
import Button from "react-bootstrap/Button"
import Spinner from "react-bootstrap/Spinner"

interface Props {
  variant: string,
  className: string | undefined
}

export default function ConnectWallet({
  variant = "outline-primary",
  className,
}: Props) {
  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, truncatedAddress, ensName }) => {
        return (
          <Button 
            onClick={show}
            variant={variant}
            className={className}
            disabled={isConnecting}
          > 
            {isConnecting && (
              <Spinner size="sm"/>
            )}

            {isConnected ? ensName ?? truncatedAddress : (isConnecting ? "" : "🦊 ") + "Connect Wallet"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  )
}