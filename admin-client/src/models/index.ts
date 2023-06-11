export interface IDraftWord {
  rus: string;
  eng: string;
  srp_latin: string;
}

export interface IWord extends IDraftWord {
  id: string;
}

export interface INotification {
  type: ENotificationTypes;
  text: string;
  id?: string;
}

export enum ENotificationTypes {
  success = "success",
  error = "error"
}
