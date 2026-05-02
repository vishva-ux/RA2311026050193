/**
 * Computes the priority score based on Notification Type
 * Priority weights: Placement (3) > Result (2) > Event (1)
 * @param {string} type 
 * @returns {number}
 */
export const computePriorityScore = (type) => {
  switch (type?.toLowerCase()) {
    case 'placement':
      return 3;
    case 'result':
      return 2;
    case 'event':
      return 1;
    default:
      return 0;
  }
};

/**
 * Returns the Top N unread notifications based on Priority Score and Recency
 * Time Complexity: O(n log n) using standard V8 sort
 * 
 * @param {Array} notifications 
 * @param {number} n 
 * @returns {Array} Top N notifications
 */
export const getTopNNotifications = (notifications, n = 10) => {
  // Only process unread notifications (assuming an 'isRead' property exists)
  const unreadNotifications = notifications.filter(notif => !notif.isRead);

  // O(n log n) sorting
  unreadNotifications.sort((a, b) => {
    const priorityA = computePriorityScore(a.Type);
    const priorityB = computePriorityScore(b.Type);

    // Primary Sort: By Weight (Descending)
    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    // Secondary Sort: By Recency (Descending)
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeB - timeA;
  });

  // Return the top N
  return unreadNotifications.slice(0, n);
};
