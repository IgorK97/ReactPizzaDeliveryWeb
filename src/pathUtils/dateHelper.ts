
/**
 * Функция форматирования строки с датой в нужный формат
 * @param dateString исходная строка
 * @returns {string} строка в формате YYYY-MM-DD HH:MM:SS
 */
export const formatDateForInput = (dateString: string): string => {
    // console.log("START",dateString);
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0") 
    const day = String(date.getDate()).padStart(2, "0")

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
  // console.log("RESULT",date);
  // console.log("RETURN",`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }