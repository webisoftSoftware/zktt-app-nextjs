"use client";

import Link from "next/link";
import Image from 'next/image'

// controller imports
import { useEffect, useState } from "react"
import { StarknetProvider } from "@/components/controller/StarknetProvider"
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

	// Add helper function to format address
	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
	};

	return (
		<div>
			<button
				className="text-black transition-colors w-full text-lg px-4 py-2 rounded-lg border-black font-normal lowercase"
				onClick={(e) => {
					e.preventDefault();
					address ? disconnect() : connect({ connector });
				}}
			>
				{address ? (
					<div className="flex flex-col items-center">
						<span className="flex items-center gap-2 text-black">
							{username && <span>{username}</span>}
							{username && "•"}  {formatAddress(address)}
						</span>
						<span className="text-black hover:text-gray-700">disconnect</span>
					</div>
				) : (
					"Connect Wallet"
				)}
			</button>
		</div>
	);
}

export default function Header({ nav = true }: { nav?: boolean }) {
	return (
		<div className="absolute top-4 w-full px-8 flex justify-between items-center z-6">
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