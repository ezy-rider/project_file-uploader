export function formatBytes(bytes) {
  const sizes = ["B", "KB", "MB"];
  if (bytes === 0) return "0 B";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}
