import { EnumCard } from "@/dojo/bindings/models.gen";

export interface Card {
    m_address: number;
    m_frontTexture: string;
    m_backTexture: string;
    m_cardType: EnumCard;
}

export interface Board {
    m_sets: number;
    m_value: number;
    m_index: number;
}

export interface Dealer {
    m_deck: Board[];
}

export interface Player {
    m_address: number;
    m_score: number;
}
