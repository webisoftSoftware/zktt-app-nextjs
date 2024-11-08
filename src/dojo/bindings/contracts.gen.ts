import { DojoProvider } from "@dojoengine/core";
import { Account } from "starknet";
import * as models from "./models.gen";

export async function setupWorld(provider: DojoProvider) {

	const game_system_start = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "game_system",
					entrypoint: "start",
					calldata: [],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const game_system_endTurn = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "game_system",
					entrypoint: "end_turn",
					calldata: [],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const player_system_join = async (account: Account, username: string) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "player_system",
					entrypoint: "join",
					calldata: [username],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const player_system_leave = async (account: Account) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "player_system",
					entrypoint: "leave",
					calldata: [],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const action_system_draw = async (account: Account, drawsFive: boolean) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "action_system",
					entrypoint: "draw",
					calldata: [drawsFive],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const action_system_play = async (account: Account, card: models.EnumCard) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "action_system",
					entrypoint: "play",
					calldata: [card],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const action_system_move = async (account: Account, card: models.EnumCard) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "action_system",
					entrypoint: "move",
					calldata: [card],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	const action_system_payFee = async (account: Account, pay: Array<models.EnumCard>, recipient: string, payee: string) => {
		try {
			return await provider.execute(
				account,
				{
					contractName: "action_system",
					entrypoint: "pay_fee",
					calldata: [pay, recipient, payee],
				},
        "zktt"
			);
		} catch (error) {
			console.error(error);
		}
	};

	return {
		game_system: {
			start: game_system_start,
			endTurn: game_system_endTurn,
		},
		player_system: {
			join: player_system_join,
			leave: player_system_leave,
		},
		action_system: {
			draw: action_system_draw,
			play: action_system_play,
			move: action_system_move,
			payFee: action_system_payFee,
		},
	};
}
