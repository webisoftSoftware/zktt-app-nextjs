import ControllerConnector from '@cartridge/connector/controller';

export interface WalletConnection {
  address: string;
  username?: string;
}

export interface ConnectorConfig {
  connector: ControllerConnector;
} 