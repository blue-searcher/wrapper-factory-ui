import { BigNumber } from "ethers";

interface Props {
	tokenSymbol: string
	tokenBalance: BigNumber
	tokenDecimals: number

	wrapperSymbol: string
	wrapperBalance: BigNumber
	wrapperDecimals: number
}

export default function UserBalances({
	tokenSymbol,
	tokenBalance,
	tokenDecimals,

	wrapperSymbol,
	wrapperBalance,
	wrapperDecimals,
}: Props) {
	return (
		<div className="container text-muted">
			<div className="row">
				<div className="col-6 text-left">{tokenSymbol + " balance"}</div>
				<div className="col-6 text-center">{tokenBalance ? tokenBalance.toString() : "0"}</div>
			</div>

			<div className="row">
				<div className="col-6 text-left">{wrapperSymbol + " balance"}</div>
				<div className="col-6 text-center">{wrapperBalance ? wrapperBalance.toString() : "0"}</div>
			</div>
		</div>
	);
}
