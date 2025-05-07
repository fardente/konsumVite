import { useSuggestionsQuery } from '../ShoppingList/Hooks/useFetchSuggestions';

export default function SuggestionBox({
  input,
  onAcceptSuggestion,
}: {
  input: string;
  onAcceptSuggestion: (suggestion: string) => void;
}) {
  const { data: suggestions, isLoading } = useSuggestionsQuery(input);
  if (!input) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  return (
    <div className="field">
      {suggestions &&
        suggestions.length > 0 &&
        suggestions.map((suggestion, index) => (
          <div key={index.toString()} className="shopping-search-result">
            <div
              onClick={event => {
                event.preventDefault();
                onAcceptSuggestion(suggestion.name);
              }}
              className="button is-light"
            >
              {suggestion.name}
            </div>
          </div>
        ))}
    </div>
  );
}
