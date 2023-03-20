export default interface IEvent {
  getEventType(): string;
  getEventOccurance(): boolean;
  execute(...args): Promise<void> | void;
}
