import React, { Fragment } from 'react';
import useModal from '../useModal';
import useFilteredItems from './Hooks/useTags';

export default function FilterView({
  toggleModal,
  filterTags,
  tagsInUse,
  setFilterTags,
}: {
  toggleModal: () => void;
  filterTags: string[];
  tagsInUse: string[];
  setFilterTags: (tags: string[]) => void;
}) {
  console.log('FilterView rendered');
  const [tempFilters, setTempFilters] = React.useState<string[]>(filterTags);

  return (
    <div>
      <h4 className="title is-4">Filter List by Tags </h4>
      <div className="field is-grouped is-grouped-multiline">
        {tagsInUse.map(tag => {
          return (
            <div key={`${tag}`} className="control">
              <div className="tags"></div>
              <label
                htmlFor={tag}
                className="tag is-warning is-large is-rounded is-capitalized"
              >
                {tag}
                <span className="tag is-warning">
                  <input
                    type="checkbox"
                    id={tag}
                    name={tag}
                    checked={tempFilters.includes(tag)}
                    onChange={() =>
                      tempFilters.includes(tag)
                        ? setTempFilters(oldFilter =>
                            oldFilter.filter(x => x !== tag)
                          )
                        : setTempFilters(old => [...old, tag])
                    }
                  />
                </span>
              </label>
            </div>
          );
        })}
      </div>
      <div className="buttons is-centered">
        <button
          className="button"
          onClick={() => {
            setFilterTags(tempFilters);
            toggleModal();
          }}
          autoFocus
        >
          Save
        </button>
        <button
          className="button"
          onClick={() => {
            setFilterTags([]);
            toggleModal();
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
