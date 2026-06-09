import {
  useEffect,
  useState
} from "react";

import {
  getNotifications
} from "../api/notificationApi";

function NotificationBell() {

  const [
    notifications,
    setNotifications
  ] = useState([]);

  useEffect(() => {

    const load =
      async () => {

        const response =
          await getNotifications();

        setNotifications(
          response.data
        );
      };

    load();

  }, []);

  const unreadCount =
    notifications.filter(
      n => !n.is_read
    ).length;

  return (
    <div className="relative">

      🔔

      {unreadCount > 0 && (

        <span
          className="
          absolute
          -top-2
          -right-2
          bg-red-500
          text-white
          text-xs
          px-2
          rounded-full
          "
        >
          {unreadCount}
        </span>

      )}

    </div>
  );
}

export default NotificationBell;