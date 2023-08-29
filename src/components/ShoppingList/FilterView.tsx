import React, { Fragment } from 'react';

export default function FilterView({
  setFilter,
  filter,
  toggleModal,
  tagsInUse,
}: {
  setFilter: React.Dispatch<React.SetStateAction<string[]>>;
  filter: string[];
  toggleModal: () => void;
  tagsInUse: string[];
}) {
  const [tempFilters, setTempFilters] = React.useState<string[]>(filter);
  return (
    <Fragment>
      <h4 className="title is-4">Filter List by Tags </h4>
      <div className="field is-grouped is-grouped-multiline">
        {tagsInUse.map(tag => {
          return (
            <div key={`${tag}`} className="control">
              <div className="tags"></div>
              <label
                htmlFor={tag}
                className="tag is-warning is-large is-rounded"
              >
                {tag}
                <span className="tag is-warning">
                  {' '}
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
      <div>
        <button
          className="button"
          onClick={() => {
            setFilter(tempFilters);
            toggleModal();
          }}
          autoFocus
        >
          Save
        </button>
        <button
          className="button"
          onClick={() => {
            setFilter([]);
            toggleModal();
          }}
        >
          Clear Filters
        </button>
      </div>
    </Fragment>
  );
}
