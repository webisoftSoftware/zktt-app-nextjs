"use client";

import Link from "next/link";
import Image from 'next/image'

// controller imports
import { useEffect, useState } from "react"
import { StarknetProvider } from "@/controller/StarknetProvider"
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core"
import ControllerConnector from '@cartridge/connector/controller'

// controller integration
export function ConnectWallet() {
	const { connect, connectors } = useConnect();
	const { disconnect } = useDisconnect();
	const { address } = useAccount();

	const connector = connectors[0] as unknown as ControllerConnector;

	const [username, setUsername] = useState<string>();
	useEffect(() => {
		if (!address) return;
		connector.username()?.then((n) => setUsername(n));
	}, [address, connector]);

	return (

		<div>
			<button
				className="btn text-black transition-colors w-full text-lg px-4 py-2 rounded-lg border-black font-normal lowercase"
				onClick={(e) => {
					e.preventDefault();
					console.log("Button clicked!"); // Debug log
						address ? disconnect() : connect({ connector });
				}}
			>
				{address ? "Disconnect" : "Connect Wallet"}
			</button>

			{address && (
				<>
					<p>Account: {address} </p>
					{username && <p>Username: {username}</p>}
				</>
			)}
			
		</div>
	);
}

export default function Header({ nav = true }: { nav?: boolean }) {
	return (
		<div className="absolute top-4 w-full px-8 flex justify-between items-center z-50">
			<div className="flex items-center gap-4">
				<Link href="/">
					<Image 
						src="/img/zktt_square_transparent.png"
						alt="ZKTT Logo"
						width={42}
						height={42}
						className="h-[42px] w-auto" // Matches typical button height
					/>
				</Link>
			</div>
			<StarknetProvider>
				<ConnectWallet></ConnectWallet>
			</StarknetProvider>
		</div>
	);
}