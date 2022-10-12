export interface INewWord {
  rus: string;
  eng: string;
  srp_latin: string;
  srp_cyrillic: string;
}

export interface IWord extends INewWord {
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
