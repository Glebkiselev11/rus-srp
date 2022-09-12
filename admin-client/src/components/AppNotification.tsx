import { useAppSelector } from "../hooks/redux";
import { INotification, ENotificationTypes } from "../models";

export function AppNotification() {
	const { list } = useAppSelector(state => state.notification);

	const Notification = (notificaion: INotification) => {

		const notificationTypeClass = () => {
			switch (notificaion.type) {
			case ENotificationTypes.success:
				return "bg-green-200";
			case ENotificationTypes.error:
				return "bg-red-200";
			default:
				return "bg-blue-200";
			}
		};

		const notificationClasses = notificationTypeClass().concat(" py-2 px-4 mt-3 transition-all -translate-y-6");

		return (<div className={notificationClasses}>{notificaion.text}</div>);
	};

	return (
		<div className="fixed left-10 bottom-10" >
			{list.map((n, i) => <div key={n.id ?? i}>{Notification(n)}</div>)}
		</div>
	);
}
