export const formatDateForDisplay = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateTimeForDisplay = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12
  const formattedHours = hours.toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`;
};
