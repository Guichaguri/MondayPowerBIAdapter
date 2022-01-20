
export function formatDateTime(date: string): string {
  const updateDate = new Date(date);

  if (isNaN(updateDate.getTime()))
    return date;

  return updateDate.getFullYear() + '-' + updateDate.getMonth() + '-' + updateDate.getDay() + ' ' +
    updateDate.getHours() + ':' + updateDate.getMinutes() + ':' + updateDate.getSeconds();
}
