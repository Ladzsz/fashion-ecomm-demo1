type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

export function FilterToggleButton({ onToggle }: Props) {
  return (
    <button className="toggleFilterBtn" onClick={onToggle}>
      Filters
    </button>
  );
}
