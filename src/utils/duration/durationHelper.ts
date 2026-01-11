export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours === 1 && minutes === 0 && seconds === 0) {
    return `60:00`
  } else if (hours > 1 || (hours === 1 && (minutes > 0 || seconds > 0))) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  } else {
    const totalMinutes = Math.floor(totalSeconds / 60)
    return `${totalMinutes}:${seconds.toString().padStart(2, '0')}`
  }
}
