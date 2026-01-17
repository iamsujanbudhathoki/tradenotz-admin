export class StringFormatter {
  static capitalizeFirst(value: string): string {
    if (!value) return "";

    const trimmed = value.trim();

    return (
      trimmed.charAt(0).toUpperCase() +
      trimmed.slice(1).toLowerCase()
    );
  }
}
