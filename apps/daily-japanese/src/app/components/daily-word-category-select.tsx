interface DailyWordCategorySelectProps {
  category: string | null;
  categories: string[];
  onCategorySelect: (cat: string) => void;
}

export function DailyWordCategorySelect({
  category,
  categories,
  onCategorySelect,
}: DailyWordCategorySelectProps) {
  return (
    <select
      className="text-center mt-4"
      value={category || ''}
      onChange={(e) => onCategorySelect(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
