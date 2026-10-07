import { Alert, Details, Heading } from '@digdir/designsystemet-react';
import type { Notification } from '../../types';

// Lists errors and warnings, followed by the collapsed import log (info), which can be long.
export function NotificationsView({
  notifications,
}: {
  notifications: Notification[];
}): React.JSX.Element {
  const alerts = notifications.filter((n) => n.kind !== 'info');
  const logs = notifications.filter((n) => n.kind === 'info');

  return (
    <div className='notifications-view'>
      <Heading level={2} data-size='sm'>
        Notifications
      </Heading>
      {alerts.map((notification, index) => (
        // Notification.kind maps onto Designsystemet severity colors; 'error' is 'danger' there.
        <Alert
          key={index}
          data-color={
            notification.kind === 'error' ? 'danger' : notification.kind
          }
        >
          {notification.text}
          {notification.details && notification.details.length > 0 && (
            <ul className='notification-details'>
              {notification.details.map((line, lineIndex) => (
                <li key={lineIndex}>{line}</li>
              ))}
            </ul>
          )}
        </Alert>
      ))}
      {logs.map((notification, index) => (
        <Details key={index}>
          <Details.Summary>{notification.text}</Details.Summary>
          <Details.Content>
            <ul className='notification-details'>
              {notification.details?.map((line, lineIndex) => (
                <li key={lineIndex}>{line}</li>
              ))}
            </ul>
          </Details.Content>
        </Details>
      ))}
    </div>
  );
}
