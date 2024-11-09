"use client";

import { Link } from 'react-router-dom';

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

	// const connector = connectors[0] as ControllerConnector;
	const connector = connectors[0] as ControllerConnector;

	// State for storing username
	const [username, setUsername] = useState<string>();
	
	// Fetch username when address changes
	useEffect(() => {
		if (!address) return;
		connector.username()?.then((n) => setUsername(n));
	}, [address, connector]);

	// Format wallet address for display
	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
	};

	return (
		<div>
			{/* Wallet connection button */}
			<button
				className="w-full rounded-lg border-black px-4 py-2 text-base font-normal lowercase text-black transition-colors"
				onClick={(e) => {
					e.preventDefault();
					address ? disconnect() : connect({ connector });
				}}
			>
				{/* Show different content based on connection status */}
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
		<div className="absolute top-4 z-10 flex w-full items-center justify-between px-8">
			{/* Logo and home link */}
			<div className="flex items-center gap-4">
				<Link to="/">
					<img
						src="/img/zktt_square_transparent.png"
						alt="ZKTT Logo"
						width={42}
						height={42}
						className="h-[42px] w-auto" // Matches typical button height
					/>
				</Link>
			</div>
			{/* Wallet connection wrapped in Starknet provider */}
			<StarknetProvider>
				<ConnectWallet></ConnectWallet>
			</StarknetProvider>
		</div>
	);
}