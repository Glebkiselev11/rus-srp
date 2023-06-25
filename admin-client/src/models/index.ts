export interface IDraftWord {
  rus: string;
  eng: string;
  srp_latin: string;
  image: string | null;
}

export interface IWord extends IDraftWord {
  id: number;
  srp_cyrillic: string;
  created_at: string;
  updated_at: string;
}

export interface INotification {
  type: ENotificationTypes;
  text: string;
  id?: string;
}

export enum ENotificationTypes {
  success = "success",
  error = "error",
}
