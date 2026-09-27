export function getAgeRatingColor(ageRating: string | null): string {
  switch (ageRating) {
    case "L":
    case "Livre":
      return "#22c55e"; // verde
    case "10":
      return "#3b82f6"; // azul
    case "12":
      return "#f0c419"; // amarelo
    case "14":
      return "#f97316"; // laranja
    case "16":
      return "#ef4444"; // vermelho claro
    case "18":
      return "#991b1b"; // vermelho escuro
    default:
      return "#8ba3bc"; // cinza, caso não reconheça o valor
  }
}