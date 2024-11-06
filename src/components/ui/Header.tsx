// @ts-nocheck 

"use client";

import Link from "next/link";
import Image from 'next/image'

// controller imports
import { useEffect, useState } from "react"
import { StarknetProvider } from "@/controller/StarknetProvider"
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import CartridgeConnector from "@cartridge/connector"

// controller integration
export function ConnectWallet() {
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { address } = useAccount();

	const connector = connectors[0] as unknown as CartridgeConnector;

	const [username, setUsername] = useState<string>();
	useEffect(() => {
		if (!address) return;
		connector.username()?.then((n) => setUsername(n));
	}, [address, connector]);

	return (
		<div>
			{address && (
				<>
					<p>Account: {address} </p>
					{username && <p>Username: {username}</p>}
				</>
			)}

			<Link
				className="btn text-black hover:bg-black-600 w-full shadow-sm text-2xl"
				onClick={() => {
					address ? disconnect() : connect({ connector });
				}}
				href={""}
			>
				{address ? "Disconnect" : "Connect"}
			</Link>
		</div>
	);
}

export default function Header({ nav = true }: { nav?: boolean }) {
	return (
		<div className="absolute top-4 right-8">
			<StarknetProvider>
				<ConnectWallet></ConnectWallet>
			</StarknetProvider>
		</div>
	);
}